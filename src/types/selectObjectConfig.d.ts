import { s3clientBaseConfig } from './s3clientBaseConfig';

export type selectObjectItemMapper<TOutput> = (item: Uint8Array) => TOutput;

export interface selectObjectConfig<TOutput> extends s3clientBaseConfig {
  key: string;
  query: string;
  itemMapper: selectObjectItemMapper<TOutput>;
}
