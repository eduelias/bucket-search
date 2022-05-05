import { S3Service } from './services/aws/S3.service';
import { QueryConfigInterface } from './interfaces';
import { DefaultProject, SimpleSearchProject } from './examples';
import {
  ListObjectsCommandInput,
  S3ClientConfig,
  _Object,
} from '@aws-sdk/client-s3';

export {
  S3Service,
  SimpleSearchProject,
  DefaultProject,
  QueryConfigInterface,
  S3ClientConfig,
  _Object,
  ListObjectsCommandInput,
};
