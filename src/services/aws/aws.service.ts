import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  AWS_S3_BUCKET = 'test-image-upload-s3-test';
  s3 = new AWS.S3({
    accessKeyId: 'AKIASBCASOPKZBNRGRDS',
    secretAccessKey: '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',
  });

  async uploadFile(file, type) {
    const { originalname } = file;
    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      type + '/' + originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteFile(folder: any) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: folder,
    };
    return this.s3_Delete(params);
  }

  async s3_Delete(params: any) {
    try {
      await this.s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await this.s3.deleteObject(params).promise();
        console.log('file deleted Successfully');
      } catch (err) {
        console.log('ERROR in file Deleting : ' + JSON.stringify(err));
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
    }
  }
}
