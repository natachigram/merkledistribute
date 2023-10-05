const ethers = require('ethers');
const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

async function generateMerkleTree() {
  // Read the CSV file containing the enabled addresses and their claimable amounts
  const csvData = fs.readFileSync('scripts/gen_files/add.csv', 'utf8');
  const rows = csvData.split('\n').map((row) => row.split(','));

  // Prepare the data for the Merkle tree
  const elements = rows.map((row) => {
    const address = row[0].trim(); // Assuming address is in the first column
    const amount = row[1].trim(); // Assuming amount is in the second column
    return keccak256(address + amount);
  });

  // Create the Merkle tree
  const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

  // Get the Merkle root
  const merkleRoot = merkleTree.getRoot().toString('hex');
  console.log('Merkle Root:', merkleRoot);
}

generateMerkleTree();
