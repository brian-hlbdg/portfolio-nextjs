import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ 
  children, 
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove
}: TagProps) {
  
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:bg-orange-400 transition-colors cursor-default',
    primary: 'bg-primary/10 dark:bg-orange-400/10 text-primary dark:text-orange-400 border border-primary/20 dark:border-orange-400/20',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  // Combine styles
  const tagStyles = `inline-flex items-center rounded-full mr-2 mb-2 transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`;
  
  return (
    <span className={tagStyles}>
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none"
          aria-label="Remove tag"
        >
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </span>
  );
}