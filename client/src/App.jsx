import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AddDocument from './pages/AddDocument';
import EditDocument from './pages/EditDocument';
import SearchPage from './pages/SearchPage';
import QAPage from './pages/QAPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-document" element={<AddDocument />} />
            <Route path="/edit-document/:id" element={<EditDocument />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/qa" element={<QAPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
