import React, { useContext } from 'react';
import { JobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
    const { savedJobs, loading } = useContext(JobContext);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            Saved Jobs
                        </h1>
                        <p className="text-slate-500">
                            Jobs you've marked for later.
                        </p>
                    </div>
                    <Link to="/jobs" className="text-indigo-600 font-medium hover:underline mt-4 md:mt-0">
                        Browse More Jobs &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((job) => (
                            // Handle if job was deleted or populate failed
                            job && job._id ? <JobCard key={job._id} job={job} /> : null
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📂</div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">No Saved Jobs</h2>
                        <p className="text-slate-500 mb-6">You haven't saved any jobs yet.</p>
                        <Link
                            to="/jobs"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                            Explore Jobs
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
