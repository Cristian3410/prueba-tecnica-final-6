"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginRequest } from "../../api/auth.js";
import { useState } from "react";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    try {
      const res = await loginRequest(values);
      // Si el login es exitoso, puedes guardar el token en localStorage o manejar la sesión según tu flujo
      if (res.data) {
        // Por ejemplo, podrías guardar info en localStorage:
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/dashboard"); // Redirige a la página principal luego del login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error en el login");
    }
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md my-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4">
          Login
        </button>
        {error && <span className="text-red-400">{error}</span>}
      </form>
    </div>
  );
}

export default LoginPage;