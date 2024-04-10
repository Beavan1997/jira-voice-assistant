import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import App from "./App";
import Settings from "./Settings";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosHelp } from "react-icons/io";
import Help from "./Help";

function Popup() {
    const location = useLocation();
    const [showSettingsButton, setShowSettingsButton] = useState(true);

    const handleSettingsClick = () => {
        setShowSettingsButton(false);
    };

    useEffect(() => {
        if (location.pathname === '/') {
            setShowSettingsButton(true);
        }
    }, [location]);

    return (
        <>
            <div className="nav-bar">
                <div className="header">
                    {!showSettingsButton && (
                        <Link to='/'><h2 className="back">{'<'}</h2></Link>
                    )}
                    <Link to='/'><h2>JIRA Assistant</h2></Link>
                </div>
                <div className="nav-buttons">
                    {showSettingsButton && (
                        <Link to='/settings'><button onClick={handleSettingsClick}><IoSettingsSharp /></button></Link>
                    )}
                    <Link to='/help'><button className="help-icon"><IoIosHelp size={28} /></button></Link>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </>
    )
}

render(<HashRouter>
    <Popup />
</HashRouter>, document.getElementById("root"));