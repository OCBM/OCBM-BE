import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class AwsService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECERET_ACCESS_KEY,
  });

  /**
   * Uploads a file to the specified destination.
   * @param file - The file to be uploaded.
   * @param type - The type of the module this file belongs to.
   * @returns A promise that resolves to the uploaded file.
   */
  async uploadFile(file, type) {
    const { originalname } = file;
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    if (process.env.STORAGE === 'local') {
      return await this.uploadFileToLocal(file, type);
    } else {
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        type + '/' + randomNumber + '_' + originalname,
        file.mimetype,
      );
    }
  }

  async uploadFileToLocal(file, type) {
    const { originalname } = file;
    const [fileName, extension] = originalname.split('.'); // ['image1', 'jpg'
    const folderName = type;
    const uploadLocation = `storage/${folderName}`;
    const uniqueFileName = `${fileName}-${new Date().getTime()}.${extension}`;
    const path = `${uploadLocation}/${uniqueFileName}`;
    /**
     * This is the key that will be stored in the database, same as how S3 gives key to the file
     * & this key will be while deleting the file from the storage
     */
    const key = `${folderName}/${uniqueFileName}`;
    if (
      originalname.split('.').length < 2 ||
      originalname.split('.').length > 2
    ) {
      throw new BadRequestException('File name is not valid');
    }
    if (!existsSync(uploadLocation)) {
      mkdirSync(uploadLocation, { recursive: true });
    }
    let error;
    writeFile(path, file.buffer, (err) => {
      if (err) {
        console.log(err);
        error = err;
      }
    });
    if (error) {
      throw new InternalServerErrorException(error);
    }
    // http://localhost:9160/file-download/storage/plants/1705668149846-image1.jpg
    const downloadUrl = process.env.DOWNLOAD_URL
      ? `${process.env.DOWNLOAD_URL}/file-download/${path}`
      : `http://localhost:3000/file-download/${path}`;
    const val: any = {
      location: downloadUrl,
      key: key,
    };
    return val;
  }

  async deleteFileFromLocal(key: string) {
    const fullPath = join(process.cwd(), `storage/${key}`);
    let error;
    unlink(fullPath, (err) => {
      if (err) {
        console.error(err);
        error = err;
      }
    });
    if (error) {
      throw new InternalServerErrorException(error);
    }
    return true;
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
      console.error(e);
    }
  }

  async deleteFile(folder: any) {
    const key = folder;
    if (process.env.STORAGE === 'local' && folder) {
      return await this.deleteFileFromLocal(key);
    } else {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: folder,
      };
      return this.s3_Delete(params);
    }
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
