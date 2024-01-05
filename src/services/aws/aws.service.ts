import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECERET_ACCESS_KEY,
  });

  async uploadFile(file, type) {
    const { originalname } = file;
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      type + '/' + randomNumber + '_' + originalname,
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
        throw new HttpException(
          'Unable to delete image in aws',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
      throw new HttpException(
        'Unable to find image  in S3',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
