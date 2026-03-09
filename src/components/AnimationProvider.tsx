import React, { ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

interface AnimationProviderProps {
    children: ReactNode;
}

/**
 * AnimationProvider component that provides Framer Motion context 
 * using LazyMotion and domAnimation for better performance.
 * This ensures that only the features needed for DOM animations 
 * are loaded initially.
 */
const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    return (
        <LazyMotion features={domAnimation} strict>
            {children}
        </LazyMotion>
    );
};

export default AnimationProvider;
