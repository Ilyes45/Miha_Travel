import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../../JS/Actions/user';
import {  useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({...user,[e.target.name]:e.target.value});
  };
const handleUser = (e) => {
  e.preventDefault();
  dispatch(login(user));
  navigate('/profile');
}

  return (
    <div className="login-container">
<h1>Login</h1>
        
      <Form>
            <Form.Group className="mb-3" >
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                onChange={handleChange} 
                name="email" 
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                name="motDePasse" 
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              onClick={handleUser}
            >
              Se Connecter 
            </Button>
          </Form>
     
    </div>
  )
}

export default Login
