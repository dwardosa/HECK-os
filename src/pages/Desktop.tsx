import React, { useState, useEffect } from "react";
import { useStore } from "~/stores";
import { apps, wallpapers } from "~/configs";
import { minMarginY } from "~/utils";
import type { MacActions } from "~/types";
import AppWindow from "~/components/AppWindow";
import TopBar from "~/components/menus/TopBar";
import Spotlight from "~/components/Spotlight";
import Launchpad from "~/components/Launchpad";
import Dock from "~/components/dock/Dock";
import DesktopFile from "~/components/files/DesktopFile";
import FileViewer from "~/components/files/FileViewer";
import WaterCooler from "~/components/files/WaterCooler";
import TreeFall from "~/components/TreeFall";
import { desktopFiles } from "~/types/configs/files";
import type { DesktopFile as DesktopFileType } from "~/types/DesktopFile";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
  selectedFile: string | null;
  viewingFile: DesktopFileType | null;
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false,
    selectedFile: null,
    viewingFile: null
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const { dark, brightness } = useStore((state) => ({
    dark: state.dark,
    brightness: state.brightness
  }));

  const getAppsData = (): void => {
    let showApps = {},
      appsZ = {},
      maxApps = {},
      minApps = {};

    apps.forEach((app) => {
      showApps = {
        ...showApps,
        [app.id]: !!app.show
      };
      appsZ = {
        ...appsZ,
        [app.id]: 2
      };
      maxApps = {
        ...maxApps,
        [app.id]: false
      };
      minApps = {
        ...minApps,
        [app.id]: false
      };
    });

    setState({ ...state, showApps, appsZ, maxApps, minApps });
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleLaunchpad = (target: boolean): void => {
    const r = document.querySelector(`#launchpad`) as HTMLElement;
    if (target) {
      r.style.transform = "scale(1)";
      r.style.transition = "ease-in 0.2s";
    } else {
      r.style.transform = "scale(1.1)";
      r.style.transition = "ease-out 0.2s";
    }

    setState({ ...state, showLaunchpad: target });
  };

  const toggleSpotlight = (): void => {
    setState({ ...state, spotlight: !state.spotlight });
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
  };

  const setAppMax = (id: string, target?: boolean): void => {
    const maxApps = state.maxApps;
    if (target === undefined) target = !maxApps[id];
    maxApps[id] = target;
    setState({
      ...state,
      maxApps: maxApps,
      hideDockAndTopbar: target
    });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    const minApps = state.minApps;
    if (target === undefined) target = !minApps[id];
    minApps[id] = target;
    setState({
      ...state,
      minApps: minApps
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);

    // get the corrosponding dock icon's position
    let r = document.querySelector(`#dock-${id}`) as HTMLElement;
    const dockAppRect = r.getBoundingClientRect();

    r = document.querySelector(`#window-${id}`) as HTMLElement;
    // const appRect = r.getBoundingClientRect();
    const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
    // "+ window.innerWidth" because of the boundary for windows
    const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

    // translate the window to that position
    r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    r.style.transition = "ease-out 0.3s";

    // add it to the minimized app list
    setAppMin(id, true);
  };

  const closeApp = (id: string): void => {
    setAppMax(id, false);
    const showApps = state.showApps;
    showApps[id] = false;
    setState({
      ...state,
      showApps: showApps,
      hideDockAndTopbar: false
    });
  };

  const openApp = (id: string): void => {
    // add it to the shown app list
    const showApps = state.showApps;
    showApps[id] = true;

    // move to the top (use a maximum z-index)
    const appsZ = state.appsZ;
    const maxZ = state.maxZ + 1;
    appsZ[id] = maxZ;

    // get the title of the currently opened app
    const currentApp = apps.find((app) => {
      return app.id === id;
    });
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    setState({
      ...state,
      showApps: showApps,
      appsZ: appsZ,
      maxZ: maxZ,
      currentTitle: currentApp.title
    });

    const minApps = state.minApps;
    // if the app has already been shown but minimized
    if (minApps[id]) {
      // move to window's last position
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      r.style.transform = `translate(${r.style.getPropertyValue(
        "--window-transform-x"
      )}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
      r.style.transition = "ease-in 0.3s";
      // remove it from the minimized app list
      minApps[id] = false;
      setState({ ...state, minApps });
    }
  };

  const handleFileSelect = (fileId: string) => {
    console.log("handleFileSelect called with:", fileId);
    setState({ ...state, selectedFile: fileId });
  };

  const handleFileOpen = (file: DesktopFileType) => {
    console.log("handleFileOpen called with file:", file); // Debug log
    // Ensure we're updating the state with the file object
    setState((prevState) => ({
      ...prevState,
      viewingFile: file
    }));
  };

  const closeFileViewer = () => {
    console.log("Closing file viewer");
    setState({ ...state, viewingFile: null });
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (state.viewingFile) {
      closeFileViewer();
      console.log("Closing file viewer on desktop click");
    }
    console.log("Desktop clicked:", e.target); // Debug log
    // Deselect file if clicking on empty desktop area
    if (e.target === e.currentTarget) {
      setState((prevState) => ({ ...prevState, selectedFile: null }));
    }
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (app.desktop && state.showApps[app.id]) {
        const props = {
          id: app.id,
          title: app.title,
          width: app.width,
          height: app.height,
          minWidth: app.minWidth,
          minHeight: app.minHeight,
          aspectRatio: app.aspectRatio,
          x: app.x,
          y: app.y,
          z: state.appsZ[app.id],
          max: state.maxApps[app.id],
          min: state.minApps[app.id],
          close: closeApp,
          setMax: setAppMax,
          setMin: minimizeApp,
          focus: openApp
        };

        return (
          <AppWindow key={`desktop-app-${app.id}`} {...props}>
            {app.content}
          </AppWindow>
        );
      } else {
        return <div key={`desktop-app-${app.id}`} />;
      }
    });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
        filter: `brightness( ${(brightness as number) * 0.7 + 50}% )`
      }}
      onClick={handleDesktopClick}
    >
      {/* Tree Fall Animation */}
      <TreeFall />

      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />

      {/* Desktop Files */}
      <div className="absolute inset-0" style={{ pointerEvents: "auto" }}>
        {desktopFiles
          .filter(file => file.id !== 'water-cooler') // Exclude water-cooler from regular files
          .map((file) => (
          <DesktopFile
            key={file.id}
            {...file}
            selected={state.selectedFile === file.id}
            onFileClick={(fileData) => {
              console.log("Double-click handler in Desktop with:", fileData);
              handleFileOpen(fileData);
            }}
          />
        ))}
      </div>

      {/* Water Cooler - Special Component */}
      <WaterCooler />

      {/* Terminal Backdrop Blur */}
      {state.showApps.terminal && (
        <div 
          className="fixed inset-0 z-12"
          style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Desktop Apps */}
      <div className="window-bound absolute" style={{ top: minMarginY, zIndex: 50 }}>
        {renderAppWindows()}
      </div>

      {/* File Viewer */}
      {state.viewingFile && (
        <FileViewer file={state.viewingFile} onClose={closeFileViewer} />
      )}

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />
    </div>
  );
}
