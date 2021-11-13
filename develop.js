const { spawn } = require("child_process");
const fs = require('fs');
const path = require('path');
const ROOT_PATH = __dirname;

const CONTRACT_PATH = path.resolve(ROOT_PATH, 'build/contracts/NftId.json');
const TARGET_JSON_PATH = path.resolve(ROOT_PATH, 'ui/src/web3Info/develop-details.json');

const develop = spawn('truffle', ['develop']);

process.stdin.pipe(develop.stdin);

const web3Details = {
    url: null,
    mnemonic: null,
    contractAddress: null,
    abi: null
}

let migrated = false;

const migrate = () => {
    develop.stdin.write("truffle migrate\n");
}

const getAbi = () => {
    if (!fs.existsSync(CONTRACT_PATH)) throw new Error(`contract has not been built at ${CONTRACT_PATH}`);
    web3Details.abi = JSON.parse(fs.readFileSync(CONTRACT_PATH)).abi;
    console.log('retrieved contract ABI');
}

const exportJson = () => {
    fs.writeFileSync(TARGET_JSON_PATH, JSON.stringify(web3Details, null, 2));
    console.log(`exported details to ${TARGET_JSON_PATH}`);
}

develop.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
    if (!web3Details.url) {
        const regex = /started at (\S+)/i;
        if (regex.test(data)) {
            const result = regex.exec(data);
            web3Details.url = result[1].trim();
            console.log(`found RPC url: <<${web3Details.url}>>`);
        }
    }
    if (!web3Details.mnemonic) {
        const regex = /Mnemonic:((?: \S+)+)/i;
        if (regex.test(data)) {
            const result = regex.exec(data);
            web3Details.mnemonic = result[1].trim();
            console.log(`found mnemonic: <<${web3Details.mnemonic}>>`);
        }
    }
    if (!migrated && />\s*/.test(data)) {
        migrated = true;
        migrate();
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
});

develop.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
});

develop.on('error', (error) => {
    console.error(`error: ${error.message}`);
});

develop.on("close", code => {
    console.log(`truffle develop process exited with code ${code}`);
});