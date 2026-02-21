import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import { AuthContext } from '../context/AuthContext';

/* ─── Color palette: cycle per company name for uniqueness ─────── */
const AVATAR_COLORS = [
    { bg: 'linear-gradient(135deg,#3b82f6,#6366f1)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#10b981,#059669)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', text: '#fff' },
];

const TYPE_STYLES = {
    'Full-time': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
    'Part-time': { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe', dot: '#8b5cf6' },
    'Remote': { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4', dot: '#10b981' },
    'Internship': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', dot: '#f97316' },
    'Contract': { bg: '#fefce8', color: '#a16207', border: '#fde68a', dot: '#eab308' },
};
const DEFAULT_TYPE = { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', dot: '#94a3b8' };

function getAvatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const SalaryIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

const BookmarkIcon = ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const JobCard = ({ job }) => {
    const { savedJobs, toggleSaveJob } = useContext(JobContext);
    const { user } = useContext(AuthContext);
    const [hovered, setHovered] = useState(false);

    const isSaved = savedJobs.some(s =>
        (typeof s === 'string' ? s : s._id) === job._id
    );

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleSaveJob(job._id);
    };

    const avatarColor = getAvatarColor(job.company || job.title);
    const typeStyle = TYPE_STYLES[job.type] || DEFAULT_TYPE;
    const initials = (job.company || 'J').slice(0, 2).toUpperCase();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                borderRadius: 24,
                background: '#fff',
                border: hovered ? '1.5px solid #bfdbfe' : '1.5px solid #e2e8f0',
                boxShadow: hovered
                    ? '0 24px 64px rgba(59,130,246,0.15), 0 4px 20px rgba(0,0,0,0.07)'
                    : '0 2px 12px rgba(15,23,42,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Gradient top accent bar — thicker and vivid */}
            <div style={{
                height: 5,
                background: hovered
                    ? 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 50%, #06b6d4 100%)'
                    : 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #67e8f9 100%)',
                transition: 'background 0.3s',
            }} />

            {/* Card content */}
            <div style={{ padding: '22px 22px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Row 1: Avatar + Type badge + Bookmark */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>

                    {/* Company avatar */}
                    <div style={{
                        width: 52, height: 52, borderRadius: 16,
                        background: avatarColor.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: avatarColor.text,
                        letterSpacing: '-0.5px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        flexShrink: 0,
                        fontFamily: 'Inter, sans-serif',
                    }}>
                        {initials}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Job type badge */}
                        {job.type && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}`,
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: typeStyle.dot }} />
                                {job.type}
                            </span>
                        )}

                        {/* Bookmark */}
                        {user?.role === 'user' && (
                            <button
                                onClick={handleSave}
                                title={isSaved ? 'Unsave' : 'Save Job'}
                                style={{
                                    width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isSaved ? '#ecfdf5' : '#f8fafc',
                                    color: isSaved ? '#059669' : '#94a3b8',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                }}
                            >
                                <BookmarkIcon filled={isSaved} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Row 2: Title + Company */}
                <div style={{ marginBottom: 14 }}>
                    <h3 style={{
                        fontSize: 17, fontWeight: 800, lineHeight: 1.35,
                        color: hovered ? '#2563eb' : '#0f172a',
                        marginBottom: 4, transition: 'color 0.2s',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        fontFamily: 'Inter, sans-serif',
                    }}>
                        {job.title}
                    </h3>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{job.company}</p>
                </div>

                {/* Row 3: Location + Salary pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                    {job.location && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '5px 11px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                            background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569',
                        }}>
                            <LocationIcon /> {job.location}
                        </span>
                    )}
                    {job.salary && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '5px 11px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                            background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
                        }}>
                            <SalaryIcon /> {job.salary}
                        </span>
                    )}
                </div>

                {/* Row 4: Description snippet */}
                {job.description && (
                    <p style={{
                        fontSize: 13, lineHeight: 1.7, color: '#94a3b8', flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginBottom: 0,
                    }}>
                        {job.description}
                    </p>
                )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, margin: '16px 22px 0', background: 'linear-gradient(to right, #eff6ff, #e0e7ff, #eff6ff)' }} />

            {/* CTA button */}
            <div style={{ padding: '16px 22px 22px' }}>
                <Link to={`/job/${job._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <button style={{
                        width: '100%', padding: '13px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                        fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.02em',
                        background: hovered
                            ? 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        boxShadow: hovered
                            ? '0 10px 28px rgba(99,102,241,0.55)'
                            : '0 4px 14px rgba(99,102,241,0.28)',
                        transform: hovered ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    }}>
                        View Details →
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
