import React, { useState, useEffect } from "react";
import './Settings.css';
import Login from "./Login";
import Logout from "./Logout";

const Settings = () => {
    const [taskConfirmation, setTaskConfirmation] = useState(true);
    const [volume, setVolume] = useState(50); // Adjust initial volume (0-100)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');

    // Load settings from Chrome storage on initial render
    useEffect(() => {
        chrome.storage.sync.get(['taskConfirmationEnabled', 'volume', 'isLoggedIn', 'userId'], (result) => {
            setTaskConfirmation(result.taskConfirmationEnabled !== undefined ? result.taskConfirmationEnabled : true);
            setVolume(result.volume !== undefined ? result.volume : 50);
            setIsLoggedIn(result.isLoggedIn);
            setUserId(result.userId);
        });
    }, []);

    const toggleTaskConfirmation = () => {
        setTaskConfirmation(!taskConfirmation);
        chrome.storage.sync.set({ taskConfirmationEnabled: !taskConfirmation });
    };

    const handleVolumeChange = (event) => {
        setVolume(parseInt(event.target.value));
        chrome.storage.sync.set({ volume: parseInt(event.target.value) });
    };

    const handleLogout = () => {
        chrome.storage.sync.set({
            'userId': '',
            'apiToken': '',
            'cloudId': '',
            'isLoggedIn': false
        });
        setIsLoggedIn(false);
    }

    const updateUserAndIsLoggedIn = (newUserId, newIsLoggedIn) => {
        setIsLoggedIn(newIsLoggedIn);
        setUserId(newUserId);
    }

    return (
        <>
            {isLoggedIn && <Logout email={userId} handleLogout = {handleLogout} />}
            {!isLoggedIn && <Login updateUserAndIsLoggedIn={updateUserAndIsLoggedIn} />}
            <div className="settings">
                <h2>Settings</h2>
                <div className="setting">
                    <label htmlFor="voiceFeedback">Task Confirmation</label>
                    <input
                        type="checkbox"
                        id="voiceFeedback"
                        checked={taskConfirmation}
                        onChange={toggleTaskConfirmation}
                    />
                </div>
            </div>
        </>
    );
};

export default Settings;
