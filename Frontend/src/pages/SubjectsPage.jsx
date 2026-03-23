import { useEffect, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import InputField from '../components/InputField.jsx'
import Loader from '../components/Loader.jsx'
import useAuth from '../hooks/useAuth.js'
import {
  addStudent,
  createSubject,
  deleteSubject,
  getSubjects,
  removeStudent,
  updateSubject,
} from '../services/academic.service.js'
import { getApiErrorMessage } from '../utils/error.js'
import { ROLES } from '../utils/constants.js'

const initialSubject = {
  name: '',
  code: '',
  semester: 1,
  teacher: '',
}

const SubjectsPage = () => {
  const { user, hasRole } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(initialSubject)
  const [semesterFilter, setSemesterFilter] = useState('1')
  const [studentAction, setStudentAction] = useState({ id: '', studentId: '', type: 'add' })

  const canCreate = hasRole([ROLES.ADMIN, ROLES.TEACHER])

  const normalizeTeacherValue = (teacher) => {
    if (!teacher) return ''
    if (typeof teacher === 'object') {
      return teacher._id || ''
    }
    return String(teacher)
  }

  const teacherForCreate = (value) => {
    const trimmed = String(value || '').trim()
    return trimmed ? trimmed : undefined
  }

  const teacherForUpdate = (value) => {
    const trimmed = String(value || '').trim()
    return trimmed ? trimmed : null
  }

  const normalizeSemester = (value) => {
    const num = Number(value)
    if (!Number.isFinite(num) || num < 1) return 1
    return Math.floor(num)
  }

  const loadSubjects = async (semester) => {
    setLoading(true)
    setError('')

    try {
      const safeSemester = normalizeSemester(semester)
      const response = await getSubjects(safeSemester)
      const payload = Array.isArray(response?.data) ? response.data : []
      const normalized = payload.map((subject) => ({
        ...subject,
        teacher: normalizeTeacherValue(subject.teacher),
      }))
      setSubjects(normalized)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load subjects'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects(semesterFilter)
  }, [])

  const onCreate = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      await createSubject({
        ...form,
        semester: Number(form.semester),
        teacher: teacherForCreate(form.teacher),
      })
      setForm(initialSubject)
      setSuccess('Subject created')
      await loadSubjects(semesterFilter)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create subject'))
    }
  }

  const onDelete = async (id) => {
    setError('')
    setSuccess('')

    try {
      await deleteSubject(id)
      setSuccess('Subject deleted')
      await loadSubjects(semesterFilter)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete subject'))
    }
  }

  const onInlineUpdate = async (subject) => {
    setError('')
    setSuccess('')

    try {
      await updateSubject(subject._id, {
        name: subject.name,
        code: subject.code,
        semester: Number(subject.semester),
        teacher: teacherForUpdate(subject.teacher),
      })
      setSuccess('Subject updated')
      await loadSubjects(semesterFilter)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update subject'))
    }
  }

  const handleSubjectEdit = (id, key, value) => {
    setSubjects((prev) => prev.map((item) => (item._id === id ? { ...item, [key]: value } : item)))
  }

  const onStudentAction = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (studentAction.type === 'add') {
        await addStudent(studentAction.id, studentAction.studentId)
        setSuccess('Student added')
      } else {
        await removeStudent(studentAction.id, studentAction.studentId)
        setSuccess('Student removed')
      }

      await loadSubjects(semesterFilter)
      setStudentAction({ id: '', studentId: '', type: 'add' })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Student action failed'))
    }
  }

  if (loading) return <Loader text="Loading subjects..." />

  return (
    <section className="stack-gap">
      <Card title="Academic / Subjects" subtitle={`Signed in as ${user?.role || 'UNKNOWN'}`}>
        <Alert message={error} />
        <Alert type="success" message={success} />

        <div className="filter-row">
          <InputField
            label="Filter by Semester"
            name="semesterFilter"
            type="number"
            min={1}
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
            placeholder="e.g. 4"
          />
          <Button
            onClick={() => {
              const safe = normalizeSemester(semesterFilter)
              setSemesterFilter(String(safe))
              loadSubjects(safe)
            }}
          >
            Apply Filter
          </Button>
          <Button
            variant="muted"
            onClick={() => {
              setSemesterFilter('1')
              loadSubjects(1)
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {canCreate ? (
        <Card title="Create Subject" subtitle="Allowed for ADMIN and TEACHER">
          <form className="form-grid cols-4" onSubmit={onCreate}>
            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <InputField
              label="Code"
              name="code"
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
              required
            />
            <InputField
              label="Semester"
              name="semester"
              type="number"
              min={1}
              value={form.semester}
              onChange={(event) => setForm((prev) => ({ ...prev, semester: event.target.value }))}
              required
            />
            <InputField
              label="Teacher User ID"
              name="teacher"
              value={form.teacher}
              onChange={(event) => setForm((prev) => ({ ...prev, teacher: event.target.value }))}
              placeholder="Optional"
            />
            <Button type="submit">Create Subject</Button>
          </form>
        </Card>
      ) : null}

      <Card title="Subjects List">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Semester</th>
                <th>Teacher</th>
                <th>Students</th>
                {canCreate ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>
                    <input
                      value={subject.name}
                      onChange={(event) => handleSubjectEdit(subject._id, 'name', event.target.value)}
                      disabled={!canCreate}
                    />
                  </td>
                  <td>
                    <input
                      value={subject.code}
                      onChange={(event) => handleSubjectEdit(subject._id, 'code', event.target.value)}
                      disabled={!canCreate}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={subject.semester}
                      onChange={(event) => handleSubjectEdit(subject._id, 'semester', event.target.value)}
                      disabled={!canCreate}
                    />
                  </td>
                  <td>
                    <input
                      value={subject.teacher || ''}
                      onChange={(event) => handleSubjectEdit(subject._id, 'teacher', event.target.value)}
                      disabled={!canCreate}
                    />
                  </td>
                  <td>{Array.isArray(subject.students) ? subject.students.length : 0}</td>
                  {canCreate ? (
                    <td className="row-actions">
                      <Button variant="secondary" onClick={() => onInlineUpdate(subject)}>
                        Save
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(subject._id)}>
                        Delete
                      </Button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {canCreate ? (
        <Card title="Add/Remove Student" subtitle="Uses academic subject student actions">
          <form className="form-grid cols-4" onSubmit={onStudentAction}>
            <InputField
              label="Subject ID"
              name="id"
              value={studentAction.id}
              onChange={(event) => setStudentAction((prev) => ({ ...prev, id: event.target.value }))}
              required
            />
            <InputField
              label="Student ID"
              name="studentId"
              value={studentAction.studentId}
              onChange={(event) => setStudentAction((prev) => ({ ...prev, studentId: event.target.value }))}
              required
            />
            <label className="field">
              <span>Action</span>
              <select
                value={studentAction.type}
                onChange={(event) => setStudentAction((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="add">Add</option>
                <option value="remove">Remove</option>
              </select>
            </label>

            <Button type="submit">Submit</Button>
          </form>
        </Card>
      ) : null}
    </section>
  )
}

export default SubjectsPage
