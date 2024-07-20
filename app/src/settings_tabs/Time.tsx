import { Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CustomDivider, TSCCheckbox } from "../components";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useContext, useState } from "react";
import { context } from "../state/index";
import "./Time.css";

export const Time = observer(function Time() {
  const { state, actions } = useContext(context);
  const [units, setUnits] = useState<string>(Object.keys(state.settings.timeSettings)[0]);

  if (units === null || units === undefined) {
    throw new Error("There must be a unit used in the config");
  }
  const disabled = units !== "Ma";

  function checkAgeRange() {
    return state.settings.timeSettings[units].topStageAge > state.settings.timeSettings[units].baseStageAge;
  }
  return (
    <div>
      <ToggleButtonGroup
        value={units}
        exclusive
        onChange={(_event: React.MouseEvent<HTMLElement>, value: string) => {
          if (value === null) {
            return;
          }
          setUnits(value);
        }}
        className="ToggleButtonGroup"
        aria-label="Units">
        {Object.keys(state.settings.timeSettings).map((unit) => (
          <ToggleButton key={unit} value={unit} disableRipple>
            {unit}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box className="time-settings-container" bgcolor="secondaryBackground.main">
        <Box className="time-settings-age-container">
          <Typography className="IntervalLabel">Top of Interval</Typography>
          <CustomDivider className="time-form-divider" />
          <FormControl className="FormControlIntervals" size="small" error={checkAgeRange()}>
            <InputLabel>{disabled ? "Not Available for this Unit" : "Top Age/Stage Name"}</InputLabel>
            <Select
              className="SelectTop"
              inputProps={{ id: "top-age-selector" }}
              name="top-age-stage-name"
              MenuProps={{ sx: { maxHeight: "400px" } }}
              label="Top Age/Stage Name"
              disabled={disabled}
              value={state.settings.timeSettings[units].topStageKey}
              onChange={(event) => {
                const age = state.geologicalTopStageAges.find((item) => item.key === event.target.value);
                if (!age) return;
                actions.setTopStageAge(age.value, units);
              }}>
              {state.geologicalTopStageAges.map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.key} ({item.value} Ma)
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              className="UnitTextField"
              label={`${units}`}
              type="number"
              name="vertical-scale-text-field"
              value={
                isNaN(state.settings.timeSettings[units].topStageAge)
                  ? ""
                  : state.settings.timeSettings[units].topStageAge
              }
              onChange={(event) => {
                actions.setTopStageAge(parseFloat(event.target.value), units);
              }}
              error={checkAgeRange()}
              helperText={checkAgeRange() ? "Base age should be older than top age" : ""}
              FormHelperTextProps={{ style: { fontSize: "13px" } }}
            />
          </FormControl>
          <Typography className="IntervalLabel">Base of Interval</Typography>
          <CustomDivider className="time-form-divider" />
          <FormControl className="FormControlIntervals" size="small" error={checkAgeRange()}>
            <InputLabel htmlFor="base-age-selector">
              {disabled ? "Not Available for this Unit" : "Base Age/Stage Name"}
            </InputLabel>
            <Select
              className="SelectBase"
              inputProps={{ id: "base-age-selector" }}
              disabled={disabled}
              name="base-age-stage-name"
              label="Base Age/Stage Name"
              value={state.settings.timeSettings[units].baseStageKey}
              MenuProps={{ sx: { maxHeight: "400px" } }}
              onChange={(event) => {
                const age = state.geologicalBaseStageAges.find((item) => item.key === event.target.value);
                if (!age) return;
                actions.setBaseStageAge(age.value, units);
              }}>
              {state.geologicalBaseStageAges
                .filter((item) => item.value >= state.settings.timeSettings[units].topStageAge)
                .map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.key} ({item.value} Ma)
                  </MenuItem>
                ))}
            </Select>
            <TextField
              size="small"
              className="UnitTextField"
              label={`${units}`}
              type="number"
              name="vertical-scale-text-field"
              value={
                isNaN(state.settings.timeSettings[units].baseStageAge)
                  ? ""
                  : state.settings.timeSettings[units].baseStageAge
              }
              onChange={(event) => {
                actions.setBaseStageAge(parseFloat(event.target.value), units);
              }}
              error={checkAgeRange()}
              helperText={checkAgeRange() ? "Base age should be older than top age" : ""}
              FormHelperTextProps={{ style: { fontSize: "13px" } }}
            />
          </FormControl>
          <TextField
            className="VerticalScale"
            label={`Vertical Scale (cm per 1 ${units}):`}
            type="number"
            size="small"
            name="vertical-scale-text-field"
            value={state.settings.timeSettings[units].unitsPerMY}
            onChange={(event) => actions.setUnitsPerMY(parseFloat(event.target.value), units)}
          />
        </Box>
        <div className="time-settings-checkbox-container">
          <FormGroup>
            <FormControlLabel
              name="skip-empty-columns"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setSkipEmptyColumns(e.target.checked, units)}
                  checked={state.settings.timeSettings[units].skipEmptyColumns}
                />
              }
              label="Gray out (and do not draw) columns which do not have data on the selected time interval"
            />
            <FormControlLabel
              name="mouse-over-info-checkbox"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setMouseOverPopupsEnabled(e.target.checked)}
                  checked={state.settings.mouseOverPopupsEnabled}
                />
              }
              label="Add MouseOver info (popups)"
            />
            <FormControlLabel
              name="global-priority-checkbox"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setEnablePriority(e.target.checked)}
                  checked={state.settings.enablePriority}
                />
              }
              label="Enabled Global Priority Filtering for block columns"
            />
            <FormControlLabel
              name="stage-background-checkbox"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setEnableColumnBackground(e.target.checked)}
                  checked={state.settings.enableColumnBackground}
                />
              }
              label="Enabled stage background for event columns"
            />
            <FormControlLabel
              name="enable-legend-checkbox"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setEnableChartLegend(e.target.checked)}
                  checked={state.settings.enableChartLegend}
                />
              }
              label="Enable legend for the chart"
            />
            <FormControlLabel
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setNoIndentPattern(e.target.checked)}
                  checked={state.settings.noIndentPattern}
                />
              }
              name="lithology-auto-indent-checkbox"
              label="Do not auto-indent lithology patterns"
            />
            <FormControlLabel
              name="conserve-chart-checkbox"
              control={<TSCCheckbox className="time-settings-checkbox" />}
              label="Conserve Chart Space in Family Tree Plotting (Not implemented)"
            />
            <FormControlLabel
              name="hide-block-labels-checkbox"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setEnableHideBlockLabel(e.target.checked)}
                  checked={state.settings.enableHideBlockLabel}
                />
              }
              label="Hide block labels based on priority"
            />
            <FormControlLabel
              name="use-suggested-age-spans"
              control={
                <TSCCheckbox
                  className="time-settings-checkbox"
                  onChange={(e) => actions.setuseDatapackSuggestedAge(!e.target.checked)}
                  checked={!state.settings.useDatapackSuggestedAge}
                />
              }
              label="Do not use the Data-Pack's suggested age span"
            />
          </FormGroup>
        </div>
      </Box>
    </div>
  );
});
