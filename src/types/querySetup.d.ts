import { jsonObjectMapper, listFilesConfig } from './listFilesConfig';
import { selectObjectConfig, selectObjectItemMapper } from './selectObjectConfig';

export abstract class querySetup<TQueryOutputType>
  implements listFilesConfig<string>, selectObjectConfig<TQueryOutputType>
{
  key: string;
  query: string;
  bucketName: string;
  prefix: string;
  maxKeys: number;
  objectMapper: jsonObjectMapper<string>;
  itemMapper: selectObjectItemMapper<TQueryOutputType>;
}
