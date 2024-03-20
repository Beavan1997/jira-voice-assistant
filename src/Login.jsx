import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css';
// npm install bootstrap

const Login = () => {

    const [cloudId, setcloudId] = useState('');
    const [userId, setuserId] = useState('');
    const [apiToken, setapiToken] = useState('');

    const handleSave = () => {
        chrome.storage.sync.set({
            'userId': userId,
            'apiToken': apiToken,
            'cloudId': cloudId
        }, function () {
            console.log('Options saved.');
        });
    };

    return (
        <div className='login-container'>
            <div className='login-content'>
                <form>
                    <h3>Sign In</h3>
                    <div className='input-group'>
                        <label for="email" className='input-label'>Email</label>
                        <input type="email" placeholder="Enter Email" className='form-control' value={userId} onChange={(e) => setuserId(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label'>Password</label>
                        <input type="password" placeholder="Enter Password" className='form-control' value={apiToken} onChange={(e) => setapiToken(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label'>Cloud ID</label>
                        <input type="password" placeholder="Enter Cloud ID" className='form-control' value={cloudId} onChange={(e) => setcloudId(e.target.value)} />
                    </div>
                    <div className='checkbox-group'>
                        <input type="checkbox" id="check" />
                        <label for="check" className="checkbox-label">Remember me</label>
                    </div>
                    <div className="button-group">
                        <button onClick={handleSave} className="btn btn-primary">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

