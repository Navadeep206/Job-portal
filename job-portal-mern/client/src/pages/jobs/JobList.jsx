import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import BlurText from "../../components/animations/BlurText";
import FadeIn from "../../components/animations/FadeIn";
import HoverGlowCard from "../../components/animations/HoverGlowCard";

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
      <FadeIn direction="down" className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
          <BlurText
            text="Find Your Dream Job Today"
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight"
            delay={0.2}
          />
          <FadeIn delay={0.6} className="text-slate-500 text-lg">
            Connect with top employers and discover opportunities.
          </FadeIn>
        </div>

        <form onSubmit={handleSearch} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
          <input
            type="text"
            className="input bg-white border-transparent focus:border-primary shadow-sm"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            type="text"
            className="input bg-white border-transparent focus:border-primary shadow-sm"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select
            className="input bg-white border-transparent focus:border-primary shadow-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 shadow-md shadow-primary/20">Search</button>
            <button type="button" onClick={clearFilters} className="btn btn-ghost px-3 text-slate-400 hover:text-slate-600" title="Clear Filters">
              ✕
            </button>
          </div>
        </form>
      </FadeIn>

      {/* Results Section */}
      {loading ? (
        <div className="text-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 animate-pulse">Searching for opportunities...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? jobs.map((job, index) => (
              <FadeIn key={job._id} delay={index * 0.05} direction="up">
                <HoverGlowCard className="h-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        {/* Placeholder logo if we had one */}
                        <div className="w-8 h-8 flex items-center justify-center text-lg">🏢</div>
                      </div>
                      {job.type && <span className="badge badge-info bg-indigo-50 text-primary border-0 font-medium px-3 py-1">{job.type}</span>}
                    </div>

                    <h4 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                    <p className="text-sm font-medium text-slate-500 mb-4">{job.company}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.location && <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1">📍 {job.location}</span>}
                      {job.salary && <span className="text-xs font-medium text-slate-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 flex items-center gap-1">💰 {job.salary}</span>}
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                      {job.description}
                    </p>

                    <Link to={`/job/${job._id}`} className="mt-auto btn w-full bg-white text-primary border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-none">
                      View Details
                    </Link>
                  </div>
                </HoverGlowCard>
              </FadeIn>
            )) : (
              <div className="col-span-full">
                <FadeIn className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No jobs found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your search criteria</p>
                  <button onClick={clearFilters} className="btn btn-outline">Clear Filters</button>
                </FadeIn>
              </div>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                className="btn btn-ghost"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ opacity: page === 1 ? 0.3 : 1 }}
              >
                ← Prev
              </button>

              <div className="flex gap-1">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-ghost"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                style={{ opacity: page === pages ? 0.3 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobList;
