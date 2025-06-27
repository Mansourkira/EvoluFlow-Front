import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'

interface ThemedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  children: React.ReactNode
}

export function ThemedButton({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: ThemedButtonProps) {
  const { colors } = useTheme()
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.button.primary,
          color: 'white',
          '--hover-bg': colors.button.primaryHover,
          border: 'none'
        }
      case 'secondary':
        return {
          backgroundColor: colors.button.secondary,
          color: 'white',
          '--hover-bg': colors.button.secondaryHover,
          border: 'none'
        }
      case 'success':
        return {
          backgroundColor: colors.button.success,
          color: 'white',
          '--hover-bg': colors.button.successHover,
          border: 'none'
        }
      case 'danger':
        return {
          backgroundColor: colors.button.danger,
          color: 'white',
          '--hover-bg': colors.button.dangerHover,
          border: 'none'
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.button.primary,
          border: `1px solid ${colors.button.primary}`,
          '--hover-bg': `${colors.button.primary}10`
        }
      default:
        return {
          backgroundColor: colors.button.primary,
          color: 'white',
          '--hover-bg': colors.button.primaryHover,
          border: 'none'
        }
    }
  }

  const buttonStyles = getButtonStyles()

  return (
    <Button
      className={cn(
        "transition-all duration-200 font-medium",
        className
      )}
      style={buttonStyles as React.CSSProperties}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement
        if (variant === 'outline') {
          target.style.backgroundColor = buttonStyles['--hover-bg']
        } else {
          target.style.backgroundColor = buttonStyles['--hover-bg']
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement
        target.style.backgroundColor = buttonStyles.backgroundColor
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

// Convenience components for specific button types
export function PrimaryButton(props: Omit<ThemedButtonProps, 'variant'>) {
  return <ThemedButton variant="primary" {...props} />
}

export function SecondaryButton(props: Omit<ThemedButtonProps, 'variant'>) {
  return <ThemedButton variant="secondary" {...props} />
}

export function SuccessButton(props: Omit<ThemedButtonProps, 'variant'>) {
  return <ThemedButton variant="success" {...props} />
}

export function DangerButton(props: Omit<ThemedButtonProps, 'variant'>) {
  return <ThemedButton variant="danger" {...props} />
}

export function OutlineButton(props: Omit<ThemedButtonProps, 'variant'>) {
  return <ThemedButton variant="outline" {...props} />
} 