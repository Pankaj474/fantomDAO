import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, WsOHM } from "src/typechain";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, wrapAllowance: BigNumber, unwrapAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "sohm") {
    applicableAllowance = wrapAllowance;
  } else if (token === "wsohm") {
    applicableAllowance = unwrapAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const smushContract = new ethers.Contract(
      addresses[networkID].SMUSH_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    const wsmushContract = new ethers.Contract(
      addresses[networkID].WSMUSH_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    let approveTx;
    let wrapAllowance = await smushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);
    let wrapAllowance1 = await smushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);
    let unwrapAllowance = await wsmushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);
    let unwrapAllowance1 = await wsmushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);

    console.log(
      `🚀 - alreadyApprovedToken(token, wrapAllowance, unwrapAllowance)`,
      alreadyApprovedToken(token, wrapAllowance, unwrapAllowance),
    );
    // return early if approval has already happened
    if (alreadyApprovedToken(token, wrapAllowance, unwrapAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          wrapping: {
            ohmWrap: +wrapAllowance,
            ohmUnwrap: +unwrapAllowance,
            ///
            hecWrap: +wrapAllowance1,
            hecUnwrap: +unwrapAllowance1,
          },
        }),
      );
    }

    try {
      if (token === "sMUSH") {
        // won't run if wrapAllowance > 0
        approveTx = await smushContract.approve(
          addresses[networkID].WSMUSH_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "wsMUSH") {
        approveTx = await wsmushContract.approve(
          addresses[networkID].SMUSH_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
        console.log(`🚀 - approveTx`, approveTx);
      }

      const text = "Approve " + (token === "sMUSH" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "sMUSH" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    wrapAllowance = await smushContract.allowance(address, addresses[networkID].SMUSH_ADDRESS);
    unwrapAllowance = await wsmushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);
    wrapAllowance1 = await smushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);
    unwrapAllowance1 = await wsmushContract.allowance(address, addresses[networkID].WSMUSH_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          ohmWrap: +wrapAllowance,
          ohmUnwrap: +unwrapAllowance,
          //
          hecWrap: +wrapAllowance1,
          hecUnwrap: +unwrapAllowance1,
        },
      }),
    );
  },
);

export const changeWrap = createAsyncThunk(
  "wrap/changeWrap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const wsmushContract = new ethers.Contract(addresses[networkID].WSMUSH_ADDRESS as string, wsOHM, signer) as WsOHM;
    console.log(`🚀 - value`, value);
    try {
      console.log("🚀 - value" + "DONE");
      console.log(`🚀 - value`, ethers.utils.parseUnits(value, 18));
    } catch (e) {
      console.log("🚀 - value" + e);
    }
    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "wrap") {
        uaData.type = "wrap";
        wrapTx = await wsmushContract.wrap(ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unwrap";
        wrapTx = await wsmushContract.unwrap(ethers.utils.parseUnits(value, 18));
      }
      const pendingTxnType = action === "wrap" ? "wrapping" : "unwrapping";
      uaData.txHash = wrapTx.hash;
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
      await wrapTx.wait();
    } catch (e: unknown) {
      console.log(`🚀 - value`, e);
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        // segmentUA(uaData);

        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
