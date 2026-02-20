import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { JobContext } from '../context/JobContext';
import { AuthContext } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const JobCard = ({ job }) => {
    const { savedJobs, toggleSaveJob } = useContext(JobContext);
    const { user } = useContext(AuthContext);

    // savedJobs contains populated job objects or just IDs? 
    // The backend returns populated objects in getSavedJobs, but just IDs in user.savedJobs usually.
    // Let's check JobContext. fetchSavedJobs sets state with populated jobs.
    // So we check if job._id is in savedJobs array (map to ids)

    const isSaved = savedJobs.some(savedJob =>
        (typeof savedJob === 'string' ? savedJob : savedJob._id) === job._id
    );

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleSaveJob(job._id);
    };

    return (
        <Card className="h-full flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute top-4 right-4 z-10">
                {user && user.role === 'user' && (
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded-full transition-all duration-300 ${isSaved
                            ? "bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400"
                            : "bg-slate-100 text-slate-400 hover:bg-white hover:text-primary hover:shadow-md dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                            }`}
                        title={isSaved ? "Unsave Job" : "Save Job"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="mb-5 flex justify-between items-start">
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 flex items-center justify-center text-2xl">
                        {/* Placeholder Logo - in real app would be an img */}
                        <Building2 size={24} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                </div>
                {job.type && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-primary border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50">
                        {job.type}
                    </span>
                )}
            </div>

            <div className="mb-5">
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {job.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.45-.96 2.337-1.774 1.772-1.626 4.301-4.708 4.301-8.577a8.001 8.001 0 00-16 0c0 3.869 2.529 6.951 4.301 8.577.887.814 1.716 1.39 2.337 1.774.31.193.57.337.757.433.093.048.17.09.224.116.027.013.048.024.06.03l.01.004.004.002.001.001zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {job.location}
                    </span>
                )}
                {job.salary && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500/80">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.35a.75.75 0 000 1.5h.739a9.749 9.749 0 000 1.5h-.74a.75.75 0 000 1.5h.35c-.066.357-.1.721-.1 1.085v.165a4 4 0 004 5.334.75.75 0 00.53-1.402 2.5 2.5 0 01-1.782-.746.75.75 0 00-1.06 1.06c.925.926 2.45.926 3.376 0a.75.75 0 00-1.06-1.06zm-1.897 5.25h1.22l1.64 3.75a.75.75 0 101.37-.6l-1.64-3.75h1.22a.75.75 0 000-1.5h-5.02a.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        {job.salary}
                    </span>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10 leading-relaxed">
                    {job.description}
                </p>
                <Link to={`/job/${job._id}`} className="block">
                    <Button variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:border-primary group-hover:text-white border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:group-hover:text-white transition-all duration-300">
                        View Details
                        <span className="text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">→</span>
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

export default JobCard;

