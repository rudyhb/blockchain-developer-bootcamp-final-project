## Updates
Previously, I thought about using `eth_getEncryptionPublicKey` and `eth_decrypt` to encrypt/decrypt data. I have now decided against this because in the case that a user's MetaMask seed phrase is compromised, an attacker would gain access to all the data the user has ever encrypted.

My new idea is to use NFTs as a way of signing in to websites. This way, a user can just transfer his NFT to easily migrate to another wallet.

## Idea
Use NFTs as a way to keep track of ownership to accounts. This would be an alternative way to sign in to websites (similar to Sign in with Google/Apple).

I will also create a demo website that uses this technology: an online inbox where you log in with your NFT and can store text and maybe files. Think [pastebin.com](https://pastebin.com/).

## Stretch Goals
* More customization on the NFT data: for example, data about email, avatar, etc.
* More wallet options (metamask, walletconnect, etc)
* L2 options

## Sample User Workflow
* User enters website and clicks, "log in with web3".
* User chooses the wallet to use (metamask, walletconnect, etc)
* User chooses the NFT to use to log in. A message is sent to the server containing the NFT address/token id.
* The server obtains the NFT's owner address and creates a challenge message for the user to sign. The server then checks if the user's signature is valid (i.e. the user is the owner of the NFT)
* If the signature is valid, the server generates a token

## Considerations
* The server should wait until the owner of the NFT has not changed in the last ~3-10 blocks to be safe before sending the challenge.
* Signing messages with Argent is different than with an externally owned account ([https://docs.argent.xyz/wallet-connect-and-argent](https://docs.argent.xyz/wallet-connect-and-argent))
