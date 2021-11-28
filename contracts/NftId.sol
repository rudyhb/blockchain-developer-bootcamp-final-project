// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/// @title An NFT that you can use to log in to a web2 site.
/// @author Rudy Hasbun
/// @notice use this contract to manage user roles for signing in to web2 sites.
/* is ERC721*/
contract NftId {
    struct Token {
        uint256 id;
        address owner;
        mapping(address => string) roles;
    }

    uint256 public immutable MAX_ROLE_SIZE = 30;
    uint256 private tokenCount;
    mapping(uint256 => Token) public tokens;

    /// @notice a new NFT account has been created
    event Minted(address indexed _owner, uint256 indexed _tokenId);
    /// @notice an NFT account has changed owners
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    /// @notice a new role has been set for an NFT account
    event SetRole(address indexed _user, uint256 indexed _tokenId);
    /// @notice a role has been removed for an NFT account
    event RemoveRole(address indexed _user, uint256 indexed _tokenId);

    modifier isOwnerOf(uint256 _tokenId) {
        require(tokens[_tokenId].owner == msg.sender, "Must be token owner");
        _;
    }

    /// @notice create a new NFT account
    function mint() external returns (uint256) {
        uint256 tokenId = tokenCount++;
        Token storage token = tokens[tokenId];
        token.id = tokenId;
        token.owner = msg.sender;

        emit Minted(msg.sender, tokenId);
        return tokenId;
    }

    /// @notice set or change the role (any string) for a particular address
    function setRole(
        uint256 _tokenId,
        address _user,
        string calldata _role
    ) external isOwnerOf(_tokenId) {
        Token storage token = tokens[_tokenId];

        if (token.owner == _user)
            revert("cannot change the role for the owner");

        if (bytes(_role).length > MAX_ROLE_SIZE)
            revert("max size for role exceeded");

        bytes memory currentRole = bytes(token.roles[_user]); // Uses memory
        if (currentRole.length != 0) removeRole(_tokenId, _user);
        token.roles[_user] = _role;

        emit SetRole(_user, _tokenId);
    }

    /// @notice remove a role for a particular address
    function removeRole(uint256 _tokenId, address _user)
        public
        isOwnerOf(_tokenId)
    {
        Token storage token = tokens[_tokenId];
        if (token.owner == _user)
            revert("cannot change the role for the owner");
        delete token.roles[_user];

        emit RemoveRole(_user, _tokenId);
    }

    /// @notice returns the owner of the NFT account
    function ownerOf(uint256 _tokenId) external view returns (address) {
        return tokens[_tokenId].owner;
    }

    /// @notice set the owner of the NFT account to a different address
    function transfer(address _to, uint256 _tokenId)
        external
        isOwnerOf(_tokenId)
    {
        Token storage token = tokens[_tokenId];

        bytes memory currentRole = bytes(token.roles[_to]); // Uses memory
        if (currentRole.length != 0) removeRole(_tokenId, _to);

        token.owner = _to;

        emit Transfer(msg.sender, _to, _tokenId);
    }

    /// @notice this is the method that should be used to check for privileges for a particular address. If empty string is returned, the user has no privileges.
    function getRoleFor(address _user, uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        require(tokens[_tokenId].owner != address(0), "Invalid token id");

        Token storage token = tokens[_tokenId];
        if (token.owner == _user) return "owner";
        return token.roles[_user];
    }
}
