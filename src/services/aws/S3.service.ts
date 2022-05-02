// Import required AWS SDK clients and commands for Node.js.
import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  SelectObjectContentCommand,
  SelectObjectContentCommandInput,
  _Object,
} from '@aws-sdk/client-s3';
import { BaseProject } from '../../projects/BaseProject.project';
import { selectObjectConfig } from '../../types/selectObjectConfig';
import { s3Client } from './S3.client'; // Helper function that creates an Amazon S3 service client module.

export class S3Service {
  /**
   *
   */
  constructor(public project: BaseProject) {}

  public async listFiles(): Promise<_Object[]> {
    // Create the parameters for the bucket
    const bucketParams: ListObjectsCommandInput = this.project.configBuilder();
    // Declare truncated as a flag that the while loop is based on.
    let truncated = true;
    // Declare a variable to which the key of the last element is assigned to in the response.
    let pageMarker;
    // Initializing the output
    const contents: _Object[] = [];
    // while loop that runs until 'response.truncated' is false.
    while (truncated) {
      try {
        const listObjectCommand = new ListObjectsCommand(bucketParams);
        const response = await s3Client.send(listObjectCommand);

        if (!response.Contents) {
          return [];
        }

        response.Contents.filter((item) => this.project.filterListItems(item)).forEach((item) => {
          contents.push(item);
        });

        // Log the key of every item in the response to standard output.
        truncated = !!response.IsTruncated;

        // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
        if (truncated) {
          pageMarker = response.Contents.slice(-1)[0].Key;
          // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
          bucketParams.Marker = pageMarker;
        }
        // At end of the list, response.truncated is false, and the function exits the while loop.
      } catch (err) {
        console.log('Error', err);
        truncated = false;
      }
    }
    return contents;
  }

  public async queryContents({ bucketName, query, key }: selectObjectConfig): Promise<Uint8Array[]> {
    const commandInput: SelectObjectContentCommandInput = {
      Bucket: bucketName,
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

    const command: SelectObjectContentCommand = new SelectObjectContentCommand(commandInput);

    const response = await s3Client.send(command);
    const records: Uint8Array[] = [];

    if (!response.Payload) return records;

    for await (const items of response.Payload) {
      try {
        if (items?.Records) {
          if (items?.Records?.Payload) {
            records.push(items.Records.Payload);
          } else {
            console.log('skipped event, payload: ', items?.Records?.Payload);
          }
        } else if (items.Stats) {
          console.log(`Processed ${items.Stats?.Details?.BytesProcessed || 'NaN'} bytes`);
        } else if (items.End) {
          console.log('SelectObjectContent completed');
        }
      } catch (err) {
        if (err instanceof TypeError) {
          console.log('error in events: ', err);
          throw err;
        }
      }
    }

    return records;
  }
}
