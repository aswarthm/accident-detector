// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Sensor{
    mapping(uint256 => string) public data_arr;    
    uint256 public count;


    constructor(){
        count = 0;  
    }
    
    function pullsensordata(string calldata sensordata) public {
        data_arr[count++] = sensordata;
    }
}