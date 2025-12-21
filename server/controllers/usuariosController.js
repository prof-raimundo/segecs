const { query } = require('../config/db');
const bcrypt = require('bcryptjs'); // Essencial para a senha!

// Listar Usuários (com o nome do nível junto)
const getUsuarios = async (req, res) => {
  try {
    const sql = `
      SELECT u.id_usuario, u.nome_completo, u.email, n.nivel as nome_nivel 
      FROM sys_usuarios u
      LEFT JOIN sys_niveis_acesso n ON u.id_nivel = n.id_nivel
      ORDER BY u.nome_completo ASC
    `;
    const resultado = await query(sql);
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

// Criar Usuário (Criptografando senha)
const createUsuario = async (req, res) => {
  try {
    const { nome, email, senha, id_nivel } = req.body;

    // 1. Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    // 2. Salva no banco
    const sql = `
      INSERT INTO sys_usuarios (nome_completo, email, senha_hash, id_nivel, ativo)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id_usuario, nome_completo, email
    `;
    
    const novo = await query(sql, [nome, email, hash, id_nivel]);
    res.json(novo.rows[0]);

  } catch (err) {
    console.error(err);
    // Erro comum: Email duplicado
    if (err.code === '23505') {
      return res.status(400).json({ error: "Email já cadastrado." });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

// Deletar Usuário
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM sys_usuarios WHERE id_usuario = $1", [id]);
    res.json({ message: "Usuário removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar" });
  }
};

module.exports = { getUsuarios, createUsuario, deleteUsuario };
