import React, { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import useSpeechToText from './hooks/useSpeechToText'
import useTextToSpeech from './hooks/useTextToSpeech';

function App() {

  let keywords = ["add", "Add"];

  const [textInput, setTextInput] = useState('');

  const [token, setToken] = useState('');
  const [payload, setPayload] = useState('');

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true })

  const { speak } = useTextToSpeech();

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening()
  }

  const stopVoiceInput = () => {
    setTextInput(transcript)
    TaskToDo()
    stopListening()
  }
  useEffect(() => {
    let ignore = false;
    
    if (!ignore)  getToken() 
    
    return () => { ignore = true; }
    },[]);

  const getToken = async() =>{
    try{
    const response = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        
      },
     body: JSON.stringify({ 
     grant_type : 'client_credentials',
     scope : 'read:jira-work write:jira-work',
     client_secret : 'ATOANA_bxN82g_BL5T1V2EBg2xckOXnJLpYyNjyjzTSL5nDKGygUknFxsMtgr6tjD7IYC6E6E7A1',
     client_id : '04xzOLLh3ZUMLkpKi65k2lQve7f9O56G' })
    });
    const data = await response.json();
    setToken(data.access_token);
  } catch(error) {
    console.error('Error:', error);
  }
};

  const TaskToDo = () => {
    if (transcript.toLowerCase().includes("add")) {
      addTask()
    } else if (transcript.toLowerCase().includes("update")) {
      updateTask()
    } else if(transcript.toLowerCase().includes("delete")) {
      deleteTask()
    } 
    // else {
    //   setTextInput("Not Found");
    // }
  }

  const addTask = () => {
    // Logic for creation of ADD payload
    let summary = 'No Summary'
    const summaryIndex = transcript.indexOf("summary");
    if (summaryIndex !== -1) {
      summary = transcript.substring(summaryIndex + "summary".length + 1)
    }

    let str = `{\n"operationName": "BoardCardCreate",\n "query": "\nmutation BoardCardCreate (\n    $boardId: ID!,\n    $cardTransitionId: ID,\n    $rankBeforeCardId: Long,\n    $newCards: [NewCard]!\n    $destinationId: ID,\n) {\n    boardCardCreate(input: {\n        boardId: $boardId,\n        cardTransitionId: $cardTransitionId,\n        rankBeforeCardId: $rankBeforeCardId,\n        newCards: $newCards\n        destinationId: $destinationId\n    }) {\n        newCards {\n            id\n            issue {\n                key\n            }\n        }\n    }\n}","variables": {"boardId": "1","cardTransitionId": null, "rankBeforeCardId": null,"newCards": [ { "assigneeId": null, "fixVersions": [], "issueTypeId": "10001", "labels": [], "parentId": null, "summary": "${summary}" }]}}`
    setPayload(str);
    // speak("Shut up bitch");
    speak(`Created task with Summary ${summary} on board 1`)
  }

  const updateTask = () => {
    //Update task logic
  }

  const deleteTask = () => { 
    
  }

  return (
    <div style={{ display: 'block', margin: '0 auto', width: '400px', textAlign: 'center' }}>
      <button
        onClick={() => { startStopListening() }}
        style={{
          backgroundColor: "#008744",
          color: "white"
        }}>
        {isListening ? 'Stop Listening l' : 'Speak'}
      </button>
      <textarea
        style={{
          marginTop: '20px',
          width: '100%',
          height: '150px',
          padding: '10px',
          border: '1px solid #ccc',
        }}
        disabled={isListening}
        value={transcript}
        onChange={(e) => {
          setTextInput(e.target.value)
        }}
      />
       <textarea
        style={{
          marginTop: '20px',
          width: '100%',
          height: '150px',
          padding: '10px',
          border: '1px solid #ccc',
        }}
        disabled={isListening}
        value={token}
      />
      <textarea name="hello" id="hello" cols="30" rows="10" value={payload} />
    </div>
  )
}

export default App
