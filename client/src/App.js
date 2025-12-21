import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
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
        
        {/* === ROTA PÚBLICA (Sem Sidebar) === */}
        <Route path="/" element={<Login />} />


        {/* === ROTAS PROTEGIDAS (Precisam de Login) === */}
        <Route element={<PrivateRoute />}>
          
          {/* === ROTAS COM LAYOUT (Precisam de Sidebar) === */}
          {/* O Layout envolve as rotas abaixo. Se tirar daqui, o menu some. */}
          <Route element={<Layout />}>
             
             {/* Aqui estão as páginas que aparecem DENTRO do Layout */}
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/alunos" element={<CadastroAlunos />} />
             <Route path="/niveis" element={<CadastroNiveis />} />
             
          </Route>
          {/* Fim do Layout */}

        </Route>
        {/* Fim do PrivateRoute */}

      </Routes>
    </Router>
  );
}

export default App;
