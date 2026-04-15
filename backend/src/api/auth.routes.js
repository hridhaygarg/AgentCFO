import express from 'express';
import { getSupabaseClient } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { generateTokens, verifyToken } from '../auth/jwt.js';
import { handleOAuthCallback } from '../auth/oauth.js';
import { isValidEmail } from '../utils/validators.js';

const router = express.Router();

// Password strength validation
function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  return true;
}

// POST /register - User registration
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      throw new AppError('Email, password, first name, and last name are required', 400, 'INVALID_INPUT');
    }

    if (!isValidEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_INPUT');
    }

    if (!validatePasswordStrength(password)) {
      throw new AppError(
        'Password must be at least 8 characters and include uppercase, number, and special character',
        400,
        'INVALID_INPUT'
      );
    }

    const supabase = getSupabaseClient();

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected)
      throw new AppError('Failed to check user existence', 500);
    }

    if (existingUser) {
      throw new AppError('Email already exists', 409, 'DUPLICATE_EMAIL');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName
        }
      ])
      .select()
      .single();

    if (userError || !newUser) {
      logger.error('User creation failed', {
        email,
        error: userError?.message
      });
      throw new AppError('Failed to create user', 500);
    }

    // Create default organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert([
        {
          name: `${firstName}'s Workspace`,
          created_by: newUser.id
        }
      ])
      .select()
      .single();

    if (orgError || !org) {
      logger.error('Organization creation failed', {
        userId: newUser.id,
        error: orgError?.message
      });
      throw new AppError('Failed to create organization', 500);
    }

    // Add user to organization as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([
        {
          org_id: org.id,
          user_id: newUser.id,
          role: 'owner'
        }
      ]);

    if (memberError) {
      logger.error('Team member creation failed', {
        userId: newUser.id,
        orgId: org.id,
        error: memberError?.message
      });
      throw new AppError('Failed to add user to organization', 500);
    }

    // Update user with org_id
    const userWithOrg = { ...newUser, org_id: org.id };

    // Generate tokens
    const tokens = generateTokens(userWithOrg);

    logger.info('User registered successfully', {
      email,
      userId: newUser.id,
      orgId: org.id
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn
    });
  })
);

// POST /login - User login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'INVALID_INPUT');
    }

    const supabase = getSupabaseClient();

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      logger.info('Login attempt for non-existent user', { email });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash);

    if (!passwordValid) {
      logger.info('Login attempt with invalid password', { email });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      const mfaToken = generateTokens(user).accessToken;
      logger.info('MFA required for login', { email });
      return res.status(200).json({
        mfaRequired: true,
        mfaToken
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    logger.info('User logged in successfully', {
      email,
      userId: user.id
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn
    });
  })
);

// POST /logout - User logout
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new AppError('Invalid token', 401, 'UNAUTHORIZED');
    }

    const supabase = getSupabaseClient();

    // Invalidate refresh token by updating user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        refresh_token_revoked_at: new Date().toISOString()
      })
      .eq('id', decoded.sub);

    if (updateError) {
      logger.error('Failed to revoke refresh token', {
        userId: decoded.sub,
        error: updateError?.message
      });
      throw new AppError('Logout failed', 500);
    }

    logger.info('User logged out successfully', {
      userId: decoded.sub
    });

    res.status(200).json({
      message: 'Logged out successfully'
    });
  })
);

// POST /refresh - Refresh access token
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400, 'INVALID_INPUT');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
    }

    // Check that token is a refresh token
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401, 'INVALID_TOKEN');
    }

    const supabase = getSupabaseClient();

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    if (userError || !user) {
      throw new AppError('User not found', 401, 'INVALID_TOKEN');
    }

    // Check if refresh token was revoked
    if (user.refresh_token_revoked_at) {
      throw new AppError('Refresh token has been revoked', 401, 'INVALID_TOKEN');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    logger.info('Tokens refreshed successfully', {
      userId: user.id
    });

    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn
    });
  })
);

// POST /oauth/:provider - OAuth callback handler
router.post(
  '/oauth/:provider',
  asyncHandler(async (req, res) => {
    const { provider } = req.params;
    const { code } = req.body;

    // Validate provider
    const validProviders = ['google', 'github', 'microsoft'];
    if (!validProviders.includes(provider)) {
      throw new AppError('Invalid OAuth provider', 400, 'INVALID_PROVIDER');
    }

    if (!code) {
      throw new AppError('Authorization code is required', 400, 'INVALID_INPUT');
    }

    // Mock OAuth callback - in production, exchange code for token and get profile
    // This would call Google/GitHub/Microsoft API
    let profile;

    try {
      // TODO: Implement actual OAuth token exchange
      // For now, use mock profile
      profile = {
        sub: `${provider}-${Math.random().toString(36).substr(2, 9)}`,
        email: `user+${provider}@example.com`,
        given_name: 'OAuth',
        family_name: 'User',
        picture: 'https://example.com/avatar.jpg'
      };

      // Use the handleOAuthCallback from oauth.js
      const { user, tokens } = await handleOAuthCallback(provider, profile);

      logger.info('OAuth authentication successful', {
        provider,
        email: user.email,
        userId: user.id
      });

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      });
    } catch (err) {
      logger.error('OAuth callback failed', {
        provider,
        error: err.message
      });
      throw new AppError('Authentication failed', 401, 'AUTH_FAILED');
    }
  })
);

export const authRoutes = router;
export default router;
