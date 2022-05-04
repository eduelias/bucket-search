// Import required AWS SDK clients and commands for Node.js.
import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  SelectObjectContentCommand,
  SelectObjectContentCommandInput,
  _Object,
} from '@aws-sdk/client-s3';
import { QueryConfigInterface } from '../../interfaces/QueryConfigInterface';
import { SearchProjectInterface } from '../../interfaces/SearchProjectInterface';

import { s3Client } from './S3.client'; // Helper function that creates an Amazon S3 service client module.

const NOT_DEFINED = 'Not defined.';
export class S3Service {
  /**
   *
   */
  constructor(public project: SearchProjectInterface) {}

  public async listObjects(): Promise<_Object[]> {
    // Create the parameters for the bucket
    const bucketParams: ListObjectsCommandInput =
      this.project.getListingConfig();
    // Declare truncated as a flag that the while loop is based on.
    let truncated = true;
    // Initializing the output
    const contents: _Object[] = [];
    // while loop that runs until 'response.truncated' is false.
    while (truncated) {
      const pageContent: _Object[] = [];
      try {
        const listObjectCommand = new ListObjectsCommand(bucketParams);
        const response = await s3Client.send(listObjectCommand);

        if (!response.Contents) {
          console.log(
            `Bucket ${bucketParams.Bucket || NOT_DEFINED} with prefix ${
              bucketParams.Prefix || NOT_DEFINED
            } has no content.`
          );
          return [];
        }

        for (const item of response.Contents.filter((item) =>
          this.project.filterObjectList(item)
        )) {
          contents.push(item);
          pageContent.push(item);
        }

        // Log the key of every item in the response to standard output.
        truncated = !!response.IsTruncated;

        // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
        bucketParams.Marker = response.Contents.slice(-1)[0].Key;

        await this.project.processObjectListPage(pageContent, bucketParams);
        // At end of the list, response.truncated is false, and the function exits the while loop.
      } catch (err) {
        console.error('Error', err);
        continue;
      }
    }

    this.project.endObjectListing(contents, bucketParams);
    return contents;
  }

  public async queryContents(
    selectConfig: QueryConfigInterface
  ): Promise<Uint8Array[]> {
    const commandInput: SelectObjectContentCommandInput =
      this.project.getAwsQueryConfig(selectConfig);
    const command: SelectObjectContentCommand = new SelectObjectContentCommand(
      commandInput
    );

    const response = await s3Client.send(command);
    const records: Uint8Array[] = [];

    if (!response.Payload) return records;

    for await (const items of response.Payload) {
      try {
        if (items?.Records) {
          if (items?.Records?.Payload) {
            records.push(items.Records.Payload);
            if (
              !this.project.processQueryPayload(
                items.Records.Payload,
                selectConfig
              )
            )
              break;
          } else {
            console.debug('skipped event, payload: ', items?.Records?.Payload);
          }
        } else if (items.Stats) {
          this.project.processQueryStats(items, selectConfig);
        } else if (items.End) {
          this.project.processQueryEnd(records, selectConfig);
        }
      } catch (err) {
        if (err instanceof TypeError) {
          console.error('error in events: ', err);
          throw err;
        }
      }
    }

    this.project.processQueryResults(records, selectConfig);

    return records;
  }
}
