import { useState } from 'react';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  let synthesis = null;

  const speak = (text) => {
    if (!synthesis) {
      synthesis = window.speechSynthesis;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };
  };

  const stopSpeaking = () => {
    if (synthesis && synthesis.speaking) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, speak, stopSpeaking };
};

export default useTextToSpeech;