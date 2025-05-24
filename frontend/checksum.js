// checksum.mjs or checksum.js (if type: module is set)
import { getAddress } from 'ethers';

const input = '0xcafac3dd18ac6c6e92c921884f9e4176737c052c';
const checksummed = getAddress(input);

console.log('Checksummed address:', checksummed);
