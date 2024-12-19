import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { DatapackUploadForm, TSCButton, CustomTooltip, CustomDivider } from "../components";
import { context } from "../state";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import { Menu, MenuItem } from "@szhsin/react-menu";
import styles from "./Datapack.module.css";
import { Dialog, ToggleButtonGroup, ToggleButton, IconButton, SvgIcon } from "@mui/material";
import { People, School, Security, Verified } from "@mui/icons-material";
import { TSCDatapackCard } from "../components/datapack_display/TSCDatapackCard";
import TableRowsIcon from "@mui/icons-material/TableRows";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { TSCDatapackRow } from "../components/datapack_display/TSCDatapackRow";
import DeselectIcon from "@mui/icons-material/Deselect";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { TSCCompactDatapackRow } from "../components/datapack_display/TSCCompactDatapackRow";
import { loadRecaptcha, removeRecaptcha } from "../util";
import { toJS } from "mobx";
import { Datapack, DatapackConfigForChartRequest, DeferredDatapack } from "@tsconline/shared";
import { Lock } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  compareExistingDatapacks,
  getCurrentUserDatapacks,
  getPrivateOfficialDatapacks,
  getPublicDatapacksWithoutCurrentUser,
  getPublicOfficialDatapacks,
  getWorkshopDatapacks,
  isFullDatapackTypeAvailable,
  isOwnedByUser
} from "../state/non-action-util";
import { ErrorCodes } from "../util/error-codes";

