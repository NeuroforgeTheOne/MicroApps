import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatList from './pages/ChatList';
import ChatScreen from './pages/ChatScreen';
import Profile from './pages/Profile';
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector(state => state.auth);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chats" element={user ? <ChatList /> : <Navigate to="/login" />} />
      <Route path="/chat/:chatId" element={user ? <ChatScreen /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/chats" : "/login"} />} />
    </Routes>
  );
}

export default App;
