const ethers = require("ethers");
const munbai = "https://matic-mumbai.chainstacklabs.com";
const polygon = "https://polygon-rpc.com";
const goerli = "https://goerli.infura.io/v3/982727d220c946f8910109c11f31dbb0";
const astar = "https://evm.astar.network/";
const shibuya = "https://evm.shibuya.astar.network";
const sepolia = "https://sepolia.infura.io/v3/4a5279230bb442ada4c296b1992ec4c4";

const signature = {
  nonce: "12",
  expiry: "123145645656",
  signer: "0x4a6f4FFd8e7164235E5aA7Db2B8425D3E3a7a165",
  signature: "",
};

// ["12", "123145645656", "0x4a6f4FFd8e7164235E5aA7Db2B8425D3E3a7a165", "0x075ecde5c21683b8c77b94aae93a3133bba6cadef29382b42ba30d2cf3b55aef21f2e3cb1ca7ec2d8f7990c9b4463d63ae05d16cf7a92a19e81f457a88590a4d1c"]
// ["100000000", "110000000", "0x9a4fC25cca157321Ab05eAbb4f19b1eBeB2a0128", "1010", "0x53f544Da7Fa2F3146eF86097aFdd5B6B90CCBc1c", "123123", []]
const offer = {
  borrowAmount: "1000000000000000000",
  repayAmount: "1500000000000000000",
  nftAsset: "0x9a4fC25cca157321Ab05eAbb4f19b1eBeB2a0128",
  borrowDuration: "3000000",
  borrowAsset: "0x53f544Da7Fa2F3146eF86097aFdd5B6B90CCBc1c",
  timestamp: "123123",
  extra: [],
};

const privateKey =
  "f6ac3a901d2170e9fa165491ca443052e6d63d50460b497aa697ef9dca194075";

const nftId = "0";

const contractAddress = "0x4D6cF50c646F660Be7Dbf1473eB127f9dA300668";

const signPersonalMessageIsCollection = async (
  _offer: any,
  _nftId: string,
  _signature: any,
  _contractAddress: string,
  _privateKey: string,
  _network: string
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(_network);
    const chainID = await provider.getNetwork().then((data: any) => data.chainId);

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
    console.log("Signature", signature);
    console.log("==========================signPersonalMessageIsCollection=================================");
  } catch (error) {
    console.log(error);
  }
};

const signPersonalMessageIsNotCollection = async (
  _offer: any,
  _signature: any,
  _contractAddress: string,
  _privateKey: string,
  _network: string
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(_network);
    const chainID = await provider.getNetwork().then((data: any) => data.chainId);

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
    console.log("SigningMessage", signingMessage);
    let wallet = new ethers.Wallet(privateKey, provider);
    const signature = await wallet.signMessage(
      ethers.utils.arrayify(signingMessage)
    );
    console.log("Signature", signature);
    console.log("==========================signPersonalMessageIsNotCollection=================================");
  } catch (error) {
    console.log(error);
  }
};

signPersonalMessageIsCollection(
  offer,
  nftId,
  signature,
  contractAddress,
  privateKey,
  munbai
);

signPersonalMessageIsNotCollection(
  offer,
  signature,
  contractAddress,
  privateKey,
  munbai
);
