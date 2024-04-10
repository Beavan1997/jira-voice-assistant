import React from 'react'
import './Login.css';
import './Logout.css';

export default function Logout({ email, handleLogout }) {

    return (
        <div className='login-container'>
            <div className='login-content'>
                <div className='logout-component'>
                    <h6><b>Logged in as</b></h6>
                    <h6>{email}</h6>
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
