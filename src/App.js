import axios from "axios";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

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
    <div>
      {data?.assets.map((_, index) => (
        <img src={data?.assets[index]?.image_url} />
      ))}
    </div>
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
