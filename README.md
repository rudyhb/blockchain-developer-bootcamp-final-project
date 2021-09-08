## Idea
Online inbox where you log in with MetaMask and can store text and maybe files. Think [pastebin.com](https://pastebin.com/).

The data is encrypted and decrypted using MetaMask's new `eth_getEncryptionPublicKey` and `eth_decrypt` functions - meaning that only the user will be able to view the data.

The data is stored in a decentralized manner (either on the blockchain or through IPFS) through a smart contract.

## Stretch Goals
* Allow for sharing of data (data would have to be encrypted with the other user's public key)
* More types of data - files, images, etc.

## Sample User Workflow
* User enters website, and MetaMask prompts user to select an account (user's public key is obtained behind the scenes with `eth_getEncryptionPublicKey`).
* User enters text into a box [like this](https://pastebin.com/) and clicks "Add".
* The website will encrypt the message using the public key (probably using `eth-sig-util`), and send this encrypted data to the smart contract.
* User connects to the website from a different computer and connects to the same MetaMask account.
* MetaMask will prompt the user that it wants to decrypt some information (using ` eth_decrypt`).
* The original information will be displayed.

## Considerations
* Could maybe use a L2 solution for cheaper fees - but how does data persist in Optimism, etc?
* How safe is this encryption? How long would it take an attacker to decrypt the data, and would the private key MetaMask uses to encrypt be susceptible to any attacks?
