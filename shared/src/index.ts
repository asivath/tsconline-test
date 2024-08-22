// Shared types between app and server (i.e. messages they send back and forth)

import { defaultColumnRootConstant, defaultFontsInfoConstant, validDateFormats } from "./constants.js";
import validator from "validator";

export * from "./constants.js";
export * from "./util.js";
export * from "./settings-types.js";

export type SharedUser = {
  username: string;
  email: string;
  pictureUrl: string | null;
  isGoogleUser: boolean;
  isAdmin: boolean;
};

export type DatapackMetadata = {
  description: string;
  title: string;
  file: string;
  size: string;
  date?: string;
  authoredBy: string;
  tags: string[];
  references: string[];
  contact?: string;
  notes?: string;
};

export type AdminSharedUser = {
  userId: number;
  uuid: string;
  emailVerified: boolean;
  invalidateSession: boolean;
} & SharedUser;

export type SuccessfulServerResponse = {
  message: string;
};

export type DatapackInfoChunk = {
  datapackIndex: DatapackIndex;
  totalChunks: number;
};
export type MapPackInfoChunk = {
  mapPackIndex: MapPackIndex;
  totalChunks: number;
};

export type ServerResponse = SuccessfulServerResponse | ServerResponseError;

export type BaseDatapackProps = {
  columnInfo: ColumnInfo;
  ageUnits: string;
  defaultChronostrat: "USGS" | "UNESCO";
  formatVersion: number;
  topAge?: number;
  baseAge?: number;
  date?: string;
  verticalScale?: number;
  description: string;
  title: string;
  file: string;
  size: string;
  warnings?: DatapackWarning[];
  image: string;
  totalColumns: number;
  columnTypeCount: ColumnTypeCounter;
  authoredBy: string;
  tags: string[];
  references: string[];
  contact?: string;
  notes?: string;
  datapackImageCount: number;
  mapPack: MapPack; // this can be empty
};

type ServerDatapack = {
  type: "server";
};
type WorkshopDatapack = {
  type: "workshop";
};
type PrivateUserDatapack = {
  type: "private_user";
  uuid: string;
};
type PublicUserDatapack = {
  type: "public_user";
  uuid: string;
};
export type DatapackType = ServerDatapack | WorkshopDatapack | PrivateUserDatapack | PublicUserDatapack;
export type Datapack = DatapackType & BaseDatapackProps;

export type ServerDatapackIndex = {
  [name: string]: ServerDatapack & BaseDatapackProps;
};
export type WorkshopDatapackIndex = {
  [name: string]: WorkshopDatapack & BaseDatapackProps;
};
export type PrivateUserDatapackIndex = {
  [name: string]: PrivateUserDatapack & BaseDatapackProps;
};
export type PublicUserDatapackIndex = {
  [name: string]: PublicUserDatapack & BaseDatapackProps;
};

export type PresetDatapack = {
  file: string;
  name: string;
};
export type ColumnTypeCounter = Record<ColumnInfoType, number>;

export type DatapackWarning = {
  lineNumber?: number;
  message?: string;
  warning: string;
};

export type ChartErrorResponse = {
  error: string;
  errorCode: number;
};

export type DatapackIndex = {
  [name: string]: Datapack;
};
export type MapPackIndex = {
  [name: string]: MapPack;
};
export type MapPack = {
  mapInfo: MapInfo;
  mapHierarchy: MapHierarchy;
};
export type SVGStatus = {
  ready: boolean;
};
export type Patterns = {
  [name: string]: {
    name: string;
    formattedName: string;
    filePath: string;
    color: Color;
  };
};
export type Color = {
  name: string;
  hex: string;
  rgb: RGB;
};
export type RGB = {
  r: number;
  g: number;
  b: number;
};
export type Presets = {
  [type: string]: ChartConfig[];
};

export type ColumnHeaderProps = {
  name: string;
  minAge: number;
  maxAge: number;
  enableTitle: boolean;
  on: boolean;
  width: number;
  popup: string;
  rgb: RGB;
};

export type ChartConfig = {
  icon: string; // path to icon image
  background: string; // path to background image
  title: string;
  description: string;
  settings: string; // path to base settings file
  datapacks: PresetDatapack[]; // active datapack names
  date: string; // active datapack names
  type?: string; // type of preset
};

export type FontLabelOptions = {
  on: boolean;
  inheritable: boolean;
  fontFace: "Arial" | "Courier" | "Verdana";
  size: number;
  bold: boolean;
  italic: boolean;
  color: string;
};

export type FontsInfo = {
  "Column Header": FontLabelOptions;
  "Age Label": FontLabelOptions;
  "Uncertainty Label": FontLabelOptions;
  "Zone Column Label": FontLabelOptions;
  "Sequence Column Label": FontLabelOptions;
  "Event Column Label": FontLabelOptions;
  "Popup Body": FontLabelOptions;
  "Ruler Label": FontLabelOptions;
  "Point Column Scale Label": FontLabelOptions;
  "Range Label": FontLabelOptions;
  "Ruler Tick Mark Label": FontLabelOptions;
  "Legend Title": FontLabelOptions;
  "Legend Column Name": FontLabelOptions;
  "Legend Column Source": FontLabelOptions;
  "Range Box Label": FontLabelOptions;
};

export const defaultFontsInfo: FontsInfo = defaultFontsInfoConstant;
export const defaultColumnRoot: ColumnInfo = defaultColumnRootConstant;

export type SubBlockInfo = {
  label: string;
  age: number;
  popup: string;
  lineStyle: "solid" | "dashed" | "dotted";
  rgb: RGB;
};

export type DatapackConfigForChartRequest = {
  file: string;
  title: string;
} & DatapackType;

export type ChartRequest = {
  settings: string; // JSON string representing the settings file you want to use to make a chart
  datapacks: DatapackConfigForChartRequest[]; // array of datapacks you want to use to make a chart
  useCache: boolean; // whether to use the cache or not
};

export type ServerResponseError = {
  error: string; // any time an error is thrown on the server side
};

export type Blank = ColumnHeaderProps;

export type ColumnInfoTypeMap = {
  Block: Block;
  Facies: Facies;
  Event: Event;
  Range: Range;
  Chron: Chron;
  Freehand: Freehand;
  Point: Point;
  Sequence: Sequence;
  Transect: Transect;
  Blank: Blank;
};

export type EventType = "events" | "ranges";

export type ColumnInfoType = keyof ColumnInfoTypeMap;

export type DisplayedColumnTypes =
  | ColumnInfoType
  | "Data"
  | "Zone"
  | "Ruler"
  | "AgeAge"
  | "MetaColumn"
  | "RootColumn"
  | "BlockSeriesMetaColumn";

export type ValidFontOptions =
  | "Column Header"
  | "Age Label"
  | "Uncertainty Label"
  | "Zone Column Label"
  | "Sequence Column Label"
  | "Event Column Label"
  | "Popup Body"
  | "Ruler Label"
  | "Point Column Scale Label"
  | "Range Label"
  | "Ruler Tick Mark Label"
  | "Legend Title"
  | "Legend Column Name"
  | "Legend Column Source"
  | "Range Box Label";

export type SubInfo =
  | SubBlockInfo
  | SubFaciesInfo
  | SubEventInfo
  | SubRangeInfo
  | SubChronInfo
  | SubFreehandInfo
  | SubPointInfo
  | SubSequenceInfo
  | SubTransectInfo;

export type ColumnSpecificSettings =
  | EventSettings
  | PointSettings
  | ChronSettings
  | RangeSettings
  | SequenceSettings
  | RulerSettings
  | ZoneSettings;

export type RulerSettings = {
  justification: RulerJustification;
};
export type ZoneSettings = {
  orientation: ZoneOrientation;
};
export type SequenceSettings = {
  labelMarginLeft: number;
  labelMarginRight: number;
  graphStyle: string;
  drawNameLabel: boolean;
  type: SequenceType;
};

export type RulerJustification = "left" | "right";
export type ZoneOrientation = "normal" | "vertical";

export type SequenceType = "sequence" | "trend";

export type RangeSettings = {
  rangeSort: RangeSort;
  margin: number;
  agePad: number;
};

export type DataMiningChronDataType = "Frequency";

export type ChronSettings = {
  dataMiningChronDataType: DataMiningChronDataType | null;
} & DataMiningSettings;

export type DataMiningPointDataType =
  | "Frequency"
  | "Maximum Value"
  | "Minimum Value"
  | "Average Value"
  | "Rate of Change"
  | "Overlay";

export type PointSettings = {
  drawLine: boolean;
  drawFill: boolean;
  drawScale: boolean;
  drawCurveGradient: boolean;
  drawBackgroundGradient: boolean;
  backgroundGradientStart: RGB;
  backgroundGradientEnd: RGB;
  curveGradientStart: RGB;
  curveGradientEnd: RGB;
  lineColor: RGB;
  flipScale: boolean;
  scaleStart: number;
  scaleStep: number;
  fill: RGB;
  pointShape: PointShape;
  lowerRange: number;
  upperRange: number;
  smoothed: boolean;
  minX: number;
  maxX: number;
  dataMiningPointDataType: DataMiningPointDataType | null;
  isDataMiningColumn: boolean;
} & DataMiningSettings;

