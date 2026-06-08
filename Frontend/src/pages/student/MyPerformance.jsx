import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import PerformanceMeter from '../../components/PerformanceMeter';
import Toast from '../../components/Toast';

const MyPerformance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState(null);
  const [weakAreas, setWeakAreas] = useState(null);
  const [trend, setTrend] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = user?.id || user?._id;

  const loadAnalyticsData = async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError('');

    try {
      const [perfRes, weakRes, trendRes, recRes, resRes] = await Promise.all([
        api.get(`/ai/performance/${studentId}`),
        api.get(`/ai/weak-areas/${studentId}`),
        api.get(`/ai/trend/${studentId}`),
        api.get(`/ai/recommendations/${studentId}`),
        api.get(`/ai/resources/${studentId}`)
      ]);

      setPerformance(perfRes.data.data);
      setWeakAreas(weakRes.data.data);
      setTrend(trendRes.data.data);
      setRecommendations(recRes.data.data?.recommendations || []);
      setResources(resRes.data.data?.recommendations || []); // gets resources recommended array
    } catch (err) {
      console.error('Failed to load performance analytics:', err);
      setError('Could not retrieve detailed performance metrics. Make sure you have graded exams/assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [studentId]);

  const getTrendIcon = (t) => {
    if (t === 'Improving') {
      return (
        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
          📈 Improving
        </span>
      );
    }
    if (t === 'Declining') {
      return (
        <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
          📉 Declining
        </span>
      );
    }
    return (
      <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
        ➡️ Stable
      </span>
    );
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <button 
            onClick={() => navigate('/student/ai-tutor')} 
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '8px', padding: 0, height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            &larr; Return to AI Tutor Chat
          </button>
          <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>AI Academic Performance</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Personalized insights and academic trajectory computed by SmartCampus AI.
          </p>
        </div>

        <button 
          onClick={loadAnalyticsData} 
          className="btn btn-outline"
          disabled={isLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--muted)', marginTop: '16px', fontSize: '0.9rem' }}>Analyzing performance details...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Overview Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Circle Meter Card */}
            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PerformanceMeter
                percentage={performance?.percentage || 0}
                level={performance?.performanceLevel || 'Average'}
                size={170}
              />
            </div>

            {/* Score Details & Stats */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Total Performance Score
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                  {performance?.obtainedMarks || 0} <span style={{ color: 'var(--muted)', fontSize: '1.2rem', fontWeight: 500 }}>/ {performance?.totalMarks || 0} Marks</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Performance Trend (Exams Only)
                </span>
                <div style={{ marginTop: '8px', fontSize: '1.05rem', color: 'var(--text)' }}>
                  {trend && !trend.message ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getTrendIcon(trend.trend)}
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                          (Last: {trend.lastPercentage?.toFixed(0)}% &rarr; Current: {trend.currentPercentage?.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      {trend?.message || 'Insufficient exam data to calculate trends.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Weak Areas vs Strong Areas Row */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem' }}>
              Subject Proficiency Breakdown
            </h3>
            
            {weakAreas && !weakAreas.message ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Strong Subjects */}
                <div style={{ padding: '16px', backgroundColor: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: 'var(--radius)' }}>
                  <h4 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✔ Strong Subjects
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {weakAreas.strongSubjects && weakAreas.strongSubjects.length > 0 ? (
                      weakAreas.strongSubjects.map((sub, idx) => (
                        <span key={idx} className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No strong subjects identified yet.</span>
                    )}
                  </div>
                </div>

                {/* Weak Subjects */}
                <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius)' }}>
                  <h4 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠ Focus Subjects (Weak Areas)
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {weakAreas.weakSubjects && weakAreas.weakSubjects.length > 0 ? (
                      weakAreas.weakSubjects.map((sub, idx) => (
                        <span key={idx} className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No critical weak subjects. Keep it up!</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                {weakAreas?.message || 'No subject proficiency data available. Graded exams are required to map focus areas.'}
              </p>
            )}
          </div>

          {/* AI Smart Recommendations & Resources */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {/* Recommendations */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem' }}>
                Smart Recommendations
              </h3>
              {recommendations.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No recommendations generated. Keep studying and checking in!
                </p>
              ) : (
                <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.map((rec, idx) => (
                    <li key={idx} style={{ color: 'var(--text)', lineHeight: '1.5', fontSize: '0.92rem' }}>
                      {rec}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Suggested Books / Resources */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem' }}>
                Suggested Study Resources
              </h3>
              {resources.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No study resources mapped. Standard resources will appear when weak subject areas are diagnosed.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {resources.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>
                        {item.subject} Resources
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {item.resources.map((res, rIdx) => (
                          <span 
                            key={rIdx} 
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text)',
                              backgroundColor: 'var(--bg)',
                              border: '1px solid var(--border)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            📖 {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPerformance;
