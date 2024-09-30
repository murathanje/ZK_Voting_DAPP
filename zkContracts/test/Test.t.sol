// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";
import "../src/Verifier.sol";

contract VotingContractTest is Test {
    VotingContract public votingContract;
    Groth16Verifier public verifier;
    address public owner;
    uint256 public constant OPTION_COUNT = 3;

    function setUp() public {
        owner = address(this);
        verifier = new Groth16Verifier();
        votingContract = new VotingContract(OPTION_COUNT, address(verifier));
    }

    function testInitialState() public view {
        assertEq(votingContract.getOptionsCount(), OPTION_COUNT);
        for (uint256 i = 0; i < OPTION_COUNT; i++) {
            assertEq(votingContract.getOption(i), 0);
        }
    }

    function testGetAllOptions() public view{
        uint256[] memory allOptions = votingContract.getAllOptions();
        assertEq(allOptions.length, OPTION_COUNT);
        for (uint256 i = 0; i < OPTION_COUNT; i++) {
            assertEq(allOptions[i], 0);
        }
    }

    function testVoteFailsWithInvalidProof() public {
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(0), uint(0)];

        vm.expectRevert("Invalid zk-SNARK proof");
        votingContract.vote(a, b, c, input);
    }

    function testVoteFailsWithInvalidOption() public {
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(0), uint(OPTION_COUNT)]; 

        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(Groth16Verifier.verifyProof.selector),
            abi.encode(true)
        );

        vm.expectRevert("Invalid option");
        votingContract.vote(a, b, c, input);
    }

    function testVoteSuccessful() public {
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(123), uint(1)]; 

        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(Groth16Verifier.verifyProof.selector),
            abi.encode(true)
        );

        vm.expectEmit(true, true, false, true);
        emit VotingContract.VoteCast(bytes32(input[0]), input[1]);
        
        votingContract.vote(a, b, c, input);

        assertEq(votingContract.getOption(1), 1);
    }

    function testPreventDoubleVoting() public {
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(123), uint(1)]; 
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(Groth16Verifier.verifyProof.selector),
            abi.encode(true)
        );

        votingContract.vote(a, b, c, input);

        vm.expectRevert("Vote already cast");
        votingContract.vote(a, b, c, input);
    }

    function testOnlyOwnerCanVote() public {
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(123), uint(1)];

        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(Groth16Verifier.verifyProof.selector),
            abi.encode(true)
        );

        address nonOwner = address(0x1234);
        vm.prank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        votingContract.vote(a, b, c, input);
    }
}