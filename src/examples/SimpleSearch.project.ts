import { ListObjectsCommandInput } from '@aws-sdk/client-s3';
import { DefaultProject } from '../types/defaultProject';

export class SimpleSearch extends DefaultProject {
  public query = 'SELECT * FROM S3Object d';
  public bucketPrefix = 'here/goes/bucket/prefix';
  public bucket = 'here-goes-bucket-name';

  async run(): Promise<void> {
    const files = await this.S3Service.listObjects();
    for (const file of files.filter((file) => file && file.Key)) {
      const found = await this.S3Service.queryContents({
        bucket: this.getBucket(),
        bucketPrefix: this.getBucketPrefix(),
        key: file.Key!,
        query: this.getQuery(),
      });
      if (!found) return;
      console.log(`Found ${found.length} records.`);
    }
  }
}
