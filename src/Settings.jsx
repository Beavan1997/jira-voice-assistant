import React, { useState, useEffect } from "react";
import './Settings.css';
import Login from "./Login";

const Settings = () => {
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
    const [volume, setVolume] = useState(50); // Adjust initial volume (0-100)

    // Load settings from Chrome storage on initial render
    useEffect(() => {
        chrome.storage.sync.get(['voiceFeedbackEnabled', 'volume'], (result) => {
            setVoiceFeedbackEnabled(result.voiceFeedbackEnabled !== undefined ? result.voiceFeedbackEnabled : true);
            setVolume(result.volume !== undefined ? result.volume : 50);
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

    return (
        <>
            <Login />
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
