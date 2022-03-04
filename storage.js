const AWS = require("aws-sdk");
const settings = require("./settings");
const path = require("path");
const uuid = require("uuid");

const s3 = new AWS.S3({
  // for backblaze
  endpoint: new AWS.Endpoint(settings.BB2_ENDPOINT),
  accessKeyId: settings.AWS_ACCESS_KEY_ID,
  secretAccessKey: settings.AWS_SECRET_ACCESS_KEY,
  // not used for backblaze
  // region: "us-east-1",
  signatureVersion: "v4",
});

async function* list(Prefix, Delimiter = "/") {
  let params = {
    Bucket: settings.AWS_S3_BUCKET,
    Prefix,
    Delimiter,
  };
  while (true) {
    let keys = [];
    console.debug("listing objects...");
    let res = await s3.listObjectsV2(params).promise();
    console.debug({ res, CommonPrefixes: res.CommonPrefixes });
    if (res.Contents) keys = keys.concat(res.Contents.map((k) => k.Key));
    if (res.CommonPrefixes)
      keys = keys.concat(res.CommonPrefixes.map((k) => k.Prefix));
    for (let key of keys) yield key;
    if (res.NextContinuationToken)
      params.ContinuationToken = res.NextContinuationToken;
    else break;
  }
}

async function put(key, content, jsonStringify = true) {
  return s3
    .putObject({
      Bucket: settings.AWS_S3_BUCKET,
      Key: key,
      Body: jsonStringify ? JSON.stringify(content) : content,
    })
    .promise();
}

async function exists(key) {
  return s3
    .headObject({
      Key: key,
      Bucket: settings.AWS_S3_BUCKET,
    })
    .promise()
    .then(() => true)
    .catch(() => false);
}

async function get(key) {
  return s3
    .getObject({
      Key: key,
      Bucket: settings.AWS_S3_BUCKET,
    })
    .promise()
    .then((res) => res.Body.toString("utf-8"));
}

async function del(key) {
  return s3
    .deleteObject({
      Key: key,
      Bucket: settings.AWS_S3_BUCKET,
    })
    .promise();
}

async function log(prefix, data) {
  return put(
    path.join("messages", new Date().toISOString() + "__" + uuid.v4()),
    data
  );
}

module.exports = {
  list,
  get,
  put,
  del,
  exists,
  log,
};
