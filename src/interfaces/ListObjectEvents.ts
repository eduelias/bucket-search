import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  ListObjectsCommandOutput,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';

export interface ListObjectsEvents {
  createClient: (defaultConfig: { instance?: S3Client }) => void;
  readListingConfig: (config: ListObjectsCommandInput) => void;
  beforeSend: (command: ListObjectsCommand) => void;
  emptyContent: (
    response: ListObjectsCommandOutput,
    params: ListObjectsCommandInput
  ) => void;
  prepareFilter: (filterFunction: (item: _Object) => boolean) => void;
  data: (item: _Object) => void;
  page: (page: _Object[], params: ListObjectsCommandInput) => Promise<void>;
  end: (items: _Object[], params: ListObjectsCommandInput) => void;
  error: (error: any) => void;
}
