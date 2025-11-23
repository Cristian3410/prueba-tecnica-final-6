"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerRequest } from "../../api/auth.js";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const res = await fetch("http://localhost:4000/api/courses");
      const data = await res.json();
      setCourses(data);
    };
    loadCourses();
  }, []);

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md my-2">
      <form
        onSubmit={handleSubmit(async (values) => {
          console.log(values); 
          try {
            const res = await registerRequest(values);
            console.log(res.data);
          } catch (err) {
            alert(err.response?.data?.message || "Error en el registro");
          }
        })}
      >
        <input
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: true })} 
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        <select
          {...register("role", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        >
          <option value="">Seleccione un rol</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          {...register("programId", { required: true })} // <-- CAMPO CORRECTO
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        >
          <option value="">Seleccione un curso</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
