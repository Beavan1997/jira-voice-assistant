import React, { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import useSpeechToText from './hooks/useSpeechToText'
import useTextToSpeech from './hooks/useTextToSpeech';

function App() {

  let keywords = ['create', 'insert', 'add', 'implement', 'generate', 'compose', 'form', 'formulate', 'setup', 'update', 'set', 'change', 'alter', 'modify', 'edit', 'correct', 'make', "delete", "remove", "scratch", "cross"];
  const [temp, setTemp] = useState(-1);

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

  useEffect(() => {
    if (temp >= 0 && temp <= 8) {
      addTask();
    } else if (temp > 8 && temp <= 16) {
      updateTask();
    } else if (temp > 16) {
      deleteTask();
    }
  }, [temp]);

  const matchesSequence = (inputString) => {
    const match = keywords.findIndex(seq => inputString.toLowerCase().includes(seq.toLowerCase()));

    if (match >= 0 && match <= 20) {
      setTemp(match);
    }
  }


  const TaskToDo = () => {
    matchesSequence(transcript)
  };

  const addTask = async () => {
    // Logic for creation of ADD payload
    let summary = 'No Summary'
    let key = 'No Key';
    let board = 'HCI board'
    const summaryIndex = transcript.indexOf("summary");
    const keyIndex = transcript.indexOf("key");
    if (summaryIndex !== -1 && keyIndex !== -1) {
      if (keyIndex < summaryIndex) {
        key = transcript.substring(keyIndex + "key".length + 1, summaryIndex);
        summary = transcript.substring(summaryIndex + "summary".length + 1);
      } else {
        summary = transcript.substring(summaryIndex + "summary".length + 1, keyIndex);
        key = transcript.substring(keyIndex + "key".length + 1);
      }
    } else if (summaryIndex !== -1) {
      summary = transcript.substring(summaryIndex + "summary".length + 1);
    } else if (keyIndex !== -1) {
      key = transcript.substring(keyIndex + "key".length + 1);
    }
    // keywords: summary, key

    setTextInput(`Created task with Summary ${summary} on board ${board}`)
    speak(`Created task with Summary ${summary} on board ${board} having key ${key}`)

    const bodyData = `{
      "fields": {
         "project":
         {
            "key": "HCI"
         },
         "summary": "${summary}",
         "issuetype": {
            "name": "Task"
         }
     }
  }`;
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/f50580bb-1d4c-4d6a-b89a-34f3991cf46f/rest/api/3/issue/`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(
              "mathiasbeavan003@gmail.com:ATATT3xFfGF0HuCC_GtUCSUOUt3NEJgoXWsbiOVrc8sngk4UEKNBBJbb7AHz5gQSuYyM9iKWJVq4w9zveEseBcUp-TltNRej_cTf3YGHsUvHMRjX1LFEHKepJDIF5ae4E7ERg53K-z-l_T1N2BD2fVGH54iaRVgSKibo3xB-F337OKKoaEDDGVI=F48546D9"
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const data = await response.json();
      const stat = await response.status;
      if (stat === 201) {
        speak(`Task with key ${data.key} is Created`);
      } else {
        speak(`The Task was not created`);
      }
    } catch (error) {
      setTemp(error);
    }
  };
  
  const deleteTask = async () => {
    let key = "HCI-12";
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/f50580bb-1d4c-4d6a-b89a-34f3991cf46f/rest/api/3/issue/${key}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${btoa(
              "mathiasbeavan003@gmail.com:ATATT3xFfGF0HuCC_GtUCSUOUt3NEJgoXWsbiOVrc8sngk4UEKNBBJbb7AHz5gQSuYyM9iKWJVq4w9zveEseBcUp-TltNRej_cTf3YGHsUvHMRjX1LFEHKepJDIF5ae4E7ERg53K-z-l_T1N2BD2fVGH54iaRVgSKibo3xB-F337OKKoaEDDGVI=F48546D9"
            )}`
          },
        }
      );
      const data = await response.status;
      if(data === 204){
        speak(`Task with key ${key} is Deleted`);
      } else {
        speak(`The Task with key ${key} was not deleted`);
      }
    } catch (error) {
      setTemp(error);
    }
  };

  const updateTask = async () => {
    let summary = "Updated Summary";
    const bodyData = `{
      "fields": {
         "project":
         {
            "key": "HCI"
         },
         "summary": "${summary}",
         "issuetype": {
            "name": "Task"
         }
     }
  }`;
    try {
      const response = await fetch(
        "https://api.atlassian.com/ex/jira/f50580bb-1d4c-4d6a-b89a-34f3991cf46f/rest/api/3/issue/HCI-14",
        {
          method: "PUT",
          headers: {
            Authorization: `Basic ${btoa(
              "mathiasbeavan003@gmail.com:ATATT3xFfGF0HuCC_GtUCSUOUt3NEJgoXWsbiOVrc8sngk4UEKNBBJbb7AHz5gQSuYyM9iKWJVq4w9zveEseBcUp-TltNRej_cTf3YGHsUvHMRjX1LFEHKepJDIF5ae4E7ERg53K-z-l_T1N2BD2fVGH54iaRVgSKibo3xB-F337OKKoaEDDGVI=F48546D9"
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const stat = await response.status;
      if (stat === 200 || stat == 204) {
        speak("The Task is updated");
      } else {
        speak("The Task was not updated");
      }
    } catch (error) {
      setTemp(error);
    }
  };

  return (
    <div
      style={{
        display: "block",
        margin: "0 auto",
        width: "400px",
        textAlign: "center",
      }}
    >
      <button
        onClick={() => {
          startStopListening();
        }}
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
  );
}

export default App;
