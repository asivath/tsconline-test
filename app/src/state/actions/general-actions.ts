import { action } from "mobx";
import { ChartSettingsInfoTSC, TimescaleItem } from "@tsconline/shared";

import {
  type MapInfo,
  type ColumnInfo,
  type MapHierarchy,
  type GeologicalStages,
  assertSuccessfulServerResponse,
  Presets,
  assertSVGStatus,
  IndexResponse,
  assertDatapackAgeInfo,
  assertMapHierarchy,
  assertColumnInfo,
  assertMapInfo,
  DatapackAgeInfo,
  defaultFontsInfo,
  assertIndexResponse,
  assertPresets,
  assertPatterns
} from "@tsconline/shared";
import { state, State } from "../state";
import { fetcher } from "../../util";
import { initializeColumnHashMap } from "./column-actions";
import { xmlToJson } from "../parse-settings";
import { displayServerError } from "./util-actions";
import { compareStrings } from "../../util/util";
import { ErrorCodes, ErrorMessages } from "../../util/error-codes";
import { equalChartSettings, equalConfig } from "../../types";

export const fetchFaciesPatterns = action("fetchFaciesPatterns", async () => {
  try {
    const response = await fetcher("/facies-patterns");
    const patternJson = await response.json();
    if (response.ok) {
      const { patterns } = patternJson;
      assertPatterns(patterns);
      state.mapPatterns = {
        patterns,
        sortedPatterns: Object.values(patterns).sort((a, b) => compareStrings(a.name, b.name))
      };
      console.log("Successfully fetched Map Patterns");
    } else {
      displayServerError(response, ErrorCodes.INVALID_PATTERN_INFO, ErrorMessages[ErrorCodes.INVALID_PATTERN_INFO]); // THIS IS THE CODE
    }
  } catch (e) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
    console.error(e);
  }
});
/**
 * Resets any user defined settings
 */
export const resetSettings = action("resetSettings", () => {
  state.settings = {
    selectedStage: "",
    topStageAge: 0,
    topStageKey: "",
    baseStageAge: 0,
    baseStageKey: "",
    unitsPerMY: 2,
    noIndentPattern: false,
    enableColumnBackground: false,
    enableChartLegend: false,
    enablePriority: false,
    enableHideBlockLabel: false,
    skipEmptyColumns: true,
    useDatapackSuggestedAge: true,
    mouseOverPopupsEnabled: false,
    datapackContainsSuggAge: false,
    selectedBaseStage: "",
    selectedTopStage: "",
    unit: "Ma"
  };
});

export const fetchDatapackInfo = action("fetchDatapackInfo", async () => {
  try {
    const response = await fetcher("/datapackinfoindex", {
      method: "GET"
    });
    const indexResponse = await response.json();
    try {
      assertIndexResponse(indexResponse);
      loadIndexResponse(indexResponse);
      console.log("Datapacks loaded");
    } catch (e) {
      displayServerError(
        indexResponse,
        ErrorCodes.INVALID_DATAPACK_INFO,
        ErrorMessages[ErrorCodes.INVALID_DATAPACK_INFO]
      );
    }
  } catch (e) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
    console.error(e);
  }
});
export const fetchPresets = action("fetchPresets", async () => {
  try {
    const response = await fetcher("/presets");
    const presets = await response.json();
    try {
      assertPresets(presets);
      loadPresets(presets);
      console.log("Presets loaded");
    } catch (e) {
      displayServerError(presets, ErrorCodes.INVALID_PRESET_INFO, ErrorMessages[ErrorCodes.INVALID_PRESET_INFO]);
    }
  } catch (e) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
    console.error(e);
  }
});

/**
 * This will grab the user datapacks AND the server datapacks from the server
 */
export const fetchUserDatapacks = action("fetchUserDatapacks", async (username: string) => {
  try {
    const response = await fetcher(`/user-datapacks/${username}`, {
      method: "GET"
    });
    const data = await response.json();
    try {
      assertIndexResponse(data);
      const { mapPackIndex, datapackIndex } = data;
      state.mapPackIndex = mapPackIndex;
      state.datapackIndex = datapackIndex;
      console.log("User Datapacks loaded");
    } catch (e) {
      displayServerError(data, ErrorCodes.INVALID_USER_DATAPACKS, ErrorMessages[ErrorCodes.INVALID_USER_DATAPACKS]);
    }
  } catch (e) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
    console.error(e);
  }
});

