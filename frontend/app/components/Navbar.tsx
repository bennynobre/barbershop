'use client'; 
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation'; 

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  
  const pathname = usePathname();
  const hideNavOnRoutes = ['/login', '/register'];
  if (hideNavOnRoutes.includes(pathname) || isLoading) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          Barbearia
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Olá, {user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md font-medium"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 hover:text-white"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}