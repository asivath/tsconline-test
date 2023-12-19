import { action, runInAction } from "mobx";
import {
  type ChartConfig,
  assertChartInfo,
  isChartError,
} from "@tsconline/shared";
import { state, State } from "./state";
import { fetcher, devSafeUrl } from "../util";
import { xmlToJson, jsonToXml } from "./settingsParser";
import { ColumnSetting } from "@tsconline/shared";
import { ConstructionOutlined } from "@mui/icons-material";

export const setTab = action("setTab", (newval: number) => {
  state.tab = newval;
});

export const setChart = action("setChart", async (newval: number) => {
  if (state.presets.length <= newval) {
    state.chart = null;
    return;
  }
  let tempColumns: ColumnSetting | null;
  function asdf(parents: string[], settings: any, stateSettings: any) {
    for (const key in settings) {
      if (String(key).includes("Column")) {
        //console.log(String(key).split(":")[1]);
        stateSettings[String(key).split(":")[1]] = {
          on: true,
          children: {},
          parents: parents,
        };
        //console.log(stateSettings);
        parents.push(String(key).split(":")[1]);
        asdf(
          parents,
          settings[key],
          stateSettings[String(key).split(":")[1]].children
        );
      }
    }
    parents.pop();
  }
  state.chart = state.presets[newval]!;
  const res = await fetcher('/columns')
  const reply = await res.json()
  console.log("reply to /columns: ", reply)
  //process decrypted file
  // TODO handle more than one datapack
  const temp = state.presets[newval]!.datapacks[0].split("/")
  const filepath = "assets/decrypted/" + temp[temp.length - 1].split(".")[0] + ".txt"
  console.log(filepath)

  state.settingsTabs.columns = reply[filepath]
  console.log(state.settingsTabs.columns)
  // Grab the settings for this chart if there are any:
  // if (state.chart.settings) {
  //   console.log(state.chart.settings);
  //   const response = await fetcher(state.chart.settings);
  //   const xml = await response.text();
  //   if (typeof xml === "string" && xml.match(/<TSCreator/)) {
  //     // Call the xmlToJsonParser function here
  //     const jsonSettings = xmlToJson(xml);
  //     runInAction(() => (state.settingsJSON = jsonSettings)); // Save the parsed JSON to the state.settingsJSON

  //     //start of column parser to display in app
  //     console.log("Parsed JSON Object:\n", jsonSettings);
  //     let temp =
  //       jsonSettings["class datastore.RootColumn:Chart Root"][
  //         "class datastore.RootColumn:Chart Title"
  //       ];
  //     state.settingsTabs.columns = {};
  //     asdf([], temp, state.settingsTabs.columns);
  //     console.log(state.settingsTabs.columns);
  //   } else {
  //     console.log(
  //       "WARNING: grabbed settings from server at url: ",
  //       devSafeUrl(state.chart.settings),
  //       ", but it was either not a string or did not have a <TSCreator tag in it"
  //     );
  //     console.log("The returned settingsXML was: ", xml);
  //   }
  // }
});

export const setAllTabs = action("setAllTabs", (newval: boolean) => {
  state.showAllTabs = newval;
});

export const generateChart = action("generateChart", async () => {
  let xmlSettings = jsonToXml(state.settingsJSON); // Convert JSON to XML using jsonToXml function
  console.log("XML Settings:", xmlSettings); // Log the XML settings to the console
  var datapacks: string[] = [];
  if (state.chart != null) {
    datapacks = state.chart.datapacks;
  }
  const body = JSON.stringify({
    settings: xmlSettings,
    datapacks: datapacks,
  });
  console.log("Sending settings to server...");
  const response = await fetcher("/charts", {
    method: "POST",
    body,
  });
  const answer = await response.json();
  try {
    assertChartInfo(answer);
    runInAction(() => (state.chartPath = devSafeUrl(answer.chartpath)));
  } catch (e: any) {
    if (isChartError(answer)) {
      console.log(
        "ERROR failed to fetch chart with the settings.  Error response from server was: ",
        answer
      );
      return;
    }
    console.log(
      "ERROR: unknown error in fetching chart with settings.  Response from server was: ",
      answer,
      ", Error was: ",
      e
    );
    return;
  }
});

export const loadPresets = action("loadPresets", (presets: ChartConfig[]) => {
  state.presets = presets;
  setChart(0);
});

export const settingsXML = action("settingsXML", (xml: string) => {
  state.settingsXML = xml;
});

//update
export const updateSettings = action("updateSettings", () => {
  const { topAge, baseAge, unitsPerMY } = state.settings;
  state.settingsJSON["settingsTabs"] = state.settingsTabs;
  const jsonSettings = state.settingsJSON;
  if ("settings" in jsonSettings) {
    const settings = jsonSettings.settings as any;
    settings["topAge"]["text"] = topAge.toString();
    settings["baseAge"]["text"] = baseAge.toString();
    settings["unitsPerMY"] = (unitsPerMY * 30).toString();
  }
  if ("settingsTabs" in jsonSettings) {
    const settingsTabs = jsonSettings as any;
  }
  console.log(jsonSettings);
  const xmlSettings = jsonToXml(jsonSettings); // Convert JSON to XML using jsonToXml function

  console.log("Updated settingsXML:\n", xmlSettings); // Print the updated XML

  state.settingsXML = xmlSettings;
});

