# Bucket Search
This is the repository for the npm package @eduelias/bucket-search

## Intro
This package helps scrapping S3 buckets using it's SQL capabilities to go through all files and querying them sequentially or simultaneously. 

## Getting started[^1]
1. Install the package into your project: `npm i --save @eduelias/bucket-search`
2. Create a project file like `SimpleQuery.ts`
3. Create a new class that extends `DefaultProject.ts`
4. Instantiate your class
5. Call method `.run()`

## Examples
To see some examples, look for the folder examples. There we have a simple sequential query runner that will list all files in the bucket and query each one sequentially and log to console when any records are found.

[^1]: To be able to query the S3 bucket you configured on your project, you need to have AWS credentials file set up and the correct credentials on your environment. 