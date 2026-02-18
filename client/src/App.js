
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Error from './Pages/Error';
import NavBar from './Components/NavBar';
import Profile from './Pages/Profile/Profile';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { current } from './JS/Actions/user';

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
       <Route path='/' element={<Home />} />
       <Route path='/login' element={<Login />} />
       <Route path='/register' element={<Register />} />
       <Route path='/profile' element={<Profile />} />
       <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
