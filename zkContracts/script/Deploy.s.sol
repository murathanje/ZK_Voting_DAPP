// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Import the Script and console functionalities from Forge Standard Library for deployment scripts
import {Script, console} from "forge-std/Script.sol";
// Import the VotingContract and Verifier contracts
import "../src/VotingContract.sol";
import "../src/Verifier.sol";

/**
 * @title DeployScript
 * @dev Script to deploy the VotingContract and Verifier contracts.
 */
contract DeployScript is Script {
    // Instances of the contracts to be deployed
    VotingContract public votingContract;
    Groth16Verifier public verifier;

    /**
     * @dev Sets up the environment for deployment.
     * @notice This function is called before `run` to initialize the deployment process.
     */
    function setUp() public {
        // Retrieve the private key from the environment variables
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        // Start broadcasting transactions with the retrieved private key
        vm.startBroadcast(privateKey);
    }

    /**
     * @dev Deploys the Verifier and VotingContract contracts.
     * @notice This function deploys both contracts and logs their addresses.
     */
    function run() public {
        uint256 _optionCount = 3;  // Define the number of voting options
        
        // Deploy the Verifier contract
        verifier = new Groth16Verifier();
        console.log("Verifier Address:", address(verifier));
        
        // Deploy the VotingContract with the number of options and the Verifier's address
        votingContract = new VotingContract(_optionCount, address(verifier));
        console.log("VotingContract Address:", address(votingContract));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
