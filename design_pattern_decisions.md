## Inheritance and Interfaces
I am using the ERC721 interface (NFT). This allows my NFT to be used in any dApp that supports ERC721 NFTs. I am also inheriting from OpenZeppelin's ERC721 to make the implementation of the interface easier and more secure.

## Access Control Design Patterns
I am using a `isOwnerOf(uint256 _tokenId)` modifier to check for permissions. This way only the owner of an NFT can perform certain actions (such as transferring the NFT or setting roles for accounts).

## Optimizing Gas
Previously my contract had an array to keep track of roles and addresses for that NFT account (for example, address `0x0...01` is `admin` and address `0x0...02` is `developer`). Adding and removing these roles and addresses cost a lot of gas. I therefore changed to a `mapping(address => string)` (mapping of address to role) to save a lot of gas.