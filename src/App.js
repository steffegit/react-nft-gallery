import axios from "axios";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

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
            <Link href={data?.assets[nftIdx].permalink} target={"_blank"}>
              <img
                onClick={() => setNftIdx(index)}
                src={data?.assets[index]?.image_url}
                width={"400px"}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

async function fetchAPI() {
  const { data } = await axios.get(
    "https://api.opensea.io/api/v1/assets?collection_slug=hapeprime"
  );
  console.log(data);
  return data;
}
