import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';


export const JobContext = createContext();

export const useJob = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hardcoded for now based on API service pattern, but ideally should use the service.
    // However, to keep it simple and self-contained or use the axios instance from api.js if I can import it.
    // I will use local axios for now but with the same base URL pattern or import API from services.

    // Let's try to import the API service which already has interceptors for token.
    // I will restart the file content to import API.
    // Wait, I can't restart in the same tool call. I will write the comprehensive code.

    // Actually, I should use the `API` service I saw earlier in `client/src/services/api.js`.

    const fetchSavedJobs = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Using the API instance handles token and base URL automatically
            const { data } = await API.get('/users/saved-jobs');
            if (data.success) {
                setSavedJobs(data.savedJobs);
            }
        } catch (error) {
            console.error("Failed to fetch saved jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSaveJob = async (jobId) => {
        if (!user) {
            alert("Please login to save jobs.");
            return;
        }
        try {
            const { data } = await API.put('/users/saved-jobs', { jobId });

            if (data.success) {
                // Update local state based on response or re-fetch
                // The backend returns the updated savedJobs array usually, or we can just fetch again.
                // My backend controller returns: res.json({ success: true, message: "...", savedJobs: user.savedJobs });
                setSavedJobs(data.savedJobs);
                return true;
            }
        } catch (error) {
            console.error("Failed to toggle save job", error);
            return false;
        }
    };

    useEffect(() => {
        if (user) {
            fetchSavedJobs();
        } else {
            setSavedJobs([]);
        }
    }, [user]);

    return (
        <JobContext.Provider value={{ savedJobs, fetchSavedJobs, toggleSaveJob, loading }}>
            {children}
        </JobContext.Provider>
    );
};
