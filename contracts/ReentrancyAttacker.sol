
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITicketMarketplace {
    function mintTicket(uint256 tokenId, uint256 price) external;
    function buyPrimaryTicket(uint256 tokenId) external payable;
}

contract ReentrancyAttacker {
    ITicketMarketplace public marketplace;

    uint256 public targetTicket;
    uint256 public attackPrice;

    bool public attempted;
    bool public blocked;

    constructor(address marketplaceAddress) {
        marketplace = ITicketMarketplace(marketplaceAddress);
    }

    function mintAttackTicket(uint256 tokenId, uint256 price) external {
        targetTicket = tokenId;
        attackPrice = price;

        marketplace.mintTicket(tokenId, price);
    }

    receive() external payable {
        attempted = true;

        try marketplace.buyPrimaryTicket{value: attackPrice}(targetTicket) {
            blocked = false;
        } catch {
            blocked = true;
        }
    }
}
