import { observer } from "mobx-react-lite";
import { useLocation, useNavigate, useParams, useBlocker } from "react-router";
import styles from "./DatapackProfile.module.css";
import React, { useContext, useEffect, useState } from "react";
import { context } from "./state";
import { devSafeUrl } from "./util";
import { Autocomplete, Box, Button, IconButton, SvgIcon, TextField, Typography, useTheme } from "@mui/material";
import { CustomDivider, TSCButton, TagButton } from "./components";
import { CustomTabs } from "./components/TSCCustomTabs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Discussion } from "./components/TSCDiscussion";
import CampaignIcon from "@mui/icons-material/Campaign";
import { PageNotFound } from "./PageNotFound";
import { BaseDatapackProps, Datapack, DatapackWarning } from "@tsconline/shared";
import { ResponsivePie } from "@nivo/pie";
import { useTranslation } from "react-i18next";
import CreateIcon from "@mui/icons-material/Create";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export const DatapackProfile = observer(() => {
  const { state } = useContext(context);
  const { id } = useParams();
  const defaultImageUrl = devSafeUrl("/datapack-images/default.png");
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  if (!id) return <PageNotFound />;
  const query = new URLSearchParams(useLocation().search);
  const fetchDatapack = () => {
    let datapack: Datapack | undefined;
    switch (query.get("index")) {
      case "server":
        datapack = state.datapackCollection.serverDatapackIndex[id];
        break;
      case "public_user":
        datapack = state.datapackCollection.publicUserDatapackIndex[id];
        break;
      case "private_user":
        datapack = state.datapackCollection.privateUserDatapackIndex[id];
        break;
      case "workshop":
        datapack = state.datapackCollection.workshopDatapackIndex[id];
        break;
      default:
        datapack =
          state.datapackCollection.serverDatapackIndex[id] ||
          state.datapackCollection.publicUserDatapackIndex[id] ||
          state.datapackCollection.privateUserDatapackIndex[id] ||
          state.datapackCollection.workshopDatapackIndex[id] ||
          null;
        break;
    }
    return datapack;
  };
  const datapack = fetchDatapack();
  if (!datapack) return <PageNotFound />;
  const tabs = [
    {
      id: "About",
      tab: "About"
    },
    {
      id: "View Data",
      tab: "View Data"
    },
    {
      id: "Discussion",
      tab: "Discussion"
    },
    {
      id: "Warnings",
      tab: <WarningsTab count={datapack.warnings ? datapack.warnings.length : 0} />
    }
  ];
  return (
    <div className={styles.adjcontainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <IconButton className={styles.back} onClick={() => navigate("/settings")}>
            <ArrowBackIcon className={styles.icon} />
          </IconButton>
          {state.datapackProfilePage.editMode ? (
            <TextField value={datapack.title} />
          ) : (
            <Typography className={styles.ht}>{datapack.title}</Typography>
          )}
          <img className={styles.di} src={datapack.image || defaultImageUrl} />
        </div>
        <CustomTabs
          className={styles.tabs}
          centered
          value={tabIndex}
          onChange={(val) => setTabIndex(val)}
          tabs={tabs}
        />
        <CustomDivider className={styles.divider} />
        <DatapackProfileContent index={tabIndex} datapack={datapack} />
      </div>
    </div>
  );
});

type WarningTabProps = {
  count: number;
};
const WarningsTab: React.FC<WarningTabProps> = ({ count }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wtc}>
      {t("settingsTabs.Warnings")}
      {count > 0 && <span className={styles.number}>{`${count > 99 ? `99+` : count}`}</span>}
    </div>
  );
};

