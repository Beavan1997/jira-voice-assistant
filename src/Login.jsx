import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css';
import { useNavigate } from 'react-router-dom';
// npm install bootstrap

const Login = () => {

    // const [cloudId, setcloudId] = useState('');
    // const [userId, setuserId] = useState(''); 
    // const [apiToken, setapiToken] = useState('');

    const navigate = useNavigate();

    const cloudIdRef = useRef(null);
    const userIdRef = useRef(null);
    const apiTokenRef = useRef(null);
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const checkCred = async (userid, apitoken, cloudid) => {
        let areCredentialsCorrect = false;
        try {
            const response = await fetch(
                `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/HCI-1`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${btoa(
                            `${userid}:${apitoken}`
                        )}`
                    },
                }
            );
            const data = await response.status;
            console.log('anything');
            if (data === 401 || data === 403) {
                setIncorrectCredentials = true;
                areCredentialsCorrect = false;
            } else {
                areCredentialsCorrect = true;
            }
        } catch (error) {
            console.log('error');
            setIncorrectCredentials = true;
            areCredentialsCorrect = false;
        }
        console.log(areCredentialsCorrect);
        return areCredentialsCorrect;
    };

    const handleSave = async (e) => {
        let isUserLoggedIn = await checkCred(userIdRef.current.value, apiTokenRef.current.value, cloudIdRef.current.value);
        if (isUserLoggedIn) {
            e.preventDefault();
            console.log(userIdRef.current.value + " " + apiTokenRef.current.value + " " + cloudIdRef.current.value);
            chrome.storage.sync.set({
                'userId': userIdRef.current.value,
                'apiToken': apiTokenRef.current.value,
                'cloudId': cloudIdRef.current.value
            }, function () {
                e.target.form.reset();
                console.log('Options saved.');
            });
            navigate('/');
        }
    };

    return (
        <div className='login-container'>
            <div className='login-content'>
                {incorrectCredentials && (
                    <div className='success-message'>Incorrect Login Credentials!</div>
                )}
                <form>
                    <h3>Sign In</h3>
                    <div className='input-group'>
                        <label for="email" className='input-label alignLabel1'>User Id</label>
                        <input type="email" placeholder="Enter Email" className='form-control' ref={userIdRef} required />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label alignLabel2'>API Token</label>
                        <input type="password" placeholder="Enter Password" className='form-control' ref={apiTokenRef} required />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label alignLabel3'>Cloud ID</label>
                        <input type="password" placeholder="Enter Cloud ID" className='form-control' ref={cloudIdRef} required />
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

