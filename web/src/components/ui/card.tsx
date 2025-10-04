import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx(
                'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
                className
            )}
            {...props}
        />
    )
)

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={clsx('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    )
)

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={clsx(
                'text-2xl font-semibold leading-none tracking-tight',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    )
)

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
    )
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
