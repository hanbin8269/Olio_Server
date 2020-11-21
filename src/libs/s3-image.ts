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

const randomKey = () => {
  return crypto.randomBytes(20).toString('hex');
};

export const uploadImage = async (filePath: string, fileType: string) => {
  const fileStream = createReadStream(filePath);

  let key = randomKey();
  while (await getImage(key)) {
    key = randomKey();
  }

  if (!fileType) {
    fileType = 'png';
  }

  const upload: any = s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key + '.' + fileType,
      ACL: 'public-read',
      Body: fileStream,
      ContentType: fileType,
    })
    .promise();

  return upload;
};

export const deleteImage = async (key: string) => {
  const deletion: any = s3
    .deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    })
    .promise();

  return deletion;
};

export const getImage = async (key: string) => {
  try {
    const file: any = s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise();

    return await file;
  } catch {
    return;
  }
};
