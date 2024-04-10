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
  const [otFlag, setOtflag] = useState(true);
  const [globalConfirm, setGlobalConfirm] = useState(true);
  const [confirmFlag, setConfirmFlag] = useState(false);
  const [valSet, setValset] = useState(false);

  const [key1, setKey] = useState('');
  const [summary1, setSummary] = useState('');
  const [description1, setDescription] = useState('');
  const [label1, setLabel] = useState('');
  const [toStage1, setToStage] = useState('');

  const [temp, setTemp] = useState('');

  const [textInput, setTextInput] = useState('');

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [userid, setUserid] = useState('');
  const [apitoken, setApitoken] = useState('');
  const [cloudid, setCloudid] = useState('');
  const [showMicrophone, setShowMicrophone] = useState(false);

  const { isListening, transcript, startListening, stopListening, stopListening2 } = useSpeechToText({ continuous: true })

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
 

  const stopVoiceInput = () => {
    stopListening()
    setTextInput(transcript)
    if(confirmFlag){
      setOtflag(!otFlag);
    } else {
      TaskToDo()
    }
  }

  useEffect(() => {
    getEnvVars();
    chrome.storage.sync.get(['cloudId', 'userId', 'apiToken'], (result) => {
      console.log(result.userId);
      if (result.userId && result.apiToken && result.cloudId) {
        setShowMicrophone(true);
      }
    });

    
    //Extract Info and Set confirm flag if Global Confirm is true
    if(!valSet){
      console.log('In Valset');
      if (keywordIndex >= 0 && keywordIndex <= 8) {
        let sum = 'No Summary'
        const summaryIndex = transcript.indexOf("summary");
        if (summaryIndex !== -1) {
          sum = transcript.substring(summaryIndex + "summary".length + 1);
        }
        setSummary(sum);
        setValset(true);
        if(globalConfirm){
          speak(`Are you sure you want to create task with summary ${sum}`);
          setConfirmFlag(true);
        }
        
      } else if (keywordIndex > 8 && keywordIndex <= 16) {
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

        key = transcriptElements[0].substring(transcriptElements[0].indexOf("key") + 4);
        key = key.substring(-1, 3) + "-" + key.substring(4);
        setKey(key);
        setLabel(jsonMap.label);
        if (label == 'undefined') {
          setLabel('');
        }
        setSummary(jsonMap.summary);
        if (summary == 'undefined') {
          setSummary('');
        }
        setDescription(jsonMap.description);
        if (description == 'undefined') {
          setDescription('');
        }
        setValset(true);
        if(globalConfirm){
          speak(`Are you sure you want to update task with Key ${key}`);
          setConfirmFlag(true);
        }
      } else if (keywordIndex > 16 && keywordIndex <= 18) {
        let key = 'No Key';
        let to = 'No Status';
        const toIndex = transcript.indexOf("to");
        const keyIndex = transcript.indexOf("key");
        if (keyIndex !== -1) {
          key = transcript.substring(keyIndex + "key".length + 1, keyIndex + "key".length + 8).trim();
        }
        if (toIndex !== -1) {
          to = transcript.substring(toIndex + "to".length + 1);
        }

        key = key.substring(-1, 3) + "-" + key.substring(4);
        setKey(key);
        setToStage(to);
        setValset(true);
        if(globalConfirm){
          speak(`Are you sure you want to move task with key ${key} to ${to}`);
          setConfirmFlag(true);
        }
      } else if (keywordIndex > 18) {
        let key = 'No key'
        const keyIndex = transcript.indexOf("key");
        if (keyIndex !== -1) {
          key = transcript.substring(keyIndex + "key".length + 1, keyIndex + "key".length + 8).trim();
        }
        key = key.substring(-1, 3) + "-" + key.substring(4);
        setKey(key);
        setValset(true);
        if(globalConfirm){
          speak(`Are you sure you want to delete task with key ${key}`);
          setConfirmFlag(true);
        }
      }
    }

    if(valSet && !confirmFlag){
      setValset(!valSet);
      // If confirmed or confirm is off
      if (keywordIndex >= 0 && keywordIndex <= 8) {
        console.log('In add');
        console.log(summary1);
        
        addTask();
      } else if (keywordIndex > 8 && keywordIndex <= 16) {
        updateTask();
      } else if (keywordIndex > 16 && keywordIndex <= 18) {
        transitionTask();
      } else if (keywordIndex > 18) {
        deleteTask();
      }
    }

  }, [flag]);

  useEffect(() => {
    if(confirmFlag && globalConfirm){
      if (transcript.includes('yes')) {
        console.log('In yess');
       setConfirmFlag(false);
       setFlag(!flag);
      } else if (transcript.includes('no')) {
        console.log('In No');
        setConfirmFlag(false);
        setValset(!valSet);
        speak('Operation cancelled.');
      } else {
        console.log('In Else');
        speak('Please say yes or no to confirm or cancel.');
      }
    } 
  }, [otFlag]);

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
    
    const bodyData = `{
      "fields": {
         "project":
         {
            "key": "HCI"
         },
         "summary": "${summary1}",
         "issuetype": {
            "name": "Task"
         }
     }
  }`;
  console.log("2a");
  //await confirmation(1, summary);
  console.log("under confirm");
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
    
    
    let sum = summary1;
    let des = description1;
    let lb = label1;
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

    if (sum !== undefined) {
      fields.summary = sum;
    }

    if (lb !== undefined) {
      lab.push(lb.trim());
      fields.labels = lab;
    }

    if (des !== undefined) {
      descrip.content[0].content[0].text = des;
      fields.description = descrip;
    }

    const bodyData = JSON.stringify({
      fields: fields
    });

    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key1}`,
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
    let to=toStage1;
    let tocode;
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
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key1}/transitions`,
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
    
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/3/issue/${key1}`,
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
          speak(`Task with key ${key1} is Deleted`);
        }
      } else {
        if (voiceFeedbackEnabled) {
          speak(`The Task with key ${key1} was not deleted`);
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
          className='transcript-box'
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