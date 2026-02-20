import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Error from './Pages/Error';
import NavBar from './Components/NavBar';
import Profile from './Pages/Profile/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { current } from './JS/Actions/user';
import Voyages from './Pages/Voyages/Voyages';
import Hotels from './Pages/Hotels/Hotels';
import Accueil from './Pages/Accueil/Accueil';
import Admin from './Pages/Admin/Admin';

function App() {
  const dispatch = useDispatch();
  const { user, isAuth, loadUser } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(current());
    }
  }, [dispatch]);

  // attendre que current() finisse avant d'afficher les routes
  if (loadUser) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar />
      <Routes>
        {/* ─── ROUTES PUBLIQUES ─── */}
        <Route path='/accueil' element={<Accueil />} />
        <Route path='/voyage' element={<Voyages />} />
        <Route path='/hotel' element={<Hotels />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Navigate to="/accueil" />} />

        {/* ─── ROUTE PRIVÉE CLIENT ─── */}
        <Route
          path='/profile'
          element={isAuth ? <Profile /> : <Navigate to="/login" />}
        />

        {/* ─── ROUTE PRIVÉE ADMIN ─── */}
        <Route
          path='/admin'
          element={
            isAuth && user?.role === "admin"
              ? <Admin />
              : <Navigate to="/accueil" />
          }
        />

        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;