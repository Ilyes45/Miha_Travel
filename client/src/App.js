
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Error from './Pages/Error';
import NavBar from './Components/NavBar';
import Profile from './Pages/Profile/Profile';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { current } from './JS/Actions/user';
import Voyages from './Pages/Voyages/Voyages';
import Hotels from './Pages/Hotels/Hotels';
import Accueil from './Pages/Accueil/Accueil';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(current())
    }
  }, [dispatch])

  return (
    <div className="App">
      <NavBar />
     <Routes>
       <Route path='/accueil' element={<Accueil />} />
       <Route path='/voyage' element={<Voyages />} />
       <Route path='/hotel' element={<Hotels />} />
       <Route path='/login' element={<Login />} />
       <Route path='/register' element={<Register />} />
       <Route path='/profile' element={<Profile />} />
       <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
