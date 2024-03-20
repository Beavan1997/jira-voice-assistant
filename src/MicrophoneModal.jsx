import React from 'react';
import './MicrophoneModal.css';
import App from './App';

const MicrophoneModal = ({handleModal}) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={handleModal} className='closebtn'>close</button>
                <App />
            </div>
        </div>
    );
};

export default MicrophoneModal;