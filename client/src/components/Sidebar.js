import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-blue-800 border-r-4 border-yellow-400" 
      : "hover:bg-blue-800";
  };

  return (
    <div className="w-64 bg-blue-900 min-h-screen text-white flex flex-col shadow-xl">
      {/* Cabeçalho */}
      <div className="p-6 text-center border-b border-blue-800">
        <h2 className="text-2xl font-bold">SEGECS</h2>
        <p className="text-xs text-gray-400 mt-1">Sistema Escolar</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 mt-6">
        
        {/* DASHBOARD */}
        <Link to="/dashboard" className={`block p-4 transition-colors ${isActive('/dashboard')}`}>
          📊 Dashboard
        </Link>

        {/* ALUNOS */}
        <Link to="/alunos" className={`block p-4 transition-colors ${isActive('/alunos')}`}>
          🎓 Alunos
        </Link>

        {/* NÍVEIS DE ACESSO */}
        <Link to="/niveis" className={`block p-4 transition-colors ${isActive('/niveis')}`}>
          🔐 Níveis de Acesso
        </Link>

        {/* USUÁRIOS (NOVO) */}
        <Link to="/usuarios" className={`block p-4 transition-colors ${isActive('/usuarios')}`}>
          👥 Usuários
        </Link>

      </nav>

      {/* Botão Sair */}
      <div className="p-4 border-t border-blue-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