export const Datapacks = observer(function Datapacks() {
  const { state, actions } = useContext(context);
  const [formOpen, setFormOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (state.isLoggedIn && state.user.isAdmin) {
      loadRecaptcha().then(async () => {
        await actions.adminFetchPrivateOfficialDatapacks();
      });
    }
    return () => {
      if (state.isLoggedIn && state.user.isAdmin) {
        removeRecaptcha();
      }
    };
  }, []);

  return (
    <div className={styles.dc}>
      <div className={styles.hdc}>
        <CustomTooltip title="Deselect All" placement="top">
          <IconButton
            className={styles.ib}
            data-tour="datapack-deselect-button"
            onClick={async () => {
              await actions.processDatapackConfig([]);
            }}>
            <DeselectIcon />
          </IconButton>
        </CustomTooltip>
        <div>
          <Typography className={styles.h}>{t("settings.datapacks.see-info-guidance")}</Typography>
          <Typography className={styles.dh}>{t("settings.datapacks.add-datapack-guidance")}</Typography>
        </div>
        <ToggleButtonGroup
          className={styles.display}
          data-tour="datapack-display-button"
          value={state.settingsTabs.datapackDisplayType}
          onChange={(_event, val) => {
            if (val === state.settingsTabs.datapackDisplayType || !/^(rows|cards|compact)$/.test(val)) return;
            actions.setDatapackDisplayType(val);
          }}
          exclusive>
          <ToggleButton className={styles.tb} disableRipple value="compact">
            {" "}
            <ViewCompactIcon className={styles.icon} />{" "}
          </ToggleButton>
          <ToggleButton className={styles.tb} disableRipple value="rows">
            {" "}
            <TableRowsIcon className={styles.icon} />{" "}
          </ToggleButton>
          <ToggleButton className={styles.tb} disableRipple value="cards">
            {" "}
            <DashboardIcon className={styles.icon} />{" "}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Box
        className={`${styles.datapackDisplayContainer} ${state.settingsTabs.datapackDisplayType === "cards" && styles.cards}`}>
        <DatapackGroupDisplay
          datapacks={getPublicOfficialDatapacks(state.datapacks)}
          header={t("settings.datapacks.title.public-official")}
          HeaderIcon={Verified}
          loading={state.skeletonStates.officialDatapacksLoading}
        />
        {state.user.isAdmin && (
          <DatapackGroupDisplay
            datapacks={getPrivateOfficialDatapacks(state.datapacks)}
            header={t("settings.datapacks.title.private-official")}
            HeaderIcon={Security}
            loading={state.skeletonStates.privateUserDatapacksLoading}
          />
        )}
        {(state.user.workshopIds?.length ?? 0) > 0 && (
          <DatapackGroupDisplay
            datapacks={getWorkshopDatapacks(state.datapacks)}
            header={t("settings.datapacks.title.workshop")}
            HeaderIcon={School}
            loading={state.skeletonStates.publicUserDatapacksLoading}
          />
        )}
        {state.isLoggedIn && state.user && (
          <DatapackGroupDisplay
            datapacks={getCurrentUserDatapacks(state.user.uuid, state.datapacks)}
            header={t("settings.datapacks.title.your")}
            HeaderIcon={Lock}
            loading={state.skeletonStates.privateUserDatapacksLoading}
          />
        )}
        <DatapackGroupDisplay
          datapacks={getPublicDatapacksWithoutCurrentUser(state.datapacks, state.user?.uuid)}
          header={t("settings.datapacks.title.contributed")}
          HeaderIcon={People}
          loading={state.skeletonStates.publicUserDatapacksLoading}
        />
      </Box>
      <Box className={`${styles.container} ${styles.buttonContainer}`}>
        {state.isLoggedIn && (
          <TSCButton
            className={styles.buttons}
            onClick={() => {
              setFormOpen(!formOpen);
            }}>
            {t("settings.datapacks.upload")}
          </TSCButton>
        )}
        <TSCButton
          className={styles.buttons}
          data-tour="datapack-confirm-button"
          onClick={async () => {
            await actions.processDatapackConfig(toJS(state.unsavedDatapackConfig));
          }}>
          {t("button.confirm-selection")}
        </TSCButton>
      </Box>
      <Dialog classes={{ paper: styles.dd }} open={formOpen} onClose={() => setFormOpen(false)}>
        <DatapackUploadForm
          close={() => setFormOpen(false)}
          upload={actions.uploadUserDatapack}
          type={{
            type: "user",
            uuid: state.user?.uuid
          }}
        />
      </Dialog>
    </div>
  );
});
type DatapackMenuProps = {
  datapack: DeferredDatapack;
  button?: JSX.Element;
};
export const DatapackMenu: React.FC<DatapackMenuProps> = ({ datapack, button }) => {
  const { state, actions } = useContext(context);
  return (
    <Menu
      direction="bottom"
      align="start"
      portal
      menuButton={button || <DownloadIcon className="download-icon" />}
      onClick={(e) => e.stopPropagation()}
      transition>
      <MenuItem onClick={async () => await actions.requestDownload(datapack, true)}>
        <Typography>Encrypted Download</Typography>
      </MenuItem>
      <MenuItem onClick={async () => await actions.requestDownload(datapack, false)}>
        <Typography>Retrieve Original File</Typography>
      </MenuItem>
      {isOwnedByUser(datapack, state.user?.uuid) && (
        <MenuItem onClick={async () => await actions.userDeleteDatapack(datapack.title)}>
          <Typography>Delete Datapack</Typography>
        </MenuItem>
      )}
    </Menu>
  );
};

