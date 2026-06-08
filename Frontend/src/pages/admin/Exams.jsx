import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const AdminExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal control states
  const [seatingModalOpen, setSeatingModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Generate Seating parameters
  const [rooms, setRooms] = useState(10);
  const [seatsPerRoom, setSeatsPerRoom] = useState(30);
  const [seatingResult, setSeatingResult] = useState('');

  // Publish Result parameters
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchExamsData = async () => {
    setIsLoading(true);
    try {
      const [examsRes, studentsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/users?role=STUDENT&limit=200')
      ]);
      setExams(examsRes.data.data || []);
      
      const studList = studentsRes.data.data?.users || studentsRes.data.data || [];
      setStudents(studList);
      if (studList.length > 0) {
        setSelectedStudent(studList[0]._id);
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch admin exam listings.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsData();
  }, []);

  const openSeatingModal = (exam) => {
    setSelectedExam(exam);
    setSeatingResult('');
    setSeatingModalOpen(true);
  };

  const handleGenerateSeating = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/exams/seating/generate', {
        examId: selectedExam._id,
        rooms: Number(rooms),
        seatsPerRoom: Number(seatsPerRoom)
      });
      const data = response.data.data;
      setSeatingResult(`Seating successfully generated for ${data.totalStudents} students across ${data.roomsUsed} rooms (Blocks used: ${data.blocksUsed || 'A'}).`);
      setToastMessage('Seating layout generated!');
      setToastType('success');
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to generate seating layout.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openResultModal = (exam) => {
    setSelectedExam(exam);
    setMarks('');
    setResultModalOpen(true);
  };

  const handlePublishResult = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !marks) {
      setToastMessage('Please fill all result details');
      setToastType('error');
      return;
    }

    const marksNum = Number(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > selectedExam.totalMarks) {
      setToastMessage(`Marks must be between 0 and ${selectedExam.totalMarks}`);
      setToastType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend expects: { student, exam, subjects: [{ subject, marks }] }
      await api.post('/exams/publish', {
        student: selectedStudent,
        exam: selectedExam._id,
        subjects: [
          {
            subject: selectedExam.subject,
            marks: marksNum
          }
        ]
      });

      setToastMessage('Marks published successfully for this student!');
      setToastType('success');
      setResultModalOpen(false);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to publish results.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header card with action */}
      <div className="card">
        <div className="card-body flex items-center justify-between" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', margin: '0' }}>
              Academic Examination Management
            </h2>
            <span className="text-muted text-xs">Total scheduled exams: {exams.length}</span>
          </div>
          <button onClick={() => navigate('/admin/exams/create')} className="btn btn-primary">
            + Schedule New Exam
          </button>
        </div>
      </div>

      {/* Main Exams List Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Scheduled Exams Logs</h3>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {isLoading ? (
            <div style={{ padding: '40px' }} className="flex-col items-center">
              <div className="spinner spinner-dark" />
              <span className="text-muted text-xs mt-2">Loading schedules...</span>
            </div>
          ) : exams.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              No exams scheduled yet. Click "Schedule New Exam" to publish a timetable.
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Exam Schedule</th>
                    <th>Subject</th>
                    <th>Class Target</th>
                    <th>Scheduled Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="font-semibold">{exam.title}</span>
                          <span className="text-muted text-xs">Type: {exam.type}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium text-sm text-secondary">{exam.subject}</span>
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {exam.className} (Sem {exam.semester})
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                          <span>{new Date(exam.date).toLocaleDateString()}</span>
                          <span className="text-muted text-xs">{exam.startTime} - {exam.endTime}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openSeatingModal(exam)}
                            className="btn btn-secondary btn-sm"
                          >
                            Seating Layout
                          </button>
                          <button
                            onClick={() => openResultModal(exam)}
                            className="btn btn-primary btn-sm"
                          >
                            Publish Marks
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 1. Generate Seating Modal */}
      <Modal isOpen={seatingModalOpen} onClose={() => setSeatingModalOpen(false)} title={`Generate Seating: ${selectedExam?.title}`}>
        {seatingResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="alert alert-success">
              <span>{seatingResult}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={() => setSeatingModalOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerateSeating} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="rooms">Number of Exam Rooms</label>
              <input
                id="rooms"
                type="number"
                min="1"
                className="form-input"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="seats">Seats Available Per Room</label>
              <input
                id="seats"
                type="number"
                min="1"
                className="form-input"
                value={seatsPerRoom}
                onChange={(e) => setSeatsPerRoom(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : 'Generate Seating Layout'}
            </button>
          </form>
        )}
      </Modal>

      {/* 2. Publish Results Modal */}
      <Modal isOpen={resultModalOpen} onClose={() => setResultModalOpen(false)} title={`Publish Student Marks: ${selectedExam?.title}`}>
        <form onSubmit={handlePublishResult} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Select Student Candidate</label>
            <select
              className="form-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              disabled={isSubmitting}
            >
              {students.map(std => (
                <option key={std._id} value={std._id}>
                  {std.name} ({std.studentProfile?.rollNumber || 'S-N/A'})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject Course</label>
            <input
              type="text"
              className="form-input"
              value={selectedExam?.subject || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="marks">Marks Obtained (Max: {selectedExam?.totalMarks || 100})</label>
            <input
              id="marks"
              type="number"
              min="0"
              max={selectedExam?.totalMarks || 100}
              className="form-input"
              placeholder="e.g. 85"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner"></span> : 'Publish Student Grade'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminExams;
