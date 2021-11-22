const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const ROOT_PATH = __dirname;

const CONTRACT_NAME = "NftId";
const CONTRACT_PATH = path.resolve(ROOT_PATH, "build/contracts/NftId.json");
const TARGET_JSON_PATH = path.resolve(
  ROOT_PATH,
  "ui/src/web3Info/develop-details.json"
);

const migrate = spawn("truffle", ["migrate"]);

const web3Details = {
  contractAddress: null,
  abi: null
};

let deployedContract = false;

const getAbi = () => {
  if (!fs.existsSync(CONTRACT_PATH))
    throw new Error(`contract has not been built at ${CONTRACT_PATH}`);
  web3Details.abi = JSON.parse(fs.readFileSync(CONTRACT_PATH)).abi;
  console.log("retrieved contract ABI");
};

const exportJson = () => {
  fs.writeFileSync(TARGET_JSON_PATH, JSON.stringify(web3Details, null, 2));
  console.log(`exported details to ${TARGET_JSON_PATH}`);
};

migrate.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
  if (!deployedContract) {
    const regex = new RegExp(`Deploying '${CONTRACT_NAME}'`, "i");
    if (regex.test(data)) {
      console.log("contract has been deployed");
      deployedContract = true;
    }
  }
  if (deployedContract && !web3Details.contractAddress) {
    const regex = /contract address:\s+(0x[0-9a-f]+)/i;
    if (regex.test(data)) {
      const result = regex.exec(data);
      web3Details.contractAddress = result[1].trim();
      console.log(`found contract address: <<${web3Details.contractAddress}>>`);
      getAbi();
      exportJson();
    }
  }
});

migrate.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

migrate.on("error", (error) => {
  console.error(`error: ${error.message}`);
});

migrate.on("close", (code) => {
  console.log(`truffle migrate process exited with code ${code}`);
  process.exit();
});
