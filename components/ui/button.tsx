import React, { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
      ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
      link: "bg-transparent underline-offset-4 hover:underline text-blue-600 hover:text-blue-700 focus-visible:ring-blue-500 p-0 h-auto",
    }
    
    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
