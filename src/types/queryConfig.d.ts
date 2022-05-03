import { s3ClientConfig } from './s3ClientConfig';

export interface queryConfig extends s3ClientConfig {
  key: string;
  query: string;
}
