// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NftId /* is ERC721*/ {

    struct Token {
      uint id;
      address owner;
      string uri;
      mapping(address => string) roles;
    }

    uint private MAX_URI_LENGTH = 300;
    uint private tokenCount;
    mapping(uint => Token) public tokens;

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

      emit Transfer(msg.sender, _to, _tokenId);
    }

    function getRoleFor(address _user, uint _tokenId) public view returns (string memory){
      require(tokens[_tokenId].owner != address(0), "Invalid token id");

      Token storage token = tokens[_tokenId];
      if (token.owner == _user)
        return "owner";
      return token.roles[_user];
    }
}
