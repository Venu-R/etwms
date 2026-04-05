import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('etwms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || '';
    const isAuthFormRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (isAuthFormRequest) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      localStorage.removeItem('etwms_token');
      localStorage.removeItem('etwms_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const loginApi = (email, password, role) => api.post('/auth/login', { email, password, role });
export const getMeApi = () => api.get('/auth/me');
export const registerApi = (data) => api.post('/auth/register', data);

export const getUsersApi = () => api.get('/users');
export const getUserByIdApi = (id) => api.get(`/users/${id}`);
export const updateUserApi = (id, data) => api.put(`/users/${id}`, data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);

export const getTeamsApi = () => api.get('/teams');
export const createTeamApi = (data) => api.post('/teams', data);
export const updateTeamApi = (id, data) => api.put(`/teams/${id}`, data);
export const deleteTeamApi = (id) => api.delete(`/teams/${id}`);

export const getProjectsApi = () => api.get('/projects');
export const getProjectByIdApi = (id) => api.get(`/projects/${id}`);
export const createProjectApi = (data) => api.post('/projects', data);
export const updateProjectApi = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProjectApi = (id) => api.delete(`/projects/${id}`);

export const getTasksByProjectApi = (projectId) => api.get(`/tasks/${projectId}`);
export const getMyTasksApi = () => api.get('/tasks/my');
export const createTaskApi = (data) => api.post('/tasks', data);
export const updateTaskApi = (id, data) => api.put(`/tasks/${id}`, data);
export const addCommentApi = (id, text) => api.post(`/tasks/${id}/comment`, { text });
export const deleteTaskApi = (id) => api.delete(`/tasks/${id}`);

export const adminDashboardApi = () => api.get('/dashboard/admin');
export const managerDashboardApi = () => api.get('/dashboard/manager');
export const employeeDashboardApi = () => api.get('/dashboard/employee');
export const getLogsApi = (params) => api.get('/dashboard/logs', { params });

export default api;
