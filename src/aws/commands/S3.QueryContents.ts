import {
  S3Client,
  SelectObjectContentCommand,
  S3ServiceException,
  SelectObjectContentCommandOutput,
  SelectObjectContentCommandInput,
} from '@aws-sdk/client-s3';
import assert from 'assert';
import EventEmitter from 'events';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
import { QueryObjectsEvents } from '../../interfaces/QueryObjectEvents';

export async function queryContents(
  ee: StrictEventEmitter<EventEmitter, QueryObjectsEvents>
): Promise<Uint8Array[]> {
  // Prepare the client creation
  const s3ClientSet: { instance?: S3Client } = {};
  ee.emit('createClient', s3ClientSet);
  const s3Client =
    s3ClientSet.instance ??
    new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

  const defaultQueryConfig: SelectObjectContentCommandInput = {
    Bucket: '',
    Key: '',
    ExpressionType: 'SQL',
    Expression: '',
    InputSerialization: {
      JSON: {
        Type: 'LINES',
      },
    },
    OutputSerialization: {
      JSON: {},
    },
  };
  ee.emit('prepareConfig', defaultQueryConfig);
  assert(defaultQueryConfig.Bucket, 'Bucket cannot be empty.');

  const command: SelectObjectContentCommand = new SelectObjectContentCommand(
    defaultQueryConfig
  );

  let response: SelectObjectContentCommandOutput;
  try {
    response = await s3Client.send(command);
  } catch (err) {
    if (err instanceof S3ServiceException) {
      const error = err as unknown as {
        Key: string;
        Code: string;
      };
      if (error && !!error.Code && error.Key && error.Code === 'NoSuchKey') {
        ee.emit('noSuchKey', error);
      }
    } else {
      throw err;
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (response === undefined) return [];

  const records: Uint8Array[] = [];

  if (!response.Payload) {
    ee.emit('emptyPayload', response);
    return [];
  }

  for await (const items of response.Payload) {
    try {
      if (items?.Records) {
        if (items?.Records?.Payload) {
          records.push(items.Records.Payload);
          if (!ee.emit('payload', items.Records.Payload)) break;
        } else {
          console.debug('skipped event, payload: ', items?.Records?.Payload);
        }
      } else if (items.Stats) {
        ee.emit('stats', items);
      } else if (items.End) {
        ee.emit('close', records);
      }
    } catch (err) {
      if (err instanceof TypeError) {
        ee.emit('error', err);
        throw err;
      }
    }
  }

  ee.emit('finish', records);
  return records;
}
