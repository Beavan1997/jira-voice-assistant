import React, { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import useSpeechToText from './hooks/useSpeechToText'
import useTextToSpeech from './hooks/useTextToSpeech';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

function App() {

  let keywords = ['create', 'insert', 'add', 'implement', 'generate', 'compose', 'form', 'formulate', 'setup', 'update', 'set', 'change', 'alter', 'modify', 'edit', 'correct', 'make', 'move', 'transition', "delete", "remove", "scratch", "cross"];
  const [keywordIndex, setKeywordIndex] = useState(-1);
  const [flag, setFlag] = useState(true);

  const [temp, setTemp] = useState('');

  const [textInput, setTextInput] = useState('');

  const [token, setToken] = useState('');
  const [payload, setPayload] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);


  const [userid, setUserid] = useState('');
  const [apitoken, setApitoken] = useState('');
  const [cloudid, setCloudid] = useState('');
  const [showMicrophone, setShowMicrophone] = useState(false);

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true })

  const { speak } = useTextToSpeech();

  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    chrome.storage.sync.get(['voiceFeedbackEnabled', 'volume'], (result) => {
      setVoiceFeedbackEnabled(result.voiceFeedbackEnabled !== undefined ? result.voiceFeedbackEnabled : true);
      setVolume(result.volume !== undefined ? result.volume : 50);
    });
  }, []);

  const getEnvVars = () => {
    chrome.storage.sync.get(['cloudId', 'userId', 'apiToken'], function (result) {
      setCloudid(result.cloudId);
      setUserid(result.userId);
      setApitoken(result.apiToken);
    });
  }

  const startStopListening = () => {
    setIsSpeaking(!isSpeaking);
    isListening ? stopVoiceInput() : startListening()
  }
  const handleClick1 = () => {
    setIsSpeaking(!isSpeaking);
  };
  const test1 = () => {
    console.log("found111111111");
  };

  const stopVoiceInput = () => {
    setTextInput(transcript)
    TaskToDo()
    stopListening()
  }

  const getToken = async () => {
    try {
      const response = await fetch('https://auth.atlassian.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          scope: 'read:jira-work write:jira-work',
          client_secret: 'ATOANA_bxN82g_BL5T1V2EBg2xckOXnJLpYyNjyjzTSL5nDKGygUknFxsMtgr6tjD7IYC6E6E7A1',
          client_id: '04xzOLLh3ZUMLkpKi65k2lQve7f9O56G'
        })
      });
      const data = await response.json();
      setToken(data.access_token);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getEnvVars();
    chrome.storage.sync.get(['cloudId', 'userId', 'apiToken'], (result) => {
      console.log(result.userId);
      if (result.userId && result.apiToken && result.cloudId) {
        setShowMicrophone(true);
      }
    });
    if (keywordIndex >= 0 && keywordIndex <= 8) {
      addTask();
    } else if (keywordIndex > 8 && keywordIndex <= 16) {
      updateTask();
    } else if (keywordIndex > 16 && keywordIndex <= 18) {
      transitionTask();
    } else if (keywordIndex > 18) {
      deleteTask();
    }
  }, [flag]);

  const matchesSequence = (inputString) => {
    const match = keywords.findIndex(seq => inputString.toLowerCase().includes(seq.toLowerCase()));

    if (match >= 0 && match <= 20) {
      setKeywordIndex(match);
      setFlag(!flag);
    }
  }


  const TaskToDo = () => {
    matchesSequence(transcript)
  };

  const addTask = async () => {
    let summary = 'No Summary'
    const summaryIndex = transcript.indexOf("summary");
    if (summaryIndex !== -1) {
      summary = transcript.substring(summaryIndex + "summary".length + 1);
    }

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
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(
              `${userid}:${apitoken}`
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
        if (voiceFeedbackEnabled) {
          speak(`Task with key ${data.key} is Created`);
        }
      } else {
        if (voiceFeedbackEnabled) {
          speak(`The Task was not created`);
        }
      }
    } catch (error) {
      setTemp(error);
    }
  };

  const updateTask = async () => {
    let updateElementKeywords = ['label', 'summary', 'description'];

    let key = 'No Key';
    let label = 'No Label';
    let summary = 'no summary';
    let description = 'no desc';

    let transcriptCopy = transcript;

    let transcriptEdited1 = transcriptCopy.replace(/\bset \b/g, '');

    const keyIndex = transcriptEdited1.indexOf("key");

    const transcriptElements = transcriptEdited1.split('and ');
    const jsonMap = new Map();

    const labelIndex = transcriptElements[0].indexOf("label");
    if (labelIndex > 0) {
      label = transcriptElements[0].substring(labelIndex + 5);
      jsonMap["label"] = label;
    }

    const summaryIndex = transcriptElements[0].indexOf("summary");
    if (summaryIndex > 0) {
      summary = transcriptElements[0].substring(summaryIndex + 7);
      jsonMap["summary"] = summary;
    }

    const descriptionIndex = transcriptElements[0].indexOf("description");
    if (descriptionIndex > 0) {
      description = transcriptElements[0].substring(descriptionIndex + 11);
      jsonMap["description"] = description;
    }

    transcriptElements.forEach(item => {
      let spaceIndex = item.indexOf(' ');
      let keyword = item.substring(0, spaceIndex);
      let value = item.substring(spaceIndex + 1);
      if (updateElementKeywords.includes(keyword)) {
        jsonMap[keyword] = value;
      }
    })

    key = transcriptElements[0].substring(transcriptElements[0].indexOf("key") + 4, transcriptElements[0].indexOf("key") + 10);
    key = key.substring(-1, 3) + "-" + key.substring(4);
    label = jsonMap.label;
    if (label == 'undefined') {
      label = '';
    }
    summary = jsonMap.summary;
    if (summary == 'undefined') {
      summary = '';
    }
    description = jsonMap.description;
    if (description == 'undefined') {
      description = '';
    }

    const descrip = {
        content: [
          {
            content: [
              {
                text: "REPSTR",
                type: "text"
              }
            ],
            type: "paragraph"
          }
        ],
        type: "doc",
        version: 1
    }
    const lab = []

    const fields = {
      project: {
        key: "HCI"
      },
      issuetype: {
        name: "Task"
      }
    };

    if (summary !== undefined) {
      fields.summary = summary;
    }

    if (label !== undefined) {
      lab.push(label);
      fields.labels = lab;
    }

    if (description !== undefined) {
      descrip.content[0].content[0].text = description;
      fields.description = descrip;
    }

    const bodyData = JSON.stringify({
      fields: fields
    });

    setToken(JSON.stringify(fields));
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Basic ${btoa(
              `${userid}:${apitoken}`
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const stat = await response.status;
      if (stat === 200 || stat == 204) {
        if (voiceFeedbackEnabled) {
          speak("The Task is updated");
        }
      } else {
        if (voiceFeedbackEnabled) {
          speak("The Task was not updated");
        }
      }
    } catch (error) {
      setTemp(error);
    }
  };

  const transitionTask = async () => {
    let key = 'No Key';
    let to = 'No Status';
    let tocode;
    const toIndex = transcript.indexOf("to");
    const keyIndex = transcript.indexOf("key");
    if (keyIndex !== -1) {
      key = transcript.substring(keyIndex + "key".length + 1, keyIndex + "key".length + 7).trim();
    }
    if (toIndex !== -1) {
      to = transcript.substring(toIndex + "to".length + 1);
    }

    key = key.substring(-1, 3) + "-" + key.substring(4);

    if (to.toLowerCase() === "to do") {
      tocode = 11;
    } else if (to.toLowerCase() === "in progress") {
      tocode = 21;
    } else if (to.toLowerCase() === "done") {
      tocode = 31;
    } else {
      tocode = -1;
    }
    const bodyData = `{
      "transition": {
        "id": "${tocode}"
      }
  }`;
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key}/transitions`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(
              `${userid}:${apitoken}`
            )}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
      const stat = await response.status;
      if (stat == 204) {
        if (voiceFeedbackEnabled) {
          speak("Transition Successful");
        }
      } else {
        if (voiceFeedbackEnabled) {
          speak("Transition Failed");
        }
      }
    } catch (error) {
      setTemp(error);
    }
  };

  const deleteTask = async () => {
    let key = 'No key'
    const keyIndex = transcript.indexOf("key");
    if (keyIndex !== -1) {
      key = transcript.substring(keyIndex + "key".length + 1, keyIndex + "key".length + 7).trim();
    }
    key = key.substring(-1, 3) + "-" + key.substring(4);
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${btoa(
              `${userid}:${apitoken}`
            )}`
          },
        }
      );
      const data = await response.status;
      if (data === 204) {
        if (voiceFeedbackEnabled) {
          speak(`Task with key ${key} is Deleted`);
        }
      } else {
        if (voiceFeedbackEnabled) {
          speak(`The Task with key ${key} was not deleted`);
        }
      }
    } catch (error) {
      setTemp(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: 'column',
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* <button
        onClick={() => {
          startStopListening();
        }}
        style={{
          backgroundColor: "#008744",
          color: "white"
        }}>
        {isListening ? 'Stop Listening l' : 'Speak'}
      </button> */}

      <div className="container">
        <div className={`sticks-container left ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
        </div>

        {!showMicrophone && <p className='login-message'>Please login inside settings to continue</p>}
        {showMicrophone && <FontAwesomeIcon icon={faMicrophone} className={`mic-icon ${isSpeaking ? 'speaking' : ''}`} onClick={() => {
          startStopListening();
        }} />}
        {showMicrophone && <div className={`sticks-container right ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
          {isSpeaking && <div className="sticks"></div>}
        </div>}
      </div>
      <div>
        <textarea
          style={{
            marginTop: '25px',
            minWidth: '300px',
            width: '94%',
            height: '75px',
            padding: '10px',
            border: '0.5 solid',
            borderRadius: '5px',
            borderColor: '#c2c2c2',
            textAlign: 'center',
            backgroundColor: 'white',
            display: 'block',
          }}
          disabled={isListening}
          value={transcript}
          onChange={(e) => {
            setTextInput(e.target.value)
          }}
        />
      </div>
    </div>
  );
}

export default App;