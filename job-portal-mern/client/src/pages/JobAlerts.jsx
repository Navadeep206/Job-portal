import { useState, useEffect } from "react";
import api from "../services/api";
import { useJob } from "../context/JobContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function JobAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState(null);

    const [formData, setFormData] = useState({
        keywords: "",
        location: "",
        frequency: "daily"
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get("/users/alerts");
            setAlerts(res.data.alerts);
        } catch (err) {
            console.error(err);
            setError("Failed to load alerts");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateError(null);
        try {
            const res = await api.post("/users/alerts", formData);
            setAlerts([res.data.alert, ...alerts]);
            setFormData({ keywords: "", location: "", frequency: "daily" }); // Reset form
        } catch (err) {
            setCreateError(err.response?.data?.message || "Failed to create alert");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this alert?")) return;
        try {
            await api.delete(`/users/alerts/${id}`);
            setAlerts(alerts.filter(a => a._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete alert");
        }
    };

    if (loading) return <div className="flex justify-center p-8">Loading alerts...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Job Alerts</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Alert Form */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Create Alert</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                label="Keywords"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                placeholder="e.g. React Developer"
                                required
                            />
                            <Input
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote, New York"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-slate-200 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>

                            {createError && <p className="text-red-500 text-sm">{createError}</p>}

                            <Button type="submit" className="w-full">Create Alert</Button>
                        </form>
                    </Card>
                </div>

                {/* Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    {error && <p className="text-red-500">{error}</p>}

                    {alerts.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No job alerts set up yet.</p>
                            <p className="text-sm text-slate-400 mt-1">Create one to get notified about new opportunities!</p>
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <Card key={alert._id} className="p-5 flex justify-between items-center hover:shadow-md transition-all">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{alert.keywords}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.625a19.055 19.055 0 005.335 2.308zM10 16a6.995 6.995 0 01-1.12-11.905A7 7 0 1115 11v.005a5 5 0 01-5 4.995z" clipRule="evenodd" />
                                            </svg>
                                            {alert.location}
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium">
                                            {alert.frequency}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                    onClick={() => handleDelete(alert._id)}
                                >
                                    Delete
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobAlerts;
