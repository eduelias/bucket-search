/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ListObjectsCommandInput,
  _Object,
  SelectObjectContentCommandInput,
  SelectObjectContentEventStream,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { QueryConfigInterface, SearchProjectInterface } from '../interfaces';
import { S3Service } from '../services/aws/S3.service';

export abstract class DefaultProject implements SearchProjectInterface {
  protected S3Service: S3Service = new S3Service(this);
  protected results: Array<[string, Uint8Array]> = [];
  /**
   *
   */
  constructor() {
    process.on('SIGINT', () => {
      this.onTerminate();
      process.exit();
    });
  }
  getClientConfig(): S3ClientConfig {
    return {
      region: process.env.AWS_REGION || 'us-east-1',
    };
  }
  public abstract query: string;
  public abstract bucketPrefix: string;
  public abstract bucket: string;

  public parseS3Object<T>(contents: Uint8Array[]): T[] {
    if (contents.length === 0) {
      return [];
    }
    const parsed: T[] = contents.map((result) => {
      return JSON.parse(Buffer.from(result).toString('utf8')) as T;
    });

    return parsed;
  }

  getBucket(): string {
    return this.bucket;
  }
  getBucketPrefix(): string {
    return this.bucketPrefix;
  }
  getQuery(): string {
    return this.query.replace(/(\r\n|\n|\r)/gm, '');
  }
  getMarker(): string | undefined {
    return undefined;
  }
  abstract run(): Promise<void>;
  getListingConfig(): ListObjectsCommandInput {
    return {
      Bucket: this.getBucket(),
      Prefix: this.getBucketPrefix(),
      Marker: this.getMarker(),
    };
  }

  filterObjectList(item: _Object): boolean {
    return !!(item && item.Key);
  }

  endObjectListing(
    contents: _Object[],
    bucketParams: ListObjectsCommandInput
  ): void {
    this.onTerminate();
  }

  processObjectListPage(
    files: _Object[],
    config: ListObjectsCommandInput
  ): Promise<void> | undefined {
    // do nothing;
    return;
  }

  getAwsQueryConfig({
    bucket,
    key,
    query,
  }: QueryConfigInterface): SelectObjectContentCommandInput {
    return {
      Bucket: bucket,
      Key: key,
      ExpressionType: 'SQL',
      Expression: query,
      InputSerialization: {
        JSON: {
          Type: 'LINES',
        },
        CompressionType: 'GZIP',
      },
      OutputSerialization: {
        JSON: {},
      },
    };
  }

  processQueryStats(
    items: SelectObjectContentEventStream.StatsMember,
    selectConfig: QueryConfigInterface
  ): void {
    // do nothing
  }

  processQueryPayload(
    Payload: Uint8Array,
    config: QueryConfigInterface
  ): boolean {
    return false;
  }

  processQueryEnd(records: Uint8Array[], config: QueryConfigInterface): void {
    // do nothing
  }

  processQueryResults(
    records: Uint8Array[],
    selectConfig: QueryConfigInterface
  ): void {
    // do nothing
  }

  onTerminate(): void {
    console.log(`Program terminated.`);
  }
}