export type DataMiningSettings = {
  windowSize: number;
  stepSize: number;
};

export type ColumnInfo = {
  name: string;
  editName: string;
  fontsInfo: FontsInfo;
  fontOptions: ValidFontOptions[];
  on: boolean;
  popup: string;
  children: ColumnInfo[];
  parent: string | null;
  subInfo?: SubInfo[];
  minAge: number;
  maxAge: number;
  show: boolean;
  expanded: boolean;
  enableTitle: boolean;
  columnDisplayType: DisplayedColumnTypes;
  rgb: RGB;
  width?: number;
  units: string;
  showAgeLabels?: boolean;
  showUncertaintyLabels?: boolean;
  columnSpecificSettings?: ColumnSpecificSettings;
};

export type RangeSort = "first occurrence" | "last occurrence" | "alphabetical";
export type EventFrequency = "FAD" | "LAD" | "Combined Events";

export type EventSettings = {
  type: EventType;
  rangeSort: RangeSort;
  frequency: EventFrequency | null;
} & DataMiningSettings;

export type Range = ColumnHeaderProps & {
  subRangeInfo: SubRangeInfo[];
};

export type Chron = ColumnHeaderProps & {
  subChronInfo: SubChronInfo[];
};

export type Freehand = ColumnHeaderProps & {
  subFreehandInfo: SubFreehandInfo[];
};

export type PointShape = "nopoints" | "rect" | "circle" | "cross";

export type Point = ColumnHeaderProps & {
  subPointInfo: SubPointInfo[];
  drawLine: boolean;
  drawFill: boolean;
  fill: RGB;
  lowerRange: number;
  upperRange: number;
  smoothed: boolean;
  pointShape: PointShape;
  minX: number;
  maxX: number;
  scaleStep: number;
};

export type Sequence = ColumnHeaderProps & {
  sequenceType: SequenceType;
  subSequenceInfo: SubSequenceInfo[];
};

/**
 * NOTE: This implementation gets rid of a lot of the freehand info
 * This is due to the structure being more complicated on various lines.
 * For the current TSCOnline as of 1.0 we don't need that information.
 * If we ever want to add that implementation, we would change this
 * but that would be a considerable amount of time and is something for the future.
 * (This is because we are using a stream reading line by line in parse-datapacks)
 */
export type SubFreehandInfo = {
  topAge: number;
  baseAge: number;
};

export type SubSequenceInfo = {
  label?: string;
  direction: "SB" | "MFS";
  age: number;
  severity: "Major" | "Minor" | "Medium";
  popup: string;
};

export type SubChronInfo = {
  polarity: "TOP" | "N" | "R" | "U" | "No Data" | "Unknown";
  label?: string;
  age: number;
  popup: string;
};

export type SubPointInfo = {
  age: number;
  xVal: number;
  popup: string;
};

export type SubRangeInfo = {
  label: string;
  age: number;
  abundance: "TOP" | "missing" | "rare" | "common" | "frequent" | "abundant" | "sample" | "flood";
  popup: string;
};

export type SubEventType = "FAD" | "LAD" | "EVENT" | "EVENTS";

export type SubEventInfo = {
  label: string;
  age: number;
  lineStyle: "solid" | "dashed" | "dotted";
  popup: string;
  subEventType: SubEventType;
};

export type SubFaciesInfo = {
  rockType: string; // rock type that is the name of the png in /public/patterns/
  label?: string; // the label
  age: number; // the base age of the facies time block
  info: string;
};

export type Facies = ColumnHeaderProps & {
  subFaciesInfo: SubFaciesInfo[];
};

export type Event = ColumnHeaderProps & {
  subEventInfo: SubEventInfo[];
};

export type Block = ColumnHeaderProps & {
  subBlockInfo: SubBlockInfo[];
};
export type Transect = ColumnHeaderProps & {
  subTransectInfo: SubTransectInfo[];
};

/**
 * The structure of transects in the datapack are complicated so I will
 * not be doing the deconstructing of the data since there is no added benefit
 * However, if we for some reason want to access it or parse it
 * I will leave this open to add more properties
 */
export type SubTransectInfo = {
  age: number;
};

export type ChartResponseInfo = {
  chartpath: string; // path to the chart
  hash: string; // hash for where it is stored
};

export type MapTransect = {
  startMapPoint: string;
  endMapPoint: string;
  note?: string;
};
export type Transects = {
  [name: string]: MapTransect;
};
export type MapPoint = {
  lat: number;
  lon: number;
  default?: string;
  minage?: number;
  maxage?: number;
  note?: string;
};
export type MapPoints = {
  [name: string]: MapPoint;
};

export type InfoPoint = {
  lat: number;
  lon: number;
  note?: string;
};

export type InfoPoints = {
  [name: string]: InfoPoint;
};

export type MapInfo = {
  [name: string]: {
    name: string;
    img: string; // the image corresponding to the map image
    note?: string; // any notes on the map
    parent?: ParentMap; // the parent map this map exists in
    coordtype: string; // the coord type of the map
    bounds: Bounds; // the bounds associated with the coordtype
    mapPoints: MapPoints; // the map points associated with the map
    infoPoints?: InfoPoints; // informational points
    transects?: Transects; // transects that connect map points
  };
};

export type ParentMap = {
  name: string; // the name of the parent map
  coordtype: string; // the coord type of the parent map
  bounds: Bounds; // the bounds associated with the bounds
};
export type MapHierarchy = {
  [parent: string]: string[]; // keep track of the children maps of the parent
};

export type Bounds = RectBounds | VertBounds;

export type RectBounds = {
  upperLeftLon: number;
  upperLeftLat: number;
  lowerRightLon: number;
  lowerRightLat: number;
};

export type VertBounds = {
  centerLat: number;
  centerLon: number;
  height: number;
  scale: number;
};

export type TimescaleItem = {
  key: string;
  value: number;
};

export type DefaultChronostrat = "USGS" | "UNESCO";

export function assertDatapackConfigForChartRequest(o: any): asserts o is DatapackConfigForChartRequest {
  if (!o || typeof o !== "object") throw new Error("DatapackConfigForChartRequest must be a non-null object");
  if (typeof o.file !== "string") throwError("DatapackConfigForChartRequest", "filename", "string", o.file);
  if (typeof o.title !== "string") throwError("DatapackConfigForChartRequest", "title", "string", o.title);
  assertDatapackType(o);
}

export function assertChartErrorResponse(o: any): asserts o is ChartErrorResponse {
  if (!o || typeof o !== "object") throw new Error("ChartErrorResponse must be a non-null object");
  if (typeof o.error !== "string") throwError("ChartErrorResponse", "error", "string", o.error);
  if (typeof o.errorCode !== "number") throwError("ChartErrorResponse", "errorCode", "number", o.errorCode);
}

export function isDefaultChronostrat(o: any): o is DefaultChronostrat {
  return /^(USGS|UNESCO)$/.test(o);
}

