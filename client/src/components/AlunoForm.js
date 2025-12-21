import React, { useState, useEffect } from 'react';

// Recebemos alunoParaEditar e onCancel do Pai
function AlunoForm({ onSuccess, alunoParaEditar, onCancel }) {
  const initialData = {
    matricula: '', nome: '', cpf: '', nasc: '', email: '', curso: 'Informática', telefone: ''
  };

  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState('');

  // EFEITO MÁGICO: Sempre que 'alunoParaEditar' mudar, rodamos isto:
  useEffect(() => {
    if (alunoParaEditar) {
      // Se veio um aluno, preenchemos o formulário
      // Pequeno truque para formatar a data do Postgres (ISO) para o input HTML (yyyy-mm-dd)
      const formattedDate = alunoParaEditar.nasc ? alunoParaEditar.nasc.split('T')[0] : '';
      
      setFormData({
        ...alunoParaEditar,
        nasc: formattedDate
      });
    } else {
      // Se não veio nada (ou cancelou), limpamos o formulário
      setFormData(initialData);
    }
  }, [alunoParaEditar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (alunoParaEditar) {
        // --- MODO EDIÇÃO (PUT) ---
        response = await fetch(`/api/alunos/${alunoParaEditar.id_aluno}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // --- MODO CRIAÇÃO (POST) ---
        response = await fetch('/api/alunos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();

      if (response.ok) {
        setMessage(alunoParaEditar ? '✅ Aluno atualizado!' : '✅ Aluno cadastrado!');
        if (!alunoParaEditar) setFormData(initialData); // Só limpa se for criação
        if (onSuccess) onSuccess(); // Avisa o pai para atualizar a lista
      } else {
        setMessage(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Erro de conexão.');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md mb-6 transition-colors ${alunoParaEditar ? 'bg-yellow-50 border border-yellow-200' : 'bg-white'}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {alunoParaEditar ? `Editando: ${alunoParaEditar.nome}` : 'Novo Aluno'}
      </h2>
      
      {message && (
        <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CAMPOS (Iguais ao anterior) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Matrícula</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Nasc.</label>
          <input type="date" name="nasc" value={formData.nasc} onChange={handleChange} required
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Curso</label>
          <input type="text" name="curso" value={formData.curso} onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded" />
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="md:col-span-2 mt-2 flex gap-3">
          <button type="submit" 
            className={`flex-1 text-white p-2 rounded transition font-bold shadow-lg ${alunoParaEditar ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {alunoParaEditar ? 'Atualizar Aluno' : 'Salvar Aluno'}
          </button>

          {/* Botão Cancelar (Só aparece se estiver editando) */}
          {alunoParaEditar && (
            <button type="button" onClick={onCancel}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 font-bold shadow-lg px-6">
              Cancelar
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default AlunoForm;
