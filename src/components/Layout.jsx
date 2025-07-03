import React from 'react';
import Slidebar from './Slidebar';
import '../App.css';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Slidebar />
      <main className="main-content-area">
        {children}
      </main>
    </div>
  );
} 