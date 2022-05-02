import { listFilesConfig } from './listFilesConfig';
import { selectObjectConfig } from './selectObjectConfig';

export abstract class querySetup implements listFilesConfig, selectObjectConfig {
  key: string;
  query: string;
  bucketName: string;
  prefix: string;
  maxKeys: number;
}
