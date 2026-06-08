import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import SkeletonLoader from '../../components/SkeletonLoader';

const Settings = () => {
  useDocumentTitle('Portal Settings', 'Manage portal system configurations');
  const { addToast } = useToast();

  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inline edit state
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // New setting state
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/settings');
      const data = response.data.data || [];
      setSettings(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load system settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleStartEdit = (setting) => {
    setEditingKey(setting.key);
    setEditingValue(setting.value || '');
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const handleUpdateSetting = async (key) => {
    if (editingValue.trim() === '') {
      addToast('Setting value cannot be empty.', 'warning');
      return;
    }
    setIsUpdating(true);
    try {
      await api.post('/admin/settings', { key, value: editingValue.trim() });
      addToast('Setting updated successfully.', 'success');
      setEditingKey(null);
      fetchSettings();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update setting.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateSetting = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      addToast('Both key and value are required.', 'warning');
      return;
    }

    // Key format validation (no spaces, alphanumeric/underscores)
    const keyRegex = /^[A-Za-z0-9_]+$/;
    if (!keyRegex.test(newKey.trim())) {
      addToast('Setting keys must be alphanumeric (letters, numbers, underscores) with no spaces.', 'warning');
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/admin/settings', {
        key: newKey.trim(),
        value: newValue.trim()
      });
      addToast('New setting registered successfully!', 'success');
      setNewKey('');
      setNewValue('');
      fetchSettings();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create setting.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>Portal Settings</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            System variables and configurations for the college ERP modules.
          </p>
        </div>
      </div>

      {/* Settings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
          Active Configuration Keys
        </h3>

        {isLoading ? (
          <SkeletonLoader type="card" count={2} />
        ) : settings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--muted)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            No configuration settings defined. Add your first system variable below.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
            {settings.map((setting) => {
              const isEditing = editingKey === setting.key;
              return (
                <div 
                  key={setting._id || setting.key} 
                  className="card" 
                  style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderColor: isEditing ? 'var(--primary)' : 'var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.92rem', color: 'var(--primary)' }}>
                      {setting.key}
                    </span>
                    {!isEditing && (
                      <button 
                        onClick={() => handleStartEdit(setting)} 
                        className="btn btn-ghost btn-sm" 
                        style={{ padding: '2px 8px', fontSize: '0.8rem', height: 'auto' }}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          style={{ height: '36px', fontSize: '0.88rem' }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
                          <button 
                            onClick={() => handleUpdateSetting(setting.key)} 
                            className="btn btn-primary btn-sm"
                            disabled={isUpdating}
                            style={{ padding: '4px 10px', height: '28px', fontSize: '0.8rem' }}
                          >
                            {isUpdating ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            onClick={handleCancelEdit} 
                            className="btn btn-outline btn-sm"
                            disabled={isUpdating}
                            style={{ padding: '4px 10px', height: '28px', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.05rem', color: 'var(--text)', fontWeight: 500, wordBreak: 'break-all' }}>
                        {setting.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Setting Form */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
          Define New Setting
        </h3>

        <form onSubmit={handleCreateSetting} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Key */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Configuration Key</label>
              <input
                type="text"
                className="form-input"
                placeholder="REGISTRATION_STATUS"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                required
                disabled={isCreating}
                style={{ height: '40px' }}
              />
            </div>

            {/* Value */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Value</label>
              <input
                type="text"
                className="form-input"
                placeholder="OPEN"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                required
                disabled={isCreating}
                style={{ height: '40px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isCreating}
            style={{ alignSelf: 'flex-start', padding: '0 24px', height: '40px' }}
          >
            {isCreating ? 'Creating...' : 'Register Setting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
