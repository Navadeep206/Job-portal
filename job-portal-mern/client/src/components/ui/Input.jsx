import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
    className,
    label,
    error,
    icon: Icon,
    type = 'text',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
        if (props.onBlur) props.onBlur(e);
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    };

    const handleChange = (e) => {
        setHasValue(e.target.value.length > 0);
        if (props.onChange) props.onChange(e);
    };

    const labelClasses = twMerge(
        "absolute left-4 transition-all duration-200 pointer-events-none",
        Icon ? "left-10" : "left-4",
        isFocused || hasValue || props.value
            ? "-top-2.5 text-xs bg-white dark:bg-slate-900 px-1 text-primary font-medium z-10"
            : "top-3.5 text-sm text-slate-400 dark:text-slate-500"
    );

    const inputClasses = twMerge(
        "input-field peer placeholder-transparent bg-transparent",
        Icon ? "pl-10" : "",
        error ? "border-error focus:border-error focus:ring-error/20" : "",
        className
    );

    if (type === 'textarea') {
        return (
            <div className={`space-y-2 mb-4 ${className}`}>
                <div className="relative">
                    <textarea
                        ref={ref}
                        className={twMerge(
                            "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-transparent focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white peer",
                            error ? "border-error focus:border-error" : ""
                        )}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={label}
                        {...props}
                    />
                    {label && (
                        <label className={twMerge(
                            "absolute left-4 transition-all duration-200 pointer-events-none",
                            isFocused || hasValue || props.value
                                ? "-top-2.5 text-xs bg-white dark:bg-slate-900 px-1 text-primary font-medium"
                                : "top-3 text-sm text-slate-400 dark:text-slate-500"
                        )}>
                            {label}
                        </label>
                    )}
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        )
    }

    return (
        <div className="relative mb-6">
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    className={inputClasses}
                    placeholder={label}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    {...props}
                />
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 peer-focus:text-primary transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                {label && (
                    <label className={labelClasses}>
                        {label}
                    </label>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-error font-medium">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
