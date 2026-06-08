import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AvatarCircle from '../../components/AvatarCircle';
import Toast from '../../components/Toast';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form Fields
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/users/me');
      const data = response.data.data;
      setProfileData(data);
      
      setName(data.name || '');
      setRollNumber(data.studentProfile?.rollNumber || '');
      setStudentClass(data.studentProfile?.class || '');
      setSection(data.studentProfile?.section || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: name.trim(),
        studentProfile: {
          rollNumber: rollNumber.trim(),
          class: studentClass.trim(),
          section: section.trim()
        }
      };

      const userId = profileData?.id || profileData?._id;
      const response = await api.put(`/users/${userId}`, payload);
      setSuccess('Profile updated successfully!');
      setProfileData(response.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}

      <h1 style={{ margin: '0 0 24px', fontWeight: 700, color: 'var(--text)' }}>My Profile</h1>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <AvatarCircle name={profileData?.name} size="xl" />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: '1.4rem' }}>
                  {profileData?.name}
                </h2>
                <span className="badge badge-primary">{profileData?.role}</span>
                <span className={`badge ${profileData?.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {profileData?.isActive ? 'Active Account' : 'Inactive'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '0.95rem' }}>{profileData?.email}</p>
            </div>
            
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ height: '40px' }}>
                Edit Profile
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                Academic Details
              </h3>
              
              {isEditing ? (
                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Roll Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={rollNumber} 
                      onChange={(e) => setRollNumber(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Class</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={studentClass} 
                      onChange={(e) => setStudentClass(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Section</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={section} 
                      onChange={(e) => setSection(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Roll Number:</span>
                    <span style={{ color: 'var(--text)' }}>{profileData?.studentProfile?.rollNumber || 'Not assigned'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Class:</span>
                    <span style={{ color: 'var(--text)' }}>{profileData?.studentProfile?.class || 'Not assigned'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Section:</span>
                    <span style={{ color: 'var(--text)' }}>{profileData?.studentProfile?.section || 'Not assigned'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Role Type:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{profileData?.role}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                Change Password
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Current Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled
                  />
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--warning)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Contact admin to change password
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
