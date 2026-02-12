import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await API.get("/jobs/my");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApps(res.data.applications);
      setSelectedJob(jobId);
    } catch (err) {
      console.error("Failed to fetch applicants");
    }
  };

  return (
    <div className="fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">My Posted Jobs</h2>
          <Link to="/post-job" className="btn btn-primary text-xs py-1 px-3">
            + Post Job
          </Link>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className={`card p-4 cursor-pointer transition-all ${selectedJob === job._id ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => viewApplicants(job._id)}
              >
                <h4 className="font-bold text-primary">{job.title}</h4>
                <p className="text-sm text-slate-500 mt-1">Click to view applicants</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {selectedJob ? (
          <div className="card fade-in">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Applicants</h3>
            {apps.length === 0 ? (
              <p className="text-slate-500">No applicants yet for this job.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {apps.map((app) => (
                  <div key={app._id} className="p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{app.applicant.name}</p>
                      <p className="text-sm text-slate-500">{app.applicant.email}</p>
                    </div>
                    <span className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card flex items-center justify-center p-10 h-full text-zinc-400 bg-slate-50 border-dashed">
            <p>Select a job to view applicants</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