//update the checkboxes
// Define settingOptions globally
export const settingOptions = [
  { name: "enablePopups", label: "Enable popups", stateName: "doPopups" },
  {
    name: "enablePriorityFiltering",
    label: "Enable priority filtering",
    stateName: "enPriority",
  },
  {
    name: "enableChartLegend",
    label: "Enable chart legend",
    stateName: "enChartLegend",
  },
  {
    name: "hideBlockLabelsIfCrowded",
    label: "If crowded, hide block labels",
    stateName: "enHideBlockLable",
  },
  {
    name: "skipEmptyColumns",
    label: "Skip empty columns",
    stateName: "skipEmptyColumns",
  },
];

// Combined function to update the checkbox settings and individual action functions
export const updateCheckboxSetting = action(
  (stateName: string, checked: boolean) => {
    // Check if the stateName is a valid setting option
    const settingOption = settingOptions.find(
      (option) => option.stateName === stateName
    );
    if (!settingOption) return;

    // Update the checkbox setting in state.settings
    (state.settings as any)[stateName] = checked;

    // Update the checkbox setting in jsonSettings['settings'] if available
    if (state.settingsJSON["settings"]) {
      const settings = state.settingsJSON["settings"];
      // Check if the current setting is already equal to the new value
      if (settings[stateName] !== checked) {
        settings[stateName] = checked;
      }
    }

    // Log the updated setting
    console.log(`Updated setting "${stateName}" to ${checked}`);
  }
);

export const setTopAge = action((topage: number) => {
  state.settings.topAge = topage;
});

export const setSelectedStage = action("setSelectedStage", (stage: string) => {
  state.settings.selectedStage = stage;
});

export const setBaseAge = action((baseage: number) => {
  state.settings.baseAge = baseage;
});

export const setUnitsPerMY = action((units: number) => {
  state.settings.unitsPerMY = units;
});

export const setSettingTabsSelected = action(
  (newtab: number | State["settingsTabs"]["selected"]) => {
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
      default:
        console.log(
          "WARNING: setSettingTabsSelected: received index number that is unknown: ",
          newtab
        );
        state.settingsTabs.selected = "time";
    }
  }
);

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
  }
}
/*
 * toggles the "on" state for a column that had its checkbox clicked
 * name: the name of the toggled column
 * parents: list of names that indicates the path from top to the toggled column
 */
export const toggleSettingsTabColumn = action(
  (name: string, parents: string[]) => {
    let curcol: ColumnSetting | null = state.settingsTabs.columns;
    // Walk down the path of parents in the tree of columns
    for (const p of parents) {
      if (!curcol) {
        console.log(
          "WARNING: tried to access path at parent ",
          p,
          " from path ",
          parents,
          " in settings tabs column list, but children was null at this level."
        );
        return;
      }
      curcol = curcol[p]["children"];
    }
    //need this to check if curcol is null for typescript to be happy in future operations
    if (!curcol) {
      console.log(
        "WARNING: tried to access path at ",
        name,
        "settings tabs column list, but children was null at this level."
      );
      return;
    }
    if (!curcol[name]) {
      console.log(
        "WARNING: tried to access name ",
        name,
        " from path ",
        parents,
        " in settings tabs column list, but object[name] was null here."
      );
      return;
    }
    curcol[name].on = !curcol[name].on;
    setcolumnSelected(name, parents);
    console.log("state after my change: ", state);
    //if the column is unchecked, then no need to check the parents
    if (!curcol[name].on) {
      //updateSettings();
      return;
    }
    //since column is checked, toggle parents on if they were previously off
    curcol = state.settingsTabs.columns;
    for (const p of parents) {
      if (!curcol) {
        console.log(
          "WARNING: tried to access path at parent ",
          p,
          " from path ",
          parents,
          " in settings tabs column list, but children was null at this level."
        );
        return;
      }
      if (!curcol[p].on) curcol[p].on = true;
      curcol = curcol[p]["children"];
    }
    //updateSettings();
  }
);

export const setSettingsColumns = action((temp: ColumnSetting) => {
  state.settingsTabs.columns = temp;
});

export const setcolumnSelected = action((name: string, parents: string[]) => {
  state.settingsTabs.columnSelected = { name, parents };
});

export const updateColumnName = action((newName: string) => {
  if (!state.settingsTabs.columnSelected) {
    console.log("WARNING: the user hasn't selected a column.");
    return;
  }
  let curcol: ColumnSetting | null = state.settingsTabs.columns;
  let oldName = state.settingsTabs.columnSelected.name;
  let parents = state.settingsTabs.columnSelected.parents;
  // Walk down the path of parents in the tree of columns
  for (const p of parents) {
    if (!curcol) {
      console.log(
        "WARNING: tried to access path at parent ",
        p,
        " from path ",
        parents,
        " in settings tabs column list, but children was null at this level."
      );
      return;
    }
    curcol = curcol[p]["children"];
  }
  if (!curcol) {
    console.log(
      "WARNING: tried to access path at ",
      oldName,
      "settings tabs column list, but children was null at this level."
    );
    return;
  }
  if (!curcol[oldName]) {
    console.log(
      "WARNING: tried to access name ",
      oldName,
      " from path ",
      parents,
      " in settings tabs column list, but object[name] was null here."
    );
    return;
  }
  curcol[newName] = curcol[oldName];
  delete curcol[oldName];
});
