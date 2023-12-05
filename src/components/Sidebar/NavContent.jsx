import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import StakeIcon from "../../assets/icons/stake.png";
import GlobeIcon from "../../assets/icons/globe.png";
import BondIcon from "../../assets/icons/bond.png";
import DashboardIcon from "../../assets/icons/dashboard.png";
import SpookyswapIcon from "../../assets/icons/spookyswap.png";
import WrapIcon from "../../assets/icons/wrap.png";
import NftIcon from "../../assets/icons/nft.png";
import LaunchpadIcon from "../../assets/icons/launchpad.png";
import SandboxIcon from "../../assets/icons/sandbox.png";

import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, Chip, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import AppLogo from "./app_logo.svg";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID } = useWeb3Context();
  const { bonds } = useBonds(chainID);
  console.log(`🚀 - NavContent - bonds`, bonds);

  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");

    if (currentPath.indexOf("wrap") >= 0 && page === "wrap") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if (currentPath === "" && page === "dashboard") {
      return true;
    }
    return false;
  }, []);
  console.log(bonds);
  return (
    <Paper className={`dapp-sidebar ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"}`}>
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            {/* <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 151 100"
                style={{ minWdth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link> */}
            <Link className="logo" component={NavLink} to="/">
              <img src={AppLogo} />
              <Typography variant="h5">
                FANTOM<span>DAO</span>
              </Typography>
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://ftmscan.com/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dash-nav"
                to="/"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={DashboardIcon} alt="Dashboard" />
                  {/* <SvgIcon color="primary" component={DashboardIcon} viewBox="0 0 16 19" /> */}
                  <Trans>Dashboard</Trans>
                </Typography>
              </Link>

              <Link
                id="dash-nav"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0xddC7aebCAd4d6d4b4d437A97faE76d4042e6a9Cc"
                target="_blank"
              >
                <Typography component="span" variant="button">
                  <img src={SpookyswapIcon} alt="Buy" />
                  {/* <SvgIcon color="primary" component={BuyIcon} viewBox="0 0 22 20" /> */}
                  <Trans>Buy on SpookySwap</Trans>
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={StakeIcon} alt="Stake" />
                  {/* <SvgIcon color="primary" component={StakeIcon} viewBox="0 0 23 23" /> */}
                  <Trans>Stake</Trans>
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="wrap-nav"
                to="/wrap"
                isActive={(match, location) => {
                  return checkPage(match, location, "wrap");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={WrapIcon} alt="Wrap" />
                  {/* <SvgIcon color="primary" component={WrapIcon} viewBox="0 0 22 20" /> */}
                  <Trans>Wrap</Trans>
                </Typography>
              </Link>

              {/* <Link
                component={NavLink}
                id="33-together-nav"
                to="/33-together"
                isActive={(match, location) => {
                  return checkPage(match, location, "33-together");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <SvgIcon color="primary" component={PoolTogetherIcon} />
                  3,3 Together
                </Typography>
              </Link> */}
              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={BondIcon} alt="Bond" />
                  {/* <SvgIcon color="primary" component={BondIcon} viewBox="0 0 26 17" /> */}
                  <Trans>Bond</Trans>
                  <Chip label="Discount" color="secondary" size="small" />
                </Typography>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <Typography variant="body2">
                    <Trans>Bond discounts</Trans>
                  </Typography>
                  {bonds.map((bond, i) => {
                    console.log(`🚀 - {bonds.map - bond`, bond);
                    return (
                      <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
                        {!bond.bondDiscount ? (
                          <Skeleton variant="text" width={"150px"} />
                        ) : (
                          <Typography variant="body2">
                            {bond.displayName}

                            <span className="bond-pair-roi">
                              {!bond.isAvailable[chainID]
                                ? "Sold Out"
                                : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                            </span>
                          </Typography>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <Link
                component={NavLink}
                id="calc-nav"
                to="/calculator"
                isActive={(match, location) => {
                  return checkPage(match, location, "calculator");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={GlobeIcon} alt="Calculator" />
                  {/* <SvgIcon color="primary" component={GlobeIcon} viewBox="0 0 18 18" /> */}
                  <Trans>Calculator</Trans>
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="nft-nav"
                to="/nft"
                isActive={(match, location) => {
                  return checkPage(match, location, "nft");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={NftIcon} alt="Nft" />
                  {/* <SvgIcon color="primary" component={BondIcon} viewBox="0 0 26 17" /> */}
                  <Trans>NFT</Trans>
                  <Chip label="NEW!" color="secondary" size="small" />
                </Typography>
              </Link>
              
              <Link
                component={NavLink}
                id="launchpad-nav"
                to="#"
                isActive={(match, location) => {
                  return checkPage(match, location, "launchpad");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={LaunchpadIcon} alt="Launchpad" />
                  {/* <SvgIcon color="primary" component={BondIcon} viewBox="0 0 26 17" /> */}
                  <Trans>Launchpad</Trans>
                  <Chip label="SOON" color="primary" size="small" />
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="sandbox-nav"
                to="#"
                isActive={(match, location) => {
                  return checkPage(match, location, "sandbox");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography component="span" variant="button">
                  <img src={SandboxIcon} alt="Sandbox" />
                  <Trans>Sandbox</Trans>
                  <Chip label="SOON" color="primary" size="small" />
                </Typography>
              </Link>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography component="span" color="textSecondary" variant="button">
                    {externalUrls[link].icon}
                  </Typography>
                  <Typography component="span" color="textSecondary" variant="button">
                    {externalUrls[link].title}
                  </Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
