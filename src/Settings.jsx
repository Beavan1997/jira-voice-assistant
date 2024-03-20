import React, { useState } from "react";
import './Settings.css';
import Login from "./Login";

const Settings = () => {
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
    const [volume, setVolume] = useState(50); // Adjust initial volume (0-100)

    const toggleVoiceFeedback = () => {
        setVoiceFeedbackEnabled(!voiceFeedbackEnabled);
    };

    const handleVolumeChange = (event) => {
        setVolume(parseInt(event.target.value)); // Update volume on slider change
    };

    return (
        <>
            <Login />
            <div className="settings">
                <h2>Settings</h2>
                <div className="setting">
                    <label htmlFor="voiceFeedback">Voice Feedback</label>
                    <input type="checkbox" id="voiceFeedback" checked={voiceFeedbackEnabled} onChange={toggleVoiceFeedback} />
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