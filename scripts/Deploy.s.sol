// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {EscrowManager} from "../contracts/EscrowManager.sol";
import {CrowdfundingFactory} from "../contracts/CrowdfundingFactory.sol";

contract DeployContracts is Script {
    function run() external {
        // Use the private key directly from command line args
        address deployer = msg.sender;
        vm.startBroadcast();

        // Set initial parameters  
        uint256 platformFee = 5; // 5% platform fee
        address[] memory approvers = new address[](1);
        approvers[0] = deployer; // Owner is initial approver
        uint256 requiredApprovals = 1;

        // Deploy EscrowManager
        EscrowManager escrowManager = new EscrowManager(
            platformFee,
            approvers,
            requiredApprovals
        );
        
        // Deploy CrowdfundingFactory with EscrowManager address
        CrowdfundingFactory factory = new CrowdfundingFactory(
            platformFee
        );

        // ------------------------------
        // Create a campaign after deployment
        // ------------------------------
        uint256 goal = 1 ether;
        uint256 deadline = block.timestamp + 3 days;
        string memory title = "First Campaign";
        string memory description = "A test campaign deployed with Foundry.";
        string memory imageURL = "https://placekitten.com/400/300";
        bool isFlexibleFunding = true;

        address campaignAddr = factory.createCampaign(
            goal,
            deadline,
            title,
            description,
            imageURL,
            isFlexibleFunding
        );

        vm.stopBroadcast();

        // Log addresses for easy reference
        console.log("EscrowManager deployed at:", address(escrowManager));
        console.log("CrowdfundingFactory deployed at:", address(factory));
        console.log("CrowdfundingCampaign deployed at:", campaignAddr);
    }
}
