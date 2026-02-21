import React, { useContext } from 'react';
import { JobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
    const { savedJobs, loading } = useContext(JobContext);

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>Saved Jobs</h1>
                    <p style={{ fontSize: 14, color: '#64748b' }}>Jobs you've bookmarked for later</p>
                </div>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button style={{
                        padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    }}>
                        Browse More Jobs →
                    </button>
                </Link>
            </div>

            {/* Saved count pill */}
            {!loading && savedJobs.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <span style={{ padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8' }}>
                        {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                    {[1, 2, 3].map(n => (
                        <div key={n} style={{ height: 280, borderRadius: 24, background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0' }} />
                    ))}
                </div>
            ) : savedJobs.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                    {savedJobs.map(job => job && job._id ? <JobCard key={job._id} job={job} /> : null)}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center', padding: '72px 32px', borderRadius: 24,
                    background: 'rgba(255,255,255,0.8)', border: '2px dashed #e2e8f0',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{ width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px', background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No saved jobs yet</h3>
                    <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Bookmark jobs you like by clicking the heart icon on any job card.</p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '13px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
                            fontSize: 14, fontWeight: 700, color: '#fff',
                            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                            boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
                        }}>
                            Browse Jobs →
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
