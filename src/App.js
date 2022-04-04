import axios from "axios";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Gallery />
    </QueryClientProvider>
  );
}

function Gallery() {
  useEffect(() => {
    fetchAPI();
  }, []);

  const { isLoading, data, error } = useQuery("fetchedData", fetchAPI);

  const [nftIdx, setNftIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <Container>
      <Typography variant="h2" gutterBottom align="center" fontWeight={500}>
        OpenSea Gallery
      </Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        {data?.assets.map((_, index) => (
          <Grid item key={index}>
            <div onClick={handleOpen}>
              <Link>
                <img
                  onClick={() => setNftIdx(index)}
                  src={data?.assets[index]?.image_url}
                  width={"400px"}
                />
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <Container
            sx={{
              display: "flex",
            }}
          >
            <Typography variant="h6" flexGrow={1}>
              {data?.assets[nftIdx].name}
            </Typography>
            <IconButton edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Container>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Link href={data?.assets[nftIdx].permalink} target={"_blank"}>
              <img src={data?.assets[nftIdx].image_url} />
            </Link>
            {data?.assets[nftIdx]?.last_sale?.total_price ? (
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                justifyContent={"center"}
                align={"center"}
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
                variant="h5"
                gutterBottom
                justifyContent={"center"}
                align={"center"}
              >
                Never Sold
              </Typography>
            )}
          </Container>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

async function fetchAPI() {
  const { data } = await axios.get(
    "https://api.opensea.io/api/v1/assets?collection_slug=hapeprime"
  );
  // console.log(data);
  return data;
}
