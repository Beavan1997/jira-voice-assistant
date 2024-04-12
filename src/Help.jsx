import React from 'react';
import './Help.css';

export default function Help() {
    return (
        <div className='main-content'>
            <h3>JIRA Speech Recognition Chrome Extension - Help Manual</h3>

            <section class="how-to-use">
                <h4>How to Use:</h4>
                <ol>
                    {<li>
                        Login in Using your JIRA credentials:
                        <ul>
                            <li><b>User Id:</b> JIRA User Id</li>
                            <li><b>API Token:</b> You JIRA API token. You can get information of how to generate your token <a href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" target="_blank">here</a>.</li>
                            <li><b>Cloud Id:</b> Your JIRA Project's Cloud Id. You can get the cloud Id by pasting this link in your https://{'<'}YOUR_DOMAIN{'>'}.atlassian.net/_edge/tenant_info</li>
                        </ul>
                    </li>}
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
                    <li><b>Create Task:</b> Creates a new task in JIRA with a user-specified summary.</li>
                    <li><b>Update Task:</b> Updates an existing task in JIRA with new summary, label, and description.</li>
                    <li><b>Delete Task:</b> Deletes a task from JIRA.</li>
                    <li><b>Transition Task:</b> Moves an existing task to a new workflow state (to-do, in progress, or done).</li>
                </ul>
            </section>

            <section class="voice-commands">
                <h4>Voice Commands:</h4>
                <ul>
                    <li><b>Create Task:</b> <i>Add</i> task with summary {'<'}your summary here{'>'}</li>
                    <li><b>Update Task:</b> <i>Update</i> task with key {'<'}task key{'>'} and set summary {'<'}new summary{'>'} and set label {'<'}new label{'>'} and set description {'<'}new description{'>'}</li>
                    <li><b>Delete Task:</b> <i>Delete</i> task with key {'<'}task key{'>'}</li>
                    <li><b>Transition Task:</b> <i>Transition</i> task with key {'<'}task key{'>'} to {'<'}to do OR in progress OR done{'>'}</li>
                </ul>
                <h4>Alternate Keywords:</h4>
                <h6>The below keywords can be used in place of <i>Keywords</i> above as alternatives to perform the mentioned operations</h6>
                <ul>
                    <li><b>Create Task:</b> Create, Insert, Add, Implement, Generate, Compose, Form, Formulate, Setup</li>
                    <li><b>Update Task:</b> Update, Set, Change, Alter, Modify, Edit, Correct, Make</li>
                    <li><b>Delete Task:</b>  Delete, Remove, Scratch, Cross</li>
                    <li><b>Transition Task:</b> Transition, Move</li>
                </ul>
            </section>
        </div>
    );
}
