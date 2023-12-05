import { ethers } from "ethers";
import { addresses } from "../constants";

import { setAll, getTokenPrice, getMarketPrice, validateETHAddress } from "../helpers";
import { createSlice, createSelector, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { mush_busd } from "../helpers/AllBonds";
import multicall from "../helpers/multicall";
import { abi as loadAppDetailsABI } from "../abi/custom/loadAppDetails.json";

const getReferralFromStorage = () => {
  const _value = window.localStorage.getItem("referral") || "";
  if (_value) {
    return _value;
  }
  //
  window.localStorage.removeItem("referral");
  return "";
};
const getMyReferralFromStorage = () => {
  const _value = window.localStorage.getItem("my_referral") || "";
  if (_value) {
    return _value;
  }
  //
  window.localStorage.removeItem("my_referral");
  return "";
};

const initialState = {
  loading: false,
  loadingMarketPrice: false,
  referral: getReferralFromStorage(),
  myReferral: getMyReferralFromStorage(),
};
const circulatingSupply = {
  inputs: [],
  name: "circulatingSupply",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};

/**
 * STAKING Page : Value APY , Total Value Deposited , Current Index
 */
export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const calls = [
      { address: addresses[networkID].MUSH_ADDRESS, name: "balanceOf", params: [addresses[networkID].STAKING_ADDRESS] },
      { address: addresses[networkID].SMUSH_ADDRESS, name: "circulatingSupply", params: [] },
      //TODO : Change the method name when changing the contract name
      { address: addresses[networkID].CIRCULATING_SUPPLY_ADDRESS, name: "XYZCirculatingSupply", params: [] },
      { address: addresses[networkID].MUSH_ADDRESS, name: "totalSupply", params: [] },
      { address: addresses[networkID].STAKING_ADDRESS, name: "epoch", params: [] },
      { address: mush_busd.networkAddrs[networkID].reserveAddress, name: "totalSupply", params: [] },
      {
        address: mush_busd.networkAddrs[networkID].reserveAddress,
        name: "balanceOf",
        params: [addresses[networkID].TREASURY_ADDRESS],
      },
      { address: addresses[networkID].STAKING_ADDRESS, name: "index", params: [] },
    ];

    let rawAppDetails;
    try {
      rawAppDetails = await multicall(networkID, provider, loadAppDetailsABI, calls);
      console.log(`🚀 - rawAppDetails111`, provider);
      /*const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, loadAppDetailsABI, provider);
      console.log(`🚀 - stakingContract`, stakingContract);
      const epoch = await stakingContract.epoch();
      console.log(`🚀 - stakingContract eproch`, epoch);
      const stakingReward = epoch.distribute;
      console.log(`🚀 - stakingContract 1111`, stakingReward);*/
      // const sHecMainContract = new ethers.Contract(addresses[networkID].SMUSH_ADDRESS, loadAppDetailsABI, provider);
      // console.log(`🚀 - rawAppDetails111`, sHecMainContract);
      // let res = await sHecMainContract.balanceOf(addresses[networkID].STAKING_ADDRESS);

      console.log(`🚀 - rawAppDetails111`, rawAppDetails);
      // const [one, two, ...lastArr] = rawAppDetails;
      // rawAppDetails = [one, two, one, ...lastArr];
      // console.log(`🚀 - rawAppDetails`, rawAppDetails);

      // rawAppDetails = rawAppDetails.splice(2, 0, rawAppDetails[1]);
    } catch (err) {
      console.log(`🚀 - rawAppDetails111`, err);
    }

    // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
    // const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult.marketPrice;
      console.log(`🚀 - marketPrice`, originalPromiseResult);
      // marketPrice = 0x01ba60d33800;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    const mushBalance = rawAppDetails[0][0];
    const sMushCirc = rawAppDetails[1][0] / 1e9;
    const circ = rawAppDetails[2][0];
    const total = rawAppDetails[3][0];
    const epoch = rawAppDetails[4];
    const total_lp = rawAppDetails[5][0];
    const mushBUSDBalance = rawAppDetails[6][0];

    const stakingTVL = (mushBalance * marketPrice) / 1e9;
    const circSupply = circ / 1e9;
    const totalSupply = total / 1e9;
    const marketCap = marketPrice * circSupply;
    const pol = mushBUSDBalance.mul(100).div(total_lp).toNumber() / 100;
    // const treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);
    const stakingRatio = sMushCirc / circSupply;

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        stakingRatio,
        pol,
        // treasuryMarketValue,
      };
    }

    let currentBlock;
    try {
      currentBlock = await provider.getBlockNumber();
    } catch (error) {
      console.log(error);
    }

    console.log(`🚀 - epoch.distribute`, epoch);
    // Calculating staking
    // const stakingReward = epoch.distribute / circ;
    // const stakingRebase = Number(stakingReward.toString()) / Number(sMushCirc.toString());
    const stakingReward = epoch.distribute;
    console.log(`🚀 - staking`, { stakingReward, sMushCirc: sMushCirc * 1e9 });
    const stakingRebase = stakingReward / (sMushCirc * 1e9);
    console.log(`🚀 - staking`, stakingRebase);
    const endBlock = epoch.endBlock;

    console.log(`🚀 - stakingRebase`, stakingRebase);
    //*    1 + 18 ^ 15 - 1
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    console.log(`🚀 - fiveDayRate`, fiveDayRate);
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    console.log(`🚀 - fiveDayRate`, stakingAPY);

    console.log("Jay Tets :: stakingReward ", stakingReward);
    console.log("Jay Test :: " + stakingReward.toString() + " 1 =  " + sMushCirc.toString());

    // Current index
    // const currentIndex = await stakingContract.index();
    console.log(`🚀 - rawAppDetails[7][0]`, rawAppDetails[7][0]);
    const currentIndex = rawAppDetails[7][0];

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      stakingRatio,
      pol,
      endBlock,
      // treasuryMarketValue,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        console.log(`🚀 - networkID`, networkID, provider);
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        console.log(`🚀 - originalPromiseResult`, originalPromiseResult);
        marketPrice = originalPromiseResult?.marketPrice;
        console.log(`🚀 - marketPrice`, marketPrice);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the MUSH price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from mush-busd contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice / Math.pow(10, 9);
  } catch (e) {
    console.log(`🚀 - loadMarketPrice - e`, e);
    marketPrice = await getTokenPrice("mush");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly stakingRatio?: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
  readonly pol?: number;
  // readonly treasuryMarketValue?: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
    setReferral(state, action: PayloadAction<string>) {
      if (action.payload) {
        state.referral = action.payload;
        window.localStorage.setItem("referral", state.referral);
      }
    },
    setMyReferral(state, action: PayloadAction<string>) {
      if (action.payload) {
        state.myReferral = action.payload;
        window.localStorage.setItem("my_referral", state.myReferral);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess, setReferral, setMyReferral } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
