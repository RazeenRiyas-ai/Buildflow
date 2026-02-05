import React from 'react';
import styles from './button.module.css';

import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps & { href?: string }>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, href, children, ...props }, ref) => {
        const classes = [
            styles.button,
            styles[variant],
            styles[size],
            fullWidth ? styles.fullWidth : '',
            className,
        ].filter(Boolean).join(' ');

        if (href) {
            return (
                <Link href={href} className={classes} style={{ display: 'inline-flex', textDecoration: 'none' }}>
                    {children}
                </Link>
            );
        }

        return (
            <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
