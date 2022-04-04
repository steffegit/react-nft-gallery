import axios from "axios";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Gallery />
    </QueryClientProvider>
  );
}

//TODO: Make EVERYTHING responsive (still needs to be done)
//TODO: Add Transitions (after everything is responsive)

//TODO: Maybe Implement Size-Slider for picture image (OPTIONAL)

const StyledImage = styled("img")({
  borderRadius: 4,
  width: 350,
  height: 350,
});

function Gallery() {
  useEffect(() => {
    fetchAPI();
  }, []);

  const { isLoading, data, error } = useQuery("fetchedData", fetchAPI);

  const [nftIdx, setNftIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <Box sx={{ flexGrow: 1, marginTop: 2 }}>
      <Typography variant="h2" gutterBottom align="center" fontWeight={500}>
        OpenSea Gallery
      </Typography>

      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 2, sm: 4, md: 10 }}
        justifyContent={"center"}
      >
        {data?.assets.map((_, index) => (
          <Grid item key={index}>
            <div onClick={handleOpen} className="grid-div">
              <Link>
                <img
                  onClick={() => setNftIdx(index)}
                  src={data?.assets[index]?.image_url}
                  width={350}
                />
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
        fullScreen={fullscreen}
      >
        <DialogTitle>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" flexGrow={1}>
              {data?.assets[nftIdx].name}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Container>
        </DialogTitle>
        <DialogContent>
          <Typography component="div" gutterBottom align={"center"}>
            <Link href={data?.assets[nftIdx].permalink} target={"_blank"}>
              <StyledImage src={data?.assets[nftIdx].image_url} />
            </Link>
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              fullWidth
              columns={4}
            >
              <Grid item xs={2}>
                <IconButton
                  onClick={() => {
                    if (nftIdx > 0) setNftIdx(nftIdx - 1);
                  }}
                  edge="start"
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Grid>

              <Grid item xs={2}>
                <IconButton
                  edge="end"
                  onClick={() => {
                    if (nftIdx < 19) setNftIdx(nftIdx + 1);
                  }}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Grid>
            </Grid>

            {data?.assets[nftIdx]?.last_sale?.total_price ? (
              <Typography
                component="div"
                variant="h6"
                gutterBottom
                justifyContent={"center"}
                align={"center"}
                alignItems={"center"}
              >
                Last Sold Price:{" "}
                {(
                  Number(data?.assets[nftIdx]?.last_sale?.total_price) / 1e18
                ).toFixed(2)}{" "}
                ETH
              </Typography>
            ) : (
              <Typography
                component="div"
                variant="h6"
                gutterBottom
                justifyContent={"center"}
                align={"center"}
              >
                Never Sold
              </Typography>
            )}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

async function fetchAPI() {
  const { data } = await axios.get(
    "https://api.opensea.io/api/v1/assets?collection_slug=hapeprime"
  );
  // console.log(data);
  return data;
}
