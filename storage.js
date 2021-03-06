const AWS = require("aws-sdk");
const settings = require("./settings");
const path = require("path");
const uuid = require("uuid");

const s3 = new AWS.S3({
  // for backblaze
  endpoint: new AWS.Endpoint(settings.BB2_ENDPOINT),
  accessKeyId: settings.BB2_ACCESS_KEY_ID,
  secretAccessKey: settings.BB2_SECRET_ACCESS_KEY,
  // not used for backblaze
  // region: "us-east-1",
  signatureVersion: "v4",
});

async function* list(Prefix, Delimiter = "/") {
  let params = {
    Bucket: settings.BB2_BUCKET,
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
      Bucket: settings.BB2_BUCKET,
      Key: key,
      Body: jsonStringify ? JSON.stringify(content) : content,
    })
    .promise();
}

async function putJson(key, content) {
  return put(key, content, true);
}

async function exists(key) {
  return s3
    .headObject({
      Key: key,
      Bucket: settings.BB2_BUCKET,
    })
    .promise()
    .then(() => true)
    .catch(() => false);
}

async function get(key) {
  return s3
    .getObject({
      Key: key,
      Bucket: settings.BB2_BUCKET,
    })
    .promise()
    .then((res) => res.Body.toString("utf-8"));
}

async function getJson(key) {
  return get(key).then(JSON.parse);
}

async function del(key) {
  return s3
    .deleteObject({
      Key: key,
      Bucket: settings.BB2_BUCKET,
    })
    .promise();
}

async function log(prefix, data) {
  const fileName = path.join(
    "messages",
    new Date().toISOString() + "__" + uuid.v4()
  );
  return put(fileName, data).then(() => fileName);
}

module.exports = {
  list,
  get,
  getJson,
  put,
  putJson,
  del,
  exists,
  log,
};
