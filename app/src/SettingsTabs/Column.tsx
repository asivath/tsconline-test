import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { context } from "../state";
import { ColumnSetting } from "@tsconline/shared";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define the Accordion component outside the Column component
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

// Define the AccordionSummary and AccordionDetails components outside the Column component
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "column", // Change to column layout
  alignItems: "flex-start", // Align headers to the start
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export const Column = observer(function Column() {
  const { state, actions } = useContext(context);
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [columnName, setColumnName] = useState("");
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  //recursively goes through the column settings state and makes a component
  //with all of the columns
  function renderColumns(columnInfo: ColumnSetting, depth: number) {
    //for indenting child. depth is how far it is from the top
    let indent = depth * 20 + "px";
    const divStyle = {
      marginLeft: indent,
    };
    return (
      <div>
        {Object.entries(columnInfo).map(([columnName, columnData]) => (
          <div key={columnName}>
            <label>
              <Checkbox
                checked={columnData.on}
                onChange={() =>
                  actions.toggleSettingsTabColumn(
                    columnName,
                    columnData.parents
                  )
                }
              />
              {columnName}
            </label>

            <div style={divStyle}>
              {columnData.children &&
                renderColumns(columnData.children, depth + 1)}
            </div>
          </div>
        ))}
      </div>
    );
  }
  const handleColumnNameChange = (event: { target: { value: string } }) => {
    setColumnName(event.target.value);
    actions.updateColumnName(event.target.value);
  };
  const navigate = useNavigate();
  const handleButtonClick = () => {
    actions.setTab(1);
    actions.setAllTabs(true);

    // Validate the user input
    if (
      isNaN(state.settings.topAge) ||
      isNaN(state.settings.baseAge) ||
      isNaN(state.settings.unitsPerMY)
    ) {
      // Handle invalid input, show error message, etc.
      return;
    }

    actions.updateSettings();

    actions.generateChart();

    navigate("/chart");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/*component for selecting column*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>TimeScale Creator GTS2020 Chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>{renderColumns(state.settingsTabs.columns, 1)}</div>
          </AccordionDetails>
        </Accordion>
      </div>
      {/*component for changing settings for a specific column*/}
      <div style={{ border: "1px solid black", width: "400px" }}>
        <div style={{ paddingTop: "20px" }}>
          <Button onClick={handleButtonClick} variant="outlined">
            Generate the Chart!
          </Button>
        </div>
        <div style={{ paddingTop: "20px" }}>
          Edit Title:
          <br />
          <TextField></TextField>
        </div>
      </div>
    </div>
  );
});
