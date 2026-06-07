import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const CreateNotice = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('notice'); // 'notice' or 'event'
  const [audience, setAudience] = useState('all'); // 'all', 'students', 'teachers'
  const [eventDate, setEventDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (type === 'event' && !eventDate) {
      setError('Event date is required for events.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        audience,
        ...(type === 'event' && { eventDate })
      };

      await api.post('/notices', payload);
      setSuccess('Notice created successfully!');
      
      // Redirect to notice board after a short delay
      setTimeout(() => {
        navigate('/notice-board');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create notice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}

      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/notice-board')} 
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          &larr; Back to Notice Board
        </button>
        <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>Create Notice / Event</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Publish announcements or scheduled calendar events.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter notice or event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Description</label>
          <textarea
            className="form-input"
            rows="5"
            placeholder="Provide detail description or notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            style={{ resize: 'vertical', minHeight: '100px', padding: '10px' }}
          />
        </div>

        {/* Notice Type Radio Option */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Type</label>
          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="type"
                value="notice"
                checked={type === 'notice'}
                onChange={() => setType('notice')}
                disabled={isLoading}
                style={{ width: '16px', height: '16px' }}
              />
              General Announcement (Notice)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="type"
                value="event"
                checked={type === 'event'}
                onChange={() => setType('event')}
                disabled={isLoading}
                style={{ width: '16px', height: '16px' }}
              />
              Calendar Event
            </label>
          </div>
        </div>

        {/* Event Date (Show only if type is event) */}
        {type === 'event' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Event Date *</label>
            <input
              type="date"
              className="form-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        )}

        {/* Target Audience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Target Audience</label>
          <select
            className="form-input"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            disabled={isLoading}
            style={{ height: '40px', padding: '0 8px' }}
          >
            <option value="all">Everyone</option>
            <option value="students">Students Only</option>
            <option value="teachers">Teachers Only</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isLoading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Publish'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={isLoading}
            onClick={() => navigate('/notice-board')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotice;
