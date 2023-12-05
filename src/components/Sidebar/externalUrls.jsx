import DocsIcon from "../../assets/icons/docs.png";
import { ReactComponent as ForumIcon } from "../../assets/icons/jade-pro-icon.svg";
import { ReactComponent as JadeProIcon } from "../../assets/icons/forum.svg";
import { SvgIcon, Chip } from "@material-ui/core";
import { Trans } from "@lingui/macro";
const externalUrls = [
  // {
  //   title: <Trans>Buy $BDAO</Trans>,
  //   url: "https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0xddC7aebCAd4d6d4b4d437A97faE76d4042e6a9Cc",
  //   icon: <img width="20" src={PancakeIcon} />,
  // },
  // {
  //   title: (
  //     <Trans>
  //       BSCDAO Bank
  //       <Chip label="Coming soon" size="small" variant="outlined" />
  //     </Trans>
  //   ),
  //   url: "#",
  //   icon: <AccountBalanceOutlined color="secondary" viewBox="0 0 20 24" />,
  // },
  // {
  //   title: (
  //     <Trans>
  //       BSCDAO Game
  //       <Chip label="Coming soon" size="small" variant="outlined" />
  //     </Trans>
  //   ),
  //   url: "#",
  //   icon: <SvgIcon color="secondary" component={JadeProIcon} viewBox="0 0 25 25" />,
  // },
  // {
  //   title: <Trans>Governance</Trans>,
  //   url: "https://vote.bscdao.finance/",
  //   icon: <SvgIcon color="secondary" component={GovIcon} />,
  // },
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.bscdao.finance/",
    icon: <img src={DocsIcon} alt="Docs" />,
  },
//  {
//   title: <Trans>Charts</Trans>, 
//   url: "https://dexscreener.com/bsc/",
//   icon: <SvgIcon color="primary" component={ForumIcon} />,
// }
];
export default externalUrls;
