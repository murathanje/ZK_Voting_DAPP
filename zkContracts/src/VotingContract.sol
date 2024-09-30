// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's Ownable contract for ownership management
import "@openzeppelin/contracts/access/Ownable.sol";
// Import the custom zk-SNARK Verifier contract
import "./Verifier.sol";

/**
 * @title VotingContract
 * @dev A contract to handle voting with zk-SNARKs for anonymous voting.
 */
contract VotingContract is Ownable {
    /**
     * @dev Represents an option in the voting system.
     * @param voteCount Number of votes received by this option.
     */
    struct Option {
        uint256 voteCount;
    }

    // Array of options available for voting
    Option[] public options;
    // Mapping from nullifier hash to whether it has been used to prevent double voting
    mapping(bytes32 => bool) public nullifierHashes;
    // Instance of the zk-SNARK verifier contract
    Groth16Verifier public verifier;

    /**
     * @dev Emitted when a vote is cast.
     * @param nullifierHash A hash used to prevent double voting.
     * @param option The index of the option voted for.
     */
    event VoteCast(bytes32 indexed nullifierHash, uint256 indexed option);

    /**
     * @dev Sets up the voting options and the verifier contract.
     * @param _optionCount The number of voting options available.
     * @param _verifierAddress Address of the Groth16 verifier contract.
     */
    constructor(uint256 _optionCount, address _verifierAddress) Ownable(msg.sender) {
        for (uint i = 0; i < _optionCount; i++) {
            options.push(Option(0));
        }
        verifier = Groth16Verifier(_verifierAddress);
    }

    /**
     * @dev Casts a vote using a zk-SNARK proof.
     * @param a zk-SNARK proof input
     * @param b zk-SNARK proof input
     * @param c zk-SNARK proof input
     * @param input zk-SNARK proof input containing nullifierHash and option index
     * @notice Only the contract owner can call this function.
     */
    function vote(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) external onlyOwner {
        // Verify the zk-SNARK proof
        require(verifier.verifyProof(a, b, c, input), "Invalid zk-SNARK proof");

        // Extract the nullifier hash and option index from the proof input
        bytes32 nullifierHash = bytes32(input[0]);
        uint256 option = uint256(input[1]);

        // Ensure the nullifier hash has not been used before
        require(!nullifierHashes[nullifierHash], "Vote already cast");
        // Ensure the option index is valid
        require(option < options.length, "Invalid option");

        // Record the nullifier hash to prevent double voting
        nullifierHashes[nullifierHash] = true;
        // Increment the vote count for the selected option
        options[option].voteCount++;

        // Emit the VoteCast event
        emit VoteCast(nullifierHash, option);
    }

    /**
     * @dev Returns the total number of options available for voting.
     * @return The count of options.
     */
    function getOptionsCount() public view returns (uint256) {
        return options.length;
        
    }

    /**
    * @dev Returns the vote count for a specific option.
    * @param index The index of the option.
    * @return voteCount The vote count for the specified option.
    */
    function getOption(uint256 index) public view returns (uint256 voteCount) {
        require(index < options.length, "Invalid option index");
        return options[index].voteCount;
    }


    /**
     * @dev Returns the vote counts for all options.
     * @return An array of vote counts for all options.
     */
    function getAllOptions() public view returns (uint256[] memory) {
        uint256[] memory voteCounts = new uint256[](options.length);
        for (uint i = 0; i < options.length; i++) {
            voteCounts[i] = options[i].voteCount;
        }
        return voteCounts;
    }
}
