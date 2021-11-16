const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const ROOT_PATH = __dirname;

const MY_ADDRESS = "0xAA856892E22f33a9daE18A4Be93386E7A7695C83";
const CONTRACT_PATH = path.resolve(ROOT_PATH, "build/contracts/NftId.json");
const TARGET_JSON_PATH = path.resolve(
  ROOT_PATH,
  "ui/src/web3Info/develop-details.json"
);

const develop = spawn("truffle", ["develop"]);

process.on("SIGINT", function () {
  develop.emit("SIGINT");
  develop.emit("SIGINT");
  process.exit();
});

process.stdin.pipe(develop.stdin);

const web3Details = {
  contractAddress: null,
  abi: null,
  mainAccount: null
};

let migrated = false;
let transferred = false;

const run = (command) => {
  console.log(`RUNNING: ${command}`);
  develop.stdin.write(`${command}\n`);
};

const migrate = () => {
  run("truffle migrate");
};

const transfer = () => {
  const amount = "6000000000000000000";
  run(
    `web3.eth.sendTransaction({to: "${MY_ADDRESS}", value: "${amount}", gas: 23000, from: "${web3Details.mainAccount}"})`
  );
};

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

develop.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
  if (!migrated && />\s*/.test(data)) {
    migrated = true;
    migrate();
  }
  if (web3Details.mainAccount && !transferred && />\s*/.test(data)) {
    transferred = true;
    transfer();
  }
  if (!web3Details.contractAddress) {
    const regex = /contract address:\s+(0x[0-9a-f]+)/i;
    if (regex.test(data)) {
      const result = regex.exec(data);
      web3Details.contractAddress = result[1].trim();
      console.log(`found contract address: <<${web3Details.contractAddress}>>`);
      getAbi();
      exportJson();
    }
  }
  if (!web3Details.mainAccount) {
    const regex = /Accounts:\s+\(0\) (0x[0-9a-f]+)/i;
    if (regex.test(data)) {
      const result = regex.exec(data);
      web3Details.mainAccount = result[1].trim();
      console.log(`found main account: <<${web3Details.mainAccount}>>`);
    }
  }
});

develop.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

develop.on("error", (error) => {
  console.error(`error: ${error.message}`);
});

develop.on("close", (code) => {
  console.log(`truffle develop process exited with code ${code}`);
});
