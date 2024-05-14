import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import { context } from "../state";
import { ColumnInfo } from "@tsconline/shared";
import { Box, TextField } from "@mui/material";
import { ColumnContainer, AccordionDetails, TSCCheckbox, AccordionSummary, Accordion, TSCButton } from "../components";

import { ColumnMenu } from "./ColumnMenu";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import "./Column.css";
import { checkIfDataIsInRange } from "../util/util";
import { setExpanded } from "../state/actions";

type ColumnAccordionProps = {
  details: ColumnInfo;
};

const ColumnAccordion: React.FC<ColumnAccordionProps> = observer(
  ({ details }) => {
    const { actions, state } = useContext(context);
    const theme = useTheme();
    if (!details.show) {
      return null;
    }
    //for keeping the original name for array access
    function clickColumnName() {
      actions.setColumnSelected(details.name);
    }
    const hasChildren = details.children && Object.keys(details.children).length > 0;
    const columnName = (
      <div>
        <Typography className="column-display-name">{details.editName}</Typography>
      </div>
    );

    const dataInrange = checkIfDataIsInRange(
      details.minAge,
      details.maxAge,
      state.settings.timeSettings[details.units].topStageAge,
      state.settings.timeSettings[details.units].baseStageAge
    );

    function checkbox(leaf: string) {
      const tooltipOrCheckBox =
        !dataInrange && !(details.name === "Ma" || details.name === "Root") ? (
          <Tooltip
            title="Data not included in time range"
            placement="top"
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10]
                    }
                  }
                ]
              }
            }}>
            <ErrorOutlineIcon
              className="column-error-icon"
              style={{
                color: theme.palette.error.main
              }}
            />
          </Tooltip>
        ) : (
          <TSCCheckbox
            checked={details.on}
            onChange={() => {
              actions.toggleSettingsTabColumn(details.name);
            }}
          />
        );

      return (
        <>
          <ColumnContainer>
            <div className={"column-checkbox " + leaf} onClick={() => clickColumnName()}>
              {tooltipOrCheckBox}

              {columnName}
            </div>
          </ColumnContainer>
        </>
      );
    }

    // if there are no children, don't make an accordion
    if (!hasChildren) {
      return checkbox("column-leaf");
    }
    return (
      <Accordion
        //checks if column name is in expand list
        expanded={details.expanded}
        onChange={() => setExpanded(details, !details.expanded)}>
        <AccordionSummary aria-controls="panel-content" id="panel-header">
          <div
            onClick={(event) => {
              //stops accordion from expanding/collapsing when clicking on the name or checkbox
              event.stopPropagation();
            }}>
            {checkbox("")}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <>
            {details.children &&
              Object.entries(details.children).map(([childName, childDetails]) => (
                <ColumnAccordion
                  key={childName}
                  details={childDetails}
                />
              ))}
          </>
        </AccordionDetails>
      </Accordion>
    );
  }
);

// column with generate button, and accordion columns
export const Column = observer(function Column() {
  const { state, actions } = useContext(context);
  //state array of column names that are expanded
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    actions.setColumnSearchTerm(term);
    actions.searchColumns(term);
  };
  return (
    <div className="column-top-level">
      <div className="column-search-bar-container">
        {state.settingsTabs.columnSearchTerm && (
          <Typography variant="body2" color="textSecondary" id="column-search-term">
            <span style={{ color: "red" }}>Filtered For: &quot;{state.settingsTabs.columnSearchTerm}&quot;</span>
          </Typography>
        )}
        <TextField
          id="column-search-bar"
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearch}
          value={state.settingsTabs.columnSearchTerm}
        />
      </div>
      <div className="column-accordion-and-menu">
        <Box
          className={`hide-scrollbar column-accordion-wrapper ${state.settingsTabs.columnSearchTerm ? "filtered-border" : ""}`}>
          <TSCButton
            id="column-expand-buttons"
            onClick={() => {
              if (!state.settingsTabs.columns) return;
              actions.setExpansionOfAll(state.settingsTabs.columns, true)
            }}>
            Expand All
          </TSCButton>
          <TSCButton
            id="column-expand-buttons"
            onClick={() => {
              if (!state.settingsTabs.columns) return;
              actions.setExpansionOfAll(state.settingsTabs.columns, false)
            }}>
            collapse All
          </TSCButton>
          {state.settingsTabs.columns &&
            Object.entries(state.settingsTabs.columns.children).map(([childName, childDetails]) => (
              <ColumnAccordion
                key={childName}
                details={childDetails}
              />
            ))}
        </Box>
        <ColumnMenu />
      </div>
    </div>
  );
});
