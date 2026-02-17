import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApps((prevApps) =>
          prevApps.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">My Posted Jobs</h2>
          <Link to="/post-job">
            <Button size="sm" variant="primary">+ Post Job</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-4">Loading jobs...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.length === 0 && (
              <p className="text-slate-500 text-center py-4">No jobs posted yet.</p>
            )}
            {jobs.map((job) => (
              <Card
                key={job._id}
                className={`p-5 transition-all cursor-pointer hover:shadow-md border-transparent ${selectedJob === job._id ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/30'}`}
                onClick={() => viewApplicants(job._id)}
              >
                <div className="mb-3">
                  <h4 className="font-bold text-gray-800 text-lg leading-tight">{job.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold">
                    {apps.length > 0 && selectedJob === job._id ? `${apps.length} Applicants` : 'Click to view applicants'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Link to={`/edit-job/${job._id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="secondary" size="xs" className="h-7 px-2 text-xs">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="xs"
                    className="h-7 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this job?")) {
                        API.delete(`/jobs/${job._id}`)
                          .then(() => {
                            setJobs(jobs.filter(j => j._id !== job._id));
                            if (selectedJob === job._id) setSelectedJob(null);
                          })
                          .catch(err => alert("Failed to delete job"));
                      }
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="ml-auto h-7 px-2 text-xs text-primary bg-indigo-50 hover:bg-indigo-100"
                    onClick={(e) => { e.stopPropagation(); viewApplicants(job._id); }}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {selectedJob ? (
          <Card className="min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Applicants</h3>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{apps.length} Total</span>
            </div>

            {apps.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="text-5xl mb-4">👥</div>
                <p>No applicants yet for this job.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {apps.map((app) => (
                  <div key={app._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-white hover:shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{app.applicant.name}</p>
                      <p className="text-sm text-slate-500 mb-1">{app.applicant.email}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        {app.resume && (
                          <a href={app.resume} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            📄 View Resume
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      {app.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100 flex-1 sm:flex-none"
                            onClick={() => handleStatusUpdate(app._id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 flex-1 sm:flex-none"
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <Card className="flex items-center justify-center p-10 h-full min-h-[400px] text-slate-400 bg-slate-50/50 border-dashed">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50">👈</div>
              <p className="text-lg font-medium">Select a job from the list</p>
              <p className="text-sm">to view and manage applicants</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
