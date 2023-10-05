import MerkleTree from 'merkletreejs';
import { keccak256, solidityPack } from 'ethers/lib/utils';
import csv from 'csv-parser';
import * as fs from 'fs';
import path from 'path';

// Specify the path to your CSV file
const csvFile = 'scripts/gen_files/add.csv';

// Read data from the CSV file and generate a Merkle tree
const generateMerkleTree = async () => {
  const data = [];

  try {
    const fileStream = fs.createReadStream(csvFile);
    const csvStream = fileStream.pipe(csv());

    for await (const row of csvStream) {
      const address = row.address;
      const amount = row.amount;

      // Pack the address and amount into the expected format and then hash it
      const combinedData = solidityPack(
        ['address', 'uint256'],
        [address, amount]
      );

      //@ts-ignore
      const leaf = keccak256(['bytes'], [combinedData]);
      data.push(leaf);
    }

    // Create the Merkle tree
    const merkleTree = new MerkleTree(data, keccak256, { sortPairs: true });

    // Get the Merkle root
    const merkleRoot = '0x' + merkleTree.getRoot().toString('hex');

    console.log('Merkle Root:', merkleRoot);
  } catch (error) {
    console.error('Error reading or processing the CSV file:', error);
  }
};

generateMerkleTree();
