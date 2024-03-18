import React from 'react';
import ReactDOM from 'react-dom';
import MicrophoneIcon from './MicrophoneIcon';

function injectMicrophoneIcon() {
  const jiraContainer = document.getElementsByClassName('css-njhh6c');//css-vtikxo
  const container = document.createElement('div')
  jiraContainer[0].appendChild(container);
  ReactDOM.render(<MicrophoneIcon />, container);
}

injectMicrophoneIcon();