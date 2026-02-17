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

    return (
        <div className="relative mb-4">
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    className={twMerge(
                        "input-field peer placeholder-transparent",
                        Icon ? "pl-10" : "",
                        error ? "border-error focus:border-error focus:ring-error/20" : "",
                        className
                    )}
                    placeholder={label}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    {...props}
                />
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-primary">
                        <Icon size={18} />
                    </div>
                )}
                {label && (
                    <label
                        className={twMerge(
                            "absolute left-4 transition-all duration-200 pointer-events-none",
                            Icon ? "left-10" : "left-4",
                            isFocused || hasValue || props.value
                                ? "-top-2.5 text-xs bg-white px-1 text-primary font-medium"
                                : "top-3.5 text-sm text-gray-400"
                        )}
                    >
                        {label}
                    </label>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-error">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
