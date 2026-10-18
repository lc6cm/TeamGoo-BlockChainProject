
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketMarketplace is ERC721, Ownable, ReentrancyGuard {
    struct Ticket {
        address issuer;
        uint256 primaryPrice;
        bool primaryListed;
        address secondarySeller;
        uint256 secondaryPrice;
        bool redeemed;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => bool) public authorizedIssuers;
    mapping(address => bool) public authorizedOperators;

    uint256 public totalTickets;

    error NotAuthorized();
    error InvalidAddress();
    error InvalidPrice();
    error TicketUnavailable();
    error TicketAlreadyRedeemed();
    error IncorrectPayment();
    error NotTicketOwner();
    error NotListed();
    error PayoutFailed();
    error CannotBuyOwnTicket();

    event IssuerAuthorizationChanged(address indexed issuer, bool authorized);
    event OperatorAuthorizationChanged(address indexed operator, bool authorized);
    event TicketMinted(uint256 indexed tokenId, address indexed issuer, uint256 price);
    event PrimaryTicketSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event TicketListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event TicketListingCancelled(uint256 indexed tokenId);
    event SecondaryTicketSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event TicketRedeemed(uint256 indexed tokenId, address indexed operator);

    constructor()
        ERC721("TeamGoo Ticket", "TGT")
        Ownable(msg.sender)
    {}

    modifier onlyIssuer() {
        if (!authorizedIssuers[msg.sender]) revert NotAuthorized();
        _;
    }

    modifier onlyOperator() {
        if (!authorizedOperators[msg.sender]) revert NotAuthorized();
        _;
    }

    function setIssuer(address issuer, bool authorized) external onlyOwner {
        if (issuer == address(0)) revert InvalidAddress();

        authorizedIssuers[issuer] = authorized;
        emit IssuerAuthorizationChanged(issuer, authorized);
    }

    function setOperator(address operator, bool authorized) external onlyOwner {
        if (operator == address(0)) revert InvalidAddress();

        authorizedOperators[operator] = authorized;
        emit OperatorAuthorizationChanged(operator, authorized);
    }

    function mintTicket(uint256 tokenId, uint256 price) external onlyIssuer {
        if (price == 0) revert InvalidPrice();
        if (_ownerOf(tokenId) != address(0)) revert TicketUnavailable();

        tickets[tokenId] = Ticket({
            issuer: msg.sender,
            primaryPrice: price,
            primaryListed: true,
            secondarySeller: address(0),
            secondaryPrice: 0,
            redeemed: false
        });

        totalTickets++;
        _mint(address(this), tokenId);

        emit TicketMinted(tokenId, msg.sender, price);
    }

    function buyPrimaryTicket(uint256 tokenId) external payable nonReentrant {
        Ticket storage ticket = tickets[tokenId];

        if (ownerOf(tokenId) != address(this) || !ticket.primaryListed) {
            revert TicketUnavailable();
        }
        if (ticket.redeemed) revert TicketAlreadyRedeemed();
        if (msg.value != ticket.primaryPrice) revert IncorrectPayment();

        uint256 price = ticket.primaryPrice;
        address issuer = ticket.issuer;

        ticket.primaryListed = false;
        _transfer(address(this), msg.sender, tokenId);

        (bool paid, ) = payable(issuer).call{value: price}("");
        if (!paid) revert PayoutFailed();

        emit PrimaryTicketSold(tokenId, msg.sender, price);
    }

    function listTicket(uint256 tokenId, uint256 price) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTicketOwner();

        Ticket storage ticket = tickets[tokenId];

        if (ticket.redeemed) revert TicketAlreadyRedeemed();
        if (price == 0) revert InvalidPrice();
        if (ticket.secondarySeller != address(0)) revert TicketUnavailable();

        ticket.secondarySeller = msg.sender;
        ticket.secondaryPrice = price;

        _transfer(msg.sender, address(this), tokenId);

        emit TicketListed(tokenId, msg.sender, price);
    }

    function cancelListing(uint256 tokenId) external {
        Ticket storage ticket = tickets[tokenId];

        if (ticket.secondarySeller != msg.sender) revert NotListed();

        ticket.secondarySeller = address(0);
        ticket.secondaryPrice = 0;

        _transfer(address(this), msg.sender, tokenId);

        emit TicketListingCancelled(tokenId);
    }

    function buySecondaryTicket(uint256 tokenId) external payable nonReentrant {
        Ticket storage ticket = tickets[tokenId];
        address seller = ticket.secondarySeller;

        if (seller == address(0) || ownerOf(tokenId) != address(this)) {
            revert NotListed();
        }
        if (ticket.redeemed) revert TicketAlreadyRedeemed();
        if (msg.sender == seller) revert CannotBuyOwnTicket();
        if (msg.value != ticket.secondaryPrice) revert IncorrectPayment();

        uint256 price = ticket.secondaryPrice;

        ticket.secondarySeller = address(0);
        ticket.secondaryPrice = 0;

        _transfer(address(this), msg.sender, tokenId);

        (bool paid, ) = payable(seller).call{value: price}("");
        if (!paid) revert PayoutFailed();

        emit SecondaryTicketSold(tokenId, seller, msg.sender, price);
    }

    function redeemTicket(uint256 tokenId) external onlyOperator {
        address ticketOwner = ownerOf(tokenId);
        Ticket storage ticket = tickets[tokenId];

        if (ticket.redeemed) revert TicketAlreadyRedeemed();
        if (ticketOwner == address(this)) revert TicketUnavailable();

        ticket.redeemed = true;

        emit TicketRedeemed(tokenId, msg.sender);
    }

    function ticketInfo(uint256 tokenId)
        external
        view
        returns (
            address ticketOwner,
            address issuer,
            uint256 primaryPrice,
            bool primaryListed,
            address secondarySeller,
            uint256 secondaryPrice,
            bool redeemed
        )
    {
        ticketOwner = ownerOf(tokenId);
        Ticket storage ticket = tickets[tokenId];

        return (
            ticketOwner,
            ticket.issuer,
            ticket.primaryPrice,
            ticket.primaryListed,
            ticket.secondarySeller,
            ticket.secondaryPrice,
            ticket.redeemed
        );
    }
}
