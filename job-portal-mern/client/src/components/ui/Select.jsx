import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const Select = React.forwardRef(({
    className,
    label,
    error,
    icon: Icon,
    options = [],
    placeholder = "Select an option",
    ...props
}, ref) => {
    return (
        <div className="relative mb-6">
            <div className="relative">
                <select
                    ref={ref}
                    className={twMerge(
                        "input-field peer appearance-none bg-transparent pt-3 pb-3",
                        Icon ? "pl-10" : "",
                        error ? "border-error focus:border-error focus:ring-error/20" : "",
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled selected>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 peer-focus:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 peer-focus:text-primary transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                {label && (
                    <label
                        className={twMerge(
                            "absolute left-4 top-[-10px] text-xs bg-white dark:bg-slate-900 px-1 text-primary font-medium transition-all duration-200",
                            Icon ? "left-10" : "left-4"
                        )}
                    >
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

Select.displayName = 'Select';

export default Select;
