import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.12,
  className = '',
  style = {}
}) {
  const { ref, hasBeenVisible } = useIntersectionObserver({ threshold, once: true });

  const getTransform = () => {
    if (hasBeenVisible) return 'translateY(0) translateX(0) scale(1)';
    switch (animation) {
      case 'fadeUp':
        return 'translateY(28px) translateX(0) scale(1)';
      case 'fadeLeft':
        return 'translateY(0) translateX(-28px) scale(1)';
      case 'fadeRight':
        return 'translateY(0) translateX(28px) scale(1)';
      case 'scale':
        return 'translateY(0) translateX(0) scale(0.96)';
      default:
        return 'translateY(28px) translateX(0) scale(1)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hasBeenVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 550ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 550ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}
