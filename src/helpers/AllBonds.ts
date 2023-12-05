import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as MUSHBUSDImg } from "src/assets/tokens/BDAO-BUSD.svg";
import { ReactComponent as wBNBImg } from "src/assets/tokens/BNB.svg";
import { ReactComponent as BusdImg } from "src/assets/tokens/BUSD.svg";

import { abi as BondContractRefABI } from "src/abi/bonds/BondRefContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";

import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { BigNumberish } from "ethers";
import { abi as JENIFREXABI } from "src/abi/bonds/jenifrax.json";
import { abi as JENIDAIABI } from "src/abi/bonds/jenidai.json";
// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond

export const busd = new StableBond({
  name: "busd",
  displayName: "BUSD",
  bondToken: "BUSD",
  isRef: true,
  bondHelper: false,
  //to show bond in test net change testnet to true
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: BusdImg,
  bondContractABI: BondContractRefABI,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x21F6457BF1C18CBaEb5E92D9469696B20D37fB23", // DAI Bond address
      reserveAddress: "0xE507e671B2c205073ad49DcccB0822fA03849573",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDa631D1c78DacBCB11282939810B7E571FA0b89a", // DAI Bond address
      reserveAddress: "0xf18eF081334e0aA0e6A6945EAf233588B57a9aDB",
    },
  },
});

export const mush_busd = new StableBond({
  name: "ftmdao",
  displayName: "FTMDAO",
  bondToken: "FTMDAO",
  isRef: true,
  bondHelper: false,
  //to show bond in test net change testnet to true
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: BusdImg,
  bondContractABI: JENIDAIABI,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xBFdc38F89BbeC26A2FEE525699BCd58511672938", //frax bond sddress
      reserveAddress: "0xCa40d22b60F1999820C943d197e82ee5a55e8690",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xb73A0E4259a5F5F69d15381371f1c79Ca0fE1b3f", //frax bond sddress
      reserveAddress: "0xB38d9C77cAbC2E4CA5316A5BaE679f7310d47Cbb",
    },
  },
});

// new LPBond({
//   name: "mush_busd_lp",
//   displayName: "MUSH-BUSD LP",
//   bondToken: "BUSD",
//   isRef: true,
//   bondHelper: true,
//   //to show bond in test net change testnet to true
//   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
//   bondIconSvg: MUSHBUSDImg,
//   bondContractABI: BondContractRefABI,
//   reserveContract: ReserveOhmDaiContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0x6aaFc032B30137CD0b1120dc9D58b986C8bbB773",
//       reserveAddress: "0xbdf06Fae530004361fF6802d1C4DA21B7abFF27E",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0x8efc5841C0498670Fb087A358C9e3A5E6b9D9136",
//       reserveAddress: "0xB38d9C77cAbC2E4CA5316A5BaE679f7310d47Cbb",
//     },
//   },
//   lpUrl:
//     "https://pancakeswap.finance/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0xddC7aebCAd4d6d4b4d437A97faE76d4042e6a9Cc",
// });

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [busd, mush_busd];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
