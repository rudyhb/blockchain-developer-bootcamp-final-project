
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

    // basic NFT minting and verify that owner is correct
    it("mint new nft and verify ownership", async () => {
      await instance.safeMint({ from: alice });
      // the first NFT minted has an ID of 0
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");
    });

    // verify that a transfer works correctly - alice mints and transfers nft to bob, bob should be the new owner
    it("transfer nft", async () => {
      await instance.safeMint({ from: alice });
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");
      await instance.transfer(bob, web3.utils.toBN(0), {from: alice});
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), bob, "bob does not own the NFT just transferred to him");
    })

    // verify that the ID of the NFTs increments automatically - i.e., the second NFT minted has an ID of 1, the third of 2, etc.
    it("check nft autoincrement id", async () => {
      await instance.safeMint({ from: alice });
      // the first NFT minted has an ID of 0
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");

      await instance.safeMint({ from: bob });
      // the second NFT minted has an ID of 1
      assert.equal(await instance.ownerOf(web3.utils.toBN(1)), bob, "bob does not own the NFT he just minted");

      await instance.safeMint({ from: alice });
      // the third NFT minted has an ID of 2
      assert.equal(await instance.ownerOf(web3.utils.toBN(2)), alice, "alice does not own the NFT she just minted");
    })

  })

  describe("NFT ID role functions", () => {

    // verify that the role of the owner of the NFT is "owner"
    it("verify role of owner", async () => {
      await instance.safeMint({ from: alice });
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");
      const roleForAlice = await instance.getRoleFor(alice, web3.utils.toBN(0));
      assert.equal(roleForAlice, "owner");
    })

    // alice mints the NFT ID. She is the "owner". She then assigns bob the role of "developer". We need to verify that bob is a "developer"
    it("verify that a role is assigned correctly to another address", async () => {
      await instance.safeMint({ from: alice });
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");

      await instance.setRole(web3.utils.toBN(0), bob, "developer", {from: alice});
      const roleForBob = await instance.getRoleFor(bob, web3.utils.toBN(0));
      assert.equal(roleForBob, "developer");

      // alice should still have the role of "owner"
      const roleForAlice = await instance.getRoleFor(alice, web3.utils.toBN(0));
      assert.equal(roleForAlice, "owner");
    })

    // building on the last test: alice now removes bob as developer. Bob's role now should be "".
    it("verify that a role is removed correctly", async () => {
      await instance.safeMint({ from: alice });
      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");

      await instance.setRole(web3.utils.toBN(0), bob, "developer", {from: alice});
      let roleForBob = await instance.getRoleFor(bob, web3.utils.toBN(0));
      assert.equal(roleForBob, "developer");

      await instance.removeRole(web3.utils.toBN(0), bob, {from: alice});
      roleForBob = await instance.getRoleFor(bob, web3.utils.toBN(0));
      assert.equal(roleForBob, "");
    })

    // similar to the last test: alice first assigns bob as a "developer" and later changes his role to "admin".
    // Verify that bob's role is "admin". Also verify that all events are emitted correctly
    it("verify that a role is re-assigned correctly and events are emitted correctly", async () => {

      let tx = await instance.safeMint({ from: alice });
      assert.equal(tx.logs[0].event, "Transfer");

      assert.equal(await instance.ownerOf(web3.utils.toBN(0)), alice, "alice does not own the NFT she just minted");

      tx = await instance.setRole(web3.utils.toBN(0), bob, "developer", {from: alice});
      assert.equal(tx.logs[0].event, "SetRole");

      let roleForBob = await instance.getRoleFor(bob, web3.utils.toBN(0));
      assert.equal(roleForBob, "developer");

      tx = await instance.setRole(web3.utils.toBN(0), bob, "admin", {from: alice});
      assert.equal(tx.logs[0].event, "RemoveRole"); // an old role is removed before a new one is added
      assert.equal(tx.logs[1].event, "SetRole");

      roleForBob = await instance.getRoleFor(bob, web3.utils.toBN(0));
      assert.equal(roleForBob, "admin");
    })

  })


});
