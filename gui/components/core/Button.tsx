
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// Define a type for the 'as' prop
type AsProp<C extends React.ElementType> = {
  as?: C;
};

// Props that the Button component will accept
type ButtonOwnProps<C extends React.ElementType = 'button'> = AsProp<C> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

// Props including those from the underlying HTML element or component
type ButtonProps<C extends React.ElementType = 'button'> = ButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;


export const Button = <C extends React.ElementType = 'button'>({
  children,
  as,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  ...restProps // These are the props intended for the underlying element
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-indigo-500 border border-gray-600 hover:border-gray-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;

  // Prepare props for the actual element
  const finalPropsToSpread: Record<string, any> = { ...restProps };

  if (Component === 'button') {
    // Ensure 'type' is valid for a button or default it.
    const buttonType = (restProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type;
    if (!buttonType || !['button', 'submit', 'reset'].includes(buttonType)) {
      finalPropsToSpread.type = 'button';
    } else {
      finalPropsToSpread.type = buttonType;
    }
    // Set 'disabled' state for button.
    finalPropsToSpread.disabled = isLoading || (restProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled;
  } else if ((as as unknown) === Link) { // Changed condition
    // Link component handles 'to' prop (expected in restProps).
    // Link does not accept a 'disabled' prop, so remove it if present in restProps.
    delete finalPropsToSpread.disabled;

    if (isLoading) {
      finalPropsToSpread['aria-disabled'] = true;
      // Prevent navigation if loading.
      const originalOnClick = (restProps as unknown as LinkProps).onClick; // Adjusted type assertion
      finalPropsToSpread.onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); // Prevent navigation.
        // Optionally, call originalOnClick if it's safe and intended under loading state,
        // but typically, loading implies the action should not proceed.
        // if (originalOnClick && !isLoading) { originalOnClick(e); }
      };
    }
  } else {
    // For other generic components or HTML elements that are not 'button' or 'Link'.
    if (isLoading) {
      finalPropsToSpread['aria-disabled'] = true;
      // If the component could potentially accept a 'disabled' prop and it's boolean:
      if (typeof (restProps as any).disabled === 'boolean') {
         (finalPropsToSpread as any).disabled = isLoading || (restProps as any).disabled;
      }
    }
  }

  return (
    <Component
      className={combinedClassName}
      {...finalPropsToSpread}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Component>
  );
};
