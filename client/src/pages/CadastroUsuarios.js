import React, { useState, useEffect } from 'react';

function CadastroUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [niveis, setNiveis] = useState([]); // Para preencher o select
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    id_nivel: ''
  });

  // Carregar dados ao entrar na tela
  useEffect(() => {
    carregarUsuarios();
    carregarNiveis();
  }, []);

  const carregarUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  const carregarNiveis = async () => {
    const res = await fetch('/api/niveis');
    const data = await res.json();
    setNiveis(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.id_nivel) return alert("Selecione um nível de acesso!");

    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("Usuário criado com sucesso!");
      setFormData({ nome: '', email: '', senha: '', id_nivel: '' }); // Limpa form
      carregarUsuarios(); // Atualiza lista
    } else {
      const err = await response.json();
      alert(err.error || "Erro ao criar usuário");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    if (res.ok) carregarUsuarios();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Usuários</h1>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Novo Usuário</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input name="nome" value={formData.nome} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Login)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
            <select 
              name="id_nivel" 
              value={formData.id_nivel} 
              onChange={handleChange} 
              required 
              className="w-full p-2 border rounded mt-1 bg-white"
            >
              <option value="">Selecione...</option>
              {/* Aqui o React desenha as opções baseado no que veio do banco */}
              {niveis.map(n => (
                <option key={n.id_nivel} value={n.id_nivel}>{n.nivel}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
              Salvar Usuário
            </button>
          </div>

        </form>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Nível</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="border-b hover:bg-gray-50">
                <td className="p-4">{u.nome_completo}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {u.nome_nivel}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(u.id_usuario)} className="text-red-500 hover:underline text-sm">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CadastroUsuarios;
