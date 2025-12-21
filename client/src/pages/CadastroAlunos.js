import React, { useState } from 'react';
import AlunoForm from '../components/AlunoForm';
import AlunoList from '../components/AlunoList';

function CadastroAlunos() {
  const [updateList, setUpdateList] = useState(0);
  
  // Novo estado: Guarda o aluno que está a ser editado no momento
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);

  const handleSuccess = () => {
    setUpdateList(prev => prev + 1); // Recarrega a lista
    setAlunoEmEdicao(null); // Limpa a edição (volta ao modo criar)
  };

  const handleEditClick = (aluno) => {
    setAlunoEmEdicao(aluno); // Manda os dados do aluno para o formulário
    // Rola a página para cima suavemente para o utilizador ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setAlunoEmEdicao(null); // Botão cancelar limpa o estado
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Alunos</h1>
        <span className="text-sm text-gray-500">Módulo Acadêmico</span>
      </div>

      {/* Passamos o alunoEmEdicao para o Form saber o que fazer */}
      <AlunoForm 
        onSuccess={handleSuccess} 
        alunoParaEditar={alunoEmEdicao} 
        onCancel={handleCancelEdit}
      />

      {/* Passamos a função onEditClick para a lista saber quem foi clicado */}
      <AlunoList 
        refresh={updateList} 
        onEditClick={handleEditClick} 
      />
    </div>
  );
}

export default CadastroAlunos;
