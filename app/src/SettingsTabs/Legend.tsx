import { Box, Button, IconButton, Typography, styled, useTheme } from "@mui/material";
import React, { useState, useContext, ChangeEvent, useRef, useEffect } from "react";
import {
  StyledScrollbar,
  CustomHeader,
  CustomDivider,
  TypographyText,
  TSCTextField,
  TSCInputAdornment,
  Lottie
} from "../components";
import { context } from "../state";
import { LegendItem } from "../types";
import { devSafeUrl } from "../util";
import { AvailableIcon, DisabledIcon, InfoIcon, ChildMapIcon } from "./MapButtons";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./Legend.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { ControlledMenu, Menu, MenuDivider, MenuItem, SubMenu, useClick, useMenuState } from "@szhsin/react-menu";
import { observer } from "mobx-react-lite";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SimpleBarCore from "simplebar-core";
import ArrowUpIcon from "../assets/icons/arrow-up.json";
import { LEGEND_HEADER_HEIGHT } from "./MapPointConstants";
import { Patterns } from "@tsconline/shared";

/**
 * This is the legend that describes the icons present on the
 * map viewer. Currently uses a legend item array inherently
 * @returns a component with a header and body of icons
 */
export const Legend = observer(() => {
  // the filters for the facies patterns
  const [searchValue, setSearchValue] = useState("");
  const [filterByPresent, setFilterByPresent] = useState(false);
  const [colorFilter, setColorFilter] = useState<Set<string>>(new Set<string>());

  //scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<SimpleBarCore>(null);

  const theme = useTheme();
  const { state } = useContext(context);

  function toggleColor(color: string) {
    if (colorFilter.has(color)) {
      colorFilter.delete(color);
      setColorFilter(new Set(colorFilter));
    } else {
      setColorFilter(new Set([...colorFilter, color]));
    }
  }
  function clearFilter() {
    setColorFilter(new Set<string>())
    setFilterByPresent(false)
  }

  // allows us to track how far the user scrolls
  useEffect(() => {
    const scrollEl = scrollRef.current?.contentWrapperEl;
    function handleScroll(_event: Event) {
      if (scrollEl) {
        setIsScrolled(scrollEl.scrollTop > window.innerHeight * 0.8);
      }
    }
    scrollEl?.addEventListener("scroll", handleScroll);
    return () => {
      scrollEl?.removeEventListener("scroll", handleScroll);
    };
  });
  const colors = new Set<string>();
  const filteredPatterns = Object.values(state.mapPatterns).filter((value) => {
    const isPresent = !filterByPresent || state.mapState.currentFaciesOptions.presentRockTypes.has(value.formattedName);
    const matchesSearch = value.formattedName.toLowerCase().includes(searchValue.toLowerCase());
    const hasColor = colorFilter.size == 0 || colorFilter.has(value.color);
    // load these to display all available colors for the certain context
    if (isPresent && matchesSearch) colors.add(value.color);
    return isPresent && matchesSearch && hasColor;
  });
  // legend icon array
  const legendItems: LegendItem[] = [
    { color: theme.palette.on.main, label: "On", icon: AvailableIcon },
    { color: theme.palette.off.main, label: "Off", icon: AvailableIcon },
    {
      color: theme.palette.disabled.main,
      label: "Data not in selected range",
      icon: DisabledIcon
    },
    { color: theme.palette.info.main, label: "Info point", icon: InfoIcon },
    { color: "transparent", label: "Child Map", icon: ChildMapIcon }
  ];
  const menuStyle = {
    zIndex: 1300,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.menuDropdown.main
  };

  return (
    <>
      <IconButton
        className={`scroll-top ${isScrolled ? "show" : ""}`}
        style={{ top: `calc(${LEGEND_HEADER_HEIGHT} + 1vh)` }}
        onClick={() => {
          scrollRef.current?.contentWrapperEl?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}>
        <Lottie key="legend-arrow-up" width="inherit" height="inherit" animationData={ArrowUpIcon} playOnHover />
      </IconButton>
      <StyledScrollbar
        ref={scrollRef}
        style={{
          height: `calc(100vh - ${LEGEND_HEADER_HEIGHT})`,
          backgroundColor: theme.palette.navbar.main
        }}>
        <CustomHeader className="legend-header" color="primary">
          Map Points
        </CustomHeader>
        <CustomDivider />
        <div className="legend-container">
          {legendItems.map((item, index) => (
            <DisplayLegendItem key={index} legendItem={item} />
          ))}
        </div>
        <CustomHeader className="legend-header" color="primary">
          Facies Patterns
        </CustomHeader>
        <div className="search-container">
          <FaciesSearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
          <div className="filters">
          <FilterMenu
            style={menuStyle}
            colors={colors}
            colorFilter={colorFilter}
            filterByPresent={filterByPresent}
            setFilterByPresent={setFilterByPresent}
            toggleColor={toggleColor}
          />
          <Button onClick={() => clearFilter()} className="filter-button">
            <TypographyText>Clear Filter</TypographyText>
          </Button>
          </div>
        </div>
        <CustomDivider />
        <FaciesPatterns patterns={filteredPatterns} />
      </StyledScrollbar>
    </>
  );
});

type FilterMenuProps = {
  style: React.CSSProperties;
  colors: Set<string>;
  colorFilter: Set<string>;
  filterByPresent: boolean;
  setFilterByPresent: (set: boolean) => void;
  toggleColor: (color: string) => void;
};

const FilterMenu: React.FC<FilterMenuProps> = observer(
  ({ style, colors, filterByPresent, colorFilter, setFilterByPresent, toggleColor }) => {
    // for configuring menu with transition and onClose
    const [menuState, toggleMenu] = useMenuState({ transition: true });
    const anchorProps = useClick(menuState.state, toggleMenu);
    const menuRef = useRef(null);
    const { state } = useContext(context);
    console.log(state.isFullscreen);
    return (
      <>
        <IconButton ref={menuRef} className="filter-button" {...anchorProps}>
          <FilterListIcon color="primary" />
        </IconButton>
        <ControlledMenu
          {...menuState}
          viewScroll="close"
          portal={!state.isFullscreen}
          className="menu"
          menuStyle={style}
          anchorRef={menuRef}
          onClose={(event) => {
            if (event.reason === "click") return;
            toggleMenu(false);
          }}>
          <CustomMenuItem
            checked={filterByPresent}
            onClick={() => setFilterByPresent(!filterByPresent)}
            type="checkbox">
            <TypographyText>Present in map</TypographyText>
          </CustomMenuItem>
          <MenuDivider />
          <ColorSubMenu style={style} colors={colors} colorFilter={colorFilter} toggleColor={toggleColor} />
        </ControlledMenu>
      </>
    );
  }
);

type FaciesSearchBarProps = {
  searchValue: string;
  setSearchValue: (search: string) => void;
};

const FaciesSearchBar: React.FC<FaciesSearchBarProps> = ({ searchValue, setSearchValue }) => {
  return (
    <div className="facies-search">
      <TSCTextField
        className="search-bar"
        value={searchValue}
        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setSearchValue(event.target.value);
        }}
        InputProps={{
          startAdornment: (
            <TSCInputAdornment>
              {" "}
              <SearchIcon />
            </TSCInputAdornment>
          )
        }}
      />
    </div>
  );
};

