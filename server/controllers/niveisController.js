const { query } = require('../config/db');

// Listar todos
const getNiveis = async (req, res) => {
  try {
    const todos = await query("SELECT * FROM sys_niveis_acesso ORDER BY id_nivel ASC");
    res.json(todos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Criar novo
const createNivel = async (req, res) => {
  try {
    const { nivel } = req.body; // Recebe { "nivel": "Diretor" }
    const novo = await query(
      "INSERT INTO sys_niveis_acesso (nivel) VALUES ($1) RETURNING *",
      [nivel]
    );
    res.json(novo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao criar nível");
  }
};

// Deletar
const deleteNivel = async (req, res) => {
  try {
    const { id } = req.params;
    // Verifica se tem usuários usando esse nível antes de apagar
    const check = await query("SELECT * FROM sys_usuarios WHERE id_nivel = $1", [id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Não é possível excluir: Existem usuários com este nível." });
    }

    await query("DELETE FROM sys_niveis_acesso WHERE id_nivel = $1", [id]);
    res.json({ message: "Nível excluído!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao deletar");
  }
};

module.exports = { getNiveis, createNivel, deleteNivel };
