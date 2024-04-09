import React, { useEffect, useState } from 'react';
import { Upload, IUploadProps } from 'aelf-design';
import { GetProp, UploadFile, message } from 'antd';
import { emitLoading } from 'utils/events';
import { useAWSUploadService } from 'hooks/useAWSUploadService';
import { convertToBytes } from 'utils/format';

export type FileType = Parameters<GetProp<IUploadProps, 'beforeUpload'>>[0];

export interface IFUploadProps extends IUploadProps {
  maxFileCount?: number;
  fileLimit?: string;
  fileList?: UploadFile[];
}

const FUpload: React.FC<IFUploadProps> = ({ fileList, maxFileCount, fileLimit = '10M', onChange, ...props }) => {
  const [showUploadBtn, setShowUploadBtn] = useState<boolean>(false);
  const [inFileList, setFileList] = useState<UploadFile[]>([]);
  const { awsUploadFile } = useAWSUploadService();

  useEffect(() => {
    if (!maxFileCount) return setShowUploadBtn(true);
    setShowUploadBtn(inFileList.length < maxFileCount);
  }, [inFileList, maxFileCount]);

  useEffect(() => {
    setFileList(fileList || []);
  }, [fileList]);

  const onFileChange: IFUploadProps['onChange'] = (info) => {
    const { file, fileList } = info;

    if (!file?.status) return;

    const newFileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    console.log('onFileChange', newFileList);
    onChange?.({ ...info, fileList: newFileList });
    setFileList(newFileList);
  };

  const onBeforeUpload = (file: FileType) => {
    const isLteLimit = file.size <= convertToBytes(fileLimit);

    if (!isLteLimit) {
      message.error(`Image must smaller than ${fileLimit}B!`);
    }

    return isLteLimit;
  };

  const onCustomRequest: IUploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      console.log('onCustom loading');
      emitLoading(true, { text: 'uploading...' });
      const fileUrl = await awsUploadFile(file as File);
      console.log('awsUpload-success', fileUrl);
      onSuccess?.({ url: fileUrl });
    } catch (error) {
      onError?.(error as Error);
    } finally {
      emitLoading(false);
    }
  };

  return (
    <Upload
      {...props}
      fileList={inFileList}
      showUploadButton={showUploadBtn}
      customRequest={onCustomRequest}
      onChange={onFileChange}
      beforeUpload={onBeforeUpload}
    />
  );
};

export default FUpload;
