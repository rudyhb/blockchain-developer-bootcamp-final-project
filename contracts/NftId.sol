// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title An NFT that you can use to log in to a web2 site.
/// @author Rudy Hasbun
/// @notice use this contract to manage user roles for signing in to web2 sites.
contract NftId is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public immutable MAX_ROLE_SIZE = 30;
    mapping(uint256 => mapping(address => string)) public tokenRoles;

    constructor() ERC721("NFT ID", "NFTID") {}

    /// @notice the url for each NFT will be this concatenated with the tokenId
    function _baseURI() internal pure override returns (string memory) {
        return "https://nftid.app/nft/";
    }

    /// @notice create a new NFT account
    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    /// @notice create a new NFT account
    function safeMint() public {
        safeMint(msg.sender);
    }

    /// @notice a new role has been set for an NFT account
    event SetRole(address indexed _user, uint256 indexed _tokenId);
    /// @notice a role has been removed for an NFT account
    event RemoveRole(address indexed _user, uint256 indexed _tokenId);

    modifier isOwnerOf(uint256 _tokenId) {
        require(ownerOf(_tokenId) == msg.sender, "Must be token owner");
        _;
    }

    /// @notice set or change the role (any string) for a particular address
    function setRole(
        uint256 _tokenId,
        address _user,
        string calldata _role
    ) public isOwnerOf(_tokenId) {
        if (ownerOf(_tokenId) == _user)
            revert("cannot change the role for the owner");
        if (bytes(_role).length > MAX_ROLE_SIZE)
            revert("max size for role exceeded");

        mapping(address => string) storage roles = tokenRoles[_tokenId];

        bytes memory currentRole = bytes(roles[_user]);
        if (currentRole.length != 0) removeRole(_tokenId, _user);
        roles[_user] = _role;

        emit SetRole(_user, _tokenId);
    }

    /// @notice remove a role for a particular address
    function removeRole(uint256 _tokenId, address _user)
        public
        isOwnerOf(_tokenId)
    {
        if (ownerOf(_tokenId) == _user)
            revert("cannot change the role for the owner");

        mapping(address => string) storage roles = tokenRoles[_tokenId];
        delete roles[_user];

        emit RemoveRole(_user, _tokenId);
    }

    /// @notice transfer NFT to a new owner
    /// @dev See {IERC721-transferFrom}.
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        preTransferCleanup(to, tokenId);
        super.transferFrom(from, to, tokenId);
    }

    /// @notice transfer NFT to a new owner
    /// @dev See {IERC721-safeTransferFrom}.
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        preTransferCleanup(to, tokenId);
        super.safeTransferFrom(from, to, tokenId);
    }

    /// @notice transfer NFT to a new owner
    /// @dev See {IERC721-safeTransferFrom}.
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        preTransferCleanup(to, tokenId);
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    /// @notice transfer NFT to a new owner
    function transfer(address to, uint256 tokenId) public {
        preTransferCleanup(to, tokenId);
        safeTransferFrom(ownerOf(tokenId), to, tokenId);
    }

    /// @notice before transferring, manage some cleanup
    function preTransferCleanup(address _to, uint256 _tokenId) private {
        bytes memory currentRole = bytes(tokenRoles[_tokenId][_to]);
        if (currentRole.length != 0) removeRole(_tokenId, _to);
    }

    /// @notice this is the method that should be used to check for privileges for a particular address. If empty string is returned, the user has no privileges.
    function getRoleFor(address _user, uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        if (ownerOf(_tokenId) == _user) return "owner";
        mapping(address => string) storage roles = tokenRoles[_tokenId];
        return roles[_user];
    }
}
