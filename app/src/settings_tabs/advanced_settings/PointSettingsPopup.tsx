import { IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ColumnInfo, assertPointSettings, isPointShape } from "@tsconline/shared";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { context } from "../../state";
import "./PointSettingsPopup.css";
import {
  CustomDivider,
  CustomTooltip,
  RGBModifier,
  CustomFormControlLabel,
  StyledScrollbar,
  TSCCheckbox
} from "../../components";
import { GenericTextField } from "../../components";

type PointSettingsPopupProps = {
  column: ColumnInfo;
};

export const PointSettingsDisplay: React.FC<PointSettingsPopupProps> = observer(({ column }) => {
  const { actions } = useContext(context);
  if (column.columnDisplayType !== "Point") return;
  assertPointSettings(column.columnSpecificSettings);
  const pointSettings = column.columnSpecificSettings;
  return (
    <>
      <div className="point-header-subsection">
        <Typography variant="h6" className="advanced-settings-header">
          Point Settings
        </Typography>
        <CustomDivider className="settings-header-divider" />
      </div>
      <div className="point-settings-content-container">
        <StyledScrollbar>
          <div className="point-settings-content">
            <div>
              <div className="point-range-settings-container">
                <div className="point-range-settings-header-container">
                  <Typography className="point-range-settings-header">Range of Data</Typography>
                  <div>
                    <CustomTooltip title="Auto Scale" placement="top" arrow>
                      <IconButton onClick={() => actions.setAutoScale(pointSettings)}>
                        <span className="auto-button-icon" />
                      </IconButton>
                    </CustomTooltip>
                    <CustomTooltip title="Flip Range" placement="top" arrow>
                      <IconButton onClick={() => actions.flipRange(pointSettings)}>
                        <span className="flip-button-icon" />
                      </IconButton>
                    </CustomTooltip>
                  </div>
                </div>
                <GenericTextField
                  key="range"
                  orientation="start"
                  helperOrientation="start"
                  helperPosition="bottom"
                  inputs={[
                    {
                      helperText: "Lower Range",
                      value: pointSettings.lowerRange,
                      onValueChange: (value) => {
                        actions.setPointColumnSettings(pointSettings, { lowerRange: value });
                      }
                    },
                    {
                      helperText: "Upper Range",
                      value: pointSettings.upperRange,
                      onValueChange: (value) => {
                        actions.setPointColumnSettings(pointSettings, { upperRange: value });
                      }
                    },
                  {
                    helperText: "Scale Start",
                    value: pointSettings.scaleStart,
                    onValueChange: (value) => {
                      actions.setPointColumnSettings(pointSettings, { scaleStart: value });
                    }
                  },
                  {
                    helperText: "Scale Step",
                    value: pointSettings.scaleStep,
                    onValueChange: (value) => {
                      actions.setPointColumnSettings(pointSettings, { scaleStep: value });
                    }
                  }
                  ]}
                />
              </div>
            </div>
            <div className="draw-buttons-and-point-shape-container">
              <div className="point-settings-adjustment-buttons draw-point-scale-checkboxes">
                <CustomFormControlLabel
                  name="drawScale"
                  label="Draw Scale"
                  control={
                    <TSCCheckbox
                      checked={pointSettings.drawScale}
                      size="small"
                      onChange={(value) =>
                        actions.setPointColumnSettings(pointSettings, { drawScale: value.target.checked })
                      }
                    />
                  }
                />
                <CustomFormControlLabel
                  name="drawPoints"
                  label="Draw Points"
                  className="point-shape-checkbox"
                  control={
                    <TSCCheckbox
                      checked={pointSettings.pointShape !== "nopoints"}
                      onChange={(event) =>
                        actions.setPointColumnSettings(pointSettings, {
                          pointShape: event.target.checked ? "rect" : "nopoints"
                        })
                      }
                    />
                  }
                />
              </div>
              <div className="point-shape-radio-group">
                <ToggleButtonGroup exclusive value={pointSettings.pointShape} onChange={(_e, val) => {
                  if (!isPointShape(val)) return;
                  actions.setPointColumnSettings(pointSettings, { pointShape: val });
                }}>
                  <ToggleButton
                    disabled={pointSettings.pointShape === "nopoints"}
                    disableRipple
                    value="rect">
                      <span className="rectangle-icon"/>
                  </ToggleButton>
                  <ToggleButton
                    disableRipple
                    disabled={pointSettings.pointShape === "nopoints"}
                    value="circle">
                      <span className="circle-icon"/>
                  </ToggleButton>
                  <ToggleButton
                    disableRipple
                    disabled={pointSettings.pointShape === "nopoints"}
                    value="cross">
                      <span className="cross-icon"/>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          <div className="point-settings-adjustment-buttons">
            <RGBModifier
              label="Line"
              checked={pointSettings.drawLine}
              onCheckedChange={(value) => actions.setPointColumnSettings(pointSettings, { drawLine: value })}
              rgbInputs={[
                {
                  rgb: pointSettings.lineColor,
                  onRGBChange: (value) => actions.setPointColumnSettings(pointSettings, { lineColor: value })
                }
              ]}
            />
            <RGBModifier
              label="Fill"
              checked={pointSettings.drawFill}
              onCheckedChange={(value) => actions.setPointColumnSettings(pointSettings, { drawFill: value })}
              rgbInputs={[
                {
                  rgb: pointSettings.fill,
                  onRGBChange: (value) => actions.setPointColumnSettings(pointSettings, { fill: value })
                }
              ]}
            />
          <div className="point-settings-gradient-buttons">
            <RGBModifier
              label="Background Gradient"
              checked={pointSettings.drawBackgroundGradient}
              onCheckedChange={(value) =>
                actions.setPointColumnSettings(pointSettings, { drawBackgroundGradient: value })
              }
              rgbInputs={[
                {
                  rgb: pointSettings.backgroundGradientStart,
                  onRGBChange: (value) =>
                    actions.setPointColumnSettings(pointSettings, { backgroundGradientStart: value }),
                  label: "Start"
                },
                {
                  rgb: pointSettings.backgroundGradientEnd,
                  onRGBChange: (value) =>
                    actions.setPointColumnSettings(pointSettings, { backgroundGradientEnd: value }),
                  label: "End"
                }
              ]}
            />
          </div>
          <div className="point-settings-gradient-buttons">
            <RGBModifier
              label="Curve Gradient"
              checked={pointSettings.drawCurveGradient}
              onCheckedChange={(value) => actions.setPointColumnSettings(pointSettings, { drawCurveGradient: value })}
              rgbInputs={[
                {
                  rgb: pointSettings.curveGradientStart,
                  onRGBChange: (value) => actions.setPointColumnSettings(pointSettings, { curveGradientStart: value }),
                  label: "Start"
                },
                {
                  rgb: pointSettings.curveGradientEnd,
                  onRGBChange: (value) => actions.setPointColumnSettings(pointSettings, { curveGradientEnd: value }),
                  label: "End"
                }
              ]}
            />
          </div>
          </div>
          </div>
        </StyledScrollbar>
      </div>
    </>
  );
});
