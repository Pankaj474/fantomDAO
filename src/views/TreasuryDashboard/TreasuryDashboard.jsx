import { memo } from "react";
import "./treasury-dashboard.scss";
// import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import {
  MarketCap,
  OHMPrice,
  WSOHMPrice,
  CircSupply,
  BackingPerOHM,
  CurrentIndex,
  StakingRaito,
  StakingTVL,
  POL,
} from "./components/Metric/Metric";

// import {
//   TotalValueDepositedGraph,
//   MarketValueGraph,
//   RiskFreeValueGraph,
//   ProtocolOwnedLiquidityGraph,
//   OHMStakedGraph,
//   APYOverTimeGraph,
//   RunwayAvailableGraph,
// } from "./components/Graph/Graph";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <MarketCap />
              <OHMPrice />
              <WSOHMPrice />
              <CircSupply />
              <BackingPerOHM />
              <CurrentIndex />
              <StakingRaito />
              <StakingTVL />
              <POL />
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
});

// const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  // <QueryClientProvider client={queryClient}>
  //   <TreasuryDashboard />
  // </QueryClientProvider>
  <TreasuryDashboard />
);
