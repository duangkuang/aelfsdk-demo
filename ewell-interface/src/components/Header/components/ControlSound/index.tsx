import React, { useState, useEffect } from 'react';
import './styles.less';
import soundPng from '../../images/sound.png';
import mutePng from '../../images/mute.png';

export const ControlSound = ({ onMute, onUnmute }) => {
  const initialMuteState = JSON.parse(localStorage.getItem('isMute') || 'false') as boolean;
  const [isMute, setIsMute] = useState(initialMuteState);

  useEffect(() => {
    localStorage.setItem('isMute', JSON.stringify(isMute));
    handleAudioMute(isMute);
  }, [isMute]);

  const handleAudioMute = (shouldMute) => {
    if (shouldMute) {
      onUnmute();
    } else {
      onMute();
    }
  };

  const handleToggleMute = () => {
    setIsMute(prevMute => {
      const newMute = !prevMute;
      handleAudioMute(newMute);
      return newMute;
    });
  };

  return (
    <div className="my-wrap-sound">
      <img
        src={isMute ? mutePng : soundPng}
        className="img-sound"
        alt={isMute ? "mute" : "sound"}
        onClick={handleToggleMute}
      />
    </div>
  );
};