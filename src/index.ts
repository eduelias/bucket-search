import { BucketSearch } from './lib/commands/BucketSearch';
import { QueryConfigInterface } from './interfaces';
import { DefaultProject, SimpleSearchProject } from './projects';
import {
  ListObjectsCommandInput,
  S3ClientConfig,
  _Object,
} from '@aws-sdk/client-s3';

export {
  BucketSearch as S3Service,
  SimpleSearchProject,
  DefaultProject,
  QueryConfigInterface,
  S3ClientConfig,
  _Object,
  ListObjectsCommandInput,
};
