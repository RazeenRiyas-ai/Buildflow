import React from 'react';
import styles from './card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

export function Card({ className = '', hoverable = false, children, ...props }: CardProps) {
    return (
        <div
            className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`${styles.header} ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={`${styles.title} ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={`${styles.description} ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`${styles.content} ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`${styles.footer} ${className}`} {...props}>{children}</div>;
}
