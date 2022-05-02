import { ListObjectsCommandInput } from '@aws-sdk/client-s3';
import { S3Service } from '../services/aws/S3.service';
import { BaseProject } from './BaseProject.project';

export class Test1 extends BaseProject {
  public configBuilder(): ListObjectsCommandInput {
    const date = new Date('2022-03-29 04:53:35');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    // const second = String(date.getSeconds()).padStart(2, '0');

    const joinedDay = [year, month, day].join('-');
    const joinedHour = [year, month, day, hour, minute].join('-');
    this.bucketPrefix = `tp=application/yr=${year}/mo=${month}/dt=${joinedDay}/hr=${hour}/${joinedHour}`;
    return {
      Bucket: this.getBucket(),
      Prefix: this.bucketPrefix,
    };
  }

  public query = `SELECT *\
    FROM S3Object d\
    WHERE d."clientOriginated" = true AND d."sessionId" LIKE '7c4c0eef-53fe-418c-818e%'
    AND d."eventSource" in ('lightning', 'lightweight', 'cast', 'marquee', 'featherweight')`;

  public bucket = 'telegraph-data-production-main';
  private bucketPrefix = '';

  public async run(): Promise<void> {
    const S3 = new S3Service(this);
    const files = await S3.listFiles();
    for (const file of files) {
      if (!file.Key) continue;
      await S3.queryContents({
        bucketName: this.getBucket(),
        query: this.getQuery(),
        prefix: this.bucketPrefix,
        key: file.Key,
      });
    }
  }
}
