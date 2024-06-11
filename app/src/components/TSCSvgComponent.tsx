import React, { useEffect, useContext, useRef } from "react";
import { context } from "../state/index";
import { observer } from "mobx-react-lite";

interface SVGWindow extends Window {
  curHoverElemID?: string;
  curHoverTextID?: string;
}

type TSCSvgComponentProps = {
  chartContent: string;
};

export const TSCSvgComponent: React.FC<TSCSvgComponentProps> = observer(({ chartContent }) => {
  const { state, actions } = useContext(context);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleSvgEvent = (evt: MouseEvent, container: HTMLElement) => {
    const target = evt.target as HTMLElement;
    const svgEventWindow = window as SVGWindow;
    let currentElement: HTMLElement | null = target;
    while (currentElement && currentElement !== container) {
      if (currentElement.id && currentElement.id.startsWith("spawner")) {
        const elemID = currentElement.id;
        const textID = `id${elemID.replace("spawner", "")}`;

        switch (evt.type) {
          case "mouseover": {
            const e = document.getElementById(elemID);
            if (!e) return;
            e.setAttribute("opacity", "1");
            svgEventWindow.curHoverElemID = elemID;
            svgEventWindow.curHoverTextID = textID;
            break;
          }
          case "mouseout": {
            const elem = svgEventWindow.curHoverElemID ? document.getElementById(svgEventWindow.curHoverElemID) : null;
            if (elem) elem.setAttribute("opacity", "0");
            break;
          }
          case "click": {
            const textElement = document.getElementById(textID);
            const text = textElement ? textElement.getAttribute("popuptext") : "";
            let url: string = "http://localhost:5173";
            if (import.meta.env.VITE_APP_URL) {
              url = import.meta.env.VITE_APP_URL;
            }
            if (typeof svgEventWindow.top === "undefined") {
              alert(textID);
            } else if (svgEventWindow.top !== null) {
              svgEventWindow.top.postMessage({ action: "showPopup", text }, url);
            }
            break;
          }
        }
        break;
      }
      currentElement = currentElement.parentElement;
    }
  };

  useEffect(() => {
    if (!state.settings.mouseOverPopupsEnabled) return;

    const container = svgContainerRef.current;
    if (!container) return;

    const eventListenerWrapper = (evt: MouseEvent) => handleSvgEvent(evt, container);
    container.addEventListener("mouseover", eventListenerWrapper);
    container.addEventListener("mouseout", eventListenerWrapper);
    container.addEventListener("click", eventListenerWrapper);

    return () => {
      container.removeEventListener("mouseover", eventListenerWrapper);
      container.removeEventListener("mouseout", eventListenerWrapper);
      container.removeEventListener("click", eventListenerWrapper);
    };
  }, [chartContent, state.settings.mouseOverPopupsEnabled]);

  const setupTimelineAndLabel = (svg: SVGSVGElement) => {
    if (svg.getElementById("timeline")) return;
    //sanitizing the svg removes timeline id, so add it back
    const timeline = document.createElementNS("http://www.w3.org/2000/svg", "line");
    timeline.setAttribute("id", "timeline");
    //timeline_up and timeline_down are still in the svg after sanitization
    const timelineUp = svg.getElementById("timeline_up");
    for (const attr of timelineUp.attributes) {
      if (attr.name === "id") continue;
      timeline.setAttribute(attr.name, attr.value);
    }
    svg.appendChild(timeline);
    const timeLabelUp = svg.getElementById("TimeLineLabelUp");
    const timeLabelDown = svg.getElementById("TimeLineLabelDown");
    if (!timeLabelUp.firstChild || !timeLabelDown.firstChild) return;
    timeLabelUp.firstChild.nodeValue = "-1";
    timeLabelDown.firstChild.nodeValue = "+1";
  };

  const handleTimeline = (evt: MouseEvent, svg: SVGSVGElement) => {
    const timeline = svg.getElementById("timeline");
    const timelineUp = svg.getElementById("timeline_up");
    const timelineDown = svg.getElementById("timeline_down");
    const timeLabel = svg.getElementById("TimeLineLabel");
    const timeLabelUp = svg.getElementById("TimeLineLabelUp");
    const timeLabelDown = svg.getElementById("TimeLineLabelDown");

    if (!state.chartTimelineEnabled) {
      hideTimeline([timeline, timelineUp, timelineDown, timeLabel, timeLabelUp, timeLabelDown]);
      return;
    } else showTimeline([timeline, timelineUp, timelineDown, timeLabel, timeLabelUp, timeLabelDown]);

    //cursor location
    let point = new DOMPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;
    if (svg.getScreenCTM()) {
      //converts coordinates
      point = point.matrixTransform(svg.getScreenCTM()!.inverse());
    }
    const minY = Number(timeline.getAttribute("miny"));
    const maxY = Number(timeline.getAttribute("maxy"));

    const indicatorLineWidth = 10;
    //move timeline horizontally
    timelineUp.setAttribute("x1", String(point.x - indicatorLineWidth / 2));
    timelineUp.setAttribute("x2", String(point.x + indicatorLineWidth / 2));

    timelineDown.setAttribute("x1", String(point.x - indicatorLineWidth / 2));
    timelineDown.setAttribute("x2", String(point.x + indicatorLineWidth / 2));

    timeLabel.setAttribute("x", String(point.x + 12));
    timeLabelUp.setAttribute("x", String(point.x - 25));
    timeLabelDown.setAttribute("x", String(point.x - 21));

    //move timeline vertically if not locked
    if (!state.chartTimelineLocked) {
      //for not going out of bounds
      let currY = minY;
      if (point.y > currY) currY = point.y;
      if (currY > maxY) currY = maxY;
      const scale = Number(timeline.getAttribute("vertscale"));

      timeline.setAttribute("y1", String(currY));
      timeline.setAttribute("y2", String(currY));
      timelineUp.setAttribute("y1", String(currY - scale));
      timelineUp.setAttribute("y2", String(currY - scale));
      timelineDown.setAttribute("y1", String(currY + scale));
      timelineDown.setAttribute("y2", String(currY + scale));
      timeLabel.setAttribute("y", String(currY - 5));
      timeLabelUp.setAttribute("y", String(currY - scale + 2.5));
      timeLabelDown.setAttribute("y", String(currY + scale + 2.5));

      //get age of mouse location
      const topAge = Number(timeline.getAttribute("topage"));
      const currAge = topAge + (currY - minY) / scale;
      if (timeLabel.firstChild) timeLabel.firstChild.nodeValue = String(Math.round(currAge * 1000) / 1000);
    }
  };

  const showTimeline = (elements: Element[]) => {
    for (const element of elements) {
      //timelines
      if (element.tagName === "line") {
        element.setAttribute("style", "stroke: red; stroke-width: 0.5; stroke-opacity: 1;");
      }
      //timelabels
      if (element.tagName === "text") {
        element.setAttribute("style", "font-size: 10; fill: red; fill-opacity: 0.7;");
      }
    }
  };

  const hideTimeline = (elements: Element[]) => {
    for (const element of elements) {
      //timelines
      if (element.tagName === "line") {
        element.setAttribute("style", "stroke-opacity: 0;");
      }
      //timelabels
      if (element.tagName === "text") {
        element.setAttribute("style", "fill-opacity: 0;");
      }
    }
  };

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;
    if (!container.querySelector("svg")) return;
    const svg = container.querySelector("svg")!;
    setupTimelineAndLabel(svg);
    const eventListenerWrapper = (evt: MouseEvent) => handleTimeline(evt, svg);
    const lockTimeline = () => actions.setChartTimelineLocked(!state.chartTimelineLocked);
    container.addEventListener("mousemove", eventListenerWrapper);
    container.addEventListener("click", lockTimeline);
    return () => {
      container.removeEventListener("mousemove", eventListenerWrapper);
      container.removeEventListener("click", lockTimeline);
    };
  }, [chartContent, state.chartTimelineEnabled, state.chartTimelineLocked]);

  return <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: chartContent }} />;
});
