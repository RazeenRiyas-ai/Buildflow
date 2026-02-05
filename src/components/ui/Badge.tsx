import React from 'react';
import styles from './badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info';
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
    return (
        <div className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}
