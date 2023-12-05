import { useSelector } from "react-redux";
import { useState } from "react";

import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
  Button,
  Link,
  Snackbar,
  IconButton,
} from "@material-ui/core";

import { NavLink } from "react-router-dom";

import { t, Trans } from "@lingui/macro";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency, shorten } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { useWeb3Context, useAddress } from "src/hooks/web3Context";

import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "src/helpers/AllBonds";

import bondImg from "./bond_img.png";
// import coinsBgImg from "../../assets/images/coins-bg.png";

function ChooseBond() {
  const { chainID } = useWeb3Context();
  const { bonds } = useBonds(chainID);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const address = useAddress();

  const hostAddress = "http://localhost:3000";

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <div id="choose-bond-view">
      {!isAccountLoading && !isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}

      <Paper className="ohm-card">
        <Box className="card-header page-header" sx={{ pb: 3 }}>
          <Typography variant="h3" data-testid="t">
            <Trans>Bond</Trans> (1,1)
          </Typography>
        </Box>
        <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
          <Grid item xs={6}>
            <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
              <Typography variant="button" component="span" color="textPrimary">
                <Trans>Treasury Balance</Trans>
              </Typography>
              <Box>
                {isAppLoading ? (
                  <Skeleton width="180px" data-testid="treasury-balance-loading" />
                ) : (
                  <Typography variant="h3" data-testid="treasury-balance">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(treasuryBalance)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} className={`ohm-price`}>
            <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
              <Typography variant="button" component="span" color="textPrimary">
                <Trans>FTMDAO Price</Trans>
              </Typography>
              <Typography variant="h3">
                {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(marketPrice, 2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {!isSmallScreen && (
          <Grid container item>
            <TableContainer>
              <Table aria-label="Available bonds">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Trans>Bond</Trans>
                    </TableCell>
                    <TableCell align="left">
                      <Trans>Price</Trans>
                    </TableCell>
                    <TableCell align="left">
                      <Trans>ROI</Trans>
                    </TableCell>
                    <TableCell align="right">
                      <Trans>Purchased</Trans>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonds.map(bond => (
                    <BondTableData key={bond.name} bond={bond} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Paper>

      {/* <Paper className="ohm-card referral-card referral-card__mobile">
        <Grid container>
          <Grid item xs={12} sm="auto" style={{ flex: 1 }}>
            <Box display="flex">
              <Box display="flex" justifyContent="center">
                <img src={coinsBgImg} alt="BSCDAO" />
              </Box>
              <p className="white--text">
                <i>
                  The forming users who successfully refer will receive a 5% commission if the referred person completes
                  to buy any bond pool.
                </i>
              </p>
            </Box>
            <Box sx={{ pt: 3 }} display="flex" justifyContent="center">
              {address ? (
                <div className="referral-card__address">
                  <Zoom in={true}>
                    <Link component={NavLink} to="/bonds/referral">
                      <Button fullWidth variant="contained" color="primary">
                        <Box sx={{ px: 3 }}>Referral</Box>
                      </Button>
                    </Link>
                  </Zoom>
                </div>
              ) : (
                <Typography variant="body1" color="textPrimary">
                  Please connect your wallet!
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper> */}

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.name}>
                <BondDataCard key={bond.name} bond={bond} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* <Paper className="ohm-card referral-card referral-card__pc">
        <Grid container>
          <Grid item xs={12} sm="auto">
            <Box display="flex" justifyContent="center">
              <img src={coinsBgImg} alt="BSCDAO" />
            </Box>
          </Grid>
          <Grid item xs={12} sm="auto" style={{ flex: 1 }}>
            <p className="white--text">
              <i>
                The forming users who successfully refer will receive a 5% commission if the referred person completes
                to buy any bond pool.
              </i>
            </p>
            <Box sx={{ pt: 3 }}>
              {address ? (
                <div className="referral-card__address">
                  <Zoom in={true}>
                    <Link component={NavLink} to="/bonds/referral">
                      <Button variant="contained" color="primary" size="small">
                        <Box sx={{ px: 3 }}>Referral</Box>
                      </Button>
                    </Link>
                  </Zoom>
                </div>
              ) : (
                <Typography variant="body1" color="textPrimary">
                  Please connect your wallet!
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper> */}

      <img className="bond-img" src={bondImg} alt="" />
    </div>
  );
}

export default ChooseBond;
