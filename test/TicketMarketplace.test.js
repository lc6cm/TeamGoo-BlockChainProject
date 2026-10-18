
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketMarketplace", function () {
  let marketplace;
  let owner;
  let issuer;
  let operator;
  let buyer;
  let secondBuyer;
  let seller;

  const ticketId = 1n;
  const price = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, issuer, operator, buyer, secondBuyer, seller] =
      await ethers.getSigners();

    const TicketMarketplace = await ethers.getContractFactory(
      "TicketMarketplace"
    );

    marketplace = await TicketMarketplace.deploy();
    await marketplace.waitForDeployment();

    await marketplace.setIssuer(issuer.address, true);
    await marketplace.setOperator(operator.address, true);
  });

  it("sets the deployer as owner", async function () {
    expect(await marketplace.owner()).to.equal(owner.address);
  });

  it("allows an authorized issuer to mint a ticket", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);

    expect(await marketplace.ownerOf(ticketId)).to.equal(
      await marketplace.getAddress()
    );
    expect(await marketplace.totalTickets()).to.equal(1n);

    const ticket = await marketplace.tickets(ticketId);
    expect(ticket.issuer).to.equal(issuer.address);
    expect(ticket.primaryListed).to.equal(true);
  });

  it("rejects minting by an unauthorized issuer", async function () {
    await expect(
      marketplace.connect(buyer).mintTicket(ticketId, price)
    ).to.be.revertedWithCustomError(marketplace, "NotAuthorized");
  });

  it("rejects a ticket with a zero price", async function () {
    await expect(
      marketplace.connect(issuer).mintTicket(ticketId, 0)
    ).to.be.revertedWithCustomError(marketplace, "InvalidPrice");
  });

  it("rejects minting a duplicate ticket ID", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);

    await expect(
      marketplace.connect(issuer).mintTicket(ticketId, price)
    ).to.be.revertedWithCustomError(marketplace, "TicketUnavailable");
  });

  it("allows a buyer to purchase a primary ticket", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);

    await expect(
      marketplace.connect(buyer).buyPrimaryTicket(ticketId, { value: price })
    )
      .to.emit(marketplace, "PrimaryTicketSold")
      .withArgs(ticketId, buyer.address, price);

    expect(await marketplace.ownerOf(ticketId)).to.equal(buyer.address);
  });

  it("rejects an incorrect primary purchase payment", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);

    await expect(
      marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
        value: price - 1n
      })
    ).to.be.revertedWithCustomError(marketplace, "IncorrectPayment");
  });

  it("allows an owner to list a ticket for resale", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });

    const resalePrice = ethers.parseEther("2");

    await expect(
      marketplace.connect(buyer).listTicket(ticketId, resalePrice)
    )
      .to.emit(marketplace, "TicketListed")
      .withArgs(ticketId, buyer.address, resalePrice);

    expect(await marketplace.ownerOf(ticketId)).to.equal(
      await marketplace.getAddress()
    );

    const ticket = await marketplace.tickets(ticketId);
    expect(ticket.secondarySeller).to.equal(buyer.address);
    expect(ticket.secondaryPrice).to.equal(resalePrice);
  });

  it("rejects resale listing by someone who does not own the ticket", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });

    await expect(
      marketplace.connect(secondBuyer).listTicket(ticketId, price)
    ).to.be.revertedWithCustomError(marketplace, "NotTicketOwner");
  });

  it("allows a seller to cancel a resale listing", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });
    await marketplace.connect(buyer).listTicket(ticketId, price);

    await marketplace.connect(buyer).cancelListing(ticketId);

    expect(await marketplace.ownerOf(ticketId)).to.equal(buyer.address);

    const ticket = await marketplace.tickets(ticketId);
    expect(ticket.secondarySeller).to.equal(ethers.ZeroAddress);
  });

  it("allows a second buyer to purchase a resale ticket", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });

    const resalePrice = ethers.parseEther("2");
    await marketplace.connect(buyer).listTicket(ticketId, resalePrice);

    await expect(
      marketplace.connect(secondBuyer).buySecondaryTicket(ticketId, {
        value: resalePrice
      })
    )
      .to.emit(marketplace, "SecondaryTicketSold")
      .withArgs(ticketId, buyer.address, secondBuyer.address, resalePrice);

    expect(await marketplace.ownerOf(ticketId)).to.equal(secondBuyer.address);
  });

  it("allows an authorized operator to redeem a ticket", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });

    await expect(
      marketplace.connect(operator).redeemTicket(ticketId)
    )
      .to.emit(marketplace, "TicketRedeemed")
      .withArgs(ticketId, operator.address);

    const ticket = await marketplace.tickets(ticketId);
    expect(ticket.redeemed).to.equal(true);
  });

  it("rejects redemption by an unauthorized operator", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });

    await expect(
      marketplace.connect(buyer).redeemTicket(ticketId)
    ).to.be.revertedWithCustomError(marketplace, "NotAuthorized");
  });

  it("rejects redemption of a ticket that was already redeemed", async function () {
    await marketplace.connect(issuer).mintTicket(ticketId, price);
    await marketplace.connect(buyer).buyPrimaryTicket(ticketId, {
      value: price
    });
    await marketplace.connect(operator).redeemTicket(ticketId);

    await expect(
      marketplace.connect(operator).redeemTicket(ticketId)
    ).to.be.revertedWithCustomError(
      marketplace,
      "TicketAlreadyRedeemed"
    );
  });
});
