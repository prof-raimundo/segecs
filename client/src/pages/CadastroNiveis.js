import React, { useState, useEffect } from 'react';

function CadastroNiveis() {
  const [niveis, setNiveis] = useState([]);
  const [novoNivel, setNovoNivel] = useState('');

  // Busca os dados ao carregar
  const fetchNiveis = async () => {
    try {
      const response = await fetch('/api/niveis');
      const data = await response.json();
      setNiveis(data);
    } catch (error) {
      console.error("Erro ao buscar níveis", error);
    }
  };

  useEffect(() => {
    fetchNiveis();
  }, []);

  // Adicionar Nível
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!novoNivel) return;

    await fetch('/api/niveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nivel: novoNivel })
    });

    setNovoNivel(''); // Limpa o campo
    fetchNiveis(); // Recarrega a lista
  };

  // Excluir Nível
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este nível?")) return;

    const response = await fetch(`/api/niveis/${id}`, { method: 'DELETE' });
    
    if (response.ok) {
      fetchNiveis();
    } else {
      const data = await response.json();
      alert(data.error || "Erro ao excluir");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Níveis de Acesso</h1>

      {/* Formulário Simples */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Novo Nível</label>
          <input 
            type="text" 
            value={novoNivel}
            onChange={(e) => setNovoNivel(e.target.value)}
            placeholder="Ex: Secretaria, Professor, Diretor..." 
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold h-10"
        >
          Adicionar
        </button>
      </div>

      {/* Lista de Níveis */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-gray-600 font-semibold">ID</th>
              <th className="p-4 text-gray-600 font-semibold">Descrição do Nível</th>
              <th className="p-4 text-gray-600 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {niveis.map((item) => (
              <tr key={item.id_nivel} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-500 w-20">#{item.id_nivel}</td>
                <td className="p-4 font-medium text-gray-800">{item.nivel}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(item.id_nivel)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition"
                  >
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

export default CadastroNiveis;
