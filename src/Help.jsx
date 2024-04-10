import React from 'react';
import './Help.css';

export default function Help() {
    return (
        <div className='main-content'>
            <h3>JIRA Speech Recognition Chrome Extension - Help Manual</h3>

            <section class="how-to-use">
                <h4>How to Use:</h4>
                <ol>
                    {/* <li>
                        Install the Extension:
                        <ul>
                            <li>Make sure the Chrome extension is installed and enabled in your Google Chrome browser.</li>
                            <li>You can find the extension in the Chrome Web Store or through developer channels.</li>
                        </ul>
                    </li> */}
                    <li>
                        Grant Permissions:
                        <ul>
                            <li>The extension might request permission to access your JIRA instance.</li>
                            <li>Granting these permissions is necessary for the extension to function properly.</li>
                        </ul>
                    </li>
                    <li>
                        Use Voice Commands:
                        <ul>
                            <li>The extension utilizes voice recognition to understand your commands.</li>
                            <li>Here are the specific phrases you can use for each action:</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section>
                <h4>Supported Actions:</h4>
                <ul class="supported-actions">
                    <li>Add Task: Creates a new task in JIRA with a user-specified summary.</li>
                    <li>Update Task: Updates an existing task in JIRA with new summary, label, and description.</li>
                    <li>Delete Task: Deletes a task from JIRA.</li>
                    <li>Transition Task: Moves an existing task to a new workflow state (to-do, in progress, or done).</li>
                </ul>
            </section>

            <section class="voice-commands">
                <h4>Voice Commands:</h4>
                <ul>
                    <li>Add task with summary {'<'}your summary here{'>'}</li>
                    <li>Update task with key {'<'}task key{'>'} and set summary {'<'}new summary{'>'} and set label {'<'}new label{'>'} and set description {'<'}new description{'>'}</li>
                    <li>Delete task with key {'<'}task key{'>'}</li>
                    <li>Transition task with key {'<'}task key{'>'} to {'<'}to do OR in progress OR done{'>'}</li>
                </ul>
            </section>
        </div>
    );
}
