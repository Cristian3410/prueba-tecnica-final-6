import axios from "axios";

const API = "http://localhost:4000/api"

export const registerRequest = user => axios.post(`${API}/register`, user)
export const fetchCourse = () => axios.get(`${API}/courses`)
export const loginRequest = (user) => axios.post(`${API}/login`, user, { withCredentials: true });
export const verifyTokenRequest = () => axios.get(`${API}/verify`, { withCredentials: true });
const handleRemoveCourse = async (userId) => {
  try {
    await axios.delete(`${API}/users/${userId}/course`, { withCredentials: true });
    const res = await axios.get(`${API}/users`, { withCredentials: true });
    setUsers(res.data);
  } catch (error) {
    setError("No se pudo eliminar el curso.");
  }
};
