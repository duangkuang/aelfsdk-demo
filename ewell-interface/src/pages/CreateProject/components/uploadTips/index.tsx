import { useMobile } from 'contexts/useStore/hooks';
import moduleName from 'module';
import { useMemo } from 'react';

const getCommonTips = (ratio: string = '1:1') => {
  return `Formats supported: JPG, JPEG, and PNG. \rMax size: 10 MB. Recommended ratio: ${ratio}.`;
};

export const LogoUploadTips = () => {
  const isMobile = useMobile();
  const tips = useMemo(() => getCommonTips(), []);
  return (
    <>
      {isMobile ? (
        tips.split('\r').map((text, index) => (
          <div key={index} className="form-upload-tips">
            {text}
          </div>
        ))
      ) : (
        <div className="form-upload-tips">{tips.replace('\r', '')}</div>
      )}
    </>
  );
};

export const FeaturedUploadTips = () => {
  const isMobile = useMobile();
  const tips = useMemo(() => getCommonTips('16:9'), []);
  const extraTip = useMemo(() => 'Please upload 3-5 featured images.', []);
  return (
    <>
      <div className="form-upload-tips">{extraTip}</div>
      {isMobile ? (
        tips.split('\r').map((text, index) => (
          <div key={index} className="form-upload-tips">
            {text}
          </div>
        ))
      ) : (
        <div className="form-upload-tips">{tips.replace('\r', '')}</div>
      )}
    </>
  );
};
