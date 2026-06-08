import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import FeeStatusBadge from '../../components/FeeStatusBadge';
import Toast from '../../components/Toast';

const StudentFees = () => {
  const { user } = useAuth();
  const [fee, setFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // States
  const [isPaying, setIsPaying] = useState(false);
  const [isInstallmentPaying, setIsInstallmentPaying] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchFeeDetails = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const studentId = user._id || user.id;
      // Backend GET /fees/:studentId returns raw object directly or inside data
      const response = await api.get(`/fees/${studentId}`);
      const data = response.data?.data || response.data;
      setFee(data);
    } catch (err) {
      console.error(err);
      setFee(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeDetails();
  }, [user]);

  const handlePayFee = async (e) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) {
      setToastMessage('Please enter a valid payment amount');
      setToastType('error');
      return;
    }

    const amountNum = Number(payAmount);
    if (amountNum > (fee?.dueAmount || 0)) {
      setToastMessage(`Payment amount cannot exceed due amount: ₹${fee?.dueAmount}`);
      setToastType('error');
      return;
    }

    setIsPaying(true);
    try {
      const studentId = user._id || user.id;
      
      // 1. Initialise order on backend
      const response = await api.post('/fees/pay', {
        studentId,
        amount: amountNum
      });
      
      const { order } = response.data;
      
      if (!order) {
        throw new Error('Order creation failed on payment server');
      }

      // 2. Open Razorpay Checkout Dialog
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: order.amount,
        currency: order.currency,
        name: 'SmartCampusERP',
        description: 'Semester Fee Payment',
        order_id: order.id,
        handler: async (paymentResponse) => {
          try {
            // 3. Verify on backend
            await api.post('/fees/verify', {
              studentId,
              amount: amountNum,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature
            });
            
            setToastMessage('Payment successfully processed & verified!');
            setToastType('success');
            setPayAmount('');
            fetchFeeDetails(); // Reload stats
          } catch (verifyErr) {
            console.error(verifyErr);
            setToastMessage(verifyErr.response?.data?.message || 'Payment verification failed. Please contact support.');
            setToastType('error');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Payment initiation failed.');
      setToastType('error');
      setIsPaying(false);
    }
  };

  const handlePayInstallment = async (index, amount) => {
    setIsInstallmentPaying(index);
    try {
      const studentId = user._id || user.id;
      // Direct post to pay installment
      await api.post('/fees/installment/pay', {
        studentId,
        installmentIndex: index
      });

      setToastMessage(`Successfully processed installment payment of ₹${amount}!`);
      setToastType('success');
      fetchFeeDetails();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Installment payment failed.');
      setToastType('error');
    } finally {
      setIsInstallmentPaying(null);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    setToastMessage('Downloading receipt...');
    setToastType('info');
    try {
      // Receipt download calls GET /fees/receipt/:id
      const response = await api.get(`/fees/receipt/${paymentId}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToastMessage('Receipt downloaded!');
      setToastType('success');
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to download receipt PDF.');
      setToastType('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '140px' }} />
        <div className="skeleton" style={{ height: '250px', marginTop: '20px' }} />
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="12" y1="10" x2="12" y2="10" />
          <line x1="2" y1="8" x2="22" y2="8" />
        </svg>
        <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>No fee record published</h4>
        <p className="text-secondary text-sm">Please contact the administrative accounts section to setup your semester fee payments.</p>
      </div>
    );
  }

  // Calculate payment percentage
  const totalBillable = fee.finalAmount || fee.totalAmount;
  const progressPct = totalBillable > 0 ? Math.round((fee.paidAmount / totalBillable) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Stats and Pay Form Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Aggregated Fee Summary */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h3 className="card-title">Semester Fee Summary</h3>
            <FeeStatusBadge status={fee.status} />
          </div>
          <div className="card-body flex-col gap-4">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <span className="text-muted text-xs block">Total Fees Due</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>₹{totalBillable.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-muted text-xs block">Paid Amount</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>₹{fee.paidAmount.toLocaleString()}</strong>
              </div>
            </div>

            <div className="divider" style={{ margin: '5px 0' }} />

            <div>
              <span className="text-muted text-xs block" style={{ marginBottom: '2px' }}>Outstanding Due</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--danger)' }}>₹{(fee.dueAmount || 0).toLocaleString()}</strong>
              {fee.lateFee > 0 && (
                <span className="badge badge-danger text-xs" style={{ marginLeft: '10px' }}>
                  Includes ₹{fee.lateFee} Late Fee
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                <span style={{ color: 'var(--success)' }}>{progressPct}% Paid</span>
                <span className="text-muted">₹{(fee.dueAmount || 0).toLocaleString()} Remaining</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: 'var(--success)', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Interactive card */}
        {fee.dueAmount > 0 && (
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-header">
              <h3 className="card-title">Make a Payment</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handlePayFee} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="payAmt">Amount to Pay (INR)</label>
                  <input
                    id="payAmt"
                    type="number"
                    min="1"
                    max={fee.dueAmount}
                    className="form-input"
                    placeholder={`e.g. ${fee.dueAmount}`}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                    disabled={isPaying}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isPaying || isInstallmentPaying !== null}
                >
                  {isPaying ? <span className="spinner"></span> : 'Pay Now with Razorpay'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Scholarship Section */}
      {fee.scholarship && fee.scholarship.value > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--success)', backgroundColor: 'var(--success-light)' }}>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="font-bold text-sm" style={{ color: '#15803D' }}>Scholarship Applied</span>
              <p className="text-secondary text-xs" style={{ marginTop: '2px' }}>
                Type: {fee.scholarship.type === 'PERCENTAGE' ? `${fee.scholarship.value}% Discount` : `Flat ₹${fee.scholarship.value} Discount`}
              </p>
            </div>
            <div>
              <span className="font-bold" style={{ color: '#15803D' }}>- ₹{fee.discountAmount.toLocaleString()} Saved</span>
            </div>
          </div>
        </div>
      )}

      {/* Installments Table */}
      {fee.installments && fee.installments.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Installment Schedule Plan</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Installment No.</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fee.installments.map((inst, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">Installment #{idx + 1}</td>
                      <td>{inst.dueDate ? new Date(inst.dueDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="font-bold">₹{inst.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${inst.status === 'PAID' ? 'badge-success' : 'badge-danger'}`}>
                          {inst.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {inst.status !== 'PAID' && (
                          <button
                            type="button"
                            onClick={() => handlePayInstallment(idx, inst.amount)}
                            className="btn btn-secondary btn-sm"
                            disabled={isInstallmentPaying !== null || isPaying}
                          >
                            {isInstallmentPaying === idx ? <span className="spinner"></span> : 'Pay Installment'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Fee Transaction Receipts</h3>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {(!fee.payments || fee.payments.length === 0) ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Transaction Reference</th>
                    <th>Method</th>
                    <th style={{ textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {fee.payments.map((p, idx) => (
                    <tr key={idx}>
                      <td>{new Date(p.date || Date.now()).toLocaleDateString()}</td>
                      <td className="font-semibold text-success">₹{p.amount?.toLocaleString()}</td>
                      <td className="text-secondary text-sm font-semibold">{p.paymentId || 'MOCK_PAY_REF'}</td>
                      <td>
                        <span className="badge badge-neutral">{p.method || 'Razorpay Online'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDownloadReceipt(p._id || p.paymentId)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>PDF Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
