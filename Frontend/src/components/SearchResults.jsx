import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, query, role = 'STUDENT' }) => {
  const { subjects = [], notices = [], books = [], assignments = [] } = results;

  const totalHits = subjects.length + notices.length + books.length + assignments.length;

  if (totalHits === 0) {
    return (
      <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="11" y1="17" x2="11.01" y2="17" />
        </svg>
        <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>No matches found</h4>
        <p className="text-secondary text-sm">We couldn't find any results for "{query}". Try searching for different keywords.</p>
      </div>
    );
  }

  // Get matching links based on user role
  const libraryPath = role === 'ADMIN' ? '/admin/library' : '/student/library';
  const assignmentPath = role === 'TEACHER' ? '/teacher/assignments' : '/student/assignments';
  const timetablePath = role === 'ADMIN' ? '/admin/timetable' : role === 'TEACHER' ? '/teacher/timetable' : '/student/timetable';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 📚 SUBJECTS SECTION */}
      {subjects.length > 0 && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📚</span>
            <h3 className="card-title">Academic Courses & Subjects ({subjects.length})</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Course Code</th>
                    <th style={{ textAlign: 'right' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(sub => (
                    <tr key={sub._id}>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{sub.name}</td>
                      <td><span className="badge badge-neutral">{sub.code}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={timetablePath} className="btn btn-secondary btn-sm">
                          View Timetable
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 📢 NOTICES SECTION */}
      {notices.length > 0 && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📢</span>
            <h3 className="card-title">Campus Announcements ({notices.length})</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Notice Title</th>
                    <th>Audience</th>
                    <th>Published Date</th>
                    <th style={{ textAlign: 'right' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map(notice => (
                    <tr key={notice._id}>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{notice.title}</td>
                      <td>
                        <span className="badge badge-neutral text-xs" style={{ textTransform: 'capitalize' }}>
                          {notice.audience || 'All'}
                        </span>
                      </td>
                      <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to="/notice-board" className="btn btn-secondary btn-sm">
                          Open Notice Board
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 📖 BOOKS SECTION */}
      {books.length > 0 && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📖</span>
            <h3 className="card-title">Library Books Catalog ({books.length})</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id}>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{book.title}</td>
                      <td>{book.author}</td>
                      <td><span className="badge badge-neutral text-xs">{book.category || 'General'}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={libraryPath} className="btn btn-secondary btn-sm">
                          Go to Library
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 📝 ASSIGNMENTS SECTION */}
      {assignments.length > 0 && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📝</span>
            <h3 className="card-title">Class Assignments ({assignments.length})</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Assignment Title</th>
                    <th>Total Marks</th>
                    <th>Deadline</th>
                    <th style={{ textAlign: 'right' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(ass => (
                    <tr key={ass._id}>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{ass.title}</td>
                      <td>{ass.totalMarks} Marks</td>
                      <td>
                        <span className={new Date() > new Date(ass.deadline) ? 'text-danger font-semibold' : ''}>
                          {new Date(ass.deadline).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={assignmentPath} className="btn btn-secondary btn-sm">
                          View Assignments
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
