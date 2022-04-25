// Import required AWS SDK clients and commands for Node.js.
import { ListObjectsCommand, ListObjectsCommandInput } from '@aws-sdk/client-s3';
import { listFilesConfig } from '../../types/listFilesConfig';
import { s3Client } from './S3.client'; // Helper function that creates an Amazon S3 service client module.

export async function listObjects<TOutput>({
  bucketName,
  prefix,
  objectMapper,
}: listFilesConfig<TOutput>): Promise<TOutput[]> {
  // Create the parameters for the bucket
  const bucketParams: ListObjectsCommandInput = { Bucket: bucketName, Prefix: prefix };
  // Declare truncated as a flag that the while loop is based on.
  let truncated = true;
  // Declare a variable to which the key of the last element is assigned to in the response.
  let pageMarker;
  // Initializing the output
  const contents: TOutput[] = [];
  // while loop that runs until 'response.truncated' is false.
  while (truncated) {
    try {
      const response = await s3Client.send(new ListObjectsCommand(bucketParams));

      if (!response.Contents) return contents;

      response.Contents.forEach((item) => {
        contents.push(objectMapper(item));
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
