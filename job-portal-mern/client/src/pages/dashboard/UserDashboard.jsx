import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await API.get("/applications/my");
        setApps(res.data.applications);
      } catch (err) {
        console.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted": return "badge badge-success";
      case "rejected": return "badge badge-error";
      case "pending": return "badge badge-warning";
      default: return "badge badge-info";
    }
  };

  return (
    <div className="fade-in">
      <h2 className="mb-6 border-b pb-2 border-slate-200">My Applications</h2>

      {loading ? (
        <div className="text-center p-8">Loading applications...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {apps.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 mb-4">You haven't applied to any jobs yet.</p>
              <Link to="/" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            apps.map((app) => (
              <div key={app._id} className="card flex justify-between items-center p-4">
                <div>
                  <h4 className="font-bold text-lg text-primary">{app.job.title}</h4>
                  <p className="text-slate-600 font-medium">{app.job.company}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={getStatusBadge(app.status)}>{app.status}</span>
                  <span className="text-xs text-slate-400">Applied on: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
