"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = "http://localhost:4000/api";
const verifyTokenRequest = () => axios.get(`${API}/verify`, { withCredentials: true });

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    verifyTokenRequest()
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("user");
        router.push("/auth/login");
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      axios.get(`${API}/users`, { withCredentials: true })
        .then(res => setUsers(res.data));
      axios.get(`${API}/courses`)
        .then(res => setCourses(res.data));
    }
  }, [user]);

  const handleLogout = async () => {
    await axios.get(`${API}/logout`, { withCredentials: true });
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleEditCourse = (userId, currentCourseId) => {
    setEditingUser(userId);
    setSelectedCourse(currentCourseId);
  };

  const handleSaveCourse = async (userId) => {
    try {
      await axios.put(`${API}/users/${userId}/course`, { programId: selectedCourse }, { withCredentials: true });
      setEditingUser(null);
      const res = await axios.get(`${API}/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (error) {
      setError("No se pudo actualizar el curso");
    }
  };

  const handleRemoveCourse = async (userId) => {
    try {
      await axios.delete(`${API}/users/${userId}/course`, { withCredentials: true });
      const res = await axios.get(`${API}/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (error) {
      setError("No se pudo eliminar el curso.");
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 to-blue-900">
      <div className="text-white text-xl font-bold">Cargando...</div>
    </div>
  );

  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-blue-900 flex flex-col items-center py-8 px-2">
        <div className="w-full max-w-6xl mx-auto bg-zinc-800 rounded-2xl shadow-2xl p-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-extrabold text-blue-100">Panel Administrador</h2>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-800 px-6 py-2 text-lg font-bold text-white rounded-xl shadow-md transition-all">
              Logout
            </button>
          </div>
          {error && <p className="text-red-400 font-semibold mb-4">{error}</p>}
          <h3 className="text-2xl font-bold mb-4 text-zinc-200">Usuarios registrados:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-zinc-900 rounded">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-lg text-blue-200 font-bold">Nombre</th>
                  <th className="px-6 py-3 text-left text-lg text-blue-200 font-bold">Email</th>
                  <th className="px-6 py-3 text-left text-lg text-blue-200 font-bold">Rol</th>
                  <th className="px-6 py-3 text-left text-lg text-blue-200 font-bold">Curso</th>
                  <th className="px-6 py-3 text-left text-lg text-blue-200 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-blue-600 hover:bg-zinc-700 transition">
                    <td className="px-6 py-3 text-white">{u.fullName}</td>
                    <td className="px-6 py-3 text-white">{u.email}</td>
                    <td className="px-6 py-3 text-white">{u.role}</td>
                    <td className="px-6 py-3 text-white">
                      {editingUser === u._id ? (
                        <select
                          value={selectedCourse}
                          onChange={e => setSelectedCourse(e.target.value)}
                          className="bg-zinc-700 text-white px-3 py-2 rounded transition"
                        >
                          {courses.map(course => (
                            <option value={course._id} key={course._id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        u.programId?.name || "Sin curso"
                      )}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      {editingUser === u._id ? (
                        <button
                          onClick={() => handleSaveCourse(u._id)}
                          className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded font-bold transition-all"
                        >
                          Guardar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditCourse(u._id, u.programId?._id)}
                            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded font-bold transition-all"
                          >
                            Editar curso
                          </button>
                          <button
                            onClick={() => handleRemoveCourse(u._id)}
                            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded font-bold transition-all"
                          >
                            Eliminar curso
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 to-blue-900">
      <div className="bg-zinc-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-white flex flex-col items-center">
        <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center mb-4">
          <span className="text-5xl font-extrabold">{user.fullName[0]?.toUpperCase()}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{user.fullName}</h2>
        <p className="mb-2 text-blue-200">{user.email}</p>
        <CursoUsuario programId={user.programId} />
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-700 px-5 py-2 rounded-full text-white font-bold shadow transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Panel usuario curso
function CursoUsuario({ programId }) {
  const [program, setProgram] = useState(null);

  useEffect(() => {
    if (programId) {
      axios.get(`${API}/courses`)
        .then(res => {
          const prog = res.data.find(c => c._id === programId);
          setProgram(prog);
        });
    }
  }, [programId]);

  if (!programId) return (
    <div className="bg-zinc-700 rounded-lg mt-6 p-4 w-full text-zinc-200 text-center">
      No tienes curso asignado.
    </div>
  );
  if (!program) return (
    <div className="bg-zinc-700 rounded-lg mt-6 p-4 w-full text-zinc-200 text-center">
      Cargando curso...
    </div>
  );
  return (
    <div className="bg-blue-700 rounded-lg mt-6 p-4 w-full text-center shadow-inner">
      <div className="text-lg font-semibold">{program.name}</div>
      <div className="mt-2 text-blue-100 text-sm">
        <span>Inicio:</span> {new Date(program.startDate).toLocaleDateString()}
      </div>
      <div className="text-blue-100 text-xs">
        Estado: <span className="font-bold">{program.status}</span>
      </div>
    </div>
  );
}

export default DashboardPage;
