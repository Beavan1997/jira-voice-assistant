import React, { useState, useEffect } from "react";
import './Settings.css';
import Login from "./Login";
import Logout from "./Logout";

const Settings = () => {
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
    const [volume, setVolume] = useState(50); // Adjust initial volume (0-100)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');

    // Load settings from Chrome storage on initial render
    useEffect(() => {
        chrome.storage.sync.get(['voiceFeedbackEnabled', 'volume', 'isLoggedIn', 'userId'], (result) => {
            setVoiceFeedbackEnabled(result.voiceFeedbackEnabled !== undefined ? result.voiceFeedbackEnabled : true);
            setVolume(result.volume !== undefined ? result.volume : 50);
            setIsLoggedIn(result.isLoggedIn);
            setUserId(result.userId);
            console.log('is logged in : ' + result.isLoggedIn),
            console.log('user Id : ' +result.userId)
        });
    }, []);

    const toggleVoiceFeedback = () => {
        setVoiceFeedbackEnabled(!voiceFeedbackEnabled);
        chrome.storage.sync.set({ voiceFeedbackEnabled: !voiceFeedbackEnabled });
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
                    <label htmlFor="voiceFeedback">Voice Feedback</label>
                    <input
                        type="checkbox"
                        id="voiceFeedback"
                        checked={voiceFeedbackEnabled}
                        onChange={toggleVoiceFeedback}
                    />
                </div>
                <div className="setting">
                    <label htmlFor="volume">Volume</label>
                    <input
                        type="range"
                        id="volume"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                    <span>{volume}%</span>
                </div>
            </div>
        </>
    );
};

export default Settings;