export function isDateValid(date: string): boolean {
  for (const format of validDateFormats) {
    try {
      if (validator.isDate(date, { format, delimiters: ["-", ".", "/"] })) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

export function assertAdminSharedUserArray(o: any): asserts o is AdminSharedUser[] {
  if (!Array.isArray(o)) throw new Error("AdminSharedUser must be an array");
  for (const user of o) {
    assertAdminSharedUser(user);
  }
}

export function assertAdminSharedUser(o: any): asserts o is AdminSharedUser {
  if (!o || typeof o !== "object") throw new Error("AdminSharedUser must be a non-null object");
  if (typeof o.userId !== "number") throwError("AdminSharedUser", "userId", "number", o.userId);
  if (typeof o.uuid !== "string") throwError("AdminSharedUser", "uuid", "string", o.uuid);
  if (typeof o.emailVerified !== "boolean") throwError("AdminSharedUser", "emailVerified", "boolean", o.emailVerified);
  if (typeof o.invalidateSession !== "boolean")
    throwError("AdminSharedUser", "invalidateSession", "boolean", o.invalidateSession);
  assertSharedUser(o);
}
export function assertSharedUser(o: any): asserts o is SharedUser {
  if (!o || typeof o !== "object") throw new Error("User must be a non-null object");
  if (typeof o.username !== "string") throwError("User", "username", "string", o.username);
  if (typeof o.email !== "string") throwError("User", "email", "string", o.email);
  if (o.pictureUrl && typeof o.pictureUrl !== "string") throwError("User", "pictureUrl", "string", o.pictureUrl);
  if (typeof o.isGoogleUser !== "boolean") throwError("User", "isGoogleUser", "boolean", o.isGoogleUser);
  if (typeof o.isAdmin !== "boolean") throwError("User", "isAdmin", "boolean", o.isAdmin);
}

export function assertFreehand(o: any): asserts o is Freehand {
  if (!o || typeof o !== "object") throw new Error("Freehand must be a non-null object");
  if (!Array.isArray(o.subFreehandInfo)) throwError("Freehand", "subFreehandInfo", "array", o.subFreehandInfo);
  for (const subFreehand of o.subFreehandInfo) {
    assertSubFreehandInfo(subFreehand);
  }
}
export function assertTransect(o: any): asserts o is Transect {
  if (!o || typeof o !== "object") throw new Error("Transect must be a non-null object");
  if (!Array.isArray(o.subTransectInfo)) throwError("Transect", "subTransectInfo", "array", o.subTransectInfo);
  for (const subTransect of o.subTransectInfo) {
    assertSubTransectInfo(subTransect);
  }
}

export function assertPointSettings(o: any): asserts o is PointSettings {
  if (!o || typeof o !== "object") throw new Error("PointSettings must be a non-null object");
  if (typeof o.minX !== "number") throwError("PointSettings", "minX", "number", o.minX);
  if (typeof o.maxX !== "number") throwError("PointSettings", "maxX", "number", o.maxX);
  if (typeof o.drawLine !== "boolean") throwError("PointSettings", "drawLine", "boolean", o.drawLine);
  if (typeof o.drawFill !== "boolean") throwError("PointSettings", "drawFill", "boolean", o.drawFill);
  if (typeof o.drawScale !== "boolean") throwError("PointSettings", "drawScale", "boolean", o.drawScale);
  if (typeof o.drawCurveGradient !== "boolean")
    throwError("PointSettings", "drawCurveGradient", "boolean", o.drawCurveGradient);
  if (typeof o.drawBackgroundGradient !== "boolean")
    throwError("PointSettings", "drawBackgroundGradient", "boolean", o.drawBackgroundGradient);
  assertRGB(o.backgroundGradientStart);
  assertRGB(o.backgroundGradientEnd);
  assertRGB(o.curveGradientStart);
  assertRGB(o.curveGradientEnd);
  assertRGB(o.lineColor);
  if (typeof o.flipScale !== "boolean") throwError("PointSettings", "flipScale", "boolean", o.flipScale);
  if (typeof o.scaleStart !== "number") throwError("PointSettings", "scaleStart", "number", o.scaleStart);
  if (typeof o.scaleStep !== "number") throwError("PointSettings", "scaleStep", "number", o.scaleStep);
  assertRGB(o.fill);
  if (typeof o.pointShape !== "string" || !isPointShape(o.pointShape))
    throwError("PointSettings", "pointShape", "string", o.pointShape);
  if (typeof o.lowerRange !== "number") throwError("PointSettings", "lowerRange", "number", o.lowerRange);
  if (typeof o.upperRange !== "number") throwError("PointSettings", "upperRange", "number", o.upperRange);
  if (typeof o.smoothed !== "boolean") throwError("PointSettings", "smoothed", "boolean", o.smoothed);
  if (o.dataMiningPointDataType != null && !isDataMiningPointDataType(o.dataMiningPointDataType))
    throwError(
      "PointSettings",
      "dataMiningPointDataType",
      "string and Frequency | Maximum Value | Minimum Value | Average Value | Rate of Change | Overlay",
      o.dataMiningPointDataType
    );
  assertDataMiningSettings(o);
}

export function assertDataMiningSettings(o: any): asserts o is DataMiningSettings {
  if (!o || typeof o !== "object") throw new Error("DataMiningSettings must be a non-null object");
  if (typeof o.windowSize !== "number") throwError("DataMiningSettings", "windowSize", "number", o.windowSize);
  if (typeof o.stepSize !== "number") throwError("DataMiningSettings", "stepSize", "number", o.stepSize);
}

export function isDataMiningPointDataType(o: any): o is DataMiningPointDataType {
  return /^(Frequency|Maximum Value|Minimum Value|Average Value|Rate of Change|Overlay)$/.test(o);
}
export function isDataMiningChronDataType(o: any): o is DataMiningChronDataType {
  return /^(Frequency)$/.test(o);
}

export function assertRangeSettings(o: any): asserts o is RangeSettings {
  if (!o || typeof o !== "object") throw new Error("RangeSettings must be a non-null object");
  if (typeof o.rangeSort !== "string" || !isRangeSort(o.rangeSort))
    throwError(
      "RangeSettings",
      "rangeSort",
      "string and first occurrence | last occurrence | alphabetical",
      o.rangeSort
    );
  if (typeof o.margin !== "number") throwError("RangeSettings", "margin", "number", o.margin);
  if (typeof o.agePad !== "number") throwError("RangeSettings", "agePad", "number", o.agePad);
}
export function assertRulerSettings(o: any): asserts o is RulerSettings {
  if (!o || typeof o !== "object") throw new Error("RulerSettings must be a non-null object");
  if (typeof o.justification !== "string" || !isRulerJustification(o.justification))
    throwError("RulerSettings", "justification", "string and left | right", o.justification);
}
export function isZoneOrientation(o: any): o is ZoneOrientation {
  return /^(normal|vertical)$/.test(o);
}
export function assertZoneSettings(o: any): asserts o is ZoneSettings {
  if (!o || typeof o !== "object") throw new Error("ZoneSettings must be a non-null object");
  if (typeof o.orientation !== "string" || !isZoneOrientation(o.orientation))
    throwError("ZoneSettings", "orientation", "string and normal | vertical", o.orientation);
}
export function assertEventSettings(o: any): asserts o is EventSettings {
  if (!o || typeof o !== "object") throw new Error("EventSettings must be a non-null object");
  if (typeof o.type !== "string" || !isEventType(o.type))
    throwError("EventSettings", "type", "string and events | ranges", o.type);
  if (typeof o.rangeSort !== "string" || !isRangeSort(o.rangeSort))
    throwError(
      "EventSettings",
      "rangeSort",
      "string and first occurrence | last occurrence | alphabetical",
      o.rangeSort
    );
  if (o.frequency != null && (typeof o.frequency !== "string" || !isEventFrequency(o.frequency)))
    throwError("EventSettings", "frequency", "string and FAD | LAD | Combined", o.frequency);
  assertDataMiningSettings(o);
}

export function assertSequenceSettings(o: any): asserts o is SequenceSettings {
  if (!o || typeof o !== "object") throw new Error("SequenceSettings must be a non-null object");
  if (typeof o.type !== "string" || !isSequenceType(o.type))
    throwError("SequenceSettings", "type", "string and sequence | trend", o.type);
  if (typeof o.labelMarginLeft !== "number")
    throwError("SequenceSettings", "labelMarginLeft", "number", o.labelMarginLeft);
  if (typeof o.labelMarginRight !== "number")
    throwError("SequenceSettings", "labelMarginRight", "number", o.labelMarginRight);
  if (typeof o.graphStyle !== "string") throwError("SequenceSettings", "graphStyle", "string", o.graphStyle);
  if (typeof o.drawNameLabel !== "boolean") throwError("SequenceSettings", "drawNameLabel", "boolean", o.drawNameLabel);
}
export function isRulerJustification(o: any): o is RulerJustification {
  return /^(left|right)$/.test(o);
}

export function isSequenceType(o: any): o is SequenceType {
  return /^(sequence|trend)$/.test(o);
}

export function isEventFrequency(o: any): o is EventFrequency {
  return /^(FAD|LAD|Combined Events)$/.test(o);
}

export function assertMapPackInfoChunk(o: any): asserts o is MapPackInfoChunk {
  if (!o || typeof o !== "object") throw new Error("MapPackInfoChunk must be a non-null object");
  if (typeof o.totalChunks !== "number") throwError("MapPackInfoChunk", "totalChunks", "number", o.totalChunks);
  assertMapPackIndex(o.mapPackIndex);
}

export function assertDatapackInfoChunk(o: any): asserts o is DatapackInfoChunk {
  if (!o || typeof o !== "object") throw new Error("DatapackInfoChunk must be a non-null object");
  if (typeof o.totalChunks !== "number") throwError("DatapackInfoChunk", "totalChunks", "number", o.totalChunks);
  assertDatapackIndex(o.datapackIndex);
}

export function assertSubFreehandInfo(o: any): asserts o is SubFreehandInfo {
  if (!o || typeof o !== "object") throw new Error("SubFreehandInfo must be a non-null object");
  if (typeof o.topAge !== "number" || isNaN(o.topAge)) throwError("SubFreehandInfo", "topAge", "number", o.topAge);
  if (typeof o.baseAge !== "number" || isNaN(o.baseAge)) throwError("SubFreehandInfo", "baseAge", "number", o.baseAge);
}

export function assertSubTransectInfo(o: any): asserts o is SubTransectInfo {
  if (!o || typeof o !== "object") throw new Error("SubTransectInfo must be a non-null object");
  if (typeof o.age !== "number") throwError("SubTransectInfo", "age", "number", o.age);
}

export function isPointShape(o: any): o is PointShape {
  return /^(nopoints|rect|circle|cross)$/.test(o);
}

export function assertPoint(o: any): asserts o is Point {
  if (!o || typeof o !== "object") throw new Error("Point must be a non-null object");
  if (!Array.isArray(o.subPointInfo)) throwError("Point", "subPointInfo", "array", o.subPointInfo);
  for (const subPoint of o.subPointInfo) {
    assertSubPointInfo(subPoint);
  }
  if (typeof o.minX !== "number") throwError("Point", "minX", "number", o.minX);
  if (typeof o.maxX !== "number") throwError("Point", "maxX", "number", o.maxX);
  if (typeof o.drawLine !== "boolean") throwError("Point", "drawLine", "boolean", o.drawLine);
  if (typeof o.lowerRange !== "number") throwError("Point", "lowerRange", "number", o.lowerRange);
  if (typeof o.upperRange !== "number") throwError("Point", "upperRange", "number", o.upperRange);
  if (typeof o.smoothed !== "boolean") throwError("Point", "smoothed", "boolean", o.smoothed);
  if (typeof o.pointShape !== "string" || !isPointShape(o.pointShape))
    throwError("Point", "pointShape", "string", o.pointShape);
  if (typeof o.drawFill !== "boolean") throwError("Point", "drawFill", "boolean", o.drawFill);
  assertRGB(o.fill);
  assertColumnHeaderProps(o);
}
export function assertSubPointInfoArray(o: any): asserts o is SubPointInfo[] {
  if (!Array.isArray(o)) throw new Error("SubPointInfo must be an array");
  for (const subPoint of o) {
    assertSubPointInfo(subPoint);
  }
}
export function assertSubPointInfo(o: any): asserts o is SubPointInfo {
  if (!o || typeof o !== "object") throw new Error("SubPointInfo must be a non-null object");
  if (typeof o.age !== "number") throwError("SubPointInfo", "age", "number", o.age);
  if (typeof o.xVal !== "number") throwError("SubPointInfo", "xVal", "number", o.xVal);
  if (typeof o.popup !== "string") throwError("SubPointInfo", "popup", "string", o.popup);
}
export function assertSequence(o: any): asserts o is Sequence {
  if (!o || typeof o !== "object") throw new Error("Sequence must be a non-null object");
  if (typeof o.sequenceType !== "string" || !isSequenceType(o.sequenceType))
    throwError("SequenceSettings", "sequenceType", "string and sequence | trend", o.type);
  if (!Array.isArray(o.subSequenceInfo)) throwError("Sequence", "subSequenceInfo", "array", o.subSequenceInfo);
  for (const subSequence of o.subSequenceInfo) {
    assertSubSequenceInfo(subSequence);
  }
  assertColumnHeaderProps(o);
}

export function assertSubSequenceInfo(o: any): asserts o is SubSequenceInfo {
  if (!o || typeof o !== "object") throw new Error("SubSequenceInfo must be a non-null object");
  if (o.label && typeof o.label !== "string") throwError("SubSequenceInfo", "label", "string", o.label);
  if (typeof o.direction !== "string" || !/^(SB|MFS)$/.test(o.direction))
    throwError("SubSequenceInfo", "direction", "string and SB | MFS", o.direction);
  if (typeof o.age !== "number") throwError("SubSequenceInfo", "age", "number", o.age);
  if (typeof o.severity !== "string" || !/^(Major|Minor|Medium)$/.test(o.severity))
    throwError("SubSequenceInfo", "severity", "string and Major | Minor | Medium", o.severity);
  if (typeof o.popup !== "string") throwError("SubSequenceInfo", "popup", "string", o.popup);
}

export function assertChron(o: any): asserts o is Chron {
  if (!o || typeof o !== "object") throw new Error("Chron must be a non-null object");
  assertSubChronInfoArray(o.subChronInfoArray);
}
export function assertSubChronInfoArray(o: any): asserts o is SubChronInfo[] {
  if (!Array.isArray(o)) throw new Error("SubChronInfoArray must be an array");
  for (const subChron of o) {
    assertSubChronInfo(subChron);
  }
}
export function assertSubChronInfo(o: any): asserts o is SubChronInfo {
  if (!o || typeof o !== "object") throw new Error("SubChronInfo must be a non-null object");
  if (typeof o.polarity !== "string" || !/^(TOP|N|R|U|No Data|Unknown)$/.test(o.polarity))
    throwError("SubChronInfo", "polarity", "string and TOP | N | R| U | No Data", o.polarity);
  if (o.label && typeof o.label !== "string") throwError("SubChronInfo", "label", "string", o.label);
  if (typeof o.age !== "number") throwError("SubChronInfo", "age", "number", o.age);
  if (typeof o.popup !== "string") throwError("SubChronInfo", "popup", "string", o.popup);
}
export function assertSubRangeInfo(o: any): asserts o is SubRangeInfo {
  if (!o || typeof o !== "object") throw new Error("SubRangeInfo must be a non-null object");
  if (typeof o.label !== "string") throwError("SubRangeInfo", "label", "string", o.label);
  if (typeof o.age !== "number") throwError("SubRangeInfo", "age", "number", o.age);
  if (typeof o.abundance !== "string") throwError("SubRangeInfo", "abundance", "string", o.abundance);
  if (!/^(TOP|missing|rare|common|frequent|abundant|sample|flood)$/.test(o.abundance))
    throwError(
      "SubRangeInfo",
      "abundance",
      "TOP | missing | rare | common | frequent | abundant | sample | flood",
      o.abundance
    );
  if (typeof o.popup !== "string") throwError("SubRangeInfo", "popup", "string", o.popup);
}
export function assertRange(o: any): asserts o is Range {
  if (!o || typeof o !== "object") throw new Error("Range must be a non-null object");
  if (!Array.isArray(o.subRangeInfo)) throwError("Range", "subRangeInfo", "array", o.subRangeInfo);
  for (const subRange of o.subRangeInfo) {
    assertSubRangeInfo(subRange);
  }
  assertColumnHeaderProps(o);
}
export function assertColumnHeaderProps(o: any): asserts o is ColumnHeaderProps {
  if (!o || typeof o !== "object") throw new Error("ColumnHeaderProps must be an object");
  if (typeof o.name !== "string") throwError("ColumnHeaderProps", "name", "string", o.name);
  if (typeof o.minAge !== "number") throwError("ColumnHeaderProps", "minAge", "number", o.minAge);
  if (typeof o.maxAge !== "number") throwError("ColumnHeaderProps", "maxAge", "number", o.maxAge);
  if (typeof o.enableTitle !== "boolean") throwError("ColumnHeaderProps", "enableTitle", "boolean", o.enableTitle);
  if (typeof o.on !== "boolean") throwError("ColumnHeaderProps", "on", "boolean", o.on);
  if (typeof o.width !== "number") throwError("ColumnHeaderProps", "width", "number", o.width);
  if (typeof o.popup !== "string") throwError("ColumnHeaderProps", "popup", "string", o.popup);
  assertRGB(o.rgb);
}
export function assertRGB(o: any): asserts o is RGB {
  if (!o || typeof o !== "object") throw new Error("RGB must be a non-null object");
  if (typeof o.r !== "number") throwError("RGB", "r", "number", o.r);
  if (o.r < 0 || o.r > 255) throwError("RGB", "r", "number between 0 and 255", o.r);
  if (typeof o.g !== "number") throwError("RGB", "g", "number", o.rgb.g);
  if (o.g < 0 || o.g > 255) throwError("RGB", "g", "number between 0 and 255", o.g);
  if (typeof o.b !== "number") throwError("RGB", "b", "number", o.b);
  if (o.b < 0 || o.b > 255) throwError("RGB", "b", "number between 0 and 255", o.b);
}

export function assertEvent(o: any): asserts o is Event {
  if (!o || typeof o !== "object") throw new Error("Event must be a non-null object");
  if (!Array.isArray(o.subEventInfo)) throwError("Event", "subEventInfo", "array", o.subEventInfo);
  for (const subEvent of o.subEventInfo) {
    assertSubEventInfo(subEvent);
  }
  assertColumnHeaderProps(o);
}
export function assertSubEventInfoArray(o: any): asserts o is SubEventInfo[] {
  if (!Array.isArray(o)) throw new Error("SubEventInfo must be an array");
  for (const subEvent of o) {
    assertSubEventInfo(subEvent);
  }
}

export function assertSubEventInfo(o: any): asserts o is SubEventInfo {
  if (!o || typeof o !== "object") throw new Error("SubEventInfo must be a non-null object");
  if (typeof o.label !== "string") throwError("SubEventInfo", "label", "string", o.label);
  if (typeof o.age !== "number") throwError("SubEventInfo", "age", "number", o.age);
  if (typeof o.popup !== "string") throwError("SubEventInfo", "popup", "string", o.popup);
  if (typeof o.lineStyle !== "string" || !/(^dotted|dashed|solid)$/.test(o.lineStyle))
    throwError("SubEventInfo", "lineStyle", "dotted | dashed | solid", o.lineStyle);
  if (typeof o.subEventType !== "string" || !isSubEventType(o.subEventType))
    throwError("SubEventInfo", "subEventType", "FAD | LAD | EVENT", o.subEventType);
}

export function assertColor(o: any): asserts o is Color {
  if (!o || typeof o !== "object") throw new Error("Color must be a non-null object");
  if (typeof o.name !== "string") throwError("Color", "name", "string", o.color);
  if (typeof o.hex !== "string") throwError("Color", "hex", "string", o.hex);
  assertRGB(o.rgb);
}
export function assertPatterns(o: any): asserts o is Patterns {
  if (!o || typeof o !== "object") throw new Error("Patterns must be a non-null object");
  for (const key in o) {
    const pattern = o[key];
    if (typeof pattern.name !== "string") throwError("Patterns", "name", "string", pattern.name);
    if (typeof pattern.formattedName !== "string")
      throwError("Patterns", "formattedName", "string", pattern.formattedName);
    if (typeof pattern.filePath !== "string") throwError("Patterns", "filePath", "string", pattern.filePath);
    assertColor(pattern.color);
  }
}

export function assertDatapackMetadata(o: any): asserts o is DatapackMetadata {
  if (!o || typeof o !== "object") throw new Error("DatapackMetadata must be a non-null object");
  if (typeof o.description !== "string") throw new Error("DatapackMetadata description must be of type string");
  if (typeof o.title !== "string") throw new Error("DatapackMetadata title must be of type string");
  if (typeof o.file !== "string") throw new Error("DatapackMetadata file must be of type string");
  if (typeof o.size !== "string") throw new Error("DatapackMetadata size must be of type string");
  if (typeof o.authoredBy !== "string") throw new Error("DatapackMetadata authoredBy must be of type string");
  if (!Array.isArray(o.tags)) throw new Error("DatapackMetadata tags must be an array");
  for (const tag of o.tags) {
    if (typeof tag !== "string") throw new Error("DatapackMetadata tags must be an array of strings");
  }
  if (o.date && typeof o.date !== "string") throw new Error("DatapackMetadata date must be of type string");
  if (!Array.isArray(o.references)) throw new Error("DatapackMetadata references must be an array");
  for (const reference of o.references) {
    if (typeof reference !== "string") throw new Error("DatapackMetadata references must be an array of strings");
  }
  if ("contact" in o && typeof o.contact !== "string") throw new Error("DatapackMetadata contact must be a string");
  if ("notes" in o && typeof o.notes !== "string") throw new Error("DatapackMetadata notes must be a string");
}
export function assertDatapackMetadataArray(o: any): asserts o is DatapackMetadata[] {
  if (!Array.isArray(o)) throw new Error("DatapackMetadata must be an array");
  for (const metadata of o) {
    assertDatapackMetadata(metadata);
  }
}
export function assertMapPackIndex(o: any): asserts o is MapPackIndex {
  if (!o || typeof o !== "object") throw new Error("MapPackIndex must be a non-null object");
  for (const key in o) {
    assertMapPack(o[key]);
  }
}
export function assertMapPack(o: any): asserts o is MapPack {
  if (!o || typeof o !== "object") throw new Error("MapPack must be a non-null object");
  assertMapInfo(o.mapInfo);
  assertMapHierarchy(o.mapHierarchy);
}
export function assertPresets(o: any): asserts o is Presets {
  if (!o || typeof o !== "object") throw new Error("Presets must be a non-null object");
  for (const type in o) {
    for (const config of o[type]) {
      assertChartConfig(config);
    }
  }
}
export function assertMapTransect(o: any): asserts o is Transects[string] {
  if (!o || typeof o !== "object") throw new Error("MapTransect must be a non-null object");
  if (typeof o.startMapPoint !== "string") throwError("MapTransect", "startMapPoint", "string", o.startMapPoint);
  if (typeof o.endMapPoint !== "string") throwError("MapTransect", "endMapPoint", "string", o.endMapPoint);
  if ("note" in o && typeof o.note !== "string") throwError("MapTransect", "note", "string", o.note);
}
export function assertTransects(o: any): asserts o is Transects {
  if (!o || typeof o !== "object") throw new Error("Transects must be a non-null object");
  for (const key in o) {
    const transect = o[key];
    if (typeof transect.startMapPoint !== "string")
      throw new Error(`Transects key ${key} value of startMapPoint must be a string`);
    if (typeof transect.endMapPoint !== "string")
      throw new Error(`Transects key ${key} value of endMapPoint must be a string`);
    if ("note" in transect && typeof transect.note !== "string")
      throw new Error(`Transects key ${key} value of note must be a string`);
  }
}
export function assertDatapack(o: any): asserts o is Datapack {
  if (!o || typeof o !== "object") throw new Error("Datapack must be a non-null object");
  if (typeof o.type !== "string") throwError("Datapack", "type", "string", o.type);
  assertDatapackType(o);
  assertBaseDatapackProps(o);
}
export function isServerDatapack(o: any): o is ServerDatapack {
  return o.type === "server";
}
export function isWorkshopDatapack(o: any): o is WorkshopDatapack {
  return o.type === "workshop";
}
export function isPublicUserDatapack(o: any): o is PublicUserDatapack {
  return o.type === "public_user" && typeof o.uuid === "string";
}
export function isUserDatapack(o: any): o is PublicUserDatapack | PrivateUserDatapack {
  return isPublicUserDatapack(o) || isPrivateUserDatapack(o);
}
export function isPrivateUserDatapack(o: any): o is PrivateUserDatapack {
  return o.type === "private_user" && typeof o.uuid === "string";
}
export function assertServerDatapackWithBaseProps(o: any): asserts o is ServerDatapack & BaseDatapackProps {
  assertServerDatapack(o);
  assertBaseDatapackProps(o);
}
export function assertWorkshopDatapackWithBaseProps(o: any): asserts o is WorkshopDatapack & BaseDatapackProps {
  assertWorkshopDatapack(o);
  assertBaseDatapackProps(o);
}
export function assertPublicUserDatapackWithBaseProps(o: any): asserts o is PublicUserDatapack & BaseDatapackProps {
  assertPublicUserDatapack(o);
  assertBaseDatapackProps(o);
}
export function assertPrivateUserDatapackWithBaseProps(o: any): asserts o is PrivateUserDatapack & BaseDatapackProps {
  assertPrivateUserDatapack(o);
  assertBaseDatapackProps(o);
}
export function assertServerDatapackIndex(o: any): asserts o is ServerDatapackIndex {
  if (!o || typeof o !== "object") throw new Error("ServerDatapackIndex must be a non-null object");
  for (const key in o) {
    assertServerDatapackWithBaseProps(o[key]);
  }
}
export function assertWorkshopDatapackIndex(o: any): asserts o is WorkshopDatapackIndex {
  if (!o || typeof o !== "object") throw new Error("WorkshopDatapackIndex must be a non-null object");
  for (const key in o) {
    assertWorkshopDatapackWithBaseProps(o[key]);
  }
}
export function assertPublicUserDatapackIndex(o: any): asserts o is PublicUserDatapackIndex {
  if (!o || typeof o !== "object") throw new Error("PublicUserDatapackIndex must be a non-null object");
  for (const key in o) {
    assertPublicUserDatapackWithBaseProps(o[key]);
  }
}
export function assertPrivateUserDatapackIndex(o: any): asserts o is PrivateUserDatapackIndex {
  if (!o || typeof o !== "object") throw new Error("PrivateUserDatapackIndex must be a non-null object");
  for (const key in o) {
    assertPrivateUserDatapackWithBaseProps(o[key]);
  }
}
export function assertDatapackType(o: any): asserts o is DatapackType {
  if (!o || typeof o !== "object") throw new Error("DatapackType must be a non-null object");
  switch (o.type) {
    case "private_user":
      assertPrivateUserDatapack(o);
      break;
    case "public_user":
      assertPublicUserDatapack(o);
      break;
    case "server":
      assertServerDatapack(o);
      break;
    case "workshop":
      assertWorkshopDatapack(o);
      break;
    default:
      throwError("Datapack", "type", "private_user | public_user | server | workshop", o.type);
  }
}
export function assertServerDatapack(o: any): asserts o is ServerDatapack {
  if (!o || typeof o !== "object") throw new Error("ServerDatapack must be a non-null object");
  if (typeof o.type !== "string") throwError("ServerDatapack", "type", "string", o.type);
  if (o.type !== "server") throwError("ServerDatapack", "type", "server", o.type);
}
export function assertWorkshopDatapack(o: any): asserts o is WorkshopDatapack {
  if (!o || typeof o !== "object") throw new Error("WorkshopDatapack must be a non-null object");
  if (typeof o.type !== "string") throwError("WorkshopDatapack", "type", "string", o.type);
  if (o.type !== "workshop") throwError("WorkshopDatapack", "type", "workshop", o.type);
}
export function assertPrivateUserDatapack(o: any): asserts o is PrivateUserDatapack {
  if (!o || typeof o !== "object") throw new Error("PrivateUserDatapack must be a non-null object");
  if (typeof o.uuid !== "string") throwError("PrivateUserDatapack", "uuid", "string", o.uuid);
}
export function assertPublicUserDatapack(o: any): asserts o is PublicUserDatapack {
  if (!o || typeof o !== "object") throw new Error("PublicUserDatapack must be a non-null object");
  if (typeof o.uuid !== "string") throwError("PublicUserDatapack", "uuid", "string", o.uuid);
}

export function assertSubBlockInfo(o: any): asserts o is SubBlockInfo {
  if (!o || typeof o !== "object") throw new Error("SubBlockInfo must be a non-null object");
  if (typeof o.label !== "string") throwError("SubBlockInfo", "label", "string", o.label);
  if (typeof o.age !== "number") throwError("SubBlockInfo", "age", "number", o.number);
  if (typeof o.popup !== "string") throwError("SubBlockInfo", "popup", "string", o.popup);
  if (o.lineStyle !== "solid" && o.lineStyle !== "dotted" && o.lineStyle !== "dashed")
    throwError("SubBlockInfo", "lineStyle", "solid, dotted or dashed", o.lineStyle);
  assertRGB(o.rgb);
}

export function assertBlock(o: any): asserts o is Block {
  if (!o || typeof o !== "object") throw new Error("Block must be a non-null object");
  for (const subBlockInfo of o.subBlockInfo) {
    assertSubBlockInfo(subBlockInfo);
  }
  assertColumnHeaderProps(o);
}

export function assertSubFaciesInfoArray(o: any): asserts o is SubFaciesInfo[] {
  if (!o || typeof o !== "object") throw new Error("SubFaciesInfoArray must be an object");
  if (!Array.isArray(o)) throw new Error("SubFaciesInfoArray must be an array");
  for (const subFacies of o) {
    assertSubFaciesInfo(subFacies);
  }
}

export function assertFacies(o: any): asserts o is Facies {
  if (!o || typeof o !== "object") throw new Error("Facies must be a non-null object");
  assertSubFaciesInfoArray(o.subFaciesInfo);
  assertColumnHeaderProps(o);
}
export function assertBaseDatapackProps(o: any): asserts o is BaseDatapackProps {
  if (!o || typeof o !== "object") throw new Error("BaseDatapackProps must be a non-null object");
  if (typeof o.ageUnits !== "string") throwError("BaseDatapackProps", "ageUnits", "string", o.ageUnits);
  if (typeof o.defaultChronostrat !== "string")
    throwError("BaseDatapackProps", "defaultChronostrat", "string", o.defaultChronostrat);
  if (!/^(USGS|UNESCO)$/.test(o.defaultChronostrat))
    throwError("BaseDatapackProps", "defaultChronostrat", "USGS | UNESCO", o.defaultChronostrat);
  if (typeof o.formatVersion !== "number") throwError("BaseDatapackProps", "formatVersion", "number", o.formatVersion);
  if ("verticalScale" in o && typeof o.verticalScale !== "number")
    throwError("BaseDatapackProps", "verticalScale", "number", o.verticalScale);
  if ("date" in o && (typeof o.date !== "string" || !isDateValid(o.date)))
    throwError("BaseDatapackProps", "date", "string", o.date);
  if ("topAge" in o && typeof o.topAge !== "number") throwError("BaseDatapackProps", "topAge", "number", o.topAge);
  if ("baseAge" in o && typeof o.baseAge !== "number") throwError("BaseDatapackProps", "baseAge", "number", o.baseAge);
  if ("uuid" in o && typeof o.uuid !== "string") throwError("BaseDatapackProps", "uuid", "string", o.uuid);
  if (typeof o.description !== "string") throwError("BaseDatapackProps", "description", "string", o.description);
  if (typeof o.title !== "string") throwError("BaseDatapackProps", "title", "string", o.title);
  if (typeof o.file !== "string") throwError("BaseDatapackProps", "file", "string", o.file);
  if (typeof o.size !== "string") throwError("BaseDatapackProps", "size", "string", o.size);
  if ("warnings" in o) {
    if (!Array.isArray(o.warnings)) throwError("BaseDatapackProps", "warnings", "array", o.warnings);
    for (const warning of o.warnings) {
      assertDatapackWarning(warning);
    }
  }
  if (typeof o.image !== "string") throwError("BaseDatapackProps", "image", "string", o.image);
  assertsColumnTypeCounter(o.columnTypeCount);
  if (typeof o.totalColumns !== "number") throwError("BaseDatapackProps", "totalColumns", "number", o.totalColumns);
  if (typeof o.authoredBy !== "string") throwError("BaseDatapackProps", "authoredBy", "string", o.author);
  if (!Array.isArray(o.tags)) throwError("BaseDatapackProps", "tags", "array", o.tags);
  for (const tag of o.tags) {
    if (typeof tag !== "string") throwError("BaseDatapackProps", "tag", "string", tag);
  }
  if (!Array.isArray(o.references)) throwError("BaseDatapackProps", "references", "array", o.references);
  for (const reference of o.references) {
    if (typeof reference !== "string") throwError("BaseDatapackProps", "reference", "string", reference);
  }
  if ("contact" in o && typeof o.contact !== "string") throwError("BaseDatapackProps", "contact", "string", o.contact);
  if ("notes" in o && typeof o.notes !== "string") throwError("BaseDatapackProps", "notes", "string", o.notes);
  if (typeof o.datapackImageCount !== "number")
    throwError("BaseDatapackProps", "datapackImageCount", "number", o.datapackImages);
  assertColumnInfo(o.columnInfo);
}

export function assertPresetDatapack(o: any): asserts o is PresetDatapack {
  if (!o || typeof o !== "object") throw new Error("PresetDatapack must be a non-null object");
  if (typeof o.name !== "string") throwError("PresetDatapack", "name", "string", o.name);
  if (typeof o.file !== "string") throwError("PresetDatapack", "file", "string", o.file);
}

export function assertDatapackWarning(o: any): asserts o is DatapackWarning {
  if (!o || typeof o !== "object") throw new Error("DatapackWarning must be a non-null object");
  if ("message" in o && typeof o.message !== "string") throwError("DatapackWarning", "message", "string", o.message);
  if (typeof o.warning !== "string") throwError("DatapackWarning", "warning", "string", o.warning);
  if ("lineNumber" in o && typeof o.lineNumber !== "number")
    throwError("DatapackWarning", "lineNumber", "number", o.lineNumber);
}
export function assertDatapackIndex(o: any): asserts o is DatapackIndex {
  if (!o || typeof o !== "object") throw new Error("DatapackIndex must be a non-null object");
  for (const key in o) {
    const pack = o[key];
    assertDatapack(pack);
  }
}

export function assertSubFaciesInfo(o: any): asserts o is SubFaciesInfo {
  if (!o || typeof o !== "object") throw new Error("SubFaciesInfo must be a non-null object");
  if (typeof o.rockType !== "string") throwError("SubFaciesInfo", "rockType", "string", o.rockType);
  if (typeof o.info !== "string") throwError("SubFaciesInfo", "info", "string", o.info);
  if ("label" in o && typeof o.label !== "string") throwError("SubFaciesInfo", "label", "string", o.label);
  if (typeof o.age !== "number") throwError("SubFaciesInfo", "age", "number", o.age);
}
export function assertChartConfig(o: any): asserts o is ChartConfig {
  if (typeof o !== "object") throw new Error("ChartConfig must be an object");
  if (typeof o.icon !== "string") throwError("ChartConfig", "icon", "string", o.icon);
  if (typeof o.background !== "string") throwError("ChartConfig", "background", "string", o.background);
  if (typeof o.title !== "string") throwError("ChartConfig", "title", "string", o.title);
  if (typeof o.description !== "string") throwError("ChartConfig", "description", "string", o.description);
  if (typeof o.settings !== "string") throwError("ChartConfig", "settings", "string", o.settings);
  if (typeof o.date !== "string") throwError("ChartConfig", "date", "string", o.date);
  if ("type" in o && typeof o.type !== "string") throwError("ChartConfig", "type", "string", o.type);
  if (!Array.isArray(o.datapacks))
    throw new Error("ChartConfig must have a datapacks array of datapack string names.  ");
}

export function assertChartConfigArray(o: any): asserts o is ChartConfig[] {
  if (!o || !Array.isArray(o)) throwError("ChartConfigArray", "ChartConfigArray", "array", o);
  for (const c of o) assertChartConfig(c);
}

export function assertChartRequest(o: any): asserts o is ChartRequest {
  if (typeof o !== "object") throw new Error("ChartRequest must be an object");
  if (typeof o.settings !== "string") throwError("ChartRequest", "settings", "string", o.settings);
  if (!Array.isArray(o.datapacks)) throwError("ChartRequest", "datapacks", "array", o.datapacks);
}

export function isServerResponseError(o: any): o is ServerResponseError {
  if (!o || typeof o !== "object") return false;
  if (typeof o.error !== "string") return false;
  return true;
}

export function assertChartInfo(o: any): asserts o is ChartResponseInfo {
  if (!o || typeof o !== "object") throw new Error("ChartInfo must be an object");
  if (typeof o.chartpath !== "string") throwError("ChartInfo", "chartpath", "string", o.chartpath);
  if (typeof o.hash !== "string") throwError("ChartInfo", "hash", "string", o.hash);
}
export function assertValidFontOptions(o: any): asserts o is ValidFontOptions {
  if (!o || typeof o !== "string") throw new Error("ValidFontOptions must be a string");
  if (
    !/^(Column Header|Age Label|Uncertainty Label|Zone Column Label|Sequence Column Label|Event Column Label|Popup Body|Ruler Label|Point Column Scale Label|Range Label|Ruler Tick Mark Label|Legend Title|Legend Column Name|Legend Column Source|Range Box Label)$/.test(
      o
    )
  )
    throwError("ValidFontOptions", "ValidFontOptions", "ValidFontOptions", o);
}

export function isRGB(o: any): o is RGB {
  if (!o || typeof o !== "object") return false;
  if (typeof o.r !== "number") return false;
  if (o.r < 0 || o.r > 255) return false;
  if (typeof o.g !== "number") return false;
  if (o.g < 0 || o.g > 255) return false;
  if (typeof o.b !== "number") return false;
  if (o.b < 0 || o.b > 255) return false;
  return true;
}

export function isSubFaciesInfoArray(o: any): o is SubFaciesInfo[] {
  if (!o || !Array.isArray(o)) return false;
  for (const sub of o) {
    if (!isSubFaciesInfo(sub)) return false;
  }
  return true;
}

function isSubFaciesInfo(o: any): o is SubFaciesInfo {
  if (!o || typeof o !== "object") return false;
  if (typeof o.rockType !== "string") return false;
  if (typeof o.info !== "string") return false;
  if ("label" in o && typeof o.label !== "string") return false;
  if (typeof o.age !== "number") return false;
  return true;
}

function isSubChronInfo(o: any): o is SubChronInfo {
  if (!o || typeof o !== "object") return false;
  if (typeof o.polarity !== "string") return false;
  if (o.label && typeof o.label !== "string") return false;
  if (typeof o.age !== "number") return false;
  if (typeof o.popup !== "string") return false;
  return true;
}

export function assertSubInfo(o: any, type: DisplayedColumnTypes): asserts o is SubInfo[] {
  if (!o || !Array.isArray(o)) throw new Error("SubInfo must be an array");
  for (const sub of o) {
    if (typeof sub !== "object") throw new Error("SubInfo must be an array of objects");
    switch (type) {
      case "Block":
      case "Zone":
        assertSubBlockInfo(sub);
        break;
      // cases where the column parent inherits facies information
      case "MetaColumn":
        assertSubFaciesInfo(sub);
        break;
      case "Event":
        assertSubEventInfo(sub);
        break;
      case "Range":
        assertSubRangeInfo(sub);
        break;
      case "Chron":
        assertSubChronInfo(sub);
        break;
      case "Point":
        assertSubPointInfo(sub);
        break;
      case "Sequence":
        assertSubSequenceInfo(sub);
        break;
      case "Transect":
        assertSubTransectInfo(sub);
        break;
      case "Freehand":
        assertSubFreehandInfo(sub);
        break;
      case "Facies":
        assertSubFaciesInfo(sub);
        break;
      case "BlockSeriesMetaColumn":
        if (!isSubFaciesInfo(sub) && !isSubChronInfo(sub))
          throw new Error("A block series meta column must have either facies or chronostratigraphy information");
        break;
      default:
        throw new Error("SubInfo must be an array of valid subInfo objects, found value of " + type);
    }
  }
}
export function assertDisplayedColumnTypes(o: any): asserts o is DisplayedColumnTypes {
  if (!o || typeof o !== "string") throwError("DisplayedColumnTypes", "DisplayedColumnTypes", "string", o);
  if (
    !/^(Block|Facies|Event|Range|Chron|Point|Sequence|Transect|Freehand|Zone|Ruler|AgeAge|MetaColumn|BlockSeriesMetaColumn|RootColumn|Blank|Data)$/.test(
      o
    )
  )
    throw new Error("DisplayedColumnTypes must be a string of a valid column type. Found value + " + o);
}

export function assertColumnInfo(o: any): asserts o is ColumnInfo {
  if (typeof o !== "object" || o === null) {
    throw new Error("ColumnInfo must be a non-null object");
  }
  if (typeof o.name !== "string") throwError("ColumnInfo", "name", "string", o.name);
  if (typeof o.editName !== "string") throwError("ColumnInfo", "editName", "string", o.editName);
  if (typeof o.on !== "boolean") throwError("ColumnInfo", "on", "boolean", o.on);
  if (typeof o.popup !== "string") throwError("ColumnInfo", "popup", "string", o.popup);
  if (o.parent !== null && typeof o.parent !== "string") throwError("ColumnInfo", "parent", "string", o.parent);
  if (typeof o.minAge !== "number") throwError("ColumnInfo", "minAge", "number", o.minAge);
  if (typeof o.maxAge !== "number") throwError("ColumnInfo", "maxAge", "number", o.maxAge);
  if ("width" in o && typeof o.width !== "number") throwError("ColumnInfo", "width", "number", o.width);
  if (typeof o.enableTitle !== "boolean") throwError("ColumnInfo", "enableTitle", "boolean", o.enableTitle);
  if (typeof o.units !== "string") throwError("ColumnInfo", "units", "string", o.units);
  if (typeof o.show !== "boolean") throwError("ColumnInfo", "show", "boolean", o.show);
  if (typeof o.expanded !== "boolean") throwError("ColumnInfo", "expanded", "boolean", o.expanded);
  if ("showAgeLabels" in o && typeof o.showAgeLabels !== "boolean")
    throwError("ColumnInfo", "showAgeLabels", "boolean", o.showAgeLabels);
  if ("showUncertaintyLabels" in o && typeof o.showUncertaintyLabels !== "boolean")
    throwError("ColumnInfo", "showUncertaintyLabels", "boolean", o.showUncertaintyLabels);
  if (!Array.isArray(o.fontOptions)) throwError("ColumnInfo", "fontOptions", "array", o.fontOptions);
  for (const fontOption of o.fontOptions) {
    assertValidFontOptions(fontOption);
  }
  assertDisplayedColumnTypes(o.columnDisplayType);
  assertRGB(o.rgb);
  for (const child of o.children) {
    assertColumnInfo(child);
  }
  assertFontsInfo(o.fontsInfo);
  if (o.subInfo) assertSubInfo(o.subInfo, o.columnDisplayType);
  if (o.columnSpecificSettings) assertColumnSpecificSettings(o.columnSpecificSettings, o.columnDisplayType);
}

export function isColumnHeaderProps(o: any): o is ColumnHeaderProps {
  if (!o || typeof o !== "object") return false;
  if (typeof o.name !== "string") return false;
  if (typeof o.minAge !== "number") return false;
  if (typeof o.maxAge !== "number") return false;
  if (typeof o.enableTitle !== "boolean") return false;
  if (typeof o.on !== "boolean") return false;
  if (typeof o.width !== "number") return false;
  if (typeof o.popup !== "string") return false;
  if (!isRGB(o.rgb)) return false;
  return true;
}

export function isFacies(o: any): o is Facies {
  if (typeof o !== "object") return false;
  if (!Array.isArray(o.subFaciesInfo)) return false;
  for (const sub of o.subFaciesInfo) {
    if (!isSubFaciesInfo(sub)) return false;
  }
  if (!isColumnHeaderProps(o)) return false;
  return true;
}

export function assertColumnSpecificSettings(o: any, type: DisplayedColumnTypes): asserts o is ColumnSpecificSettings {
  switch (type) {
    case "Event":
      assertEventSettings(o);
      break;
    case "Point":
      assertPointSettings(o);
      break;
    case "Chron":
      assertChronSettings(o);
      break;
    case "Range":
      assertRangeSettings(o);
      break;
    case "Sequence":
      assertSequenceSettings(o);
      break;
    case "Ruler":
      assertRulerSettings(o);
      break;
    case "Zone":
      assertZoneSettings(o);
      break;
    default:
      throw new Error(
        "ColumnSpecificSettings must be an object of a valid column type. Found value of " +
          type +
          " which is not a valid column type"
      );
  }
}

export function assertFontsInfo(o: any): asserts o is FontsInfo {
  if (typeof o !== "object") throw new Error("FontsInfo must be an object");
  for (const key in o) {
    assertValidFontOptions(key);
    assertFontLabelOptions(o[key]);
  }
}

export function assertFontLabelOptions(o: any): asserts o is FontLabelOptions {
  if (typeof o !== "object") throw new Error("FontLabelOptions must be an object");
  if (typeof o.bold !== "boolean") throwError("FontLabelOptions", "bold", "boolean", o.bold);
  if (typeof o.color !== "string") throwError("FontLabelOptions", "color", "string", o.color);
  if (typeof o.fontFace !== "string") throwError("FontLabelOptions", "fontFace", "string", o.fontFace);
  if (typeof o.inheritable !== "boolean") throwError("FontLabelOptions", "inheritable", "boolean", o.inheritable);
  if (typeof o.italic !== "boolean") throwError("FontLabelOptions", "italic", "boolean", o.italic);
  if (typeof o.size !== "number") throwError("FontLabelOptions", "size", "number", o.size);
  if (typeof o.on !== "boolean") throwError("FontLabelOptions", "on", "boolean", o.on);
}

export function assertMapHierarchy(o: any): asserts o is MapHierarchy {
  if (typeof o !== "object" || o === null) throw new Error("MapsHierarchy must be a non-null object");
  for (const key in o) {
    const map = o[key];
    if (!Array.isArray(map)) throwError("MapHierarchy", `value for key ${key}`, "string array", map);
  }
}

export function isEventType(o: any): o is EventType {
  if (typeof o !== "string") return false;
  if (!/^(events|ranges)$/.test(o)) return false;
  return true;
}
export function isRangeSort(o: any): o is RangeSort {
  if (typeof o !== "string") return false;
  if (!/^(first occurrence|last occurrence|alphabetical)$/.test(o)) return false;
  return true;
}

export function isSubFreehandInfo(o: any): o is SubFreehandInfo {
  if (typeof o !== "object") return false;
  if (typeof o.baseAge !== "number") return false;
  if (typeof o.topAge !== "number") return false;
  return true;
}

export function assertMapInfo(o: any): asserts o is MapInfo {
  if (typeof o !== "object" || o === null) {
    throw new Error("MapInfo must be a non-null object");
  }

  for (const key in o) {
    const map = o[key];

    if (typeof map !== "object" || map === null) {
      throw new Error(`MapInfo' value for key '${key}' must be a non-null object`);
    }
    if (typeof map.name !== "string") throwError("MapInfo", "name", "string", map.name);
    if (typeof map.img !== "string") {
      throw new Error(`MapInfo' value for key '${key}' must have an 'img' string property`);
    }
    if ("note" in map && typeof map.note !== "string") {
      throw new Error(`MapInfo' value for key '${key}' must have a 'note' string property`);
    }
    if (typeof map.coordtype !== "string") {
      throw new Error(`MapInfo' value for key '${key}' must have a 'coordtype' string property`);
    }
    if ("infoPoints" in map) {
      assertInfoPoints(map.infoPoints);
    }
    if ("transects" in map) {
      assertTransects(map.transects);
    }
    assertBounds(map.coordtype, map.bounds);
    assertMapPoints(map.mapPoints);
  }
}

export function assertParentMap(parent: any): asserts parent is ParentMap {
  if (typeof parent! !== "object" || parent == null) {
    throw new Error(`Parent must be a non-nul object`);
  }
  if (typeof parent.name !== "string") {
    throw new Error(`Parent must have a name string property`);
  }
  if (typeof parent.coordtype !== "string") {
    throw new Error(`Parent must have a coordtype string property`);
  }
  assertBounds(parent.coordtype, parent.bounds);
}

export function isRectBounds(bounds: Bounds): bounds is RectBounds {
  return "upperLeftLon" in bounds && "upperLeftLat" in bounds && "lowerRightLat" in bounds && "lowerRightLon" in bounds;
}

export function isVertBounds(bounds: Bounds): bounds is VertBounds {
  return "centerLat" in bounds && "centerLon" in bounds && "height" in bounds && "scale" in bounds;
}

export function assertBounds(coordtype: string, bounds: any): asserts bounds is Bounds {
  switch (coordtype) {
    case "RECTANGULAR":
      assertRectBounds(bounds);
      break;
    case "VERTICAL PERSPECTIVE":
      assertVertBounds(bounds);
      break;
    default:
      throw new Error(`Unrecognized coordtype: ${coordtype}`);
  }
}

export function assertVertBounds(vertBounds: any): asserts vertBounds is VertBounds {
  if (typeof vertBounds !== "object" || vertBounds === null) {
    throw new Error("VertBounds must be a non-null object");
  }
  if (typeof vertBounds.centerLat !== "number") {
    throw new Error("VertBounds must have a centerLat number property");
  }
  if (typeof vertBounds.centerLon !== "number") {
    throw new Error("VertBounds must have an centerLon number property");
  }
  if (typeof vertBounds.height !== "number") {
    throw new Error("VertBounds must have a height number property");
  }
  if (typeof vertBounds.scale !== "number") {
    throw new Error("VertBounds must have a scale number property");
  }
}

export function isSubEventType(o: any): o is SubEventType {
  if (typeof o !== "string") return false;
  if (!/^(EVENT|FAD|LAD|EVENTS)$/.test(o)) return false;
  return true;
}

export function assertsColumnTypeCounter(o: any): asserts o is ColumnTypeCounter {
  const keys = ["Block", "Facies", "Event", "Range", "Chron", "Point", "Sequence", "Transect", "Freehand", "Blank"];
  if (!o || typeof o !== "object") throw new Error("ColumnTypeCounter must be an object");
  for (const key of keys) {
    if (!(key in o)) throwError("ColumnTypeCounter", key, "ColumnInfoType", o[key]);
    if (typeof o[key] !== "number") throwError("ColumnTypeCounter", key, "number", o[key]);
  }
}

export function assertRectBounds(rectBounds: any): asserts rectBounds is RectBounds {
  if (typeof rectBounds !== "object" || rectBounds === null) {
    throw new Error("RectBounds must be a non-null object");
  }
  if (typeof rectBounds.upperLeftLon !== "number") {
    throw new Error("RectBounds must have an upperLeftLon number property");
  }
  if (typeof rectBounds.upperLeftLat !== "number") {
    throw new Error("RectBounds must have an upperLeftLat number property");
  }
  if (typeof rectBounds.lowerRightLon !== "number") {
    throw new Error("RectBounds must have a lowerRightLon number property");
  }
  if (typeof rectBounds.lowerRightLat !== "number") {
    throw new Error("RectBounds must have a lowerRightLat number property");
  }
}
export function assertInfoPoint(o: any): asserts o is InfoPoint {
  if (typeof o !== "object" || o === null) {
    throw new Error("InfoPoint must be a non-null object");
  }
  if (typeof o.lat !== "number") throwError("InfoPoint", "lat", "number", o.lat);
  if (typeof o.lon !== "number") throwError("InfoPoint", "lon", "number", o.lon);
  if (o.note !== undefined && typeof o.note !== "string") throwError("InfoPoint", "note", "string", o.note);
}
export function assertInfoPoints(o: any): asserts o is InfoPoints {
  if (typeof o !== "object" || o === null) {
    throw new Error("InfoPoints must be a non-null object");
  }

  for (const key in o) {
    const point = o[key];
    if (typeof point !== "object" || point === null) {
      throw new Error(`InfoPoints' value for key '${key}' must be a non-null object`);
    }
    if (typeof point.lat !== "number") {
      throw new Error(`InfoPoints' value for key '${key}' must have a 'lat' number property`);
    }
    if (typeof point.lon !== "number") {
      throw new Error(`InfoPoints' value for key '${key}' must have a 'lon' number property`);
    }
    if (point.note !== undefined && typeof point.note !== "string") {
      throw new Error(`InfoPoints' value for key '${key}' must have a 'note' string property`);
    }
  }
}

export function assertMapPoint(o: any): asserts o is MapPoint {
  if (typeof o !== "object" || o === null) {
    throw new Error("MapPoint must be a non-null object");
  }
  if (typeof o.lat !== "number") throwError("MapPoint", "lat", "number", o.lat);
  if (typeof o.lon !== "number") throwError("MapPoint", "lon", "number", o.lon);
  if (o.default !== undefined && typeof o.default !== "string") throwError("MapPoint", "default", "string", o.default);
  if (o.minage !== undefined && typeof o.minage !== "number") throwError("MapPoint", "minage", "number", o.minage);
  if (o.maxage !== undefined && typeof o.maxage !== "number") throwError("MapPoint", "maxage", "number", o.maxage);
  if (o.note !== undefined && typeof o.note !== "string") throwError("MapPoint", "note", "string", o.note);
}
export function assertMapPoints(o: any): asserts o is MapPoints {
  if (typeof o !== "object" || o === null) {
    throw new Error("MapPoints must be a non-null object");
  }

  for (const key in o) {
    const point = o[key];
    if (typeof point !== "object" || point === null) {
      throw new Error(`MapPoints' value for key '${key}' must be a non-null object`);
    }
    if (typeof point.lat !== "number") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'lat' number property`);
    }
    if (typeof point.lon !== "number") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'lon' number property`);
    }
    if (point.default !== undefined && typeof point.default !== "string") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'default' string property`);
    }
    if (point.minage !== undefined && typeof point.minage !== "number") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'minage' number property`);
    }
    if (point.maxage !== undefined && typeof point.maxage !== "number") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'maxage' number property`);
    }
    if (point.note !== undefined && typeof point.note !== "string") {
      throw new Error(`MapPoints' value for key '${key}' must have a 'note' string property`);
    }
  }
}
export function assertSuccessfulServerResponse(o: any): asserts o is SuccessfulServerResponse {
  if (!o || typeof o !== "object") throw new Error(`SuccessfulServerResponse must be a non-null object`);
  if (typeof o.message !== "string") throw new Error(`SuccessfulServerResponse must have a 'message' string property`);
}

