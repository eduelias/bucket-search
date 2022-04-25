import { SelectObjectContentCommand, SelectObjectContentCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from './S3.client'; // Helper function that creates an Amazon S3 service client module.
import { selectObjectConfig } from '../../types/selectObjectConfig';

export async function selectObjectContents<TOutput>({
  itemMapper,
  bucketName,
  query,
  key,
}: selectObjectConfig<TOutput>): Promise<TOutput[]> {
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

  const data = await s3Client.send(command);
  const records: TOutput[] = [];

  if (!data.Payload) return [];

  for await (const items of data.Payload) {
    try {
      if (items?.Records) {
        if (items?.Records?.Payload) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
          records.push(itemMapper(items.Records.Payload));
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
