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
        default: "bg-white/80 backdrop-blur-md border-slate-200/50 shadow-sm dark:bg-slate-800/80 dark:border-slate-700/50",
        glass: "glass",
        outline: "bg-transparent border border-slate-200 dark:border-slate-700",
        gradient: "bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur border-slate-100 dark:from-slate-800/90 dark:to-slate-900/90 dark:border-slate-700",
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
