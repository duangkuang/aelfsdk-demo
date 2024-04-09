import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { useCallback, useMemo } from 'react';
import { S3_CONFIG } from 'constants/index';

export function useAWSUploadService() {
  const REGION = 'ap-northeast-1';

  const s3Client = useMemo(
    () =>
      new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({
            region: REGION,
          }),
          identityPoolId: S3_CONFIG.identityPoolID || '',
        }),
      }),
    [],
  );

  const awsUploadFile = useCallback(
    async (file: File) => {
      const FileKey = `${Date.now()}-${file.name}`;
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: FileKey,
      };
      try {
        const res = await s3Client.send(
          new PutObjectCommand({
            ACL: 'public-read',
            Body: file,
            ContentType: file.type,
            ContentLength: file.size,
            ...params,
          }),
        );
        console.log('=====uploadFile success:', res);
        return `https://${S3_CONFIG.bucket}.s3.${REGION}.amazonaws.com/${encodeURIComponent(FileKey)}`;
      } catch (error) {
        console.error('=====awsUploadFile error:', error);
        return Promise.reject(error);
      }
    },
    [s3Client],
  );

  return {
    awsUploadFile,
  };
}
