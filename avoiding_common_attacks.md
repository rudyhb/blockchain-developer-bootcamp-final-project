## Using Specific Compiler Pragma
I am using a specific compiler pragma so that my code can only be compiled with a speficic version of the solidity compiler. This will prevent bugs in case a different compiler version compiles to a different bytecode with unexpected results.

## Proper Use of Require, Assert and Revert
I am using `require` to make sure that only the owner of an NFT can perform certain functions. I am using `revert` when checking for invalid user input (for example when the string input is too large).

## Use Modifiers Only for Validation
My only modifier is `isOwnerOf`, and it validates/requires that the caller is the owner of the referenced NFT.