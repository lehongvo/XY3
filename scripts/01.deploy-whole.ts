import assert from "assert";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { getAddresses, writeAddresses } from "../utils/addressManager";
import { formatEther } from "ethers/lib/utils";

async function main() {
  console.log(
    `============================Start deploy whole contract=============================`
  );

  const signers: SignerWithAddress[] = await ethers.getSigners();
  const adminAddress = await signers[0].getAddress();
  console.log(`Deploy from address ${adminAddress}`);
  const contractAdminBalanceBeforeDeploy = await signers[0].getBalance();
  console.log(
    `Contract admin balance: ${formatEther(
      contractAdminBalanceBeforeDeploy
    )} ETH\n`
  );

  /*============================================================================*/
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdminContract = await ProxyAdmin.deploy();
  await proxyAdminContract.deployed();
  console.log(`ProxyAdmin contract address: ${proxyAdminContract.address}\n`);

  /*============================================================================*/
  const Animal = await ethers.getContractFactory("Animal");
  let animal = await Animal.deploy();
  await animal.deployed();
  console.log(`Animal contract address: ${animal.address}\n`);

  const Anime = await ethers.getContractFactory("Anime");
  let anime = await Anime.deploy();
  await anime.deployed();
  console.log(`Anime contract address: ${anime.address}\n`);

  /*============================================================================*/
  const nameBorrowerNode = process.env.NAME_BORROWER_NODE!;
  const symbolBorrowerNode = process.env.SYMBOL_BORROWER_NODE!;
  const nameLenderNode = process.env.NAME_LENDER_NODE!;
  const symbolLenderNode = process.env.SYMBOL_LENDER_NODE!;
  const baseUrl = process.env.BASE_URL!;

  /*============================================================================*/
  const Xy3Nft = await ethers.getContractFactory("Xy3Nft");
  const borrowNodeAddressContract = await Xy3Nft.deploy(
    adminAddress,
    nameBorrowerNode,
    symbolBorrowerNode,
    baseUrl
  );
  await borrowNodeAddressContract.deployed();
  console.log(
    `BorrowNode address contract: ${borrowNodeAddressContract.address}`
  );
  const lenderNodeAddressContract = await Xy3Nft.deploy(
    adminAddress,
    nameLenderNode,
    symbolLenderNode,
    baseUrl
  );
  console.log(
    `LenderNode address contract: ${lenderNodeAddressContract.address}\n`
  );

  /*============================================================================*/
  const Delegate = await ethers.getContractFactory("Delegate");
  const delegate = await Delegate.deploy(adminAddress);
  await delegate.deployed();
  console.log(`Delegate address contract: ${delegate.address}\n`);

  /*============================================================================*/
  const ServiceFee = await ethers.getContractFactory("ServiceFee");
  const serviceFee = await ServiceFee.deploy(adminAddress);
  await serviceFee.deployed();
  console.log(`ServiceFee address contract: ${serviceFee.address}\n`);

  /*============================================================================*/
  const AddressProvider = await ethers.getContractFactory("AddressProvider");
  const addressProvider = await AddressProvider.deploy(adminAddress);
  await addressProvider.deployed();
  console.log(`AddressProvider contract address: ${addressProvider.address}`);

  const idBorrowNode = await addressProvider.ADDR_BORROWER_NOTE();
  const idLenderNode = await addressProvider.ADDR_LENDER_NOTE();
  const idTransferDelegate = await addressProvider.ADDR_TRANSFER_DELEGATE();
  const idServiceFee = await addressProvider.ADDR_SERVICE_FEE();

  const txSetBorrowerId = await addressProvider.setAddress(
    idBorrowNode,
    borrowNodeAddressContract.address
  );
  await txSetBorrowerId.wait();
  console.log(`Transaction set borrower id address: ${txSetBorrowerId.hash}`);

  const txSetLenderId = await addressProvider.setAddress(
    idLenderNode,
    lenderNodeAddressContract.address
  );
  await txSetLenderId.wait();
  console.log(`Transaction set lender id address: ${txSetLenderId.hash}`);

  const txSetTransferDelegated = await addressProvider.setAddress(
    idTransferDelegate,
    delegate.address
  );
  await txSetTransferDelegated.wait();
  console.log(
    `Transaction set transfer delegate id address: ${txSetTransferDelegated.hash}`
  );

  const txSetServiceFee = await addressProvider.setAddress(
    idServiceFee,
    serviceFee.address
  );
  await txSetServiceFee.wait();
  console.log(
    `Transaction set service fee id address: ${txSetServiceFee.hash}\n`
  );

  /*============================================================================*/

  const SigningUtils = await ethers.getContractFactory("SigningUtils");
  const signingUtilsContract = await SigningUtils.deploy();
  await signingUtilsContract.deployed();
  console.log(
    `Signature utils contract address: ${signingUtilsContract.address}\n`
  );

  /*============================================================================*/
  const XY3 = await ethers.getContractFactory("XY3", {
    libraries: {
      SigningUtils: signingUtilsContract.address,
    },
  });
  const xy3LogicContract = await XY3.deploy();
  await xy3LogicContract.deployed();
  console.log(`XY3 logic smart contract: ${xy3LogicContract.address}`);

  /*============================================================================*/
  const XY3Proxy = await ethers.getContractFactory("XY3Proxy");
  const xy3Proxy = await XY3Proxy.deploy(
    xy3LogicContract.address,
    proxyAdminContract.address,
    []
  );
  await xy3Proxy.deployed();
  console.log(`XY3 proxy smart contract: ${xy3Proxy.address}`);

  const xy3ProxyContract = await ethers.getContractAt("XY3", xy3Proxy.address);
  const initializeTx = await xy3ProxyContract.initialize(
    adminAddress,
    addressProvider.address
  );
  await initializeTx.wait();
  console.log(`Transaction initialize: ${initializeTx.hash}`);

  const setERC20PermitsTx = await xy3ProxyContract.setERC20Permits(
    [animal.address],
    [true]
  );
  await setERC20PermitsTx.wait();
  console.log(`Transaction setERC20Permits: ${initializeTx.hash}`);

  const setERC721PermitsTx = await xy3ProxyContract.setERC721Permits(
    [anime.address],
    [true]
  );
  await setERC721PermitsTx.wait();
  console.log(`Transaction setERC721Permits: ${initializeTx.hash}`);

  /*============================================================================*/
  const contractAdminBalanceAfterDeploy = await signers[0].getBalance();
  console.log(
    `Contract Owner Balance: ${formatEther(
      contractAdminBalanceAfterDeploy
    )} ETH`
  );
  console.log(
    `Deployed Gas Fee: ${formatEther(
      contractAdminBalanceBeforeDeploy.sub(contractAdminBalanceAfterDeploy)
    )} ETH`
  );

  /*============================================================================*/
  writeAddresses(ethers.provider.network.chainId, {
    DEPLOYED_PROXY_ADMIN_CONTRACT_ADDRESS: proxyAdminContract.address,
    DEPLOYED_ANIMAL_TOKEN_ERC20: animal.address,
    DEPLOYED_ANIME_TOKEN_ERC20: anime.address,
    DEPLOYED_BORROWER_NODE_CONTRACT_ADDRESS: borrowNodeAddressContract.address,
    DEPLOYED_LENDER_NODE_CONTRACT_ADDRESS: lenderNodeAddressContract.address,
    DEPLOYED_DELEGATE_CONTRACT_ADDRESS: delegate.address,
    DEPLOYED_SERVICE_FEE_CONTRACT_ADDRESS: serviceFee.address,
    DEPLOYED_PROVIDER_CONTRACT_ADDRESS: addressProvider.address,
    DEPLOYED_SIGNATURE_UTILS_CONTRACT_ADDRESS: signingUtilsContract.address,
    DEPLOYED_XY3_LOGIC_CONTRACT_ADDRESS: xy3LogicContract.address,
    DEPLOYED_XY3_PROXY_LOGIC_CONTRACT_ADDRESS: xy3Proxy.address,
  });
  /*============================================================================*/
  console.log(
    `============================💕💕💓💓Finish deploy whole contract💕💕💓💓=============================`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
