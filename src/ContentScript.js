import React from 'react';
import ReactDOM from 'react-dom';
import MicrophoneIcon from './MicrophoneIcon';
import './MicrophoneIcon.css'

function injectMicrophoneIcon() {
  const jiraContainer = document.getElementsByClassName('css-njhh6c');//css-vtikxo
  const container = document.createElement('div');
  container.classList.add('center-div');
  jiraContainer[0].appendChild(container);
  ReactDOM.render(<MicrophoneIcon />, container);
}

injectMicrophoneIcon();