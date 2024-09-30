pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";

template Vote() {
    signal input address;
    signal input option;
    signal input nullifier;
    signal output nullifierHash;
    signal output optionValue;

    component gtZero = GreaterThan(252);
    gtZero.in[0] <== address;
    gtZero.in[1] <== 0;
    gtZero.out === 1;

    component geZero = GreaterEqThan(252);
    geZero.in[0] <== option;
    geZero.in[1] <== 0;
    geZero.out === 1;

    component poseidonAddress = Poseidon(1);
    component poseidonNullifier = Poseidon(1);

    poseidonAddress.inputs[0] <== address;
    poseidonNullifier.inputs[0] <== nullifier;

    nullifierHash <== poseidonNullifier.out;
    optionValue <== option; 
}

component main = Vote();