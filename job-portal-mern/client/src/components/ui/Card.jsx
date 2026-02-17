import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({
    className,
    children,
    hoverEffect = true,
    glass = false,
    ...props
}) => {
    const baseStyles = "rounded-2xl p-6 border transition-all duration-300";

    const variants = {
        default: "bg-white border-slate-100 shadow-sm",
        glass: "glass",
    };

    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
            className={twMerge(
                baseStyles,
                glass ? variants.glass : variants.default,
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