export const uploadDatapack = action("uploadDatapack", async (file: File, username: string, name: string) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetcher(`/upload/${username}`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Successfully uploaded datapack");
      fetchUserDatapacks(username);
      pushSnackbar("Successfully uploaded " + name + " datapack", "success");
    } else {
      displayServerError(data, ErrorCodes.INVALID_DATAPACK_UPLOAD, ErrorMessages[ErrorCodes.INVALID_DATAPACK_UPLOAD]);
    }
  } catch (e) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
    console.error(e);
  }
});
export const loadIndexResponse = action("loadIndexResponse", (response: IndexResponse) => {
  state.mapPackIndex = response.mapPackIndex;
  state.datapackIndex = response.datapackIndex;
});
export const fetchTimescaleDataAction = action("fetchTimescaleData", async () => {
  try {
    const response = await fetcher("/timescale", { method: "GET" });
    const data = await response.json();
    if (response.ok) {
      const stages = data.timescaleData || [];
      const geologicalBaseStageAges = [...stages];
      const geologicalTopStageAges = [];

      for (let i = 0; i < stages.length; i++) {
        const item = stages[i];
        const value = i > 0 ? stages[i - 1].value : 0;
        geologicalTopStageAges.push({ ...item, value });
      }
      setGeologicalBaseStageAges(geologicalBaseStageAges);
      setGeologicalTopStageAges(geologicalTopStageAges);

      console.log("Time Scale Data Loaded");
    } else {
      displayServerError(data, ErrorCodes.INVALID_TIME_SCALE, ErrorMessages[ErrorCodes.INVALID_TIME_SCALE]);
    }
  } catch (error) {
    displayServerError(null, ErrorCodes.SERVER_RESPONSE_ERROR, ErrorMessages[ErrorCodes.SERVER_RESPONSE_ERROR]);
  }
});

const setChartSettings = action("setChartSettings", (settings: ChartSettingsInfoTSC) => {
  const {
    topAge,
    baseAge,
    unitsPerMY,
    skipEmptyColumns,
    doPopups,
    noIndentPattern,
    enChartLegend,
    enEventColBG,
    enHideBlockLable,
    enPriority
  } = settings;
  if (topAge.text) {
    setTopStageAge(topAge.text);
  }
  if (baseAge.text) {
    setBaseStageAge(baseAge.text);
  }
  setUnitsPerMY(unitsPerMY.text);
  setSkipEmptyColumns(skipEmptyColumns.text);
  setMouseOverPopupsEnabled(doPopups);
  setEnableChartLegend(enChartLegend);
  setEnablePriority(enPriority);
  setEnableColumnBackground(enEventColBG);
  setNoIndentPattern(noIndentPattern);
  setEnableHideBlockLabel(enHideBlockLable);
});

/**
 * Rests the settings, sets the tabs to 0
 * sets chart to newval and requests info on the datapacks from the server
 * If attributed settings, load them.
 */
