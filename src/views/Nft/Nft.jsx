import "./Nft.scss";
import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import NftbgImg from "./nft_img.png";
import Nft1Img from "./nft1.png";
import Nft2Img from "./nft2.png";
import Nft3Img from "./nft3.png";

export default function Nft() {
  return (
    <div id="nft-view">
      <Box display="flex" width="100%" justifyContent="center">
          
          <Grid container spacing={3} className={`nft-card`}>
              <Grid item xs={12} sm={12}>
                  <Typography variant="h3">
                    Founders Limited Series
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <img src={Nft1Img} className="nft-img" alt="" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <img src={Nft2Img} className="nft-img" alt="" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <img src={Nft3Img} className="nft-img" alt="" />
              </Grid>
          </Grid>
      </Box>
      <img className="nft_img" src={NftbgImg} alt="" />
    </div>
  );
}