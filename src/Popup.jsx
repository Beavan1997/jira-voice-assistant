import React from "react";
import { render } from "react-dom";
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import App from "./App";
import Settings from "./Settings";

function Popup() {
    return (
        // <div>
        //     Hello World
        // </div>
        <>
            <div className="nav-bar">
                <Link to='/'><h2>JIRA Assistant</h2></Link>
                <Link to='/settings'><button>settings</button></Link>
            </div>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    )
}

render(<HashRouter>
    <Popup />
</HashRouter>, document.getElementById("root"));