/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ListObjectsCommandInput,
  S3Client,
  SelectObjectContentCommandInput,
  _Object,
} from '@aws-sdk/client-s3';
import { EventEmitter } from 'stream';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
import { listObjects } from './aws/commands/S3.ListObjects';
import { queryContents } from './aws/commands/S3.QueryContents';
import { ListObjectsEvents } from './interfaces/ListObjectEvents';
import { QueryObjectsEvents } from './interfaces/QueryObjectEvents';

const project = {
  region: 'us-east-1',
  bucket: 'hurley-parcel-east-1',
  prefix: 'events/',
  sql: 'select * from s3Object',
};
(async (): Promise<void> => {
  const s3Client = new S3Client({
    region: project.region,
  });
  const listEmitter: StrictEventEmitter<EventEmitter, ListObjectsEvents> =
    new EventEmitter();
  const queryEmitter: StrictEventEmitter<EventEmitter, QueryObjectsEvents> =
    new EventEmitter();
  listEmitter.on('createClient', () => {
    return { instance: s3Client };
  });
  queryEmitter.on('createClient', () => {
    return { instance: s3Client };
  });

  listEmitter.on('readListingConfig', (config: ListObjectsCommandInput) => {
    config.Bucket = project.region;
    config.Prefix = project.prefix;
  });

  queryEmitter.on('finish', (records: Uint8Array[]) => {
    for (const record of records) {
      console.log(record);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  listEmitter.on('page', async (page: _Object[]) => {
    for (const item of page) {
      queryEmitter.on(
        'prepareConfig',
        (config: SelectObjectContentCommandInput) => {
          return Object.assign({}, config, {
            Bucket: project.bucket,
            Key: item.Key,
            Expression: project.sql,
          });
        }
      );
      await queryContents(queryEmitter);
    }
  });
  await listObjects(listEmitter);
})();
