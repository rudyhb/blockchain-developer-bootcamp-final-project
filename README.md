##Idea
Online inbox where you log in with MetaMask and can store text and maybe files. Think  [pastebin.com](https://pastebin.com/).

The data is encrypted and decrypted using MetaMask's new `eth_getEncryptionPublicKey` and `eth_decrypt` functions - meaning that only the user will be able to view the data.

 The data is stored in a decentralized manner (either on the blockchain or through IPFS).

## Stretch Goals
* allow for sharing of data (data would have to be encrypted with the other user's public key)