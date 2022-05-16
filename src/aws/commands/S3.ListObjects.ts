import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';
import { assert } from 'console';
import EventEmitter from 'events';
import StrictEventEmitter from 'strict-event-emitter-types/types/src';
import { ListObjectsEvents } from '../../interfaces/ListObjectEvents';

export const NOT_DEFINED = 'Not defined';

export async function listObjects(
  ee: StrictEventEmitter<EventEmitter, ListObjectsEvents>
): Promise<_Object[]> {
  // Prepare the client creation
  const s3ClientSet: { instance?: S3Client } = {};
  ee.emit('createClient', s3ClientSet);
  const s3Client =
    s3ClientSet.instance ??
    new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

  // Create the parameters for the bucket
  const defaultConfig: ListObjectsCommandInput = {
    Bucket: '',
  };
  ee.emit('readListingConfig', defaultConfig);
  const bucketParams: ListObjectsCommandInput = defaultConfig;

  assert(
    bucketParams.Bucket,
    `Bucket not found. You should use 'onReadListingConfig' event to set the correct Bucket.`
  );

  // Declare truncated as a flag that the while loop is based on.
  let truncated = true;
  // Initializing the output
  const contents: _Object[] = [];
  // while loop that runs until 'response.truncated' is false.
  while (truncated) {
    const pageContent: _Object[] = [];
    try {
      const listObjectCommand = new ListObjectsCommand(bucketParams);
      ee.emit('beforeSend', listObjectCommand);
      const response = await s3Client.send(listObjectCommand);

      if (!response.Contents) {
        ee.emit('emptyContent', response, bucketParams);
        // console.log(
        //   `Bucket ${bucketParams.Bucket || NOT_DEFINED} with prefix ${
        //     bucketParams.Prefix || NOT_DEFINED
        //   } has no content.`
        // );
        return [];
      }

      const filterConfig = (item: _Object): boolean => !!item;
      ee.emit('prepareFilter', filterConfig);
      for (const item of response.Contents.filter(filterConfig)) {
        contents.push(item);
        pageContent.push(item);
        ee.emit('data', item);
      }

      // Log the key of every item in the response to standard output.
      truncated = !!response.IsTruncated;

      // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
      bucketParams.Marker = response.Contents.slice(-1)[0].Key;

      ee.emit('page', pageContent, bucketParams);
      // At end of the list, response.truncated is false, and the function exits the while loop.
    } catch (err) {
      ee.emit('error', err);
      continue;
    }
  }

  ee.emit('end', contents, bucketParams);
  return contents;
}
