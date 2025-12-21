const pool = require('../config/db');

const createAluno = async (req, res) => {
  // Pegamos os dados que o Front-end enviou
  const { matricula, nome, cpf, nasc, email, curso, telefone } = req.body;

  try {
    // Query de Inserção (SQL)
    // Obs: Estamos fixando id_cidade = 1 para facilitar este primeiro teste
    const newAluno = await pool.query(
      `INSERT INTO cad_alunos (matricula, nome, cpf, nasc, email, curso, telefone, id_cidade) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1) 
       RETURNING *`,
      [matricula, nome, cpf, nasc, email, curso, telefone]
    );

    res.json(newAluno.rows[0]);
  } catch (err) {
    console.error(err.message);
    // Se der erro (ex: CPF duplicado), avisa o front-end
    res.status(500).json({ error: "Erro ao cadastrar aluno. Verifique se a matrícula ou CPF já existem." });
  }
};

const getAlunos = async (req, res) => {
  try {
    // Fazemos um JOIN para trazer o nome da cidade em vez de apenas o ID
    const todosAlunos = await pool.query(`
      SELECT a.*, c.cidade, c.uf 
      FROM cad_alunos a
      LEFT JOIN cad_cidades c ON a.id_cidade = c.id_cidade
      ORDER BY a.id_aluno DESC
    `);
    
    res.json(todosAlunos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro ao buscar alunos." });
  }
};

const deleteAluno = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID que vem na URL (ex: /api/alunos/5)
    
    const deleteOp = await pool.query("DELETE FROM cad_alunos WHERE id_aluno = $1", [id]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json({ message: "Aluno excluído com sucesso!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro ao excluir aluno" });
  }
};

const updateAluno = async (req, res) => {
  try {
    const { id } = req.params; // ID vem da URL
    const { matricula, nome, cpf, nasc, email, curso, telefone, id_cidade } = req.body; // Dados vêm do corpo

    const updateOp = await pool.query(
      `UPDATE cad_alunos 
       SET matricula = $1, nome = $2, cpf = $3, nasc = $4, email = $5, curso = $6, telefone = $7, id_cidade = $8
       WHERE id_aluno = $9`,
      [matricula, nome, cpf, nasc, email, curso, telefone, id_cidade || 1, id] // id_cidade fixo em 1 por enquanto
    );

    if (updateOp.rowCount === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json({ message: "Aluno atualizado com sucesso!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro ao atualizar aluno." });
  }
};

module.exports = { createAluno, getAlunos, deleteAluno, updateAluno };