type DatapackProfileContentProps = {
  index: number;
  datapack: BaseDatapackProps;
};
const DatapackProfileContent: React.FC<DatapackProfileContentProps> = ({ index, datapack }) => {
  switch (index) {
    case 0:
      return <About datapack={datapack} />;
    case 1:
      return <ViewData datapack={datapack} />;
    case 2:
      return <Discussion />;
    case 3:
      return (
        datapack.warnings &&
        datapack.warnings.length > 0 &&
        datapack.warnings.map((warning, index) => (
          <DatapackWarningAlert
            key={warning.lineNumber + warning.warning + warning.message + index}
            warning={warning}
          />
        ))
      );
    default:
      return <About datapack={datapack} />;
  }
};
type AboutProps = {
  datapack: BaseDatapackProps;
};
const About: React.FC<AboutProps> = observer(({ datapack }) => {
  const { state, actions } = useContext(context);
  const { t } = useTranslation();
  // for when user tries to navigate away with unsaved changes
  useBlocker(
    ({ currentLocation, nextLocation }) =>
      state.datapackProfilePage.unsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname &&
      !window.confirm(t("dialogs.confirm-changes.message"))
  );
  // for when user tries to leave page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (state.datapackProfilePage.unsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [state.datapackProfilePage.unsavedChanges]);
  actions.setEditableDatapackMetadata(datapack);
  return (
    <Box className={styles.about} bgcolor="secondaryBackground.main">
      <div className={styles.ah}>
        <Typography className={styles.dt}>Description</Typography>
        <Description description={datapack.description} />
        <Notes notes={datapack.notes} />
        <Contact contact={datapack.contact} />
      </div>
      <div className={styles.additional}>
        <EditButtons
          unsavedChanges={state.datapackProfilePage.unsavedChanges}
          resetForm={() => actions.setEditableDatapackMetadata(datapack)}
        />
        <div className={styles.ai}>
          <AuthoredBy authoredBy={datapack.authoredBy} />
        </div>
        <div className={styles.ai}>
          <Typography className={styles.aih}>Created</Typography>
          <DateField datapackDate={datapack.date} />
        </div>
        <div className={styles.ai}>
          <Typography className={styles.aih}>Total Columns</Typography>
          <Typography>{datapack.totalColumns}</Typography>
        </div>
        <div className={styles.ai}>
          <Typography className={styles.aih}>File Name</Typography>
          <Typography>{datapack.originalFileName}</Typography>
        </div>
        <div className={styles.ai}>
          <Typography className={styles.aih}>File Size</Typography>
          <Typography>{datapack.size}</Typography>
        </div>
        <div className={styles.ai}>
          <Tags tags={datapack.tags} />
        </div>
      </div>
    </Box>
  );
});

type TagsProps = {
  tags: string[];
};

const Tags: React.FC<TagsProps> = observer(({ tags }) => {
  const { state, actions } = useContext(context);
  return (
    <>
      <Typography className={styles.aih}>Tags</Typography>
      {state.datapackProfilePage.editMode ? (
        <Autocomplete
          multiple
          value={state.datapackProfilePage.editableDatapackMetadata?.tags}
          onChange={(_, values) => {
            actions.updateEditableDatapackMetadata({ tags: values });
          }}
          options={[]}
          freeSolo
          renderInput={(params) => <TextField {...params} />}
        />
      ) : (
        <>
          <div className={styles.tags}>
            {tags[0]
              ? tags.map((tag) => (
                  <TagButton key={tag}>
                    <Typography fontSize="0.9rem">{tag}</Typography>
                  </TagButton>
                ))
              : "No tags"}
          </div>
        </>
      )}
    </>
  );
});

type AuthoredByProps = {
  authoredBy: string;
};
const AuthoredBy: React.FC<AuthoredByProps> = observer(({ authoredBy }) => {
  const { state, actions } = useContext(context);
  return (
    <>
      <Typography className={styles.aih}>Authored By</Typography>
      {state.datapackProfilePage.editMode ? (
        <TextField
          fullWidth
          onChange={(e) => actions.updateEditableDatapackMetadata({ authoredBy: e.target.value })}
          placeholder="Creator of the data pack"
          value={state.datapackProfilePage.editableDatapackMetadata?.authoredBy}
        />
      ) : (
        <Typography>{authoredBy}</Typography>
      )}
    </>
  );
});
type DescriptionProps = {
  description: string | undefined;
};
const Description: React.FC<DescriptionProps> = observer(({ description }) => {
  const { state, actions } = useContext(context);
  return (
    <>
      {state.datapackProfilePage.editMode ? (
        <TextField
          value={state.datapackProfilePage.editableDatapackMetadata?.description}
          onChange={(e) => actions.updateEditableDatapackMetadata({ description: e.target.value })}
          fullWidth
          multiline
          placeholder="A brief description of the data"
          minRows={7}
        />
      ) : (
        <Typography className={styles.description}>{description}</Typography>
      )}
    </>
  );
});
type ContactProps = {
  contact: string | undefined;
};
const Contact: React.FC<ContactProps> = observer(({ contact }) => {
  const { state, actions } = useContext(context);
  return (
    <>
      {state.datapackProfilePage.editMode ? (
        <>
          <Typography className={styles.dt}>Contact</Typography>
          <TextField
            value={state.datapackProfilePage.editableDatapackMetadata}
            onChange={(e) => actions.updateEditableDatapackMetadata({ contact: e.target.value })}
            fullWidth
            multiline
            placeholder="Who can be contacted for more information"
            minRows={3}
          />
        </>
      ) : (
        contact && (
          <>
            <Typography className={styles.dt}>Contact</Typography>
            <Typography className={styles.description}>{contact}</Typography>
          </>
        )
      )}
    </>
  );
});
type NotesProps = {
  notes: string | undefined;
};
const Notes: React.FC<NotesProps> = observer(({ notes }) => {
  const { state, actions } = useContext(context);
  return (
    <>
      {state.datapackProfilePage.editMode ? (
        <>
          <Typography className={styles.dt}>Notes</Typography>
          <TextField
            value={state.datapackProfilePage.editableDatapackMetadata?.notes}
            onChange={(e) => actions.updateEditableDatapackMetadata({ notes: e.target.value })}
            fullWidth
            placeholder="Any additional notes for use of generating charts for this datapack"
            multiline
            minRows={3}
          />
        </>
      ) : (
        notes && (
          <>
            <Typography className={styles.dt}>Notes</Typography>
            <Typography className={styles.description}>{notes}</Typography>
          </>
        )
      )}
    </>
  );
});
type EditButtonsProps = {
  unsavedChanges: boolean;
  resetForm: () => void;
};

