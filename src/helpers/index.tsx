import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS, addresses } from "../constants";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { abi as PairContractABI } from "../abi/PairContract.json";
import { abi as RedeemHelperABI } from "../abi/RedeemHelper.json";

import { mush_busd } from "./AllBonds";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { PairContract, RedeemHelper } from "../typechain";

/**
 * !This following function is for getting the price of a TOKEN POOL,
 * The contract needs to be a LP contract with getReserves method to get the price.
 * ISSUE : Currently we don't have a LP contract and thus causing the crash.
 * TEMP SOLUTION : Replacing the price call with API to fetch token price.
 */
export async function getMarketPrice({ networkID, provider }: IBaseAsyncThunk) {
  /**
   * Uncomment the following lines and make sure that the token contract is of LPCoin

  const mush_busd_address = mush_busd.getAddressForReserve(networkID);
  console.log(`🚀 - getMarketPrice - mush_busd_address`, mush_busd_address);
  const pairContract = new ethers.Contract(mush_busd_address, PairContractABI, provider) as PairContract;
  console.log(`🚀 - getMarketPrice - pairContract`, pairContract);
  await pairContract
    .getReserves()
    .then(res => {
      console.log(`🚀 - getMarketPrice - res`, res);
    })
    .catch(err => {
      console.log(`🚀 - getMarketPrice - err`, err);
    });
  const reserves = await pairContract.getReserves();
  console.log(`🚀 - getMarketPrice - reserves`, reserves);

  const marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString());*/
  let resp;
  //mush
  let tokenId = "mushroom";
  // let tokenId = "01coin";
  try {
    resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    console.log(`🚀 - getMarketPrice - resp`, resp);
    //Currently the $ is converted into wei
    return resp.data[tokenId].usd * Math.pow(10, 9);
  } catch (e) {
    console.log("coingecko api error: ", e);
  }

  return 0;
}

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(tokenId = "mush") {
  let resp;
  try {
    resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return resp.data[tokenId].usd;
  } catch (e) {
    // console.log("coingecko api error: ", e);
  }
}

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(currentBlock: number, endBlock: number) {
  console.log(
    `🚀 - secondsUntilBlock - currentBlock 2`,
    currentBlock,
    endBlock,
    EPOCH_INTERVAL,
    parseInt(endBlock.toString()) - parseInt(currentBlock.toString()),
    " Mod = ",
    parseInt(currentBlock.toString()) % parseInt(EPOCH_INTERVAL.toString()),
    " After Mod = ",
    Math.abs(
      (parseInt(currentBlock.toString()) % parseInt(EPOCH_INTERVAL.toString())) - parseInt(EPOCH_INTERVAL.toString()),
    ),
  );
  // const blocksAway = endBlock - currentBlock;
  // console.log(`🚀 - secondsUntilBlock - endBlock - currentBlock`, endBlock, currentBlock);
  console.log(`🚀 - vestingPeriod - parseInt(EPOCH_INTERVAL.toString())`, parseInt(EPOCH_INTERVAL.toString()));
  // const blocksAway =
  //   parseInt(endBlock.toString()) + parseInt(EPOCH_INTERVAL.toString()) - parseInt(currentBlock.toString());
  const blocksAway = Math.abs(
    (parseInt(currentBlock.toString()) % parseInt(EPOCH_INTERVAL.toString())) - parseInt(EPOCH_INTERVAL.toString()),
  );
  console.log(`🚀 - vestingPeriod - blocksAway`, blocksAway);
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;
  return Math.abs(secondsAway);
}

export function getTimeFromBlockForBonds(currentBlock: number, endBlock: number) {
  const blocksAway = endBlock - currentBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;
  return Math.abs(secondsAway);
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = getTimeFromBlockForBonds(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts, LusdSlice.ts
export function setAll(state: any, properties: any) {
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
}

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: number;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(
    addresses[networkID].REDEEM_HELPER_ADDRESS as string,
    RedeemHelperABI,
    provider,
  ) as RedeemHelper;
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
};

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

/**
 * subtracts two dates for use in 33-together timer
 * param (Date) dateA is the ending date object
 * param (Date) dateB is the current date object
 * returns days, hours, minutes, seconds
 * NOTE: this func previously used parseInt() to convert to whole numbers, however, typescript doesn't like
 * ... using parseInt on number params. It only allows parseInt on string params. So we converted usage to
 * ... Math.trunc which accomplishes the same result as parseInt.
 */
export const subtractDates = (dateA: Date, dateB: Date) => {
  let msA: number = dateA.getTime();
  let msB: number = dateB.getTime();

  let diff: number = msA - msB;

  let days: number = 0;
  if (diff >= 86400000) {
    days = Math.trunc(diff / 86400000);
    diff -= days * 86400000;
  }

  let hours: number = 0;
  if (days || diff >= 3600000) {
    hours = Math.trunc(diff / 3600000);
    diff -= hours * 3600000;
  }

  let minutes: number = 0;
  if (hours || diff >= 60000) {
    minutes = Math.trunc(diff / 60000);
    diff -= minutes * 60000;
  }

  let seconds: number = 0;
  if (minutes || diff >= 1000) {
    seconds = Math.trunc(diff / 1000);
  }
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const validateETHAddress = (str: string) => {
  if (!str) return false;
  const referralValidate = new RegExp(/0x[a-fA-F0-9]{40}/g);
  return referralValidate.test(str);
};