export const setDatapackConfig = action(
  "setChart",
  async (datapacks: string[], settingsPath: string): Promise<boolean> => {
    let datapackAgeInfo: DatapackAgeInfo = {
      datapackContainsSuggAge: false
    };
    let mapInfo: MapInfo = {};
    let mapHierarchy: MapHierarchy = {};
    let columnInfo: ColumnInfo;
    try {
      // Grab the settings for this chart if there are any:
      //TODO: only get default settings file if its a preset
      if (settingsPath && settingsPath.length > 0) {
        const res = await fetcher(`/settingsXml/${encodeURIComponent(settingsPath)}`, {
          method: "GET"
        });
        let settingsXml;
        try {
          settingsXml = await res.text();
        } catch (e) {
          //couldn't get settings from server
          displayServerError(
            null,
            ErrorCodes.INVALID_SETTINGS_RESPONSE,
            ErrorMessages[ErrorCodes.INVALID_SETTINGS_RESPONSE]
          );
          return false;
        }
        try {
          state.settingsTSC = xmlToJson(settingsXml); // Save the parsed JSON to the state.settingsTSC
        } catch (e) {
          //couldn't parse settings
          displayServerError(e, ErrorCodes.INVALID_SETTINGS_RESPONSE, "Error parsing xml settings file");
          return false;
        }
      } else {
        state.settingsTSC = {};
      }
      // the default overarching variable for the columnInfo
      columnInfo = {
        name: "Chart Root", // if you change this, change parse-datapacks.ts :69
        editName: "Chart Root",
        fontsInfo: JSON.parse(JSON.stringify(defaultFontsInfo)),
        fontOptions: ["Column Header"],
        popup: "",
        on: true,
        width: 100,
        enableTitle: true,
        rgb: {
          r: 255,
          g: 255,
          b: 255
        },
        minAge: state.settings.topStageAge,
        maxAge: state.settings.baseStageAge,
        children: [
          {
            name: "Chart Title",
            editName: "Chart Title",
            fontsInfo: JSON.parse(JSON.stringify(defaultFontsInfo)),
            on: true,
            width: 100,
            fontOptions: ["Column Header"],
            enableTitle: true,
            rgb: {
              r: 255,
              g: 255,
              b: 255
            },
            popup: "",
            children: [
              {
                name: "Ma",
                editName: "Ma",
                fontsInfo: JSON.parse(JSON.stringify(defaultFontsInfo)),
                fontOptions: ["Column Header", "Ruler Label"],
                on: true,
                width: 100,
                enableTitle: true,
                rgb: {
                  r: 255,
                  g: 255,
                  b: 255
                },
                popup: "",
                children: [],
                parent: "Chart Title", // if you change this, change parse-datapacks.ts :69
                minAge: state.settings.topStageAge, //tbd
                maxAge: state.settings.baseStageAge //tbd
              }
            ],
            parent: "Chart Root", // if you change this, change parse-datapacks.ts :69
            minAge: state.settings.topStageAge, //tbd
            maxAge: state.settings.baseStageAge //tbd
          }
        ],
        parent: null
      };
      // add everything together
      // uses preparsed data on server start and appends items together
      for (const datapack of datapacks) {
        if (!datapack || !state.datapackIndex[datapack] || !state.mapPackIndex[datapack])
          throw new Error(`File requested doesn't exist on server: ${datapack}`);
        const datapackParsingPack = state.datapackIndex[datapack]!;
        // concat the children array of root to the array created in preparsed array
        // we can't do Object.assign here because it will overwrite the array rather than concat it
        // concat datapack info under chart title column info
        // todo: create multiple chart titles if creating two different charts in one
        columnInfo.children[0].children = columnInfo.children[0].children.concat(datapackParsingPack.columnInfoArray);
        // concat datapackAgeInfo objects together
        if (!datapackAgeInfo) datapackAgeInfo = datapackParsingPack.datapackAgeInfo;
        else Object.assign(datapackAgeInfo, datapackParsingPack.datapackAgeInfo);

        const mapPack = state.mapPackIndex[datapack]!;
        if (!mapInfo) mapInfo = mapPack.mapInfo;
        else Object.assign(mapInfo, mapPack.mapInfo);
        if (!mapHierarchy) mapHierarchy = mapPack.mapHierarchy;
        else Object.assign(mapHierarchy, mapPack.mapHierarchy);
      }
      assertDatapackAgeInfo(datapackAgeInfo);
      assertMapHierarchy(mapHierarchy);
      assertColumnInfo(columnInfo);
      assertMapInfo(mapInfo);
    } catch (e) {
      console.error(e);
      pushError(ErrorCodes.INVALID_DATAPACK_CONFIG);
      return false;
    }
    state.settings.datapackContainsSuggAge = datapackAgeInfo.datapackContainsSuggAge;
    state.mapState.mapHierarchy = mapHierarchy;
    state.settingsTabs.columns = columnInfo;
    state.mapState.mapInfo = mapInfo;
    state.config.datapacks = datapacks;
    state.config.settingsPath = settingsPath;
    initializeColumnHashMap(state.settingsTabs.columns);
    resetSettings();
    if (state.settingsTSC.settings) {
      setChartSettings(state.settingsTSC.settings);
    }
    return true;
  }
);

/**
 * Sets the geological top stages and the base stages
 * Assuming the given stages includes the stages[TOP] = 0
 */
export const setGeologicalStages = action("setGeologicalStages", (stages: GeologicalStages) => {
  let top = stages["TOP"];
  const geologicalTopStages: GeologicalStages = { Present: 0 };
  Object.keys(stages).map((key) => {
    geologicalTopStages[key] = top;
    top = stages[key];
  });
  delete stages["TOP"];
  delete geologicalTopStages["TOP"];
  state.settingsTabs.geologicalTopStages = geologicalTopStages;
  state.settingsTabs.geologicalBaseStages = stages;
});

/**
 * Removes cache in public dir on server
 */
export const removeCache = action("removeCache", async () => {
  const response = await fetcher(`/removecache`, {
    method: "POST"
  });
  // check if we successfully removed cache
  const msg = await response.json();
  try {
    assertSuccessfulServerResponse(msg);
    console.log(`Server successfully deleted cache with message: ${msg.message}`);
    pushSnackbar("Successfully removed cache of recently generated charts", "success");
  } catch (e) {
    displayServerError(e, msg, "Server could not remove cache");
    return;
  }
});

