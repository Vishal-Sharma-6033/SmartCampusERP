import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import IssueRow from '../../components/IssueRow';
import OverdueBanner from '../../components/OverdueBanner';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const StudentMyBooks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasOverdue, setHasOverdue] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchIssuesList = async () => {
    try {
      const res = await api.get('/library/my-issues');
      const data = res.data?.data || res.data || [];
      setIssues(data);
      
      // Calculate overdue flag
      const overdueExists = data.some(
        issue => issue.status === 'ISSUED' && new Date() > new Date(issue.dueDate)
      );
      setHasOverdue(overdueExists);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch issued books.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesList();
  }, []);

  const handleReturnBook = async (bookId) => {
    // 1. Optimistic UI update: Find target issue and update status to returned locally
    const originalIssues = [...issues];
    setIssues(prevIssues =>
      prevIssues.map(issue => {
        if (issue.bookId?._id === bookId && issue.status === 'ISSUED') {
          return {
            ...issue,
            status: 'RETURNED',
            returnDate: new Date().toISOString()
          };
        }
        return issue;
      })
    );

    setIsProcessing(true);
    try {
      await api.post('/library/return', { bookId });
      setToastMessage('Book returned successfully!');
      setToastType('success');
      fetchIssuesList(); // Sync with DB (which returns exact fine calculated, etc.)
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to return book.');
      setToastType('error');
      // Revert optimistic state
      setIssues(originalIssues);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayFine = async (issueId, fineAmount) => {
    setIsProcessing(true);
    try {
      // 1. Initiate Fine checkout on backend
      const res = await api.post('/library/fine/pay', { issueId });
      const order = res.data?.data || res.data;
      
      if (!order || !order.id) {
        throw new Error('Failed to generate payment order');
      }

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: order.amount,
        currency: order.currency,
        name: 'SmartCampusERP',
        description: 'Library Late Return Fine Settlement',
        order_id: order.id,
        handler: async (rzpResponse) => {
          setIsProcessing(true);
          try {
            // 3. Verify on backend (with HMAC checks)
            await api.post('/library/fine/verify', {
              issueId,
              paymentId: rzpResponse.razorpay_payment_id,
              orderId: rzpResponse.razorpay_order_id,
              razorpaySignature: rzpResponse.razorpay_signature
            });
            
            setToastMessage('Fine paid and verified successfully!');
            setToastType('success');
            fetchIssuesList(); // Refresh timeline status
          } catch (verifyErr) {
            console.error(verifyErr);
            setToastMessage('Payment verification failed.');
            setToastType('error');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Fine initiation failed.');
      setToastType('error');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '80px' }} />
        <div className="skeleton" style={{ height: '200px', marginTop: '20px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Sticky Warning Bar */}
      <OverdueBanner hasOverdue={hasOverdue} />

      {/* Page Header */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>My Issued Books</h2>
            <p className="text-secondary text-xs">Track current checkout items, check due dates, and settle outstanding late return fines online.</p>
          </div>
          <button 
            onClick={() => navigate('/student/library')} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search Book Catalog</span>
          </button>
        </div>
      </div>

      {/* Books list table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Borrowing History Log</h3>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {issues.length === 0 ? (
            <p className="text-muted text-sm" style={{ padding: '40px', textAlign: 'center' }}>
              No books borrowed yet. Browse the catalog to issue a book.
            </p>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Book Details</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map(issue => (
                    <IssueRow
                      key={issue._id}
                      issue={issue}
                      isProcessing={isProcessing}
                      onReturn={handleReturnBook}
                      onPayFine={handlePayFine}
                      role="STUDENT"
                    />
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

export default StudentMyBooks;
