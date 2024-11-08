import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Paper } from "@mui/material";
import { set } from "lodash";

export const ExternalChart = observer(() => {
  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    if (source) {
      const fetchData = async () => {
        const externalAPI = `https://${source}.treatise.geolex.org/tscLinkAPI.php`;
        try {
          const response = await fetch(externalAPI);
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          const data = await response.json();

          console.log("Fetched datapack:", data);

        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };
      fetchData();

    } else {
      console.log("Error: Request made by Unknown source");
    }
  }, [location]);
  return (
    <Paper sx={{mt: 1}}>Loading Data...</Paper>
  );
});
