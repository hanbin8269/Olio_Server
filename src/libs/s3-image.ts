import * as aws from 'aws-sdk';
import * as crypto from 'crypto';
import { createReadStream } from 'fs';

aws.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // credentials: new aws.CognitoIdentityCredentials({
  //   IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
  // }),
});

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: process.env.AWS_BUCKET_NAME },
});

export const uploadFile = async (
  filePath: string,
  fileName: string,
  fileType: string
) => {
  const fileStream = createReadStream(filePath);
  console.log(fileType);
  const upload = s3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ACL: 'public-read',
    Body: fileStream,
    ContentType: 'image/png',
  });

  return await upload.send((err, data) => {
    if (err) {
      throw err;
    }
    return { key: data.Key, location: data.Location };
  });
};
