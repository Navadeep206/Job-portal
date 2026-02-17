import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Loading applications...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {apps.length === 0 ? (
            <Card className="text-center py-12 bg-slate-50 border-dashed">
              <div className="text-4xl mb-4">📂</div>
              <p className="text-slate-500 mb-6 font-medium">You haven't applied to any jobs yet.</p>
              <Link to="/">
                <Button variant="primary">Browse Jobs</Button>
              </Link>
            </Card>
          ) : (
            apps.map((app) => (
              <Card key={app._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 sm:mb-0">
                  <h4 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{app.job?.title || 'Job Title Unavailable'}</h4>
                  <p className="text-slate-500 font-medium">{app.job?.company || 'Company Unavailable'}</p>
                </div>
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Applied on: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
