import { ListObjectsCommandInput, _Object } from '@aws-sdk/client-s3';
import EventEmitter from 'events';

export abstract class BaseProject extends EventEmitter {
  public abstract query: string;
  public abstract bucket: string;

  public getBucket(): string {
    return this.bucket;
  }

  public getQuery(): string {
    return this.query.replace(/(\r\n|\n|\r)/gm, '');
  }

  public abstract configBuilder(): ListObjectsCommandInput;
  public abstract run(): Promise<void>;

  public filterListItems(item: _Object): boolean {
    return !!(item && item.Key);
  }
  public parseListItem(item: _Object): string | undefined {
    return item.Key;
  }
}