export function assertSVGStatus(o: any): asserts o is SVGStatus {
  if (!o || typeof o !== "object") throw new Error(`SVGStatus must be a non-null object`);
  if (typeof o.ready !== "boolean") throw new Error(`SVGStatus must have a 'ready' boolean property`);
}

export function assertChronSettings(o: any): asserts o is ChronSettings {
  if (o.dataMiningChronDataType !== null && !isDataMiningChronDataType(o.dataMiningChronDataType))
    throwError("ChronSettings", "dataMiningChronType", "DataMiningChronDataType", o.dataMiningChronDataType);
  assertDataMiningSettings(o);
}

/**
 * throws an error `Object '${obj}' must have a '${variable}' ${type} property.\nFound value: ${value}`
 * @param obj
 * @param variable
 * @param type
 * @param value
 */
export function throwError(obj: string, variable: string, type: string, value: any) {
  throw new Error(`Object '${obj}' must have a '${variable}' ${type} property.\nFound value: ${value}\n`);
}

export function assertTimescale(val: any): asserts val is TimescaleItem {
  if (!val || typeof val !== "object") {
    throwError("Timescale", "object", "of type object", val);
  }
  if (typeof val.key !== "string" || typeof val.value !== "number") {
    throwError("Timescale", "'key' of type string and 'value' of type number", "", val);
  }
}
