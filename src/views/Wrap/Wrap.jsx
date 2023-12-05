import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  spacing,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import "../Stake/stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import "./wrap.scss";
import { Trans } from "@lingui/macro";
import wrapImg from "./wrap_img.png";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Wrap() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const sHECPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const wsHECPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const sHecBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsHecBalance = useSelector(state => {
    return state.account.balances && state.account.balances.busd;
  });
  const wrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.hecWrap;
  });
  const unwrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.hecUnwrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  // useEffect(() => {
  //   console.log(wrapAllowance);
  // }, [wrapAllowance]);
  const setMax = () => {
    if (view === 0) {
      setQuantity(sHecBalance);
    } else {
      setQuantity(wsHecBalance);
    }
  };

  const onSeekApproval = async token => {
    console.log(`🚀 - Wrap - address, token, provider, networkID: chainID `, address);
    console.log(`🚀 - Wrap - address, token, provider, networkID: chainID `, token);
    console.log(`🚀 - Wrap - address, token, provider, networkID: chainID `, provider);
    console.log(`🚀 - Wrap - address, token, provider, networkID: chainID `, chainID);
    dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeWrap = async action => {
    console.log(`🚀 - WRAP 1212 - action`, action);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || Number(quantity) === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    if (
      action === "wrap" &&
      ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(sHecBalance, "gwei"))
    ) {
      return dispatch(error("You cannot wrap more than your sFTMDAO balance."));
    }
    console.log(
      "WRAP 1212",
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wsHecBalance, "ether")),
    );
    if (
      action === "unwrap" &&
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wsHecBalance, "ether"))
    ) {
      return dispatch(error("You cannot unwrap more than your rFTMDAO balance."));
    }

    await dispatch(changeWrap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "sMUSH") return wrapAllowance > 0;
      if (token === "wsMUSH") return wrapAllowance > 0;
      return 0;
    },
    [wrapAllowance, unwrapAllowance],
  );

  const isAllowanceDataLoading = (wrapAllowance == null && view === 0) || (unwrapAllowance == null && view === 1);

  const isUnwrap = view === 1;
  console.log(`🚀 - Wrap - `, isUnwrap, quantity, sHECPrice, wsHECPrice);
  const convertedQuantity = isUnwrap ? (quantity * wsHECPrice) / sHECPrice : (quantity * sHECPrice) / wsHECPrice;
  console.log(`🚀 - Wrap - (quantity * sHECPrice) / wsHECPrice`, (quantity * sHECPrice) / wsHECPrice);
  console.log(`🚀 - Wrap - convertedQuantity`, convertedQuantity);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };
  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Box display="flex" width="100%" justifyContent="center">
          <Paper className={`ohm-card`}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12} sm={12} className="card-header page-header">
                <Typography variant="h3" gutterBottom>
                  Wrap / Unwrap
                </Typography>
                <div className="wrap-index">
                  <Typography variant="body1" component="p" gutterBottom>
                    'Wrap' allows you to swap staked $sFTMDAO to $rFTMDAO.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    This way, the value of your tokens increases instead of the quantity, which makes the income you
                    receive from $rFTMDAO a capital gain rather than an income.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    This is especially useful in countries where capital gains tax is lower than income tax, which is in
                    many cases. The returns from $sFTMDAO and $rFTMDAO are practically identical.
                  </Typography>
                </div>
                {/* <Link
                  className="migrate-sHEC-button"
                  style={{ textDecoration: "none" }}
                  href="https://docs.olympusdao.finance/main/contracts/tokens#wsHEC"
                  aria-label="wsHec-wut"
                  target="_blank"
                > */}
                {/* <Typography>rFTMDAO</Typography> */}
                {/* <SvgIcon component={InfoIcon} color="primary" /> */}
                {/* </Link> */}
              </Grid>

              <Grid item>
                <div className="stake-top-metrics">
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-sHEC">
                        <Typography variant="body1" component="p">
                          sFTMDAO Price
                        </Typography>
                        <Typography variant="h4">
                          {sHECPrice ? formatCurrency(sHECPrice, 2) : <Skeleton width="150px" />}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-index">
                        <Typography variant="body1" component="p">
                          Current Index
                        </Typography>
                        <Typography variant="h4">
                          {currentIndex ? <>{trim(currentIndex, 2)} FTMDAO</> : <Skeleton width="150px" />}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-wsHEC">
                        <Typography variant="body1" component="p">
                          rFTMDAO Price
                          <InfoTooltip
                            message={
                              "wsHEC = sHEC * index\n\nThe price of wsHEC is equal to the price of HEC multiplied by the current index"
                            }
                          />
                        </Typography>
                        <Typography variant="h4">
                          {wsHECPrice ? formatCurrency(wsHECPrice, 2) : <Skeleton width="150px" />}
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
                    <Typography variant="h6">Connect your wallet to wrap sFTMDAO</Typography>
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
                      >
                        <Tab label="Wrap" {...a11yProps(0)} />
                        <Tab label="Unwrap" {...a11yProps(1)} />
                      </Tabs>
                      <Box
                        className="stake-action-row "
                        display="flex"
                        alignItems="center"
                        style={{ paddingBottom: 0 }}
                      >
                        {address && !isAllowanceDataLoading ? (
                          !hasAllowance("sMUSH") && view === 0 ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note">
                                {view === 0 && (
                                  <>
                                    <Trans>First time wrapping</Trans> <b>FTMDAO</b>?
                                    <br />
                                    <Trans>Please approve FTMDAO to use your</Trans> <b>FTMDAO</b>{" "}
                                    <Trans>for wrapping.</Trans>
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <FormControl className="HEC-input" variant="outlined" color="primary">
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
                          {address && hasAllowance("sMUSH") ? (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "wrapping")}
                              onClick={() => {
                                onChangeWrap("wrap");
                              }}
                            >
                              {txnButtonText(pendingTransactions, "wrapping", "Wrap sFTMDAO")}
                            </Button>
                          ) : (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
                              onClick={() => {
                                onSeekApproval("sMUSH");
                              }}
                            >
                              {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
                            </Button>
                          )}
                        </TabPanel>

                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unwrapping")}
                            onClick={() => {
                              onChangeWrap("unwrap");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unwrapping", "Unwrap sFTMDAO")}
                          </Button>
                        </TabPanel>
                      </Box>

                      {quantity && (
                        <Box padding={1}>
                          <Typography variant="body2" className={classes.textHighlight}>
                            {isUnwrap
                              ? `Unwrapping ${quantity} rFTMDAO will result in ${trim(convertedQuantity, 4)} sFTMDAO`
                              : `Wrapping ${quantity} sFTMDAO will result in ${trim(convertedQuantity, 4)} rFTMDAO`}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <div className={`stake-user-data`}>
                      <div className="data-row">
                        <Typography variant="body1">Wrappable Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(sHecBalance, 4)} sFTMDAO</>}
                        </Typography>
                      </div>
                      <div className="data-row">
                        <Typography variant="body1">Unwrappable Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsHecBalance, 4)} rFTMDAO</>}
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          </Paper>
        </Box>
      </Zoom>
      <img className="stake-img" src={wrapImg} alt="" />
    </div>
  );
}

export default Wrap;
