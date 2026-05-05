import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Charities from './pages/Charities';
import Draws from './pages/Draws';
import Subscribe from './pages/Subscribe';
import Winnings from './pages/Winnings';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;
  return user ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/subscribe' element={<Subscribe />} />
          <Route path='/charities' element={<Charities />} />
          <Route path='/winnings' element={
  <PrivateRoute><Winnings /></PrivateRoute>
} />
          <Route path='/draws' element={
            <PrivateRoute><Draws /></PrivateRoute>
          } />
          <Route path='/dashboard' element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}