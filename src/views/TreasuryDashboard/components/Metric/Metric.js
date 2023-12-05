import { useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { trim, formatCurrency } from "../../../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import { allBondsMap } from "src/helpers/AllBonds";

export const Metric = props => (
  <Box className={`metric ${props.className}`} textAlign="center">
    {props.children}
  </Box>
);
const percentFormatter = Intl.NumberFormat("en", { style: "percent", minimumFractionDigits: 2 });
Metric.Value = props => <Typography variant="h4">{props.children || <Skeleton type="text" />}</Typography>;

Metric.Title = props => (
  <Typography variant="body2" component="span" color="textPrimary">
    {props.children}
  </Typography>
);

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap);

  return (
    <Metric className="market">
      <Metric.Title>Market Cap</Metric.Title>
      <Metric.Value>{marketCap && formatCurrency(marketCap, 0)}</Metric.Value>
    </Metric>
  );
};

export const OHMPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);

  return (
    <Metric className="price">
      <Metric.Title>FTMDAO Price</Metric.Title>
      <Metric.Value>{marketPrice && formatCurrency(marketPrice, 2)}</Metric.Value>
    </Metric>
  );
};

export const StakingAPY = () => {
  const stakingAPY = useSelector(state => state.app.stakingAPY);
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  return (
    <Metric className="stakingAPY">
      <Metric.Title>StakingAPY</Metric.Title>
      <Metric.Value>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</Metric.Value>
    </Metric>
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);

  const isDataLoaded = circSupply && totalSupply;

  return (
    <Metric className="circ">
      <Metric.Title>Circulating Supply (total)</Metric.Title>
      <Metric.Value>{isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}</Metric.Value>
    </Metric>
  );
};

export const BackingPerOHM = () => {
  const backingPerMUSH = useSelector(state => {
    if (state.bonding.loading === false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances / state.app.circSupply;
    }
  });

  return (
    <Metric className="bpo">
      <Metric.Title>Backing per FTMDAO</Metric.Title>
      <Metric.Value>{!isNaN(backingPerMUSH) && formatCurrency(backingPerMUSH, 2)}</Metric.Value>
    </Metric>
  );
};

export const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);

  return (
    <Metric className="index">
      <Metric.Title>
        Current Index
        <InfoTooltip message="The current index tracks the amount of sFTMDAO accumulated since the beginning of staking. Basically, how much sFTMDAO one would have if they staked and held a single MUSH from day 1." />
      </Metric.Title>
      <Metric.Value>{currentIndex && trim(currentIndex, 2) + " sFTMDAO"}</Metric.Value>
    </Metric>
  );
};

export const WSOHMPrice = () => {
  const wsOhmPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);

  return (
    <Metric className="wsoprice">
      <Metric.Title>
        rFTMDAO Price
        <InfoTooltip
          message={
            "rFTMDAO = sFTMDAO * index\n\nThe price of rFTMDAO is equal to the price of FTMDAO multiplied by the current index"
          }
        />
      </Metric.Title>
      <Metric.Value>{wsOhmPrice && formatCurrency(wsOhmPrice, 2)}</Metric.Value>
    </Metric>
  );
};

export const StakingRaito = () => {
  const stakingRatio = useSelector(state => state.app.stakingRatio);

  return (
    <Metric className="index">
      <Metric.Title>
        Staking Ratio
        <InfoTooltip message="FTMDAO Staked, is the ratio of sFTMDAO to FTMDAO (staked vs unstaked)" />
      </Metric.Title>
      <Metric.Value>{stakingRatio && percentFormatter.format(stakingRatio)}</Metric.Value>
    </Metric>
  );
};

export const StakingTVL = () => {
  const stakingTVL = useSelector(state => state.app.stakingTVL);

  return (
    <Metric className="index">
      <Metric.Title>
        Staking TVL
        <InfoTooltip message="Total Value Deposited, is the dollar amount of all FTMDAO staked in the protocol. This metric is often used as growth or health indicator in DeFi projects." />
      </Metric.Title>
      <Metric.Value>{stakingTVL && formatCurrency(stakingTVL, 2)}</Metric.Value>
    </Metric>
  );
};

export const POL = () => {
  const pol = useSelector(state => state.app.pol);

  return (
    <Metric className="index">
      <Metric.Title>
        Protocol Own Liquidity
        <InfoTooltip message="Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users." />
      </Metric.Title>
      <Metric.Value>{pol && percentFormatter.format(pol)}</Metric.Value>
    </Metric>
  );
};