/**
 * Resets state
 * Only implementation is used when we remove cache
 * If error from server, this is really bad. Will loop forever
 */
export const resetState = action("resetState", () => {
  setChartMade(true);
  setChartLoading(true);
  setDatapackConfig([], "");
  setChartHash("");
  setChartContent("");
  setUseCache(true);
  setUsePreset(true);
  setTab(0);
  setSettingsTabsSelected("time");
  setSettingsColumns(undefined);
  setMapInfo({});
  state.settingsTabs.columnSelected = null;
  state.settingsXML = "";
  state.settingsTSC = {};
});

export const loadPresets = action("loadPresets", (presets: Presets) => {
  state.presets = presets;
  setDatapackConfig([], "");
});

// Define settingOptions globally
export const settingOptions = [
  { name: "enablePopups", label: "Enable popups", stateName: "doPopups" },
  {
    name: "enablePriorityFiltering",
    label: "Enable priority filtering",
    stateName: "enPriority"
  },
  {
    name: "enableChartLegend",
    label: "Enable chart legend",
    stateName: "enChartLegend"
  },
  {
    name: "hideBlockLabelsIfCrowded",
    label: "If crowded, hide block labels",
    stateName: "enHideBlockLable"
  },
  {
    name: "skipEmptyColumns",
    label: "Skip empty columns",
    stateName: "skipEmptyColumns"
  }
];

/**
 * set the settings tab based on a string or number
 */
export const setSettingsTabsSelected = action((newtab: number | State["settingsTabs"]["selected"]) => {
  if (typeof newtab === "string") {
    state.settingsTabs.selected = newtab;
    return;
  }
  switch (newtab) {
    case 0:
      state.settingsTabs.selected = "time";
      break;
    case 1:
      state.settingsTabs.selected = "column";
      break;
    case 2:
      state.settingsTabs.selected = "font";
      break;
    case 3:
      state.settingsTabs.selected = "mappoints";
      break;
    case 4:
      state.settingsTabs.selected = "datapacks";
      break;
    default:
      console.log("WARNING: setSettingTabsSelected: received index number that is unknown: ", newtab);
      state.settingsTabs.selected = "time";
  }
});

/**
 * The tab name we want to switch to in settings based on a string translated to an index
 * @param tab the tab to be selected
 * @returns
 */
export function translateTabToIndex(tab: State["settingsTabs"]["selected"]) {
  switch (tab) {
    case "time":
      return 0;
    case "column":
      return 1;
    case "font":
      return 2;
    case "mappoints":
      return 3;
    case "datapacks":
      return 4;
  }
}

/**
 * Constantly ping the server for the pdf status
 * TODO DEPRECATE FOR SVGS
 */
