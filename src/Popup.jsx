import React from "react";
import { render } from "react-dom";
import App from "./App";

function Popup() {
    return (
        // <div>
        //     Hello World
        // </div>
        <>
            <App/>
        </>
    )
}

render(<Popup />, document.getElementById("root"));