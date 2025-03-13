import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './Store/useAuthStore'
import { Loader } from "lucide-react"
import { useThemeStore } from './Store/useThemeStore'


function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore()

  

  useEffect(() => {
    checkAuth()
  }, [checkAuth])


  if (isCheckingAuth && !authUser) return (
    <div className='flex justify-center items-center h-screen overflow-hidden'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  return (
    <div className='App' data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
