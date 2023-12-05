import { AppBar, Toolbar, Box, Button, SvgIcon, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import OhmMenu from "./OhmMenu.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.background.paper,
    backdropFilter: "none",
    height: "86px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  return (
    <AppBar position="fixed" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
          aria-label="open drawer"
          size="large"
          variant="text"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </Button>

        <Box sx={{ flexGrow: 1 }} />
        <Box display="flex">
          {!isVerySmallScreen && <OhmMenu />}

          <ConnectMenu theme={theme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
