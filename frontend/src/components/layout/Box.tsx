import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  direction?: string;
  align?: string;
  justify?: string;
  wrap?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  gap,
  direction,
  align,
  justify,
  wrap,
  style,
  ...props
}) => {
  const flexStyle: React.CSSProperties = {
    display: 'flex',
    gap,
    flexDirection: direction as React.CSSProperties['flexDirection'],
    alignItems: align as React.CSSProperties['alignItems'],
    justifyContent: justify as React.CSSProperties['justifyContent'],
    flexWrap: wrap as React.CSSProperties['flexWrap'],
    ...style
  };

  return (
    <div
      className={`p-4 border border-gray-200 rounded-lg ${className}`}
      style={flexStyle}
      {...props}
    >
      {children}
    </div>
  );
};