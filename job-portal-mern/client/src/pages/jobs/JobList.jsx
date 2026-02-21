import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import FadeIn from "../../components/animations/FadeIn";
import JobCard from "../../components/JobCard";
import Skeleton from "../../components/ui/Skeleton";

/* ─── Inline style constants ─────────────────────────────────────── */
const HERO_BG = {
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #1e3a5f 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const CARDS_BG = {
  background: 'linear-gradient(160deg, #eff6ff 0%, #eef2ff 35%, #faf5ff 65%, #f0fdf4 100%)',
  minHeight: '500px',
};

const GRADIENT_BTN = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
  border: 'none',
  color: '#fff',
  fontWeight: 700,
  padding: '0 28px',
  height: 52,
  borderRadius: 14,
  fontSize: 15,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  flexShrink: 0,
};

/* ─── Stats ──────────────────────────────────────────────────────── */
const StatIcon1 = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>);
const StatIcon2 = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const StatIcon3 = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const StatIcon4 = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>);

const STATS = [
  { value: '12,500+', label: 'Jobs Posted', color: '#eff6ff', border: '#bfdbfe', Icon: StatIcon1 },
  { value: '850+', label: 'Companies', color: '#f5f3ff', border: '#ddd6fe', Icon: StatIcon2 },
  { value: '2.4M', label: 'Candidates', color: '#ecfeff', border: '#a5f3fc', Icon: StatIcon3 },
  { value: '150+', label: 'Hired Daily', color: '#f0fdf4', border: '#bbf7d0', Icon: StatIcon4 },
];

/* ─── Job Types ───────────────────────────────────────────────────── */
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { page, search: keyword, location, type };
        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        const res = await API.get('/jobs', { params });
        setJobs(res.data.jobs);
        setPages(res.data.pages);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, searchTrigger]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setSearchTrigger(p => p + 1); };
  const clearFilters = () => { setKeyword(''); setLocation(''); setType(''); setPage(1); setSearchTrigger(p => p + 1); };
  const applyType = (t) => { setType(t === 'All' ? '' : t); setPage(1); setSearchTrigger(p => p + 1); };

  return (
    <div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — deep navy gradient
      ═══════════════════════════════════════════════════════════ */}
      <div style={HERO_BG}>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(60px)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-5%', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(80px)'
          }} />
          <div style={{
            position: 'absolute', top: '30%', left: '40%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', filter: 'blur(60px)'
          }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ paddingTop: 96, paddingBottom: 80, zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, alignItems: 'center', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

            {/* Badge */}
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
                borderRadius: 99, fontSize: 13, fontWeight: 600,
                background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(165,180,252,0.3)',
                color: '#a5b4fc', marginBottom: 24,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
                10,000+ jobs available right now
              </span>

              <h1 style={{
                fontFamily: 'Inter,sans-serif', fontWeight: 900, lineHeight: 1.1,
                fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: 20,
                background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Find Your Dream<br />Career Today
              </h1>

              <p style={{ fontSize: 18, color: 'rgba(203,213,225,0.85)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
                Connect with world-class employers. Discover roles that match your skills, passion, and ambition.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch}>
                <div style={{
                  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center',
                  background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 10, maxWidth: 700, margin: '0 auto',
                }}>
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Job title or keyword…"
                    style={{
                      flex: '1 1 180px', minWidth: 120, background: 'transparent', border: 'none', outline: 'none',
                      color: '#fff', fontSize: 15, padding: '8px 12px', fontFamily: 'Inter,sans-serif',
                    }}
                  />
                  <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Location…"
                    style={{
                      flex: '1 1 140px', minWidth: 100, background: 'transparent', border: 'none', outline: 'none',
                      color: '#fff', fontSize: 15, padding: '8px 12px', fontFamily: 'Inter,sans-serif',
                    }}
                  />
                  <button type="submit" style={GRADIENT_BTN}>
                    Search Jobs
                  </button>
                </div>
              </form>

              {/* Popular searches */}
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13, fontWeight: 600 }}>Popular:</span>
                {['React Developer', 'UI Designer', 'Node.js', 'Marketing'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setKeyword(tag); setPage(1); setSearchTrigger(p => p + 1); }}
                    style={{
                      padding: '4px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(203,213,225,0.9)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '28px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '16px 8px', textAlign: 'center' }}>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: s.color, border: `1px solid ${s.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.Icon />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#1e40af', letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          JOB CARDS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <div style={{ ...CARDS_BG, paddingTop: 64, paddingBottom: 80, position: 'relative' }}>

        {/* Background orbs inside cards section */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(147,197,253,0.5) 0%, transparent 70%)', filter: 'blur(80px)'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: -80, width: 500, height: 600, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(167,139,250,0.25) 0%, transparent 70%)', filter: 'blur(80px)'
          }} />
          <div style={{
            position: 'absolute', top: 100, right: -60, width: 400, height: 500, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(134,239,172,0.25) 0%, transparent 70%)', filter: 'blur(80px)'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 1 }}>

          {/* Section Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Latest Opportunities</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>Find your perfect role from our curated listings</p>
            </div>
            {/* Filter pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {JOB_TYPES.map(t => {
                const active = (t === 'All' && !type) || t === type;
                return (
                  <button
                    key={t}
                    onClick={() => applyType(t)}
                    style={{
                      padding: '7px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.85)',
                      color: active ? '#fff' : '#475569',
                      border: active ? 'none' : '1px solid #e2e8f0',
                      boxShadow: active ? '0 4px 14px rgba(99,102,241,0.4)' : '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards grid / skeleton */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-4 w-1/2 mb-4 rounded" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {jobs.length > 0 ? jobs.map((job, idx) => (
                  <FadeIn key={job._id} delay={idx * 0.05} direction="up">
                    <JobCard job={job} />
                  </FadeIn>
                )) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: 80, height: 80, borderRadius: 24, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No jobs found</h3>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>Try adjusting your search or filters</p>
                    <button onClick={clearFilters} style={{ ...GRADIENT_BTN, height: 44, padding: '0 24px', fontSize: 14 }}>
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 56 }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                      padding: '8px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: page === 1 ? 'not-allowed' : 'pointer',
                      background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#475569',
                      opacity: page === 1 ? 0.4 : 1, transition: 'all 0.2s',
                    }}
                  >← Prev</button>

                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        width: 40, height: 40, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                        background: page === i + 1 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.9)',
                        color: page === i + 1 ? '#fff' : '#475569',
                        border: page === i + 1 ? 'none' : '1px solid #e2e8f0',
                        boxShadow: page === i + 1 ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                      }}
                    >{i + 1}</button>
                  ))}

                  <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    style={{
                      padding: '8px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: page === pages ? 'not-allowed' : 'pointer',
                      background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#475569',
                      opacity: page === pages ? 0.4 : 1, transition: 'all 0.2s',
                    }}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobList;