type ColorSubMenuProps = {
  style: React.CSSProperties;
  colors: Set<string>;
  colorFilter: Set<string>;
  toggleColor: (color: string) => void;
};

const ColorSubMenu: React.FC<ColorSubMenuProps> = ({ style, colors, colorFilter, toggleColor }) => {
  return (
    <CustomSubMenu className="color-menu" menuStyle={style} label={SubMenuIcon}>
      {Array.from(colors).map((color) => (
        <CustomMenuItem key={color} checked={colorFilter.has(color)} onClick={() => toggleColor(color)} type="checkbox">
          <TypographyText>{color}</TypographyText>
        </CustomMenuItem>
      ))}
    </CustomSubMenu>
  );
};

type FaciesPatternsProps = {
  patterns: Patterns[string][];
};
const FaciesPatterns: React.FC<FaciesPatternsProps> = ({ patterns }) => {
  return (
    <div className="legend-container facies-container">
      {patterns.map(({ name, formattedName, filePath }) => {
        return (
          <div className="facies-pattern-container" key={name}>
            <img className="legend-pattern" src={devSafeUrl(filePath)} />
            <Typography className="facies-pattern" color="primary">
              {formattedName}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

const SubMenuIcon = () => (
  <>
    <ColorLensIcon className="color-lens-icon" />
    <TypographyText>Color</TypographyText>
  </>
);

const DisplayLegendItem = ({ legendItem }: { legendItem: LegendItem }) => {
  const { color, label, icon: Icon } = legendItem;
  return (
    <Box className="legend-item-container">
      <Icon width={20} height={20} style={{ color: color }} mr={1} />
      <TypographyText className="legend-label">{label}</TypographyText>
    </Box>
  );
};
const CustomSubMenu = styled(SubMenu)(({ theme }) => ({
  "&.szh-menu__submenu > .szh-menu__item--hover": {
    backgroundColor: theme.palette.menuDropdown.light
  },
  "&.szh-menu__submenu > .szh-menu__item--checked": {
    color: theme.palette.primary.main
  }
}));
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.szh-menu__item--hover": {
    backgroundColor: theme.palette.menuDropdown.light
  },
  "&.szh-menu__item--checked": {
    color: theme.palette.primary.main
  }
}));
