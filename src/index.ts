import { ethers } from "ethers";

const YOUR_RPC = "https://scroll.drpc.org";

// rToken ABI
const rTokenAbi = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "accrualBlockNumber",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "borrowBalanceStored",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
];

const oracleABI = [
  {
    type: "function",
    name: "getPrice",
    inputs: [
      {
        name: "rToken",
        type: "address",
        internalType: "contract RToken",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
];

const ORACLE = "0x3E1AbD0731c9397f92beC0fbA6918628013F7C6F";

const R_TOKEN_LIST = [
  { symbol: "rETH", address: "0x639355f34Ca9935E0004e30bD77b9cE2ADA0E692" },
  { symbol: "rSTONE", address: "0xAD3d07d431B85B525D81372802504Fa18DBd554c" },
  { symbol: "rUSDC", address: "0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5" },
  { symbol: "rUSDT", address: "0x855CEA8626Fa7b42c13e7A688b179bf61e6c1e81" },
  { symbol: "rwstETH", address: "0xe4FC4C444efFB5ECa80274c021f652980794Eae6" },
];

async function queryUserAccount(accountAddress: string) {
  const provider = new ethers.JsonRpcProvider(YOUR_RPC);

  for (const token of R_TOKEN_LIST) {
    const { symbol, address } = token;
    const cTokenContract = new ethers.Contract(address, rTokenAbi, provider);
    const oracleContract = new ethers.Contract(ORACLE, oracleABI, provider);

    try {
      const decimal = await cTokenContract.decimals();
      const balance = await cTokenContract.balanceOf(accountAddress);
      console.log(
        `${symbol} Supply Balance: ${ethers.formatUnits(balance, decimal)} Tokens`
      );

      const borrowBalance = await cTokenContract.borrowBalanceStored(
        accountAddress
      );
      console.log(
        `${symbol} Borrow Balance: ${ethers.formatUnits(
          borrowBalance,
          18
        )} Tokens`
      );

      const accrualBlockNumber = await cTokenContract.accrualBlockNumber();
      console.log(`${symbol} Accrual Block Number: ${accrualBlockNumber}`);

      const price = await oracleContract.getPrice(token);
      console.log(`${symbol} current price: ${price}`);
    } catch (error) {
      console.error(`User asset  not exist ${symbol} #${address}`);
    }
  }
}

queryUserAccount("0x001f368f599bedce0779d0ea1d4a1b2be13359b1").catch(
  (error) => {
    console.error("Error:", error);
  }
);
