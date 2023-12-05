import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Paper,
  Button,
  Slide,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Countdown from "react-countdown";
import apollo from "../../lib/apolloClient";
import { useTheme } from "@material-ui/core/styles";

import {
  MarketCap,
  OHMPrice,
  WSOHMPrice,
  CircSupply,
  BackingPerOHM,
  CurrentIndex,
  StakingAPY,
  // StakingRaito,
  // StakingTVL,
  // POL,
} from "../TreasuryDashboard/components/Metric/Metric";
import "./style.scss";
// import dashboardImg from "../../assets/images/dashboard-img.png";
import Chart from "../../components/Chart/Chart";
import { bulletpoints, itemType, treasuryDataQuery } from "../TreasuryDashboard/treasuryData";
import { formatCurrency, getTokenImage, trim } from "../../helpers";

const tooltipItems = {
  tvl: ["Total Value Deposited"],
  coin: ["MAI", "FRAX", "MATIC"],
  rfv: ["MAI", "FRAX"],
  holder: ["CLAMies"],
  apy: ["APY"],
  runway: ["Current", "100K APY", "50K APY", "10K APY"],
  pol: ["LP Treasury", "Market LP"],
};

const tooltipInfoMessages = {
  tvl: "Total Value Deposited, is the dollar amount of all FTMDAO staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.",
  mvt: "Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.",
  rfv: "Risk Free Value, is the amount of funds the treasury guarantees to use for backing FTMDAO.",
  pol: "Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.",
  holder: "Holders, represents the total number of otters (sFTMDAO holders)",
  staked: "FTMDAO Staked, is the ratio of sFTMDAO to FTMDAO (staked vs unstaked)",
  apy: "Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.",
  runway: "Runway, is the number of days sFTMDAO emissions can be sustained at a given rate. Lower APY = longer runway",
  currentIndex:
    "The current index tracks the amount of sFTMDAO accumulated since the beginning of staking. Basically, how much sFTMDAO one would have if they staked and held a single FTMDAO from day 1.",
};

