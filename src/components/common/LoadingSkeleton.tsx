import React from 'react';
import './LoadingSkeleton.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    variant?: 'text' | 'rectangular' | 'circular';
    style?: React.CSSProperties;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    borderRadius,
    className = '',
    variant = 'text',
    style: customStyle,
}) => {
    const style: React.CSSProperties = {
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
        borderRadius: borderRadius,
        ...customStyle
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
        />
    );
};
