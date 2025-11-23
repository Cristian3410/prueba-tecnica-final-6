"use client";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-blue-900">
      <div className="bg-zinc-800 rounded-2xl p-12 shadow-2xl flex flex-col items-center gap-8">
        <h1 className="text-4xl font-extrabold text-white mb-8">Bienvenido 😃</h1>
        <div className="flex gap-6">
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow transition-all"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="bg-green-500 hover:bg-green-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow transition-all"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;