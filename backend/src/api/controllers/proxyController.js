import { forwardToOpenAIAPI, forwardToAnthropic } from '../../services/index.js';

function isAnthropicModel(model) {
  return model && (model.includes('claude') || model.startsWith('claude-'));
}

export async function handleChatCompletion(req, res) {
  const model = req.body.model || 'gpt-3.5-turbo';
  const agentName = req.agentName || 'unknown';

  if (isAnthropicModel(model)) {
    return forwardToAnthropic(req, res, agentName);
  }

  return forwardToOpenAIAPI(req, res, agentName);
}
