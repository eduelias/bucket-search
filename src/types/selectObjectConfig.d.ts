import { s3clientBaseConfig } from './s3clientBaseConfig';

export interface selectObjectConfig extends s3clientBaseConfig {
  key: string;
  query: string;
}
