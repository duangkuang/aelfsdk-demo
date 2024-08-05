import React, { useEffect, useState } from 'react';
import './styles.less';

export const ScreenOrientationDetector = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const orientation = window.screen.orientation;
      if (orientation) {
        setIsPortrait(orientation.type.startsWith('portrait'));
      } else {
        setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
      }
    };

    // Initial check
    handleOrientationChange();

    // Event listeners
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div>
      {isPortrait && (
        <div className="mask">
          <div className="modal-container-tip tip-modal tip-modal-portrait">
            <div className="title-tip">Tips</div>
            <p className='withdraw-text'>
              Detect that you are in portrait mode, please turn on landscape screen to enjoy a better experience.
            </p>
            <div className="btns">
              <div onClick={() => setIsPortrait(false)} className="ok-btn">OK</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};