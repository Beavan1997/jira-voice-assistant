import React from "react";
import { render } from "react-dom";

function Popup() {
    return (
        <div>
            Hello World
        </div>
    )
}

render(<Popup />, document.getElementById("root"));