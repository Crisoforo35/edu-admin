'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './Button'
import { InlineLoading } from './InlineLoading'

export default function ButtonLoading({ children, loading, onLoadingChildren, className, ...props }: { loading?: boolean, variant?: ButtonProps['variant'], onLoadingChildren?: React.ReactNode, className?: string, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { pending } = useFormStatus()

    const isLoading = pending || loading;

    return (
        <Button disabled={isLoading} className={`flex items-center gap-2 ${className}`} {...props} type={props.type || 'submit'}>
            {isLoading && onLoadingChildren ? onLoadingChildren : children}
            {isLoading && <InlineLoading pending={true} />}
        </Button>
    )
}