const EditButtons: React.FC<EditButtonsProps> = observer(({ unsavedChanges, resetForm }: EditButtonsProps) => {
  const { t } = useTranslation();
  const { state, actions } = useContext(context);
  return (
    <>
      {!state.datapackProfilePage.editMode ? (
        <Box className={styles.pencilIconContainer} onClick={() => actions.setDatapackProfilePageEditMode(true)}>
          <SvgIcon className={styles.pencilIcon}>
            <CreateIcon />
          </SvgIcon>
        </Box>
      ) : (
        <Box className={styles.editButtonContainer}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "error.main",
              color: "error.main",
              ":hover": {
                borderColor: "error.light",
                backgroundColor: "transparent"
              }
            }}
            className={styles.editButton}
            onClick={() => {
              if (!unsavedChanges || window.confirm(t("dialogs.confirm-changes.message"))) {
                actions.setDatapackProfilePageEditMode(false);
                // reset the metadata if the user cancels
                if (unsavedChanges) {
                  resetForm();
                }
              }
            }}>
            Cancel
          </Button>
          <TSCButton className={styles.editButton}>Save</TSCButton>
        </Box>
      )}
    </>
  );
});

type DateFieldProps = {
  datapackDate: string | undefined;
};
const DateField: React.FC<DateFieldProps> = observer(({ datapackDate }) => {
  const { state, actions } = useContext(context);
  return state.datapackProfilePage.editMode ? (
    <DatePicker
      value={
        state.datapackProfilePage.editableDatapackMetadata
          ? dayjs(state.datapackProfilePage.editableDatapackMetadata?.date)
          : null
      }
      maxDate={dayjs()}
      slotProps={{
        field: {
          clearable: true,
          onClear: () => actions.updateEditableDatapackMetadata({ date: undefined })
        },
        textField: { helperText: null },
        popper: {
          sx: {
            "& .MuiPickersYear-yearButton": {
              fontSize: "1rem"
            },
            "& .MuiPaper-root": {
              backgroundColor: "secondaryBackground.main"
            }
          }
        }
      }}
      onChange={(val) => actions.updateEditableDatapackMetadata({ date: val?.format("YYYY-MM-DD") })}
    />
  ) : (
    <Typography>{datapackDate || "Unknown"}</Typography>
  );
});

type DatapackWarningProps = {
  warning: DatapackWarning;
};
export const DatapackWarningAlert: React.FC<DatapackWarningProps> = ({ warning }) => {
  return (
    <Box className={styles.dwc} bgcolor="secondaryBackground.light">
      <CampaignIcon className={styles.dwi} />
      <Box>
        {warning.lineNumber !== undefined && (
          <Typography fontWeight={600}>{`Warning found on line ${warning.lineNumber}`}</Typography>
        )}
        <Typography>{warning.warning}</Typography>
        {warning.message && <Typography fontStyle="italic">{warning.message}</Typography>}
      </Box>
    </Box>
  );
};

type ViewDataProps = {
  datapack: BaseDatapackProps;
};

const ViewData: React.FC<ViewDataProps> = observer(({ datapack }) => {
  const theme = useTheme();
  function convertToPieChartData(data: Record<string, number>): { label: string; value: number }[] {
    return Object.keys(data)
      .filter((key) => data[key] !== 0)
      .map((key) => ({
        id: key,
        label: key,
        value: data[key]
      }));
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Box className={styles.vd} bgcolor="secondaryBackground.main">
        <Typography className={styles.dt}>Number of Columns</Typography>
        <ResponsivePie
          data={convertToPieChartData(datapack.columnTypeCount)}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.75}
          cornerRadius={2}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={1}
          arcLinkLabelsTextColor={theme.palette.text.primary}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={2}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          theme={{
            tooltip: {
              container: {
                background: "#ffffff",
                color: "#333333"
              }
            }
          }}
        />
      </Box>
    </div>
  );
});
