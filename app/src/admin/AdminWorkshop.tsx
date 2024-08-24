import { Box, Dialog, useTheme, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { AgGridReact } from "ag-grid-react";
import { useContext, useState } from "react";
import { context } from "../state";
import { ColDef } from "ag-grid-community";
import { TSCButton, InputFileUpload } from "../components";
import { ErrorCodes } from "../util/error-codes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { TSCPopup } from "../components/TSCPopup";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "./AdminWorkshop.css";

const workshopColDefs: ColDef[] = [
  {
    headerName: "Workshop Title",
    field: "title",
    sortable: true,
    filter: true,
    flex: 1
  },
  { headerName: "Workshop Start Date", field: "startDate", flex: 1 },
  { headerName: "Workshop End Date", field: "endDate", flex: 1 }
];

export const AdminWorkshop = observer(function AdminWorkshop() {
  const theme = useTheme();
  const { actions } = useContext(context);
  const [addUsersFormOpen, setAddUsersFormOpen] = useState(false);
  const [createWorkshopFormOpen, setCreateWorkshopFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [invalidEmails, setInvalidEmails] = useState<string>("");
  const handleCreateWorkshopSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("workshopTitle")?.toString();
    if (!title) {
      actions.pushError(ErrorCodes.ADMIN_WORKSHOP_FIELDS_EMPTY);
      return;
    }
    const startDate = form.get("startDate")?.toString();
    const endDate = form.get("endDate")?.toString();
    if (!startDate || !endDate) {
      actions.pushError(ErrorCodes.ADMIN_WORKSHOP_FIELDS_EMPTY);
      return;
    }
    const start = dayjs(startDate).format("YYYY-MM-DD HH:mm");
    const end = dayjs(endDate).format("YYYY-MM-DD HH:mm");
    if (dayjs(start).isAfter(dayjs(end))) {
      actions.pushError(ErrorCodes.ADMIN_WORKSHOP_START_AFTER_END);
      return;
    }
    await actions.adminCreateWorkshop(title, start, end);
  }
  const handleAddUsersSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const emails = form.get("emails")?.toString();
    if (!emails && !file) {
      actions.pushError(ErrorCodes.ADMIN_WORKSHOP_FIELDS_EMPTY);
      return;
    }
    if (file) form.append("file", file);
    // TODO: Add some sort of id here, probably generated when the workshop is created
    form.append("workshopId", "123");
    const invalidEmails = await actions.adminAddUsersToWorkshop(form);
    setInvalidEmails(invalidEmails || "");
    setFile(null);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) {
      return;
    }
    const ext = file.name.split(".").pop();
    if (
      file.type !== "application/vnd.ms-excel" && // for .xls files
      file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && // for .xlsx files
      file.type !== ""
    ) {
      actions.pushError(ErrorCodes.UNRECOGNIZED_EXCEL_FILE);
      return;
    }
    if (!ext || !/^(xlx|xlsx)$/.test(ext)) {
      actions.pushError(ErrorCodes.UNRECOGNIZED_EXCEL_FILE);
      return;
    }
    setFile(file);
  };
  return (
    <Box className={theme.palette.mode === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"} height={500}>
      <Box display="flex" m="10px" gap="20px">
        <TSCButton
          onClick={() => {
            setCreateWorkshopFormOpen(true);
          }}>
          Create Workshop
        </TSCButton>
        <TSCPopup
          open={!!invalidEmails}
          title="Please fix the following emails:"
          message={invalidEmails}
          onClose={() => setInvalidEmails("")}
          maxWidth="xs"
        />
        <Dialog open={createWorkshopFormOpen} onClose={() => setCreateWorkshopFormOpen(false)}>
          <Box textAlign="center" padding="10px">
            <Typography variant="h5" mb="5px">
              Create Workshop
            </Typography>
            <Box
              component="form"
              gap="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              onSubmit={handleCreateWorkshopSubmit}>
              <TextField
                label="Workshop Title"
                name="workshopTitle"
                placeholder="Enter a title for the workshop"
                fullWidth
                size="small"
                required
              />
              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={5}>
                <DateTimePicker
                  label="Start Date"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock
                  }}
                  disablePast
                  slotProps={{
                    textField: {
                      required: true,
                      size: "small"
                    },
                    popper: { className: "date-time-picker" }
                  }}
                />
                <DateTimePicker
                  label="End Date"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock
                  }}
                  disablePast
                  slotProps={{
                    textField: {
                      required: true,
                      size: "small"
                    },
                    popper: { className: "date-time-picker" }
                  }}
                />
              </Box>
              <TSCButton type="submit">Submit</TSCButton>
            </Box>
          </Box>
        </Dialog>
        <Dialog open={addUsersFormOpen} onClose={() => setAddUsersFormOpen(false)}>
          <Box textAlign="center" padding="10px">
            <Typography variant="h5" mb="5px">
              Add Users
            </Typography>
            <Box
              component="form"
              gap="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              onSubmit={handleAddUsersSubmit}>
              <TextField
                label="Paste Emails"
                name="emails"
                multiline
                rows={5}
                placeholder="Enter multiple emails, separated by commas"
                size="small"
                fullWidth
              />
              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <InputFileUpload
                  text="Upload Excel File of Emails"
                  onChange={handleFileUpload}
                  accept=".xls,.xlsx"
                  startIcon={<CloudUploadIcon />}
                />
                <Typography ml="10px">{file?.name || "No file selected"}</Typography>
              </Box>
              <TSCButton type="submit" onClick={() => setAddUsersFormOpen(false)}>
                Submit
              </TSCButton>
            </Box>
          </Box>
        </Dialog>
      </Box>
      <AgGridReact
        columnDefs={workshopColDefs}
        rowSelection="multiple"
        rowDragManaged
        rowMultiSelectWithClick
        rowData={null}
      />
    </Box>
  );
});
