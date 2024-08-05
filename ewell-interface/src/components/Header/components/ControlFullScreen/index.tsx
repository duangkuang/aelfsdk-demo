// ControlFullScreen.tsx
import React, { useState } from 'react';
import './styles.less';
import fullScreenPng from '../../images/full-screen.png';
import exitFullScreenPng from '../../images/exit-full-screen.png';
import { requestFullScreen, exitFullScreen, isFullscreenElement } from './util';

export const ControlFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullscreenElement()) {
      // 进入全屏
      requestFullScreen(document.body);
      setIsFullScreen(true);
    } else {
      // 退出全屏
      exitFullScreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="my-control-screen">
      <img
        src={isFullScreen ? exitFullScreenPng : fullScreenPng}
        className="img-sound"
        onClick={toggleFullScreen}
        alt={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
      />
    </div>
  );
};
