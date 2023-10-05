// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Distributor {
    address public tokenAddress;
    bytes32 public merkleRoot;

    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        tokenAddress = _tokenAddress;
        merkleRoot = _merkleRoot;
    }

    // Function to claim tokens
    function claim(uint256 amount, bytes32[] calldata proof) external {
        // Verify the Merkle proof
        require(
            MerkleProof.verify(
                proof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender, amount))
            ),
            "Invalid proof"
        );

        // Transfer tokens to the claimant
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }
}
