// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NftId /* is ERC721*/ {

    struct Token {
      uint id;
      address owner;
      mapping(address => string) roles;
    }

    uint private tokenCount;
    mapping(uint => Token) public tokens;

    event Minted(address indexed _owner, uint256 indexed _tokenId);
    event Modified(address indexed _owner, uint256 indexed _tokenId);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event SetRole(address indexed _user, uint256 indexed _tokenId);
    event RemoveRole(address indexed _user, uint256 indexed _tokenId);

    modifier isOwned(uint _tokenId) {
      require(tokens[_tokenId].owner != address(0), "Invalid token id");
      _;
    }

    modifier isOwnerOf(uint _tokenId) {
      require(tokens[_tokenId].owner == msg.sender, "Must be token owner");
      _;
    }

    function mint() external returns (uint) {

      uint tokenId = tokenCount++;
      Token storage token = tokens[tokenId];
      token.id = tokenId;
      token.owner = msg.sender;

      emit Minted(msg.sender, tokenId);
      return tokenId;
    }

    function setRole(uint _tokenId, address _user, string calldata _role) external isOwnerOf(_tokenId) {
      Token storage token = tokens[_tokenId];
      if (token.owner == _user)
        revert("cannot change the role for the owner");
      bytes memory currentRole = bytes(token.roles[_user]); // Uses memory
      if (currentRole.length != 0)
        removeRole(_tokenId, _user);
      token.roles[_user] = _role;

      emit SetRole(_user, _tokenId);
    }

    function removeRole(uint _tokenId, address _user) public isOwnerOf(_tokenId) {
      Token storage token = tokens[_tokenId];
      if (token.owner == _user)
        revert("cannot change the role for the owner");
      delete token.roles[_user];

      emit RemoveRole(_user, _tokenId);
    }

    function ownerOf(uint _tokenId) external view isOwned(_tokenId) returns (address) {
      return tokens[_tokenId].owner;
    }

    function transfer(address _to, uint _tokenId) external isOwnerOf(_tokenId) {
      Token storage token = tokens[_tokenId];

      bytes memory currentRole = bytes(token.roles[_to]); // Uses memory
      if (currentRole.length != 0)
        removeRole(_tokenId, _to);

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
