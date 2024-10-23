// src/components/UserManagement.js
import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '', id: null });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddUser = async () => {
    const newUser = await addUser({ name: userData.name, email: userData.email });
    setUsers([...users, newUser]);
    setUserData({ name: '', email: '', id: null });
  };

  const handleEditUser = async () => {
    const updatedUser = await updateUser(userData.id, { name: userData.name, email: userData.email });
    setUsers(users.map((user) => (user.id === userData.id ? updatedUser : user)));
    setUserData({ name: '', email: '', id: null });
    setEditing(false);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const startEditing = (user) => {
    setUserData(user);
    setEditing(true);
  };

  return (
    <div>
      <h1>User Management</h1>
      <input type="text" name="name" value={userData.name} onChange={handleInputChange} placeholder="Name" />
      <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" />
      <button onClick={editing ? handleEditUser : handleAddUser}>
        {editing ? 'Update User' : 'Add User'}
      </button>
  
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <div className="button-container">
              <button onClick={() => startEditing(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
