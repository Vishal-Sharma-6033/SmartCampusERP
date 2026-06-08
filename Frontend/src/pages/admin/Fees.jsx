import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import FeeStatusBadge from '../../components/FeeStatusBadge';
import Toast from '../../components/Toast';
import { getIcon } from '../../components/Sidebar';

const AdminFees = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'management'
  
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  // Search/Student State
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentFee, setStudentFee] = useState(null);
  const [isFeeLoading, setIsFeeLoading] = useState(false);

  // Administrative Action Form States
  const [createAmount, setCreateAmount] = useState('');
  const [scholarshipType, setScholarshipType] = useState('PERCENTAGE');
  const [scholarshipValue, setScholarshipValue] = useState('');
  
  // Installment creation state
  const [installments, setInstallments] = useState([
    { amount: '', dueDate: '' }
  ]);

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // 1. Fetch Analytics on tab open
  const fetchAnalyticsData = async () => {
    setIsAnalyticsLoading(true);
    try {
      const res = await api.get('/fees/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch collection analytics.');
      setToastType('error');
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab]);

  // 2. Search Students
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsStudentsLoading(true);
    setSelectedStudent(null);
    setStudentFee(null);
    try {
      const res = await api.get(`/users?role=STUDENT&search=${searchQuery}&limit=10`);
      setStudentsList(res.data.data?.users || res.data.data || []);
    } catch (err) {
      console.error(err);
      setToastMessage('Student search failed.');
      setToastType('error');
    } finally {
      setIsStudentsLoading(false);
    }
  };

  // 3. Fetch Fee record for chosen student
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setIsFeeLoading(true);
    setStudentFee(null);
    setCreateAmount('');
    setScholarshipValue('');
    setInstallments([{ amount: '', dueDate: '' }]);
    try {
      const res = await api.get(`/fees/${student._id}`);
      const data = res.data?.data || res.data;
      setStudentFee(data);
    } catch (err) {
      console.error('No fee record or fetch failed:', err);
      setStudentFee(null);
    } finally {
      setIsFeeLoading(false);
    }
  };

  // 4. Create Fee
  const handleCreateFee = async (e) => {
    e.preventDefault();
    if (!createAmount || Number(createAmount) <= 0) return;
    setIsActionSubmitting(true);
    try {
      const res = await api.post('/fees/create', {
        studentId: selectedStudent._id,
        totalAmount: Number(createAmount)
      });
      setToastMessage('Fee record successfully initialized!');
      setToastType('success');
      setStudentFee(res.data?.data || res.data);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to initialize fee record.');
      setToastType('error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 5. Apply Scholarship
  const handleApplyScholarship = async (e) => {
    e.preventDefault();
    if (!scholarshipValue || Number(scholarshipValue) <= 0) return;
    setIsActionSubmitting(true);
    try {
      const res = await api.post('/fees/scholarship', {
        studentId: selectedStudent._id,
        type: scholarshipType,
        value: Number(scholarshipValue)
      });
      setToastMessage('Scholarship successfully applied!');
      setToastType('success');
      setStudentFee(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to apply scholarship.');
      setToastType('error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 6. Apply Late Fee
  const handleApplyLateFee = async () => {
    setIsActionSubmitting(true);
    try {
      const res = await api.post(`/fees/late-fee/${selectedStudent._id}`);
      setToastMessage('Late penalty assessment applied!');
      setToastType('success');
      setStudentFee(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to apply late fee (check due dates).');
      setToastType('error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 7. Installments plan configuration
  const handleAddInstallmentRow = () => {
    setInstallments([...installments, { amount: '', dueDate: '' }]);
  };

  const handleRemoveInstallmentRow = (idx) => {
    if (installments.length === 1) return;
    setInstallments(installments.filter((_, i) => i !== idx));
  };

  const handleInstallmentChange = (idx, field, val) => {
    const updated = installments.map((item, i) => {
      if (i === idx) return { ...item, [field]: val };
      return item;
    });
    setInstallments(updated);
  };

  const handlePublishInstallments = async (e) => {
    e.preventDefault();
    const totalSelected = installments.reduce((sum, inst) => sum + Number(inst.amount), 0);
    const billable = studentFee.finalAmount || studentFee.totalAmount;
    if (totalSelected !== billable) {
      setToastMessage(`Total installment sums (₹${totalSelected}) must exactly match billable fees (₹${billable})`);
      setToastType('error');
      return;
    }

    setIsActionSubmitting(true);
    try {
      const formatted = installments.map(item => ({
        amount: Number(item.amount),
        dueDate: new Date(item.dueDate).toISOString()
      }));

      const res = await api.post('/fees/installment', {
        studentId: selectedStudent._id,
        installments: formatted
      });
      setToastMessage('Installment schedule published!');
      setToastType('success');
      setStudentFee(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to create installments plan.');
      setToastType('error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // Analytics Donut Chart parameters
  const getDonutSegments = () => {
    if (!analytics || !analytics.statusStats) return [];
    const stats = analytics.statusStats;
    const totalCount = stats.reduce((sum, item) => sum + item.count, 0);
    if (totalCount === 0) return [];

    let accumulatedAngle = 0;
    return stats.map((item) => {
      const pct = (item.count / totalCount) * 100;
      const angle = (item.count / totalCount) * 360;
      const segment = {
        label: item._id,
        count: item.count,
        percentage: Math.round(pct),
        angleStart: accumulatedAngle,
        angleEnd: accumulatedAngle + angle
      };
      accumulatedAngle += angle;
      return segment;
    });
  };

  const donutSegments = getDonutSegments();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Main Mode Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'analytics' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Fee Analytics & Charts
        </button>
        <button
          onClick={() => setActiveTab('management')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'management' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'management' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'management' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Student Fee Registry
        </button>
      </div>

      {/* ────────────────── VIEW 1: COLLECTION ANALYTICS ────────────────── */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isAnalyticsLoading ? (
            <div className="skeleton" style={{ height: '250px' }} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Financial Stats Summary */}
              <div className="card" style={{ height: 'fit-content' }}>
                <div className="card-header">
                  <h3 className="card-title">Collection Summary</h3>
                </div>
                <div className="card-body flex-col gap-4">
                  <div>
                    <span className="text-muted text-xs block">Total Collection (Paid)</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--success)' }}>
                      ₹{analytics.totalCollection?.totalPaid?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted text-xs block">Total Outstanding (Due)</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--danger)' }}>
                      ₹{analytics.totalCollection?.totalDue?.toLocaleString() || 0}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Donut Chart / Counts Breakdown */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Payment Status Distribution</h3>
                </div>
                <div className="card-body flex items-center justify-center" style={{ gap: '30px', padding: '24px', flexWrap: 'wrap' }}>
                  {/* SVG Donut Chart */}
                  <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                    <svg viewBox="0 0 42 42" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="4" />
                      {donutSegments.map((seg, idx) => {
                        const colors = { PAID: 'var(--success)', PARTIAL: 'var(--warning)', PENDING: 'var(--danger)' };
                        const strokeColor = colors[seg.label] || 'var(--muted)';
                        const circumference = 2 * Math.PI * 15.915; // exactly 100
                        const dashoffset = 100 - seg.percentage;
                        const rotation = (seg.angleStart / 360) * 100;
                        return (
                          <circle
                            key={idx}
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke={strokeColor}
                            strokeWidth="4.2"
                            strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`}
                            strokeDashoffset={100 - rotation}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                    {donutSegments.map((seg, idx) => {
                      const colors = { PAID: 'var(--success)', PARTIAL: 'var(--warning)', PENDING: 'var(--danger)' };
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[seg.label] }} />
                            <span className="font-semibold text-secondary">{seg.label}</span>
                          </span>
                          <span className="text-muted">{seg.count} ({seg.percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────── VIEW 2: REGISTRY & MANAGEMENT ────────────────── */}
      {activeTab === 'management' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left Panel: Search & Select */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-header">
              <h3 className="card-title">Search Student Portal</h3>
            </div>
            <div className="card-body flex-col gap-4">
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={isStudentsLoading}>
                  Search
                </button>
              </form>

              {/* Search list results */}
              {isStudentsLoading ? (
                <div className="flex justify-center p-4"><div className="spinner spinner-dark"></div></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                  {studentsList.map(std => (
                    <div
                      key={std._id}
                      onClick={() => handleSelectStudent(std)}
                      style={{
                        padding: '12px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        backgroundColor: selectedStudent?._id === std._id ? 'var(--primary-light)' : 'var(--surface)',
                        transition: 'background var(--transition)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div className="avatar-small">{std.name?.slice(0,2).toUpperCase()}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{std.name}</span>
                        <span className="text-muted text-xs truncate">{std.email} | Sem {std.studentProfile?.semester || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Selected Student Management */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-header">
              <h3 className="card-title">Student Fee Operations</h3>
            </div>
            <div className="card-body">
              {!selectedStudent ? (
                <p className="text-muted text-sm" style={{ padding: '30px', textAlign: 'center' }}>
                  Select a student from the portal search results to view details.
                </p>
              ) : isFeeLoading ? (
                <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
              ) : !studentFee ? (
                /* CREATE FEE RECORD FORM */
                <div className="flex-col gap-4">
                  <div className="alert alert-info">
                    <span>No active fee record found for {selectedStudent.name}. Initialize a new ledger.</span>
                  </div>
                  <form onSubmit={handleCreateFee} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Total Fee Amount (INR)</label>
                      <input
                        type="number"
                        min="100"
                        className="form-input"
                        placeholder="e.g. 50000"
                        value={createAmount}
                        onChange={(e) => setCreateAmount(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={isActionSubmitting}>
                      Initialize Fee Record
                    </button>
                  </form>
                </div>
              ) : (
                /* MANAGE LEDGER FORM */
                <div className="flex-col gap-6">
                  {/* Ledger summary */}
                  <div style={{ backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong className="text-sm">{selectedStudent.name}</strong>
                      <FeeStatusBadge status={studentFee.status} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', fontSize: '0.8rem' }}>
                      <span>Billable: <strong>₹{(studentFee.finalAmount || studentFee.totalAmount).toLocaleString()}</strong></span>
                      <span>Outstanding: <strong style={{ color: 'var(--danger)' }}>₹{(studentFee.dueAmount || 0).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Actions section */}
                  {studentFee.dueAmount > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {/* Apply Scholarship Form */}
                      <form onSubmit={handleApplyScholarship} className="card" style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span className="font-bold text-xs" style={{ display: 'block', marginBottom: '8px' }}>Apply Scholarship Discount</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <select className="form-select" style={{ padding: '6px 10px' }} value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value)}>
                            <option value="PERCENTAGE">PERCENTAGE (%)</option>
                            <option value="FIXED">FIXED (₹)</option>
                          </select>
                          <input
                            type="number"
                            min="1"
                            className="form-input"
                            style={{ padding: '6px 10px' }}
                            placeholder="Value"
                            value={scholarshipValue}
                            onChange={(e) => setScholarshipValue(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-secondary btn-sm w-full" disabled={isActionSubmitting}>
                          Apply Discount
                        </button>
                      </form>

                      {/* Late Fee Trigger */}
                      <div className="card" style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="font-bold text-xs block">Apply Late Penalty</span>
                          <span className="text-muted text-xs">Adds ₹50 per day past due date</span>
                        </div>
                        <button onClick={handleApplyLateFee} className="btn btn-danger btn-sm" disabled={isActionSubmitting}>
                          Apply
                        </button>
                      </div>

                      {/* Installment Plan configuration */}
                      {(!studentFee.installments || studentFee.installments.length === 0) && (
                        <form onSubmit={handlePublishInstallments} className="card" style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span className="font-bold text-xs">Configure Installments</span>
                            <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={handleAddInstallmentRow}>
                              + Add Row
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                            {installments.map((inst, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <input
                                  type="number"
                                  placeholder="Amount (₹)"
                                  className="form-input"
                                  style={{ padding: '6px' }}
                                  value={inst.amount}
                                  onChange={(e) => handleInstallmentChange(idx, 'amount', e.target.value)}
                                  required
                                />
                                <input
                                  type="date"
                                  className="form-input"
                                  style={{ padding: '6px' }}
                                  value={inst.dueDate}
                                  onChange={(e) => handleInstallmentChange(idx, 'dueDate', e.target.value)}
                                  required
                                />
                                {installments.length > 1 && (
                                  <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '2px' }} onClick={() => handleRemoveInstallmentRow(idx)}>
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <button type="submit" className="btn btn-primary btn-sm w-full" disabled={isActionSubmitting}>
                            Publish Installment Schedule
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
