import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = ({user}) => {
    console.log(user,"uieie")
//   const [token, setToken] = useState('');

//   if (!token) {
//     return <Redirect to="/" />;
//   }

  return <div>Dashboard</div>;
};

export default Dashboard;
