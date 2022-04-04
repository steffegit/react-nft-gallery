import axios from "axios";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <Container>
      <Typography variant="h2" gutterBottom align="center">
        OpenSea Gallery
      </Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        {data?.assets.map((_, index) => (
          <Grid item key={index}>
            <img src={data?.assets[index]?.image_url} width={"400px"} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  // <img src={data?.assets[0].image_url} />;
}

async function fetchAPI() {
  const { data } = await axios.get(
    "https://api.opensea.io/api/v1/assets?collection_slug=boredapeyachtclub"
  );
  console.log(data);
  return data;
}
