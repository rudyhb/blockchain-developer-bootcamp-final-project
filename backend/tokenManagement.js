const {nanoid} = require('nanoid');
const redis = require('redis');

const useRedis = !!process.env.USE_REDIS;
const redisHost = process.env.REDIS_HOST || "redis";

const client = useRedis ? redis.createClient({
  host: redisHost,
  port: 6379
}) : null;

if (useRedis)
  client.on('error', err => {
    console.error('Error ' + err);
  });

const tokens = {};

const getNewToken = async (address, nftId, role, chainId) => {
  const token = nanoid();
  const data = {
    address,
    nftId,
    role,
    chainId
  };
  if (useRedis)
    await client.set(token, JSON.stringify(data));
  else
    tokens[token] = data;
  return token;
}

const retrieveDetails = async (token) => {
  let data;
  if (useRedis)
    data = await client.get(token);
  else
    data = tokens[token];
  if (!data)
    throw new Error('token not found');
  return JSON.parse(data);
}

module.exports = {
  getNewToken,
  retrieveDetails
};
