// scripts/deploy.js

const hre = require('hardhat');
const ethers = hre.ethers;

async function main() {
  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  // Deploy EscrowManager (update constructor args if needed)
  const platformFee = 5; // 5%
  const approvers = [deployer.address];
  const requiredApprovals = 1;

  const EscrowManager = await ethers.getContractFactory('EscrowManager');
  const escrowManager = await EscrowManager.deploy(
    platformFee,
    approvers,
    requiredApprovals,
  );
  await escrowManager.waitForDeployment();
  console.log('EscrowManager deployed at:', await escrowManager.getAddress());

  // Deploy CrowdfundingFactory (pass escrowManager.getAddress() if needed)
  const CrowdfundingFactory = await ethers.getContractFactory(
    'CrowdfundingFactory',
  );
  const factory = await CrowdfundingFactory.deploy(platformFee);
  await factory.waitForDeployment();
  console.log('CrowdfundingFactory deployed at:', await factory.getAddress());

  // Create a campaign
  const goal = ethers.parseEther('1'); // 1 ETH goal
  const deadline = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // 3 days from now
  const title = 'Hardhat Campaign';
  const description = 'This campaign was deployed from Hardhat!';
  const imageURL = 'https://placekitten.com/400/300';
  const isFlexibleFunding = true;

  const tx = await factory.createCampaign(
    goal,
    deadline,
    title,
    description,
    imageURL,
    isFlexibleFunding,
  );
  const receipt = await tx.wait();

  // Parse event logs for the new campaign address
  let campaignAddress = null;
  for (const log of receipt.logs) {
    try {
      const parsed = factory.interface.parseLog(log);
      if (parsed && parsed.name === 'CampaignCreated') {
        campaignAddress = parsed.args.campaignAddress;
        break;
      }
    } catch (e) {}
  }
  if (!campaignAddress) {
    throw new Error(
      'Failed to get CrowdfundingCampaign address from event logs.',
    );
  }
  console.log('CrowdfundingCampaign deployed at:', campaignAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
