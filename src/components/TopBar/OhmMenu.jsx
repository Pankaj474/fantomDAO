import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sMUSHTokenImg } from "../../assets/tokens/sBDAO.svg";
import { ReactComponent as MUSHTokenImg } from "../../assets/tokens/BDAO.svg";

import "./ohmmenu.scss";
import { busd } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import { useWeb3Context } from "../../hooks/web3Context";

import MUSHImg from "src/assets/tokens/BDAO.svg";
import SMUSHImg from "src/assets/tokens/sBDAO.svg";

import { segmentUA } from "../../helpers/userAnalyticHelpers";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "BDAO":
        tokenPath = MUSHImg;
        break;
      case "sBDAO":
        tokenPath = SMUSHImg;
        tokenDecimals = 9;
        break;
      default:
        tokenPath = SMUSHImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      // segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID, address } = useWeb3Context();

  const networkID = chainID;

  const MUSH_ADDRESS = addresses[networkID].MUSH_ADDRESS;
  const SMUSH_ADDRESS = addresses[networkID].SMUSH_ADDRESS;
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const busdAddress = busd.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="outlined" color="primary" title="BDAO" aria-describedby={id}>
        Buy $FTMDAO
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://pancakeswap.finance/swap?inputCurrency=${busdAddress}&outputCurrency=${MUSH_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left" component="p">
                        <Trans>Buy on {new String("PancakeSwap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  {/* <Link
                    href={`https://app.uniswap.org/#/swap?inputCurrency=${fraxAddress}&outputCurrency=${MUSH_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        <Trans>Buy on {new String("Uniswap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}

                  {/* <Link component={NavLink} to="/wrap" style={{ textDecoration: "none" }}>
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">Wrap sOHM</Typography>
                    </Button>
                  </Link> */}
                </Box>

                <Box component="div" className="data-links">
                  <Divider color="secondary" className="less-margin" />
                  <Link
                    href={`https://www.dextools.io/app/bsc/pair-explorer/0xbdf06fae530004361ff6802d1c4da21b7abff27e`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left" component="p">
                        Chart on DexTools <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>
                      <Trans>ADD TOKEN TO WALLET</Trans>
                    </p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {MUSH_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("BDAO", MUSH_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={MUSHTokenImg}
                            viewBox="0 0 80 80"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1" component="p">
                            BDAO
                          </Typography>
                        </Button>
                      )}
                      {SMUSH_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("sBDAO", SMUSH_ADDRESS, address)}
                        >
                          <SvgIcon
                            component={sMUSHTokenImg}
                            viewBox="0 0 80 80"
                            style={{ height: "25px", width: "25px" }}
                          />
                          <Typography variant="body1" component="p">
                            sBDAO
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : null}

                {/* <Divider color="secondary" />
                <Link
                  href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">
                      <Trans>Unstake Legacy LP Token</Trans>
                    </Typography>
                  </Button>
                </Link> */}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default OhmMenu;
