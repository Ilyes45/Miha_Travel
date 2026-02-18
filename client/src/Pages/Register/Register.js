import React, { useState } from 'react'
import { Button, Form} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { register } from '../../JS/Actions/user';
import {  useNavigate } from 'react-router-dom';
import './Register.css';


const Register = () => {
  const [newUser, setNewUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewUser({...newUser,[e.target.name]:e.target.value});
  };

  const handleUser = (e) => {
    e.preventDefault();
    dispatch(register(newUser));
    navigate('/profile');
  };


  return (
     <div className="register-container">
      <h1>Register</h1>
      <Form>
        {/* Champ nom */}
        <Form.Group className="mb-3" >
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter username" name="nom" onChange={handleChange} />
        </Form.Group>

        {/* Champ email */}
        <Form.Group className="mb-3" >
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
        </Form.Group>

        {/* Champ téléphone */}
        <Form.Group className="mb-3" >
          <Form.Label>User Phone</Form.Label>
          <Form.Control type="number" placeholder="Enter phone number" name="telephone" onChange={handleChange} />
        </Form.Group>

        {/* Champ mot de passe */}
        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="motDePasse" name="motDePasse" onChange={handleChange} />
        </Form.Group>

        

        {/* Checkbox optionnelle */}
        <Form.Group className="mb-3" >
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        {/* Bouton submit */}
        <Button variant="primary" type="submit" onClick={handleUser}>
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register
