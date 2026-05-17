import API from './api';

const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getToken = () => {
  return localStorage.getItem('token');
};

const authService = {
  signup,
  login,
  logout,
  getToken,
};

export default authService;
