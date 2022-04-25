import { _Object } from '@aws-sdk/client-s3';
import { s3clientBaseConfig } from './s3clientBaseConfig';

export type jsonObjectMapper<TOutput> = (input: _Object) => TOutput;

export interface listFilesConfig<TOutput> extends s3clientBaseConfig {
  maxKeys: number;
  objectMapper: jsonObjectMapper<TOutput>;
}
