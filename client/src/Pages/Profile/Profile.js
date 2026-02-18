import React from 'react'
import { useSelector } from 'react-redux';
import { Card, ListGroup } from 'react-bootstrap';

import './Profile.css';

const Profile = () => {
    const user = useSelector((state) => state.userReducer.user)

  return (
     <div className='profile'>
      <h1>User Profile</h1>
      <Card className="profile-card">
        
        {/* 🔹 informations de l'utilisateur */}
        <ListGroup variant="flush">
          <ListGroup.Item>{user?.nom}</ListGroup.Item>
          <ListGroup.Item>{user?.email}</ListGroup.Item>
          <ListGroup.Item>{user?.telephone}</ListGroup.Item>
        </ListGroup>
       
      </Card>
    </div>
  )
}

export default Profile
