// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Animal is ERC20 {
    constructor() ERC20("Animal ERC20", "Animal") {
        _mint(msg.sender, 1000000000000 * 10 ** decimals());
    }
}
