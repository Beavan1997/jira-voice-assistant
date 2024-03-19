import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css';
// npm install bootstrap

const Login = () => {
    
    return (
        <div className='login d-flex justify-content-center align-items-center bg-primary'>
            <div className='login-height p-5 rounded bg-white'>
                <form>
                    <h3>Sign In</h3>
                    <div className='mb-10'>
                        <label htmlFor="email" className='leftAlign1'>Email</label>
                        <input type="email" placeholder="Enter Email" className='form-control' />
                    </div>
                    <div className='mb-10'>
                        <label htmlFor="password" className='leftAlign2'>Password</label>
                        <input type="password" placeholder="Enter Password" className='form-control' />
                    </div>
                    <div className='mb-10 leftAlign3' >
                        <input type="checkbox" id="check" />
                        <label htmlFor="check"style={{paddingLeft: '5px'}}>
                            Remember me
                        </label>
                    </div>
                    <div className="mb-10 d-grid">
                        <button className="btn btn-primary">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

