import { twMerge } from 'tailwind-merge';

function Skeleton({ className, ...props }) {
    return (
        <div
            className={twMerge("animate-pulse bg-slate-200 dark:bg-slate-700 rounded", className)}
            {...props}
        />
    );
}

export default Skeleton;
