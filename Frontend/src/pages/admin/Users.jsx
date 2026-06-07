import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import AvatarCircle from '../../components/AvatarCircle';
import SkeletonLoader from '../../components/SkeletonLoader';
import Modal from '../../components/Modal';

const Users = () => {
  useDocumentTitle('User Management', 'Administrative user management panel');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' or 'deactivated'
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [linkParentOpen, setLinkParentOpen] = useState(false);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  // Delete confirm modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit user profile states
  const [editOpen, setEditOpen] = useState(false);
  const [editUserObj, setEditUserObj] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        search,
        role: roleFilter || undefined,
        status: statusFilter
      };
      const response = await api.get('/users', { params });
      const payload = response.data.data || { users: [], total: 0, totalPages: 1 };
      setUsers(payload.users || []);
      setTotalUsers(payload.total || 0);
      setTotalPages(payload.totalPages || 1);
    } catch (err) {
      console.error(err);
      addToast('Failed to load user list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDeactivate = async (id) => {
    try {
      await api.patch(`/admin/user/${id}/delete`);
      addToast('User account deactivated successfully.', 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to deactivate user.', 'error');
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.patch(`/admin/user/${id}/restore`);
      addToast('User account restored successfully.', 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to restore user.', 'error');
    }
  };

  const openDeleteModal = (user) => {
    setTargetUser(user);
    setDeleteInput('');
    setDeleteConfirmOpen(true);
  };

  const handleHardDelete = async () => {
    if (deleteInput !== 'DELETE') {
      addToast('Please type DELETE to confirm.', 'warning');
      return;
    }
    setIsDeleting(true);
    try {
      const id = targetUser?._id || targetUser?.id;
      await api.delete(`/admin/user/${id}/hard`);
      addToast('User permanently deleted.', 'success');
      setDeleteConfirmOpen(false);
      setTargetUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openLinkParentModal = async () => {
    setLinkParentOpen(true);
    try {
      const [parentsRes, studentsRes] = await Promise.all([
        api.get('/users?limit=100&role=PARENT'),
        api.get('/users?limit=100&role=STUDENT')
      ]);
      setParents(parentsRes.data.data?.users || []);
      setStudents(studentsRes.data.data?.users || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load parents or students lists.', 'error');
    }
  };

  const handleLinkParentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParentId || !selectedStudentId) {
      addToast('Please select both a parent and a student.', 'warning');
      return;
    }
    setIsLinking(true);
    try {
      await api.post('/users/link-parent', {
        parentId: selectedParentId,
        studentId: selectedStudentId
      });
      addToast('Parent linked to student successfully!', 'success');
      setLinkParentOpen(false);
      setSelectedParentId('');
      setSelectedStudentId('');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to link parent.', 'error');
    } finally {
      setIsLinking(false);
    }
  };

  const openEditModal = (user) => {
    setEditUserObj(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      addToast('Name and email are required.', 'warning');
      return;
    }
    setIsSavingEdit(true);
    try {
      const id = editUserObj?._id || editUserObj?.id;
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editUserObj.role,
        studentProfile: editUserObj.studentProfile,
        teacherProfile: editUserObj.teacherProfile
      };
      await api.put(`/users/${id}`, payload);
      addToast('User details updated successfully!', 'success');
      setEditOpen(false);
      setEditUserObj(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update user profile.', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>User Management</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Total Registered System Users: {totalUsers}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={openLinkParentModal} className="btn btn-outline" style={{ height: '40px' }}>
            Link Parent
          </button>
          <button onClick={() => navigate('/admin/users/create')} className="btn btn-primary" style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '16px',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '32px', height: '40px' }}
          />
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <select
          className="form-input"
          value={roleFilter}
          onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}
          style={{ height: '40px', padding: '0 8px' }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
          <option value="PARENT">Parent</option>
        </select>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg)', padding: '4px', borderRadius: '8px', height: '40px', boxSizing: 'border-box' }}>
          <button
            onClick={() => { setPage(1); setStatusFilter('active'); }}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: statusFilter === 'active' ? 'var(--surface)' : 'transparent',
              color: statusFilter === 'active' ? 'var(--text)' : 'var(--muted)',
              boxShadow: statusFilter === 'active' ? 'var(--shadow)' : 'none'
            }}
          >
            Active
          </button>
          <button
            onClick={() => { setPage(1); setStatusFilter('deactivated'); }}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: statusFilter === 'deactivated' ? 'var(--surface)' : 'transparent',
              color: statusFilter === 'deactivated' ? 'var(--text)' : 'var(--muted)',
              boxShadow: statusFilter === 'deactivated' ? 'var(--shadow)' : 'none'
            }}
          >
            Deactivated
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto', marginBottom: '20px' }}>
        {isLoading ? (
          <div style={{ padding: '24px' }}>
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
            No users found matching current filters.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem' }}>Avatar</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Name</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Email</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Role</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Created</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userObj) => {
                const isActive = userObj.isActive && !userObj.isDeleted;
                return (
                  <tr key={userObj._id || userObj.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <AvatarCircle name={userObj.name} size="sm" />
                    </td>
                    <td style={{ padding: '12px 20px', fontWeight: '500', color: 'var(--text)' }}>
                      {userObj.name}
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--muted)' }}>
                      {userObj.email}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className={`badge ${
                        userObj.role === 'ADMIN' ? 'badge-danger' : userObj.role === 'TEACHER' ? 'badge-warning' : userObj.role === 'STUDENT' ? 'badge-primary' : 'badge-success'
                      }`}>
                        {userObj.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}>
                        {isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {new Date(userObj.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditModal(userObj)} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', padding: '6px 12px' }}>
                          Edit
                        </button>

                        {isActive ? (
                          <button onClick={() => handleDeactivate(userObj._id || userObj.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--warning)', padding: '6px 12px' }}>
                            Deactivate
                          </button>
                        ) : (
                          <button onClick={() => handleRestore(userObj._id || userObj.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--success)', padding: '6px 12px' }}>
                            Restore
                          </button>
                        )}

                        <button onClick={() => openDeleteModal(userObj)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '6px 12px' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="btn btn-outline btn-sm"
            disabled={page === 1}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--muted)', padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            className="btn btn-outline btn-sm"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {linkParentOpen && (
        <Modal title="Link Parent to Student" onClose={() => setLinkParentOpen(false)}>
          <form onSubmit={handleLinkParentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Select Parent</label>
              <select
                className="form-input"
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                required
                style={{ height: '40px', padding: '0 8px' }}
              >
                <option value="">-- Choose Parent --</option>
                {parents.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.email})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Select Student</label>
              <select
                className="form-input"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                style={{ height: '40px', padding: '0 8px' }}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={isLinking}>
              {isLinking ? 'Linking...' : 'Link Parent'}
            </button>
          </form>
        </Modal>
      )}

      {deleteConfirmOpen && (
        <Modal title="Delete User Account" onClose={() => setDeleteConfirmOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <p style={{ margin: 0, color: 'var(--text)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Are you sure you want to permanently delete the user account for <strong style={{ color: 'var(--danger)' }}>{targetUser?.name}</strong> ({targetUser?.email})?
              <br />
              This action is irreversible. All related grade files, exam entries, and logs will remain but references might break.
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Type <strong style={{ color: 'var(--text)' }}>DELETE</strong> in the box below to authorize.
            </p>

            <input
              type="text"
              className="form-input"
              placeholder="DELETE"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              style={{ borderColor: 'var(--danger)', height: '40px' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleHardDelete} className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)' }} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Authorize Deletion'}
              </button>
              <button onClick={() => setDeleteConfirmOpen(false)} className="btn btn-outline" style={{ flex: 1 }} disabled={isDeleting}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editOpen && (
        <Modal title="Edit User Profile" onClose={() => setEditOpen(false)}>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Name</label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                style={{ height: '40px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email</label>
              <input
                type="email"
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                style={{ height: '40px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={isSavingEdit}>
              {isSavingEdit ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Users;
