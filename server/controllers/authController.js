const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'segecs_secret_key_123'; // Em produção, use variáveis de ambiente (.env)

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Buscar usuário pelo email
    const userResult = await pool.query("SELECT * FROM sys_usuarios WHERE email = $1", [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const usuario = userResult.rows[0];

    // 2. Verificar se o usuário está ATIVO
    if (!usuario.ativo) {
      return res.status(403).json({ error: "Usuário inativo. Contate o administrador." });
    }

    // 3. Comparar a senha (usando o campo senha_hash)
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 4. Gerar Token (Incluímos o id_nivel no token, pois será útil para permissões)
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        email: usuario.email,
        nivel: usuario.id_nivel 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Retorna dados básicos (sem a senha, claro)
    res.json({
      message: "Login realizado com sucesso",
      token: token,
      usuario: { 
        id: usuario.id_usuario,
        nome: usuario.nome_completo, 
        email: usuario.email,
        nivel: usuario.id_nivel
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

module.exports = { login };