function Home() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const [apyScale, setApyScale] = useState(0);

  const theme = useTheme();

  var endDate = new Date("12/21/2021 20:00:00"); // MM/DD/YYYY  HH:mm:ss
  var milisecondBetweenTwoDate = Math.abs(endDate.getTime() - new Date().getTime());
  const totalTimeCountdown = milisecondBetweenTwoDate;

  const Completionist = () => <span>Time ended!</span>;

  const rendererCountDown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <Typography variant="h2" className="count-down-container" color="textPrimary">
          {Number(days) > 0 ? <span>{days.toString().padStart(2, "0")} D : </span> : null}
          <span>{hours.toString().padStart(2, "0")} H : </span>
          <span>{minutes.toString().padStart(2, "0")} M : </span>
          <span>{seconds.toString().padStart(2, "0")} S</span>
        </Typography>
      );
    }
  };

  useEffect(() => {
    console.log("🚀 - useEffect - Treasury data Query calll");
    apollo(treasuryDataQuery)
      .then(r => {
        console.log(`🚀 - useEffect - r`, r);
        let metrics = r?.data.protocolMetrics.map(entry =>
          Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
        );
        console.log(`🚀 - useEffect - metrics`, metrics);

        metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
        setData(metrics);

        let staked = r.data.protocolMetrics.map(entry => ({
          staked: (parseFloat(entry.sHecCirculatingSupply) / parseFloat(entry.hecCirculatingSupply)) * 100,
          timestamp: entry.timestamp,
        }));
        console.log(`🚀 - apollo - staked`, staked);

        staked = staked.filter(pm => pm.staked < 100);
        console.log(`🚀 - apollo - staked`, staked);
        setStaked(staked);

        console.log(`🚀 - apollo - pm`, metrics);
        let runway = metrics.filter(pm => pm.runway100k > 5);
        console.log(`🚀 - apollo - runway`, runway);
        setRunway(runway);

        let apy = r.data.protocolMetrics.map(entry => ({
          apy: entry.currentAPY,
          timestamp: entry.timestamp,
        }));
        //First data point seems to be bugged?
        //Reports an APY of 3191769842703686000000, which messes with graph scale
        var sl_apy = apy.slice(0, -1);
        setApy(sl_apy);
        const apyMax = Math.max.apply(
          Math,
          sl_apy.map(function (o) {
            return o.apy;
          }),
        );
        setApyScale(apyMax);
        const latestMetrics = r.data.protocolMetrics[0];
        // setBackingPerClam(latestMetrics.treasuryMarketValue / latestMetrics.clamCirculatingSupply);
      })
      .catch(err => {
        console.log(`🚀 - apollo - err`, err);
      });
  }, []);
  console.log(`🚀 - useEffect - "Treasury data Query calll"`, "Treasury data Query calll");
  console.log(`🚀 - useEffect - "Treasury data Query calll"`, "Treasury data Query calll");

  return (
    <div id="home-view">
      <Container>
        <Box>
          <Grid container spacing={3}>
            <Grid item className="right-side" xs={12} sm={12}>
              <Box className="grid-view">
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <MarketCap />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <OHMPrice />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <WSOHMPrice />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StakingAPY />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <BackingPerOHM />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CurrentIndex />
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <StakingRaito />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StakingTVL />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <POL />
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>

            <Grid container item spacing={3} className="data-grid">
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="ohm-card ohm-chart-card">
                  {
                    <Chart
                      type="area"
                      data={data}
                      dataKey={["totalValueLocked"]}
                      stopColor={[["#FFACA1", "rgba(255, 172, 161, 0.5)"]]}
                      headerText={"Total Value Deposited"}
                      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
                      bulletpointColors={bulletpoints.tvl}
                      itemNames={tooltipItems.tvl}
                      itemType={itemType.dollar}
                      infoTooltipMessage={tooltipInfoMessages.tvl}
                    />
                  }
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="ohm-card ohm-chart-card">
                  {
                    <Chart
                      type="stack"
                      data={data}
                      dataKey={["treasuryDaiMarketValue", "treasuryFRAXMarketValue"]}
                      // dataKey={['treasuryMaiMarketValue', 'treasuryFraxMarketValue', 'treasuryWmaticMarketValue']} //Pratik
                      stopColor={[
                        ["#EE4B4E", "rgba(219, 55, 55, 0.5)"],
                        ["#8F5AE8", "rgba(143, 90, 232, 0.5)"],
                        // ["#2891F9", "rgba(40, 145, 249, 0.5)"], //Change Pratik
                        // ['#DC30EB', '#EA98F1'],
                        // ['#8BFF4D', '#4C8C2A'],
                      ]}
                      headerText={"Market Value of Treasury Assets"}
                      headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                      bulletpointColors={bulletpoints.coin}
                      itemNames={tooltipItems.coin}
                      itemType={itemType.dollar}
                      infoTooltipMessage={tooltipInfoMessages.mvt}
                    />
                  }
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="ohm-card ohm-chart-card">
                  {
                    <Chart
                      type="stack"
                      data={data}
                      format="currency"
                      // dataKey={['treasuryMaiRiskFreeValue', 'treasuryFraxRiskFreeValue']}
                      dataKey={["treasuryDaiRiskFreeValue", "treasuryFRAXRiskFreeValue"]}
                      stopColor={[
                        ["#EE4B4E", "rgba(219, 55, 55, 0.5)"], //MAI
                        ["#8F5AE8", "rgba(143, 90, 232, 0.5)"], //FRAX
                        // ['#DC30EB', '#EA98F1']
                        // ['#000', '#fff'],
                        // ['#000', '#fff'],
                      ]}
                      headerText={"Risk Free Value of Treasury Assets"}
                      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                      bulletpointColors={bulletpoints.rfv}
                      itemNames={tooltipItems.rfv}
                      itemType={itemType.dollar}
                      infoTooltipMessage={tooltipInfoMessages.rfv}
                    />
                  }
                </Paper>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Paper className="ohm-card">
                  {
                    <Chart
                      type="area"
                      data={data}
                      // dataKey={['treasuryClamMaiPOL']}
                      dataKey={["treasuryHecDaiPOL"]}
                      stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0.5)"]]}
                      headerText={"Protocol Owned Liquidity"}
                      // headerSubText={`${data && trim(data[0].treasuryClamMaiPOL, 2)}% `}
                      headerSubText={`${data && trim(data[0].treasuryHecDaiPOL, 2)}% `}
                      dataFormat="percent"
                      bulletpointColors={bulletpoints.pol}
                      itemNames={tooltipItems.pol}
                      itemType={itemType.percentage}
                      infoTooltipMessage={tooltipInfoMessages.pol}
                      // domain={[98, 'auto']}
                      isPOL={true}
                      // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                    />
                  }
                </Paper>
              </Grid>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  <Chart
                    type="area"
                    data={staked}
                    dataKey={["staked"]}
                    stopColor={[["rgba(255, 220, 119, 1)", "rgba(255, 220, 119, 0.5)"]]}
                    headerText={"FTMDAO Staked"}
                    dataFormat="percent"
                    headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
                    isStaked={true}
                    bulletpointColors={bulletpoints.staked}
                    infoTooltipMessage={tooltipInfoMessages.staked}
                  />
                }
              </Paper>
            </Grid>

            {/* <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  <Chart
                    type="line"
                    scale="auto"
                    data={apy}
                    dataKey={['apy']}
                    color={theme.palette.text.primary}
                    stroke={[theme.palette.text.primary]}
                    headerText={'APY over time'}
                    dataFormat="percent"
                    headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
                    bulletpointColors={bulletpoints.apy}
                    itemNames={tooltipItems.apy}
                    itemType={itemType.percentage}
                    infoTooltipMessage={tooltipInfoMessages.apy}
                    domain={[0, apyScale]}
                  />
                }
              </Paper>
            </Grid> */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  <Chart
                    type="multi"
                    data={runway}
                    dataKey={["runwayCurrent", "runway100k", "runway50k", "runway10k"]}
                    color={theme.palette.text.primary}
                    stroke={[theme.palette.text.primary, "#2EC608", "#49A1F2", "#ff758f"]}
                    headerText={"Runway available"}
                    headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
                    dataFormat="days"
                    bulletpointColors={
                      theme.palette.text.primary == "#1D2654" ? bulletpoints.runway : bulletpoints.runway_darktheme
                    }
                    itemNames={tooltipItems.runway}
                    itemType={""}
                    infoTooltipMessage={tooltipInfoMessages.runway}
                  />
                }
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {/* <img className="dashboard-img" src={dashboardImg} alt="" /> */}
    </div>
  );
}

export default Home;
