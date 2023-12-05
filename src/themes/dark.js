import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings, { handleBackdropFilter } from "./global.js";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in darkTheme using the global color variables

const darkTheme = {
  color: "#1D2654",
  secondaryColor: "#FF6854",
  gold: "#FF6854",
  gray: "#A3A3A3",
  white: "#FFFFFF",
  borderColor: "2px solid #F2F1F1",
  textHighlightColor: "#FF6854",
  backgroundColor: "#000000",
  background: "#000000",
  paperBg: "#fff",
  modalBg: "#fff",
  // popoverBg: "rgba(54, 56, 64, 0.99)",
  popoverBg: "#fff",
  menuBg: handleBackdropFilter("rgba(54, 56, 64, 0.5)"),
  backdropBg: "rgba(0,0,0,.5)",
  largeTextColor: "#FF6854",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#F2F1F1",
  primaryButtonBG: "#FF6854",
  primaryButtonHoverBG: "#fb1c1c",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#fb1c1c",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#fb1c1c", //gold
  containedSecondaryButtonHoverBG: "#fb1c1c",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: darkTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: darkTheme.backgroundColor,
          paper: darkTheme.backgroundColor,
        },
        contrastText: darkTheme.color,
        primary: {
          main: darkTheme.color,
        },
        secondary: {
          main: darkTheme.secondaryColor,
        },
        neutral: {
          main: darkTheme.color,
          secondary: darkTheme.gray,
        },
        text: {
          primary: darkTheme.color,
          secondary: darkTheme.gray,
        },
        graphStrokeColor: darkTheme.graphStrokeColor,
        highlight: darkTheme.textHighlightColor,
      },
      // typography: {
      //   fontFamily: "Gilroy",
      // },
      typography: {
        fontSize: 16,
        fontFamily: "Gilroy",
        h1: {
          fontSize: "3rem",
          fontFamily: "Gilroy",
        },
        h2: {
          fontSize: "2.25rem",
          fontWeight: 600,
          letterSpacing: "1.3px",
          fontFamily: "Gilroy",
        },
        h3: {
          fontSize: "1.75rem",
          fontFamily: "Gilroy",
        },
        h4: {
          fontSize: "1.5rem",
          fontFamily: "Gilroy",
        },
        h5: {
          fontSize: "1.25rem",
          letterSpacing: "0.4px",
          fontFamily: "Gilroy",
        },
        h6: {
          fontSize: "1rem",
          fontFamily: "Gilroy",
        },
        body1: {
          fontSize: "0.875rem",
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: "Gilroy",
        },
        body2: {
          fontSize: "0.75rem",
          fontWeight: 400,
          lineHeight: 1,
          fontFamily: "Gilroy",
        },
        caption: {
          fontFamily: "Gilroy",
        },
      },
      props: {
        MuiSvgIcon: {
          htmlColor: darkTheme.color,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            // "@font-face": fonts,
            body: {
              background: darkTheme.background,
            },
            ":root": {
              "--color-gold": darkTheme.gold,
              "--color-white": darkTheme.white,
            },
          },
        },

        MuiDrawer: {
          paper: {
            backgroundColor: darkTheme.background,
            zIndex: 7,
          },
          paperAnchorLeft: {
            backgroundColor: "#000000",
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: darkTheme.paperBg,
            borderRadius: 0,
            color: "#1D2654",
            "&.ohm-card": {
              backgroundColor: "#fff",
              border: darkTheme.borderColor,
              borderRadius: "20px",
            },
            "&.ohm-modal": {
              backgroundColor: darkTheme.modalBg,
            },
            "&.ohm-menu": {
              backgroundColor: darkTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: darkTheme.popoverBg,
              color: darkTheme.color,
              backdropFilter: "blur(15px)",
            },
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: darkTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: darkTheme.color,
              },
            },
            "&.active": {
              color: darkTheme.color,
              textDecoration: "underline",
            },
          },
        },
        MuiTableCell: {
          root: {
            // color: darkTheme.color,
          },
          body: {
            color: darkTheme.color,
          },
        },
        MuiInputBase: {
          root: {
            // color: darkTheme.gold,
            color: darkTheme.color,
          },
          // input: {
          //   borderColor: darkTheme.gold,
          // },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            borderColor: `${darkTheme.primary} !important`,
            borderWidth: "2px",
            borderRadius: "8px",
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: darkTheme.gray,
            "&$selected": {
              color: darkTheme.gold,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: darkTheme.gold,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&:hover": {
              color: darkTheme.color,
              // backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            selected: {
              // backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              "&:hover": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
              },
              "&:focus": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          root: {
            fontFamily: "Gilroy",
            borderRadius: "10px",
            textTransform: "none",
            textDecoration: "none",
            whiteSpace: "nowrap",
            minWidth: "max-content",
            maxHeight: "57px",
            height: "44px",
          },
          containedSizeLarge: {
            fontSize: "18px",
          },
          containedPrimary: {
            border: 0,
            fontWeight: "bold",
          },
          containedSecondary: {
            fontWeight: "400",
            height: "44px",
          },
          outlinedPrimary: {
            height: "44px",
            borderRadius: "10px",
            border: "2px solid",
            padding: "9px 20px",
            fontWeight: "bold",
            "&:hover": {
              border: "2px solid",
            },
          },
          outlinedSecondary: {
            textTransform: "none",
            textDecoration: "none",
            height: "33px",
            fontSize: "1.1em",
            padding: "9px 20px",
          },
          text: {
            "&:hover": {
              backgroundColor: "#00000000",
            },
          },
          textSecondary: {
            textTransform: "none",
            textDecoration: "none",
            padding: "2px 2px",
            "&:hover": {
              backgroundColor: "#00000000",
            },
          },
        },
        MuiSvgIcon: {
          colorSecondary: {
            color: darkTheme.color,
          },
        },
        MuiChip: {
          sizeSmall: {
            fontSize: "10px",
            height: "22px",
            marginLeft: "4px",
          },
        },
      },
    },
    commonSettings,
  ),
);
