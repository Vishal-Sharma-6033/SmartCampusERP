import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const CreateUser = () => {
  useDocumentTitle('Add User', 'Add a new user to the ERP portal');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // default role

  // Student specific profile details
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');

  // Teacher specific profile details
  const [subject, setSubject] = useState('');
  const [experience, setExperience] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      addToast('Name, email, and password are required.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        ...(role === 'STUDENT' && {
          studentProfile: {
            rollNumber: rollNumber.trim(),
            class: studentClass.trim(),
            section: section.trim()
          }
        }),
        ...(role === 'TEACHER' && {
          teacherProfile: {
            subject: subject.trim(),
            experience: Number(experience) || 0
          }
        })
      };

      await api.post('/users/create', payload);
      addToast('User created successfully!', 'success');
      navigate('/admin/users');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create user.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/admin/users')} 
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          &larr; Back to Users Management
        </button>
        <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>Add New User</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Create a new user account and map role profiles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Full Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Full Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Email Address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Email Address *</label>
          <input
            type="email"
            className="form-input"
            placeholder="johndoe@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Password *</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* System Role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>System Role</label>
          <select
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
            style={{ height: '40px', padding: '0 8px' }}
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
            <option value="PARENT">Parent</option>
          </select>
        </div>

        {/* Conditional Student Profile Fields */}
        {role === 'STUDENT' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px',
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--primary)' }}>Student Profile Details</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Roll Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="CS101"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Class</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="B.Tech CS"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Section</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Teacher Profile Fields */}
        {role === 'TEACHER' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px',
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--primary)' }}>Teacher Profile Details</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Subject Specialization</label>
              <input
                type="text"
                className="form-input"
                placeholder="Computer Networks"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Experience (Years)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isLoading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Create User'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={isLoading}
            onClick={() => navigate('/admin/users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
