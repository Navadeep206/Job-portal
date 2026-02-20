import { useEffect, useState } from "react";
import { Search } from 'lucide-react';
import { Link } from "react-router-dom";
import API from "../../services/api";
import BlurText from "../../components/animations/BlurText";
import FadeIn from "../../components/animations/FadeIn";
import JobCard from "../../components/JobCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Skeleton from "../../components/ui/Skeleton";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search States
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  // Debounce or simple search trigger
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          search: keyword,
          location,
          type
        };
        // Clean empty params
        Object.keys(params).forEach(key => !params[key] && delete params[key]);

        // Convert to query string manually or let axios handle it (axios handles it)
        const res = await API.get("/jobs", { params });

        setJobs(res.data.jobs);
        setPages(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, searchTrigger]); // Re-fetch on page change or search trigger

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1
    setSearchTrigger(prev => prev + 1);
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setType("");
    setPage(1);
    setSearchTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero / Search Section */}
      <FadeIn direction="down" className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
          <BlurText
            text="Find Your Dream Job Today"
            className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-3 tracking-tight"
            delay={0.2}
          />
          <FadeIn delay={0.6} className="text-slate-500 dark:text-slate-400 text-lg">
            Connect with top employers and discover opportunities.
          </FadeIn>
        </div>

        <form onSubmit={handleSearch} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm">
          <Input
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-white dark:bg-slate-900 border-none shadow-sm h-12"
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white dark:bg-slate-900 border-none shadow-sm h-12"
          />
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "", label: "All Job Types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Remote", label: "Remote" },
            ]}
            placeholder="Select Type"
            className="mb-0"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="flex-1 shadow-lg shadow-primary/25 h-12">Search</Button>
            <Button
              type="button"
              onClick={clearFilters}
              variant="ghost"
              className="px-3 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 h-12 w-12 flex items-center justify-center"
              title="Clear Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </form>
      </FadeIn>

      {/* Results Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2 rounded" />
              <Skeleton className="h-4 w-1/2 mb-4 rounded" />
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? jobs.map((job, index) => (
              <FadeIn key={job._id} delay={index * 0.05} direction="up">
                <JobCard job={job} />
              </FadeIn>


            )) : (
              <div className="col-span-full">
                <FadeIn className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="mb-4 flex justify-center text-slate-300 dark:text-slate-600"><Search size={64} /></div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search criteria</p>
                  <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                </FadeIn>
              </div>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={page === 1 ? "opacity-30" : ""}
              >
                ← Prev
              </Button>

              <div className="flex gap-1">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                className={page === pages ? "opacity-30" : ""}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobList;