export const checkSVGStatus = action(async () => {
  let SVGReady = false;
  try {
    while (!SVGReady) {
      SVGReady = await fetchSVGStatus();
      if (!SVGReady) {
        // Wait for some time before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } catch (e) {
    console.log(`Error fetching svg status: ${e}`);
    return;
  }
  setChartLoading(false);
});

/**
 * The request for pdf status
 * @returns
 */
async function fetchSVGStatus(): Promise<boolean> {
  if (state.chartHash === "") {
    return false;
  }
  const response = await fetcher(`/svgstatus/${state.chartHash}`, {
    method: "GET"
  });
  const data = await response.json();
  try {
    assertSVGStatus(data);
  } catch (e) {
    displayServerError(
      data,
      ErrorCodes.INVALID_SVG_READY_RESPONSE,
      ErrorMessages[ErrorCodes.INVALID_SVG_READY_RESPONSE]
    );
    const msg = `Error fetching SVG status with error ${e}`;
    throw new Error(msg);
  }
  return data.ready;
}

export const removeError = action("removeError", (context: ErrorCodes) => {
  state.errors.errorAlerts.delete(context);
});

export const pushError = action("pushError", (context: ErrorCodes) => {
  if (state.errors.errorAlerts.has(context)) {
    state.errors.errorAlerts.get(context)!.errorCount += 1;
    return;
  }
  const error = {
    errorText: ErrorMessages[context],
    errorCount: 1
  };
  state.errors.errorAlerts.set(context, error);
});
export const removeSnackbar = action("removeSnackbar", (text: string) => {
  state.snackbars = state.snackbars.filter((info) => info.snackbarText !== text);
});
export const pushSnackbar = action("pushSnackbar", (text: string, severity: "success" | "info" | "warning") => {
  if (text.length > 70) {
    console.error("The length of snackbar text must be less than 70");
    return;
  }
  for (const snackbar of state.snackbars) {
    if (snackbar.snackbarText === text) {
      snackbar.snackbarCount += 1;
      return;
    }
  }
  state.snackbars.push({
    snackbarText: text,
    snackbarCount: 1,
    severity: severity
  });
});

export const fetchImage = action("fetchImage", async (datapackName: string, imageName: string) => {
  const response = await fetcher(`/images/${datapackName}/${imageName}`, {
    method: "GET"
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Image not found");
    } else if (response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("Unknown error");
    }
  }
  const image = await response.blob();
  return image;
});

export const setuseDatapackSuggestedAge = action((isChecked: boolean) => {
  state.settings.useDatapackSuggestedAge = isChecked;
});
export const setTab = action("setTab", (newval: number) => {
  if (
    newval == 1 &&
    state.chartContent &&
    (!equalChartSettings(state.settings, state.prevSettings) || !equalConfig(state.config, state.prevConfig))
  ) {
    pushSnackbar("Chart settings are different from the displayed chart.", "warning");
  }
  state.tab = newval;
});
export const setSettingsColumns = action((temp?: ColumnInfo) => {
  state.settingsTabs.columns = temp;
});
export const setUseCache = action((temp: boolean) => {
  state.useCache = temp;
});
export const setUsePreset = action((temp: boolean) => {
  state.useCache = temp;
});

export const setChartContent = action("setChartContent", (chartContent: string) => {
  state.chartContent = chartContent;
});
export const setMapInfo = action("setMapInfo", (mapInfo: MapInfo) => {
  state.mapState.mapInfo = mapInfo;
});
export const setTopStageKey = action("setTopStageKey", (key: string) => {
  state.settings.topStageKey = key;
});
export const setBaseStageKey = action("setBottomStageKey", (key: string) => {
  state.settings.baseStageKey = key;
});
export const setSelectedTopStage = action("setSelectedTopStage", (key: string) => {
  state.settings.topStageKey = key;
});
export const setSelectedBaseStage = action("setSelectedBaseStage", (key: string) => {
  state.settings.baseStageKey = key;
});
export const setSelectedStage = action("setSelectedStage", (key: string) => {
  state.settings.selectedStage = key;
});
export const setGeologicalBaseStageAges = action("setGeologicalBaseStageAges", (key: TimescaleItem[]) => {
  state.geologicalBaseStageAges = key;
});
export const setGeologicalTopStageAges = action("setGeologicalTopStageAges", (key: TimescaleItem[]) => {
  state.geologicalTopStageAges = key;
});
export const setUnitsPerMY = action((units: number) => {
  state.settings.unitsPerMY = units;
});

export const setMouseOverPopupsEnabled = action((checked: boolean) => {
  state.settings.mouseOverPopupsEnabled = checked;
});

export const setChartLoading = action((value: boolean) => {
  state.chartLoading = value;
});

export const setChartMade = action((value: boolean) => {
  state.madeChart = value;
});

export const setMapHierarchy = action("setMapHierarchy", (mapHierarchy: MapHierarchy) => {
  state.mapState.mapHierarchy = mapHierarchy;
});
export const setChartHash = action("setChartHash", (charthash: string) => {
  state.chartHash = charthash;
});
export const setTopStageAge = action("setTopStageAge", (age: number) => {
  state.settings.topStageAge = age;
});
export const setBaseStageAge = action("setBaseStageAge", (age: number) => {
  state.settings.baseStageAge = age;
});

export const settingsXML = action("settingsXML", (xml: string) => {
  state.settingsXML = xml;
});

export const setIsFullscreen = action("setIsFullscreen", (newval: boolean) => {
  state.isFullscreen = newval;
});
export const setSkipEmptyColumns = action("setSkipEmptyColumns", (newval: boolean) => {
  state.settings.skipEmptyColumns = newval;
});
export const setNoIndentPattern = action("setNoIndentPattern", (newval: boolean) => {
  state.settings.noIndentPattern = newval;
});
export const setEnableColumnBackground = action("setEnableColumnBackground", (newval: boolean) => {
  state.settings.enableColumnBackground = newval;
});
export const setEnableChartLegend = action("setEnableChartLegend", (newval: boolean) => {
  state.settings.enableChartLegend = newval;
});
export const setEnablePriority = action("setEnablePriority", (newval: boolean) => {
  state.settings.enablePriority = newval;
});
export const setEnableHideBlockLabel = action("setEnableHideBlockLabel", (newval: boolean) => {
  state.settings.enableHideBlockLabel = newval;
});
