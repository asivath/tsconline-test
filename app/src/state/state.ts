import { observable } from "mobx";

import { FaciesOptions, MapHistory } from "../types";
import type {
  MapHierarchy,
  MapInfo,
  ChartConfig,
  ColumnInfo,
  Facies,
  GeologicalStages,
} from "@tsconline/shared";

export type State = {
  chartLoading: boolean;
  tab: number;
  showAllTabs: boolean;
  showPresetInfo: boolean;
  settingsTabs: {
    selected: "time" | "font" | "column" | "mappoints";
    columns: ColumnInfo;
    columnSelected: { name: string; parents: string[] } | null;
    geologicalTopStages: GeologicalStages;
    geologicalBaseStages: GeologicalStages;
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
    mapHistory: MapHistory[]
  }
  chart: ChartConfig | null;
  presets: ChartConfig[];
  chartPath: string;
  chartHash: string;
  settingsXML: string;
  settingsJSON: any;
  settings: {
    topStageKey: string;
    baseStageKey: string;
    unitsPerMY: number;
  };
  useCache: boolean;
  usePreset: boolean;
};

export const state = observable<State>({
  chartLoading: true,
  tab: 0,
  showAllTabs: false,
  showPresetInfo: false,
  settingsTabs: {
    selected: "time",
    columns: {},
    columnSelected: null,
    geologicalTopStages: {},
    geologicalBaseStages: {},
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
    facies: {},
    mapHistory: []
  },
  chart: null,
  presets: [],
  chartPath: "",
  chartHash: "",
  settingsXML: "",
  settingsJSON: {},
  settings: {
    topStageKey: "",
    baseStageKey: "",
    unitsPerMY: 2,
  },
  useCache: true,
  usePreset: true,
});
