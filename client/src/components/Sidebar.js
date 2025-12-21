import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Ao carregar o menu, lemos quem é o usuário logado
  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Limpa os dados
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-blue-800 border-r-4 border-yellow-400" 
      : "hover:bg-blue-800";
  };

  // Se ainda não carregou o usuário, não mostra nada para evitar "piscada"
  if (!user) return null;

  return (
    <div className="w-64 bg-blue-900 min-h-screen text-white flex flex-col shadow-xl">
      <div className="p-6 text-center border-b border-blue-800">
        <h2 className="text-2xl font-bold">SEGECS</h2>
        <p className="text-xs text-gray-400 mt-1">Olá, {user.nome.split(' ')[0]}</p>
      </div>

      <nav className="flex-1 mt-6">
        
        {/* TODOS veem Dashboard e Alunos */}
        <Link to="/dashboard" className={`block p-4 transition-colors ${isActive('/dashboard')}`}>
          📊 Dashboard
        </Link>

        <Link to="/alunos" className={`block p-4 transition-colors ${isActive('/alunos')}`}>
          🎓 Alunos
        </Link>

        {/* --- ÁREA RESTRITA (Só Nível 1 - Admin) --- */}
        {user.id_nivel === 1 && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs text-gray-400 uppercase font-bold">
              Administração
            </div>

            <Link to="/niveis" className={`block p-4 transition-colors ${isActive('/niveis')}`}>
              🔐 Níveis de Acesso
            </Link>

            <Link to="/usuarios" className={`block p-4 transition-colors ${isActive('/usuarios')}`}>
              👥 Usuários
            </Link>
          </>
        )}

      </nav>

      <div className="p-4 border-t border-blue-800">
        <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition">
          Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
