import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  // Hook do React Router para mudar de página
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros antigos

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCESSO!
        // 1. Salvar o Token no navegador (LocalStorage)
        localStorage.setItem('token', data.token);
        
        // 2. Salvar dados do usuário (opcional, útil para mostrar "Olá, Admin")
        localStorage.setItem('user', JSON.stringify(data.usuario));

        // 3. Redirecionar para a página de Alunos
        // navigate('/alunos');
        navigate('/dashboard');
      } else {
        // ERRO (Senha errada, usuário não existe, etc)
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">SEGECS</h1>
        <p className="text-center text-gray-500 mb-6">Sistema Escolar</p>
        
        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@segecs.com" 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="******" 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold transition duration-200"
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
