import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

/**--------METHODS AVAILABLE-------- */
// loadMetamaskProvider : This will be used to setup metamask and ethers provider and will be the first function to be executed
// getUserAddress : Return current user's address
// getUserBalance : Return  current user's balance
// convertToEther : Return wei amount converted to ether
// getNetworkInfo : Return an object which stores info about current blockchain network
// getBlockInfo : Return information about block whose blocknumber is passed as an argument
// loadContractInstance : Return an contract instance that can be used to interact with contracts

const loadMetamaskProvider = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    startApp(provider);
    //checking if metamask is connected
    if (provider.isMetaMask) {
      console.log("metamask is installed");
    } else {
      throw new Error("Metamask not installed");
    }
    //here I am checking if provider can make RPC requests to current chain using metamask
    if (provider.isConnected()) {
      console.log("Provider is able to send RPC requests to current chain");
    } else {
      throw new Error("Provider can't make RPC requests to current chain");
    }
    //Creating an ethers.js provider using provider provided by metmask and injecting it in windows object
    window.ethersProvider = new ethers.providers.Web3Provider(provider);
    //how to handle chainId changes
    provider.on("chainChanged", handleChainIdChange);
  } else {
    throw new Error("Please install metamask");
  }
};
//Check if provider API we got is the one from MetaMask or some other wallet
const startApp = (provider) => {
  if (provider !== window.ethereum) {
    throw new Error("May be you have multiple wallets installed");
  }
};
//Reload web app if Chain ID changes
const handleChainIdChange = () => {
  //here we will reload the whole page if chainID changes
  window.location.reload();
};
//Get users account balance
export const getUserBalance = async () => {
  try {
    const provider = window.ethersProvider;
    const balance = await provider.getBalance("ethers.eth");
    return balance;
  } catch (error) {
    throw new Error("Can't get user balance");
  }
};
//Convert Wei(As Big Number) into Ether format
export const convertToEther = (amount) => {
  return ethers.utils.formatEther(amount);
};
//Get blockchain network information
export const getNetworkInfo = async () => {
  try {
    const provider = window.ethersProvider;
    const networkInfo = await provider.getNetwork();
    return networkInfo;
  } catch (err) {
    throw new Error("Couldn't get network information");
  }
};
//Get block information
export const getBlockInfo = async (blockNumber) => {
  try {
    const provider = window.ethersProvider;
    const block = await provider.getBlock(blockNumber);
    return block;
  } catch (err) {
    throw new Error("Error while getting block information");
  }
};
// Create an contract instance
export const loadContractInstance = async (abi, address) => {
  try {
    let provider = window.ethersProvider;
    if (address === undefined) {
      throw new Error("Address Not defined");
    }
    let contract = new ethers.Contract(address, abi, provider.getSigner(0));
    await contract.deployed();
    return contract;
  } catch (error) {
    throw error;
  }
};
//get user address
export const getUserAddress = async () => {
  try {
    const provider = window.ethersProvider;
    const signer = provider.getSigner(0);
    const address = await signer.getAddress();
    return address;
  } catch (err) {
    console.log(err);
    throw new Error("Couldn't get user address");
  }
};

export default loadMetamaskProvider;
