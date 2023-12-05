import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Slide,
  ThemeProvider,
} from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import { Textfit } from "react-textfit";
import Emojify from "react-emojione";

import { t, Trans } from "@lingui/macro";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";

import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

import stakeImg from "./stake_img.png";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const themeTransition = createTheme({
  transitions: {
    easing: {
      easeOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      sharp: "linear",
    },
  },
});

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    console.log(`🚀 - Stake - state.app.stakingAPY`, state.app.stakingAPY);
    return state.app.stakingAPY;
  });

  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    console.log(`🚀 - Stake - gweiValue`, gweiValue);
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your FTMDAO balance.`));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot unstake more than your sFTMDAO balance.`));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);
  console.log(`🚀 - Stake - isAllowanceDataLoading`, isAllowanceDataLoading);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  console.log(`🚀 - Stake - stakingAPY`, stakingAPY);
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  console.log(`🚀 - Stake - trimmedStakingAPY`, trimmedStakingAPY);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view">
      <Box display="flex" width="100%" justifyContent="center">
        <Paper className={`ohm-card`}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="card-header page-header">
              <Typography variant="h3">
                <Emojify>Single Stake (🧙,🧙)</Emojify>
              </Typography>
              <RebaseTimer />
            </Grid>
            <Grid item xs={12} sm={6} className="your-earnings">
              {/* <ThemeProvider theme={themeTransition}>
                <Slide
                  direction="left"
                  mountOnEnter
                  unmountOnExit
                  in={true}
                  timeout={400}
                  style={{ transformOrigin: "0 0 0" }}
                >
                  <Typography variant="body1">Your Earnings / Day</Typography>
                </Slide>
                <Slide
                  direction="left"
                  mountOnEnter
                  unmountOnExit
                  in={true}
                  timeout={600}
                  style={{
                    transformOrigin: "0 0 0",
                  }}
                >
                  <Typography variant="h3" color="textPrimary">
                    $0
                  </Typography>
                </Slide>
              </ThemeProvider> */}
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={2}>
            <Grid item></Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="body1" component="p">
                        <Trans>APY</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <span data-testid="apy-value">
                            <Textfit mode="single" max={22.6}>
                              {
                                //! Below is the code that trims out the stacking APY
                                /* {new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}% */
                              }
                              {
                                //! Below code shows staking APY without any trim
                                new Intl.NumberFormat("en-US").format(stakingAPY * 100)
                              }
                              %
                            </Textfit>
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="apy-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="body1" component="p">
                        <Trans>Total Value Deposited</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          <span data-testid="tvl-value">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            }).format(stakingTVL)}
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="tvl-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="body1" component="p">
                        <Trans>Current Index</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? (
                          <span data-testid="index-value">{trim(currentIndex, 1)} FTMDAO</span>
                        ) : (
                          <Skeleton width="150px" data-testid="index-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="body1" component="span">
                    <Trans>Connect your wallet to stake FTMDAO</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed && { style: { display: "none" } }}
                    >
                      <Tab
                        label={t({
                          id: "do_stake",
                          comment: "The action of staking (verb)",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>
                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" component="span" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  <Trans>First time staking</Trans> <b>FTMDAO</b>?
                                  <br />
                                  <Trans>Please approve sFTMDAO to use your</Trans> <b>FTMDAO</b>{" "}
                                  <Trans>for staking</Trans>.
                                </>
                              ) : (
                                <>
                                  <Trans>First time unstaking</Trans> <b>sFTMDAO</b>?
                                  <br />
                                  <Trans>Please approve FTMDAO to use your</Trans> <b>sFTMDAO</b>{" "}
                                  <Trans>for unstaking</Trans>.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="ohm-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit">
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("ohm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "staking")}
                            onClick={() => {
                              onChangeStake("stake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", t`Stake FTMDAO`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("ohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("sohm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", t`Unstake FTMDAO`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("sohm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography component="span" variant="body1">
                        <Trans>Unstaked Balance</Trans>
                      </Typography>
                      <Typography component="span" variant="body1" id="user-balance">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} FTMDAO</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography component="span" variant="body1">
                        <Trans>Staked Balance</Trans>
                      </Typography>
                      <Typography component="span" variant="body1" id="user-staked-balance">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{sohmBalance} sFTMDAO</>}
                      </Typography>
                    </div>

                    {/* <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography component="span" variant="body2" color="textSecondary">
                        <Trans>Single Staking</Trans>
                      </Typography>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(sohmBalance, 4)} sOHM</>}
                      </Typography>
                    </div> */}

                    {/* <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography component="span" variant="body2" color="textSecondary">
                        <Trans>Staked Balance in Fuse</Trans>
                      </Typography>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fsohmBalance, 4)} fsOHM</>}
                      </Typography>
                    </div>

                    <div className="data-row" style={{ paddingLeft: "10px" }}>
                      <Typography component="span" variant="body2" color="textSecondary">
                        <Trans>Wrapped Balance</Trans>
                      </Typography>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsohmBalance, 4)} wsOHM</>}
                      </Typography>
                    </div> */}

                    {/* <Divider color="secondary" /> */}

                    <div className="data-row">
                      <Typography component="span" variant="body1">
                        <Trans>Next Reward Amount</Trans>
                      </Typography>
                      <Typography component="span" variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sFTMDAO</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography component="span" variant="body1">
                        <Trans>Next Reward Yield</Trans>
                      </Typography>
                      <Typography component="span" variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography component="span" variant="body1">
                        <Trans>ROI (5-Day Rate)</Trans>
                      </Typography>
                      <Typography component="span" variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Box>
      <img className="stake-img" src={stakeImg} alt="" />
    </div>
  );
}

export default Stake;
