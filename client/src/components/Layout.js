import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. O Sidebar fica fixo na esquerda */}
      <Sidebar />

      {/* 2. O conteúdo da página (Outlet) fica na direita */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
