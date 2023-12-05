import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import "./calculator.scss";
import { useWeb3Context } from "../../hooks";
import store from "src/store";
import { Grid, InputAdornment, TextField, Slider, Paper, Box, Typography, Fade } from "@material-ui/core";
import { Textfit } from "react-textfit";

import caculatorImg from "../../assets/images/calculator-img.png";

import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { Trans } from "@lingui/macro";

function Calculator() {
  const isAppLoading = useSelector(state => state.app.loading);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const sMUSHBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const trimmedsMUSHBalance = trim(Number(sMUSHBalance), 4);
  const trimeMarketPrice = trim(marketPrice, 2);

  const [sMushAmount, setsMushAmount] = useState(trimmedsMUSHBalance);
  const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
  const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
  const [futureMarketPrice, setFutureMarketPrice] = useState(trimeMarketPrice);
  const [days, setDays] = useState(30);

  const [rewardsEstimation, setRewardsEstimation] = useState("0");
  const [potentialReturn, setPotentialReturn] = useState("0");

  const calcInitialInvestment = () => {
    const sMUSH = Number(sMushAmount) || 0;
    const price = parseFloat(priceAtPurchase) || 0;
    const amount = sMUSH * price;
    return trim(amount, 2);
  };

  const calcCurrentWealth = () => {
    const sMUSH = Number(sMushAmount) || 0;
    const price = parseFloat(trimeMarketPrice);
    const amount = sMUSH * price;
    return trim(amount, 2);
  };

  const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

  useEffect(() => {
    const newInitialInvestment = calcInitialInvestment();
    setInitialInvestment(newInitialInvestment);
  }, [sMushAmount, priceAtPurchase]);

  const calcNewBalance = () => {
    let value = parseFloat(rewardYield) / 100;
    value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
    let balance = Number(sMushAmount);
    for (let i = 0; i < days * 3; i++) {
      balance += balance * value;
    }
    return balance;
  };

  useEffect(() => {
    const newBalance = calcNewBalance();
    setRewardsEstimation(trim(newBalance, 6));
    const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
    setPotentialReturn(trim(newPotentialReturn, 2));
  }, [days, rewardYield, futureMarketPrice, sMushAmount]);

  return (
    <div className="calculator-view">
      <Paper className="hec-card ohm-card calculator-card">
        <Box className="card-header  page-header calculator-card-header">
          <Typography variant="h3">Calculator</Typography>
          <Typography variant="body2" color="#000">
            Estimate your returns
          </Typography>
        </Box>
        <Grid className="calculator-card-grid" container direction="column" spacing={2}>
          <Grid item></Grid>
          <Grid item>
            <Box className="calculator-card-metrics">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={3}>
                  <Box className="calculator-card-apy">
                    <Typography variant="body1" component="p">
                      <Trans>Current FTMDAO Price</Trans>
                    </Typography>
                    <Typography variant="h3">
                      {isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Box className="calculator-card-tvl">
                    <Typography variant="body1" component="p">
                      <Trans>Current APY </Trans>
                    </Typography>

                    <Typography variant="h3">
                      {isAppLoading ? (
                        <Skeleton width="100px" />
                      ) : (
                        <Textfit mode="single" max={22.6}>
                          {new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%
                        </Textfit>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={5}>
                  <Box className="calculator-card-index">
                    <Typography variant="body1" component="p">
                      <Trans> Your Balance</Trans>
                    </Typography>
                    <Typography variant="h3">
                      {isAppLoading ? <Skeleton width="100px" /> : <>{trimmedsMUSHBalance} FTMDAO</>}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Box className="calculator-card-area">
            <Grid container spacing={3}>
              <Grid item xs={12} sm="12" style={{ flex: 1 }}>
                <Box className="calculator-card-action-area" display="flex">
                  <Grid container spacing={3}>
                    <Grid item lg={6} xs={12}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <TextField
                          id="sMUSH-Amount"
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={sMushAmount}
                          onChange={e => setsMushAmount(e.target.value)}
                          variant="outlined"
                          label="sFTMDAO Amount"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <div
                                  onClick={() => setsMushAmount(trimmedsMUSHBalance)}
                                  className="stake-card-action-input-btn"
                                >
                                  <Typography>Max</Typography>
                                </div>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <TextField
                          id="APY"
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={rewardYield}
                          onChange={e => setRewardYield(e.target.value)}
                          label="APY (%)"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <div
                                  onClick={() => setRewardYield(trimmedStakingAPY)}
                                  className="stake-card-action-input-btn"
                                >
                                  <Typography>Current</Typography>
                                </div>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <TextField
                          id="MUSH_price_at_purchase"
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={priceAtPurchase}
                          onChange={e => setPriceAtPurchase(e.target.value)}
                          variant="outlined"
                          label="FTMDAO Purchase Price ($)"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <div
                                  onClick={() => setPriceAtPurchase(trimeMarketPrice)}
                                  className="stake-card-action-input-btn"
                                >
                                  <Typography>Current</Typography>
                                </div>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <TextField
                          id="Future_MUSH_market_price"
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={futureMarketPrice}
                          onChange={e => setFutureMarketPrice(e.target.value)}
                          variant="outlined"
                          label="Future FTMDAO Market Price ($)"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <div
                                  onClick={() => setFutureMarketPrice(trimeMarketPrice)}
                                  className="stake-card-action-input-btn"
                                >
                                  <Typography>Current</Typography>
                                </div>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs="12">
                <Fade mountOnEnter unmountOnExit in={true} timeout={400} style={{ transformOrigin: "0 0 0" }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    className="calculator-days-slider-wrap"
                  >
                    <Typography variant="body2" color="textPrimary">{`${days} day${days > 1 ? "s" : ""}`}</Typography>
                    <Slider
                      className="calculator-days-slider"
                      orientation="horizontal"
                      min={1}
                      max={365}
                      value={days}
                      onChange={(e, newValue) => setDays(newValue)}
                    />
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} sm="12" style={{ flex: 1 }}>
                <Box>
                  <Grid container className="calculator-user-data">
                    <Grid item xs={12} className="data-row">
                      <Typography>Your initial investment</Typography>
                      <Typography variant="h5">
                        {isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment}</>}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className="data-row">
                      <Typography>Current wealth</Typography>
                      <Typography variant="h5">
                        {isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth()}</>}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className="data-row">
                      <Typography>FTMDAO rewards estimate</Typography>
                      <Typography variant="h5">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation} FTMDAO</>}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className="data-row">
                      <Typography>Potential future value</Typography>
                      <Typography variant="h5">
                        {isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={12} className="data-row">
                        <Typography>Potential number of Tesla Roadsters</Typography>
                        <Typography variant="h4">
                          {isAppLoading ? (
                            <Skeleton width="80px" />
                          ) : (
                            <>{Math.floor(Number(potentialReturn) / 220000)}</>
                          )}
                        </Typography>
                      </Grid> */}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Paper>
      <img className="caculator-img" src={caculatorImg} alt="" />
    </div>
  );
}

export default Calculator;
