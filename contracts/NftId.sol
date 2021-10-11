// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NftId /* is ERC721*/ {

    struct Token {
      uint id;
      address owner;
      string uri;
    }

    uint private MAX_URI_LENGTH = 300;
    uint private tokenCount;
    mapping(uint => Token) public tokens;
    mapping(address => mapping(uint => bool)) public tokenOwners;

    event Minted(address indexed _owner, uint256 indexed _tokenId);
    event Modified(address indexed _owner, uint256 indexed _tokenId);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    modifier isOwned(uint _tokenId) {
      require(tokens[_tokenId].owner != address(0), "Invalid token id");
      _;
    }

    modifier isOwnerOf(uint _tokenId) {
      require(tokens[_tokenId].owner == msg.sender, "Must be token owner");
      _;
    }

    function mint(string calldata _uri) external returns (uint) {
      require(bytes(_uri).length <= MAX_URI_LENGTH, "uri too long");

      uint tokenId = tokenCount++;
      Token storage token = tokens[tokenId];
      token.id = tokenId;
      token.owner = msg.sender;
      token.uri = _uri;

      tokenOwners[msg.sender][tokenId] = true;

      emit Minted(msg.sender, tokenId);
      return tokenId;
    }

    function changeUri(uint _tokenId, string calldata _uri) external isOwnerOf(_tokenId) {
      Token storage token = tokens[_tokenId];
      token.uri = _uri;

      emit Modified(msg.sender, _tokenId);
    }

    function ownerOf(uint _tokenId) external view isOwned(_tokenId) returns (address) {
      return tokens[_tokenId].owner;
    }

    function transfer(address _to, uint _tokenId) external isOwnerOf(_tokenId) {
      Token storage token = tokens[_tokenId];
      token.owner = _to;

      tokenOwners[msg.sender][_tokenId] = false;
      tokenOwners[_to][_tokenId] = true;

      emit Transfer(msg.sender, _to, _tokenId);
    }
}
