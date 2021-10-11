const NftIdTests = artifacts.require("NftIdTests");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NftIdTests", function (/* accounts */) {
  it("should assert true", async function () {
    await NftIdTests.deployed();
    return assert.isTrue(true);
  });
});
