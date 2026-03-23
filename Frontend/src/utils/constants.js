export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    ROOT: '/users',
    CREATE: '/users/create',
    ME: '/users/me',
    LINK_PARENT: '/users/link-parent',
  },
  TENANT: {
    CREATE: '/tenant',
  },
  ACADEMIC: {
    SUBJECTS: '/academic/subjects',
    SUBJECT_BY_ID: (id) => `/academic/subjects/${id}`,
    STUDENT_DASHBOARD: (studentId) => `/academic/dashboard/${studentId}`,
    ADD_STUDENT: (id) => `/academic/subjects/${id}/add-student`,
    REMOVE_STUDENT: (id) => `/academic/subjects/${id}/remove-student`,
  },
}