type DatapackGroupDisplayProps = {
  datapacks: DeferredDatapack[];
  header: string;
  HeaderIcon: React.ElementType;
  loading?: boolean;
};
const DatapackGroupDisplay: React.FC<DatapackGroupDisplayProps> = observer(
  ({ datapacks, header, HeaderIcon, loading = false }) => {
    const { state, actions } = useContext(context);
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const extraLoadingSkeletons = loading ? 2 : 0;
    const isOfficial = header === t("settings.datapacks.title.public-official");
    const isPublicContributed = header === t("settings.datapacks.title.contributed");
    const shouldSplitIntoTwoCol = isOfficial || isPublicContributed;
    const visibleLimit = shouldSplitIntoTwoCol ? 12 : 6;
    const visibleDatapacks: (Datapack | null)[] = showAll ? datapacks : datapacks.slice(0, visibleLimit);
    const skeletons = Array.from({ length: extraLoadingSkeletons }, () => null);
    const onChange = async (newDatapack: DatapackConfigForChartRequest) => {
      if (state.unsavedDatapackConfig.includes(newDatapack)) {
        actions.setUnsavedDatapackConfig(
          state.unsavedDatapackConfig.filter((datapack) => datapack.title !== newDatapack.title)
        );
      } else {
        actions.setLoadingDatapack(true);
      if (!isFullDatapackTypeAvailable(newDatapack, state.datapacks)) {
        let datapack: Datapack | undefined;
        try {
          switch (newDatapack.type) {
            case "user":
              datapack = await actions.fetchUserDatapack(newDatapack.title);
              break;
            case "official":
              datapack = await actions.fetchOfficialDatapack(newDatapack.title);
              break;
            case "workshop":
              // TODO: FILL THIS IN
              break;
          }
        } catch (e) {
          actions.setLoadingDatapack(false);
          actions.pushError(ErrorCodes.UNABLE_TO_FETCH_DATAPACKS);
          return;
        }
        if (!datapack) {
          actions.setLoadingDatapack(false);
          actions.pushError(ErrorCodes.UNABLE_TO_FETCH_DATAPACKS);
          return;
        }
        actions.addDatapack(datapack);
      }
      actions.setUnsavedDatapackConfig([...state.unsavedDatapackConfig, newDatapack]);
        actions.setLoadingDatapack(false);
    }
    };
    const numberOfDatapacks = datapacks.length + extraLoadingSkeletons;
    const shouldWrap = shouldSplitIntoTwoCol && state.settingsTabs.datapackDisplayType !== "cards";
    const officialRowLimit =
      shouldSplitIntoTwoCol && (showAll || numberOfDatapacks <= visibleLimit)
        ? { gridTemplateRows: `repeat(${(numberOfDatapacks / 2).toFixed(0)}, 1fr)` }
        : {};

    return (
      <Box
        className={`${styles.container} ${state.settingsTabs.datapackDisplayType === "cards" ? styles.cards : ""} ${shouldSplitIntoTwoCol && styles.official}`}>
        <Box className={styles.header}>
          <SvgIcon className={styles.sdi}>
            <HeaderIcon />
          </SvgIcon>
          <Typography
            variant="h5"
            fontWeight={700}
            fontSize="1.2rem"
            className={styles.idh}>{`${header} (${numberOfDatapacks - extraLoadingSkeletons})`}</Typography>
        </Box>
        <CustomDivider className={styles.divider} />
        {numberOfDatapacks !== 0 && (
          <Box className={`${styles.item} ${shouldWrap && styles.wrapItem}`} style={officialRowLimit}>
            {[...visibleDatapacks, ...skeletons].map((datapack, index) => {
              const value = datapack
                ? state.unsavedDatapackConfig.some((dp) => compareExistingDatapacks(dp, datapack))
                : false;
              if (datapack.title === "British Isles") console.log("value", value);
            return state.settingsTabs.datapackDisplayType === "rows" ? (
                datapack ? (
                  <TSCDatapackRow key={datapack.title} datapack={datapack} value={value} onChange={onChange} />
                ) : (
                  <TSCDatapackRow key={index} />
                )
              ) : state.settingsTabs.datapackDisplayType === "compact" ? (
                datapack ? (
                  <TSCCompactDatapackRow key={datapack.title} datapack={datapack} value={value} onChange={onChange} />
                ) : (
                  <TSCCompactDatapackRow key={index} />
                )
              ) : datapack ? (
                <TSCDatapackCard key={datapack.title} datapack={datapack} value={value} onChange={onChange} />
              ) : (
                <TSCDatapackCard key={index} />
              );
            })}
          </Box>
        )}
        {numberOfDatapacks > visibleLimit && (
          <Box className={styles.showBox} onClick={() => setShowAll(!showAll)}>
            <Typography className={styles.show} variant="body2" color="primary">
              {!showAll ? t("settings.datapacks.seeMore") : t("settings.datapacks.seeLess")}
            </Typography>
          </Box>
        )}
        {numberOfDatapacks === 0 && (
          <Typography>
            {t("settings.datapacks.no")} {header} {t("settings.datapacks.avaliable")}
          </Typography>
        )}
      </Box>
    );
  }
);
