import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ResultCard from '../../components/ResultCard';

const Results = () => {
  const [resultsList, setResultsList] = useState([]);
  const [summary, setSummary] = useState({
    totalGraded: 0,
    cumulativePercentage: 0,
    overallGrade: 'C'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get('/exams/results');
        const list = response.data.data || [];
        setResultsList(list);

        // Compute summary metrics
        if (list.length > 0) {
          const totalGraded = list.length;
          const sumPct = list.reduce((sum, item) => sum + (item.percentage || 0), 0);
          const cumulativePercentage = Math.round(sumPct / totalGraded);
          
          let overallGrade = 'C';
          if (cumulativePercentage >= 75) overallGrade = 'A';
          else if (cumulativePercentage >= 60) overallGrade = 'B';

          setSummary({
            totalGraded,
            cumulativePercentage,
            overallGrade
          });
        }
      } catch (err) {
        console.error('Failed to load results:', err);
        setError('Failed to fetch result sheets.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '100px' }} />
        <div className="skeleton" style={{ height: '150px', marginTop: '20px' }} />
        <div className="skeleton" style={{ height: '150px', marginTop: '20px' }} />
      </div>
    );
  }

  let summaryGradeColor = 'var(--text-secondary)';
  if (summary.overallGrade === 'A') summaryGradeColor = 'var(--success)';
  else if (summary.overallGrade === 'B') summaryGradeColor = 'var(--info)';
  else if (summary.overallGrade === 'C') summaryGradeColor = 'var(--warning)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Summary Box */}
      {resultsList.length > 0 && (
        <div className="card" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="text-secondary text-sm font-semibold">Cumulative Academic Performance</span>
              <h2 className="font-bold text-2xl" style={{ color: 'var(--primary)', margin: '2px 0' }}>
                {summary.cumulativePercentage}% Score Rate
              </h2>
              <span className="text-muted text-xs">Averaged across {summary.totalGraded} term result sheets</span>
            </div>
            <div style={{
              padding: '12px 24px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="text-muted text-xs font-semibold block" style={{ textTransform: 'uppercase', marginBottom: '2px' }}>Overall Grade</span>
              <span className="font-bold text-2xl" style={{ color: summaryGradeColor }}>
                {summary.overallGrade}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="font-bold text-lg" style={{ color: 'var(--text)', margin: '0' }}>Result Sheets Log</h3>
        
        {resultsList.length === 0 ? (
          <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>
            No exam results published yet for your academic account.
          </div>
        ) : (
          resultsList.map(res => (
            <ResultCard key={res._id} result={res} />
          ))
        )}
      </div>
    </div>
  );
};

export default Results;
