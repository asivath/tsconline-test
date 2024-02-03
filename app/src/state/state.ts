import { observable } from "mobx";

import { FaciesOptions, MapHistory } from "../types";
import type {
  MapHierarchy,
  MapInfo,
  ChartConfig,
  ColumnInfo,
  Facies,
  GeologicalStages,
  Presets,
} from "@tsconline/shared";

export type State = {
  chartLoading: boolean;
  tab: number;
  showAllTabs: boolean;
  showPresetInfo: boolean;
  settingsTabs: {
    selected: "time" | "font" | "column" | "mappoints";
    columns: ColumnInfo | null;
    columnSelected: string | null;
    geologicalTopStages: GeologicalStages;
    geologicalBaseStages: GeologicalStages;
    columnHashMap: Map<string, ColumnInfo>;
  };
  mapState: {
    mapInfo: MapInfo;
    mapHierarchy: MapHierarchy;
    currentFaciesOptions: FaciesOptions;
    selectedMap: string | null;
    isLegendOpen: boolean;
    isMapViewerOpen: boolean;
    isFacies: boolean;
    facies: Facies;
    selectedMapAgeRange: {
      minAge: number,
      maxAge: number
    }
    mapHistory: MapHistory
  };
  config: {
    datapacks: string[], // the datapacks used on the server
    settingsPath: string // the path to the settings file on the server
  };
  presets: Presets;
  selectedPreset: ChartConfig | null;
  chartPath: string;
  chartHash: string;
  settingsXML: string;
  settingsJSON: any;
  settings: {
    topStageKey: string;
    baseStageKey: string;
    unitsPerMY: number;
    useDefaultAge: boolean;
  };
  useCache: boolean;
  usePreset: boolean;
  openSnackbar: boolean;
};

export const state = observable<State>({
  chartLoading: true,
  tab: 0,
  showAllTabs: false,
  showPresetInfo: false,
  settingsTabs: {
    selected: "time",
    columns: null,
    columnSelected: null,
    geologicalTopStages: {},
    geologicalBaseStages: {},
    columnHashMap: new Map<string, ColumnInfo>(),
  },
  mapState: {
    mapInfo: {},
    mapHierarchy: {},
    currentFaciesOptions: {
      faciesAge: 0,
      dotSize: 1
    },
    selectedMap: null,
    isLegendOpen: false,
    isMapViewerOpen: false,
    isFacies: false,
    facies: {
      locations: {},
      minAge: 0,
      maxAge: 0,
      aliases: {}
    },
    selectedMapAgeRange: {
      minAge: 0,
      maxAge: 0
    },
    mapHistory: {
      savedHistory: {},
      accessHistory: []
    } 
  },
  config: {
    datapacks: [],
    settingsPath: ""
  },
  presets: {},
  selectedPreset: null,
  chartPath: "",
  chartHash: "",
  settingsXML: "",
  settingsJSON: {},
  settings: {
    topStageKey: "",
    baseStageKey: "",
    unitsPerMY: 2,
    useDefaultAge: false,
  },
  useCache: true,
  usePreset: true,
  openSnackbar: false,
});
