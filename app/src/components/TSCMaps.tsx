import { IconButton, Dialog, Button, List, Box, ListItemButton, ListItemAvatar, ListItemText, Avatar} from '@mui/material'
import { useTheme } from "@mui/material/styles"
import type { InfoPoints, MapHierarchy, Bounds, MapPoints, MapInfo, RectBounds} from '@tsconline/shared'
import { devSafeUrl } from '../util'
import React, { useState, useRef, useContext } from "react"
import { context } from '../state';
import { observer } from "mobx-react-lite"
import { TransformWrapper, TransformComponent, useTransformEffect } from "react-zoom-pan-pinch"
import { TSCButton } from './TSCButton'
import { Tooltip } from 'react-tooltip'
import { isRectBounds, isVertBounds } from '@tsconline/shared'
import { calculateRectBoundsPosition, calculateVertBoundsPosition, calculateRectButton } from '../coordinates'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import 'react-tooltip/dist/react-tooltip.css'

import './TSCMaps.css'

const ICON_SIZE = 30

type MapRowComponentProps = {
  mapInfo: MapInfo; 
};

//overarching map list that has a hidden dialog box that will open on click
export const TSCMapList: React.FC<MapRowComponentProps> = observer(({ mapInfo }) => {
  const theme = useTheme();
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (name: string) => {
    setSelectedMap(name);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedMap(null)
  }

  return (
    <div style={{minHeight: '100vh'}}>
      <Box>
        <List>
          {Object.entries(mapInfo).map(([name, map]) => {
            return (
              <ListItemButton key={name} 
                selected={selectedMap === name}
                onClick={() => handleRowClick(name)} sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        cursor: 'pointer'
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.selection.light,
                      },
              }}>
                <ListItemAvatar>
                  <Avatar alt={name} src={devSafeUrl(map.img)} />
                </ListItemAvatar>
                <ListItemText primary={`${name}`} />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth={false}>
        {selectedMap ? <MapDialog name={selectedMap} /> : null}
      </Dialog>
    </div>
  );
});

 // The map interface that will be recursive so that we can create "multiple" windows.
 // Nested dialogs
 // TODO: possibly a better container than dialog?
const MapDialog = ({ name }: {name: string;}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [childName, setChildName] = useState(name)

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const openChild = (childName: string) => {
    setDialogOpen(true)
    setChildName(childName)
  }

  return (
    <>
      <MapViewer openChild={openChild} name={name} />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth={false} >
        <MapDialog name={childName}/>
      </Dialog>
    </>
  );
}

type MapProps  = {
  name: string;
  openChild: (childName: string) => void;
}

// This component is the map itself with the image and buttons within.
const MapViewer: React.FC<MapProps> = ({ name, openChild }) => {
  const {state, actions} = useContext(context)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const mapInfo: MapInfo = state.settingsTabs.mapInfo
  const mapData: MapInfo[string] = mapInfo[name]
  const mapHierarchy: MapHierarchy = state.settingsTabs.mapHierarchy
  const Controls = (
    { 
      zoomIn, 
      zoomOut, 
      resetTransform, 
      ...rest 
    } : {
      zoomIn: any,
      zoomOut: any,
      resetTransform: any,
    }
  ) => (
    <div className="controls">
      <TSCButton className="zoom-button" onClick={() => zoomIn()}>zoom in</TSCButton>
      <TSCButton className="zoom-button" onClick={() => zoomOut()}>zoom out</TSCButton>
      <TSCButton className="zoom-button" onClick={() => resetTransform()}>reset</TSCButton>
    </div>
  );

  return (
    <TransformWrapper 
    doubleClick={{
      disabled: true 
    }}
    minScale={1} 
    maxScale={3}
    limitToBounds={true}
    >
      {(utils) => (
      <>
        <TransformComponent >
          <>
          <img
          id="map"
          ref={imageRef}
          src={devSafeUrl(mapData.img)}
          alt="Map" 
          className="map"
          onLoad={() => setImageLoaded(true)}
          />
          {imageLoaded && imageRef && imageRef.current && mapData.mapPoints &&
          loadMapPoints(mapData.mapPoints, mapData.bounds, imageRef.current.width, imageRef.current.height, false)}
          {imageLoaded && imageRef && imageRef.current && mapData.infoPoints && 
          loadMapPoints(mapData.infoPoints, mapData.bounds, imageRef.current.width, imageRef.current.height, true)}
          {Object.keys(mapHierarchy).includes(name) && mapHierarchy[name].map((child, index) => {
            // if the parent exists, use the bounds of the parent on mapData
            // this is because the parent field is the bounds of this map on that parent map
            const bounds = ! mapData.parent ? mapData.bounds : mapData.parent!.bounds

            // name is the parentMap
            // mapHierarchy[name] contains all the children of the parent map
            // this will call for each child of name
            return createChildMapButton(
              child, 
              bounds, 
              mapInfo[mapHierarchy[name][Number(index)]].parent!.bounds, 
              openChild
              )
            })}
          </>
        </TransformComponent>
        <Controls {...utils}/>
      </>
      )}
    </TransformWrapper>
  );
}



type MapPointButtonProps = {
  mapPoint: MapPoints[string] | InfoPoints[string],
  x: number,
  y: number,
  name: string,
  isInfo?: boolean
}

// mapPointButton that pulls up the map points on the image
// mapPoint: the information of the map point
// x: % from the left
// y: % from the top
// name: name of the map point
// isInfo: will default to false. is this point an info button?
const MapPointButton: React.FC<MapPointButtonProps> = ({mapPoint, x, y, name, isInfo = false}) => {
  const [clicked, setClicked] = useState(false)
  const theme = useTheme()

  // below is the hook for grabbing the scale from map image scaling
  const [transform, setTransform] = useState({scale: 1, x: 0, y: 0})
  useTransformEffect(({ state, instance }) => {
    // console.log(state); // { previousScale: 1, scale: 1, positionX: 0, positionY: 0 }
    setTransform({scale: state.scale, x: state.positionX, y: state.positionY})
    return () => {
      // unmount
    };
  })
  let pointStyle = {
    color: `${clicked ? '#2ecc71' : '#f64747'}`,
  }
  if(isInfo) {
    pointStyle = {
      color: `${theme.palette.primary.light}`,
    }
  }

  return (
    <>
      <IconButton
        className="map-point"
        disableRipple={isInfo}
        style={{
          ...pointStyle,
          position: 'absolute',
          left: `calc(${x}% - ${ICON_SIZE / 2 / transform.scale}px)`,
          // we take a the full icon_size here to anchor to the
          // bottom of the icon
          top: `calc(${y}% - ${ICON_SIZE / transform.scale}px)`,
          width: `${ICON_SIZE / transform.scale}px`,
          height: `${ICON_SIZE / transform.scale}px`,
        }}
        data-tooltip-id={name}
        data-tooltip-float={true}
        onClick={() => {
          setClicked(!clicked)
        }}
      >
        {isInfo ? getIcon(true) : getIcon(clicked)}
      </IconButton>
      <Tooltip
        id={name}
        place="bottom"
        className="tooltip"
      >
        <div>
        <h3 className="header">{`${name}`}</h3>
        <ul>
            <li>Latitude: {mapPoint.lat}</li>
            <li>Longitude: {mapPoint.lon}</li>
            {/* <li>Default: {mapPoint.default || '--'}</li>
            <li>Minimum Age: {mapPoint.minage || '--'}</li>
            <li>Maximum Age: {mapPoint.maxage || '--'}</li> */}
            <li>Note: {mapPoint.note || '--'}</li>
        </ul>
        </div>
      </Tooltip>
    </>
  )
}


/**
 * This will create the rectangular map button for any children
 * @param name name of the child map
 * @param mapBounds bounds of the parent map
 * @param childBounds bounds of the child within the parent map
 * @param openChild function to open the dialog box in the recursive call
 * @returns 
 */
function createChildMapButton(name: string, mapBounds: Bounds, childBounds: Bounds, openChild: (childName: string) => void) {
  if (isRectBounds(childBounds) && isRectBounds(mapBounds)) {
    const { midpoint, upperLeft, width, height } = calculateRectButton(childBounds, mapBounds)
    return (
      <>
      <Button
      data-tooltip-id={name}
      className="child-map"
      style={{
        // border: "0.5px solid yellow",
        position: 'absolute',
        left: `calc(${upperLeft.x}%`,
        top: `calc(${upperLeft.y}%`,
        width: `${width}%`,
        height: `${height}%`,
        zIndex: "0"
      }} 
      data-tooltip-float={true}
      onClick={() => {openChild(name)}}
      />
      <Tooltip
        id={name}
        place="bottom"
        className="tooltip"
      >
        <div>
        <h3 className="header">{`${name}`}</h3>
        <ul>
            <li>Latitude: {midpoint.y}</li>
            <li>Longitude: {midpoint.x}</li>
            {/* <li>Default: {mapPoint.default || '--'}</li>
            <li>Minimum Age: {mapPoint.minage || '--'}</li>
            <li>Maximum Age: {mapPoint.maxage || '--'}</li> */}
            {/* <li>Note: {mapPoint.note || '--'}</li> */}
        </ul>
        </div>
      </Tooltip>
      </>
  )
  } else {
    console.log('map and/or child bounds are not rectbounds')
    console.log(`mapBounds not recognized, mapBounds are ${JSON.stringify(mapBounds, null, 2)}`)
    console.log(`childBounds not recognized, childBounds are ${JSON.stringify(childBounds, null, 2)}`)
    return
  }

}

/**
 * Gets position {x, y} of a map point based on the width and height
 * @param bounds Parent map bounds
 * @param point point within bounds
 * @param frameWidth frame width
 * @param frameHeight frame height
 * @returns x and y as a percentage of the frame from the top and left
 */
function getPositionOfPointBasedOnBounds(bounds: Bounds, point: MapPoints[string] | InfoPoints[string], frameWidth: number, frameHeight: number) { 
  let position = {x: 0, y: 0}
  if(isRectBounds(bounds)) {
    position = calculateRectBoundsPosition(point.lat, point.lon, bounds);
  } else if (isVertBounds(bounds)) {
    position = calculateVertBoundsPosition(point.lat, point.lon, frameHeight, frameWidth, bounds);
  } else {
    console.log(`Bounds is not in the correct format `, JSON.stringify(bounds, null, 2))
    return null
  }
  return position
}

/**
 * Loads map points based on frame and parent bounds
 * @param points points to be iterated over
 * @param bounds Parent Bounds that points is within
 * @param frameWidth frame width
 * @param frameHeight frame height
 * @param isInfo is this an info point?
 * @returns all MapPointButton Components
 */
function loadMapPoints(points: MapPoints | InfoPoints, bounds: Bounds, frameWidth: number, frameHeight: number, isInfo: boolean) {
  if (!points) return
  return (Object.entries(points).map(([name, point]) => {
    if (!point) return
    const position = getPositionOfPointBasedOnBounds(bounds, point, frameWidth, frameHeight)
    if (position == null) return
    return (
      <MapPointButton 
      key={name} 
      mapPoint={point}
      x={position.x} 
      y={position.y} 
      name={name}
      isInfo={isInfo}/>
    );
  }))
}

/**
 * Depending on if the point was clicked, return a different icon
 * @param clicked 
 * @returns 
 */
function getIcon(clicked: boolean){
  if (clicked) {
    return (<LocationOnIcon 
      className="icon"
      />)
  }
  return (<LocationOffIcon
    className="icon"
    />)
}