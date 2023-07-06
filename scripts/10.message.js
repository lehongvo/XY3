const ethers = require("ethers");
const munbai = "https://matic-mumbai.chainstacklabs.com";
const polygon = "https://polygon-rpc.com";
const goerli = "https://goerli.infura.io/v3/982727d220c946f8910109c11f31dbb0";
const astar = "https://evm.astar.network/";
const shibuya = "https://evm.shibuya.astar.network";
const sepolia = "https://sepolia.infura.io/v3/4a5279230bb442ada4c296b1992ec4c4";

// 0x4a6f4FFd8e7164235E5aA7Db2B8425D3E3a7a165
// 0x9b3f40286411b33774409392A4b9b5Df0Db9503a
// ["13", "123145645656", "0x9b3f40286411b33774409392A4b9b5Df0Db9503a", "0x6c8330dbdc12a1f303f0e1dbdff58bd42f00120d23e53a3981deb343a8ee246913959163fe56490ef5e05380dbd8d99809a920aeac04e5b2c282391d72fd54c21c"]
// ["13", "123145645656", "0x9b3f40286411b33774409392A4b9b5Df0Db9503a", "0x2f4e7c7c39ca420839392925a08f1c0f60a781d95aea8d4d3f6b3a3658399c9b71e2d4288e894e0461521f6ba3c96cec2dce130616113f82de50b176787ffaf31c"]
// ["1000000000000000000", "1500000000000000000", "0x6b75DB7549852Ffb5A17FFf61222124cFEBC55B3", "3456000", "0x7e4eE271E21A9abF20849F09713C32454425FB50", "123123", []]


["0x0000000000000000000000000000000000000000", "0x00000000", "0x", 0]
const extraData = {
  target: "0x0000000000000000000000000000000000000000",
  selector: "0x00000000",
  data: "0x",
  referral: "0"
}

const signature = {
  nonce: "13",
  expiry: "123145645656",
  signer: "0x9b3f40286411b33774409392A4b9b5Df0Db9503a",
  signature: "",
};

const offer = {
  borrowAmount: "1000000000000000000",
  repayAmount: "1500000000000000000",
  nftAsset: "0x6b75DB7549852Ffb5A17FFf61222124cFEBC55B3",
  borrowDuration: "3456000",
  borrowAsset: "0x7e4eE271E21A9abF20849F09713C32454425FB50",
  timestamp: "123123",
  extra: [],
};

const privateKey =
  "024a5ead8df0730ba4a1f5d1c5646f19af39b53045466b759f09f40ddf79d232";

const nftId = "15";

const contractAddress = "0xD5aF368841eE94ACCeF5322F3351ac792826dfF0";

const signPersonalMessageIsNotCollection = async (
  _offer,
  _nftId,
  _signature,
  _contractAddress,
  _privateKey,
  _network
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(_network);
    const chainID = await provider.getNetwork().then((data) => data.chainId);
    console.log("ChainID", Number(chainID));

    const hash = ethers.utils.solidityKeccak256(
      [
        "address",
        "uint256",
        "uint256",
        "address",
        "uint32",
        "uint256",
        "bytes",
        "uint256",
        "address",
        "uint256",
        "uint256",
        "address",
        "uint256",
      ],
      [
        _offer.borrowAsset,
        _offer.borrowAmount,
        _offer.repayAmount,
        _offer.nftAsset,
        _offer.borrowDuration,
        _offer.timestamp,
        _offer.extra,
        _nftId,
        _signature.signer,
        _signature.nonce,
        _signature.expiry,
        _contractAddress,
        chainID,
      ]
    );
    const sigHashBytes = ethers.utils.arrayify(hash);
    const signingMessage = ethers.utils.hexlify(sigHashBytes);
    console.log("SigningMessage", signingMessage);
    let wallet = new ethers.Wallet(privateKey, provider);
    const signature = await wallet.signMessage(
      ethers.utils.arrayify(signingMessage)
    );
    console.log("signPersonalMessageIsNotCollection", signature);
    console.log("==========================signPersonalMessageIsCollection=================================");
  } catch (error) {
    console.log(error);
  }
};

const signPersonalMessageIsCollection = async (
  _offer,
  _signature,
  _contractAddress,
  _privateKey,
  _network
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(_network);
    const chainID = await provider.getNetwork().then((data) => data.chainId);

    const hash = ethers.utils.solidityKeccak256(
      [
        "address",
        "uint256",
        "uint256",
        "address",
        "uint32",
        "uint256",
        "bytes",
        "address",
        "uint256",
        "uint256",
        "address",
        "uint256",
      ],
      [
        _offer.borrowAsset,
        _offer.borrowAmount,
        _offer.repayAmount,
        _offer.nftAsset,
        _offer.borrowDuration,
        _offer.timestamp,
        _offer.extra,
        _signature.signer,
        _signature.nonce,
        _signature.expiry,
        _contractAddress,
        chainID,
      ]
    );
    const sigHashBytes = ethers.utils.arrayify(hash);
    const signingMessage = ethers.utils.hexlify(sigHashBytes);
    let wallet = new ethers.Wallet(privateKey, provider);
    const signature = await wallet.signMessage(
      ethers.utils.arrayify(signingMessage)
    );
    console.log("signPersonalMessageIsCollection", signature);
  } catch (error) {
    console.log(error);
  }
};

signPersonalMessageIsNotCollection(
  offer,
  nftId,
  signature,
  contractAddress,
  privateKey,
  munbai
);

signPersonalMessageIsCollection(
  offer,
  signature,
  contractAddress,
  privateKey,
  munbai
);
