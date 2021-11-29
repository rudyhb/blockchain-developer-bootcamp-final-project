const { MongoClient } = require("mongodb");
const deploymentDetails = require('./deployment-details');
const chains = Object.keys(deploymentDetails.deploymentAddress);
const data = {};
chains.forEach(chain => {
  data[chain] = {};
})

const url = "mongodb://mongo:27017/";

const insert = async (id, status, chainId) => {
  return await run(async dbo => {
    const query = {chainId, id};
    const update = { $set: { chainId, id, status }};
    const options = { upsert: true };
    await dbo.collection("data").updateOne(query, update, options);
  });
}

const get = async (id, chainId) => {
  return await run(async dbo => {
    const query = {chainId, id};
    const options = { };
    return await dbo.collection("data").findOne(query, options);
  });
}

const run = async (action) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const dbo = client.db("userData");

    return await (action(dbo));
  }
  finally {
    await client.close();
  }
}

const getStatusForNftId = async (id, chainId) => {
  const data = await get(id, chainId);
  if (!data)
    return "";
  return data.status;
}

const setStatusForNftId = async (id, status, chainId) => {
  if (status.length > 300)
    throw new Error('status is too long');
  await insert(id, status, chainId);
}

module.exports = {
  getStatusForNftId,
  setStatusForNftId
};
