
const { catchRevert } = require("./exceptionHelpers.js");
const NftId = artifacts.require("./NftId.sol");

// instance of NftId contract
let instance;

contract("NftIdTests", function (accounts) {
  const [contractOwner, alice, bob] = accounts;

  // create a new instance of the contract before running each test
  beforeEach(async () => {
    instance = await NftId.new();
  });

  describe("basic NFT functions", () => {
    it("mint new nft and verify ownership", async () => {
      await instance.safeMint({ from: alice });
      // the first NFT minted has an ID of 0
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");
    });
  })


});
