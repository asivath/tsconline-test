import { useEffect, useContext } from "react";
import { context } from "./state";
import { getCurrentUserDatapacks, getPublicOfficialDatapacks } from "./state/non-action-util";
import { ErrorCodes } from "./util/error-codes";
import { DatapackConfigForChartRequest } from "@tsconline/shared";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

export function GenerateExternalChart() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const datapackHash = queryParams.get("hash");
  const { state, actions } = useContext(context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (datapackHash) {
        // Call API to load the external datapack
        await actions.fetchTreatiseDatapacks(datapackHash);
        // wait 1 seconds for datapack to load
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchedDatapack = getCurrentUserDatapacks("treatise", state.datapacks).find(
          (dp) => dp.title === datapackHash
        );
        const internalDatapack = getPublicOfficialDatapacks(state.datapacks).find(
          (dp) => dp.title === "TimeScale Creator Internal Datapack"
        );

        if (!internalDatapack) {
          console.log("Error: Unable to fetch datapack");
          return;
        }
        if (!fetchedDatapack || !internalDatapack) {
          actions.pushError(ErrorCodes.USER_FETCH_DATAPACK_FAILED);
          return;
        }
        const dataReqTreatise: DatapackConfigForChartRequest = {
          storedFileName: fetchedDatapack.storedFileName,
          title: fetchedDatapack.title,
          isPublic: fetchedDatapack.isPublic,
          uuid: "treatise",
          type: "user"
        };

        const internalDatapackConfig: DatapackConfigForChartRequest = {
          storedFileName: internalDatapack.storedFileName,
          title: internalDatapack.title,
          isPublic: internalDatapack.isPublic,
          type: "official"
        };

        await actions.processDatapackConfig([dataReqTreatise, internalDatapackConfig]);
        actions.initiateChartGeneration(navigate, location.pathname);
      }
    };
    fetchData();
  }, [datapackHash]);

  if (!datapackHash) {
    return <Typography>Error: Missing datapack hash</Typography>;
  }

  return <Typography>Generating chart for datapack hash: {datapackHash}</Typography>;
}
