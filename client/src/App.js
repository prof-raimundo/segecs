import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import CadastroUsuarios from './pages/CadastroUsuarios';
import EditarUsuario from './pages/EditarUsuario';
import Login from './pages/Login';
import CadastroAlunos from './pages/CadastroAlunos';
import CadastroNiveis from './pages/CadastroNiveis';
import Dashboard from './pages/Dashboard';

// Componentes de Estrutura
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'; 

function App() {
  return (
    <Router>
      <Routes>
        
        {/* === ROTA PÚBLICA === */}
        <Route path="/" element={<Login />} />

        {/* === ROTAS PROTEGIDAS (O PrivateRoute protege tudo aqui dentro) === */}
        <Route element={<PrivateRoute />}>
          
          {/* === ROTAS COM LAYOUT (Menu Lateral + Conteúdo) === */}
          <Route element={<Layout />}>
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alunos" element={<CadastroAlunos />} />
              <Route path="/niveis" element={<CadastroNiveis />} />
              <Route path="/usuarios" element={<CadastroUsuarios />} />
              
              {/* --- AQUI: Movi a edição para dentro do Layout --- */}
              {/* Não precisa repetir <PrivateRoute> pois o pai já protege */}
              <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
              
          </Route>
          {/* Fim do Layout */}

        </Route>
        {/* Fim do PrivateRoute */}

      </Routes>
    </Router>
  );
}

export default App;
