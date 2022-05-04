import { S3ClientConfigInterface } from './S3ClientConfigInterface';

export declare interface QueryConfigInterface extends S3ClientConfigInterface {
  key: string;
  query: string;
}
