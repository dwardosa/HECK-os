import React from "react";
import { format } from "date-fns";
import { isFullScreen } from "~/utils";
import { music } from "~/configs";
import type { MacActions } from "~/types";

interface TopBarItemProps {
  hideOnMobile?: boolean;
  forceHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const TopBarItem = forwardRef(
  (props: TopBarItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const hide = props.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex";
    const bg = props.forceHover
      ? "bg-gray-100/30 dark:bg-gray-400/40"
      : "hover:(bg-gray-100/30 dark:bg-gray-400/40)";

    return (
      <div
        ref={ref}
        className={`hstack space-x-1 h-6 px-1 cursor-default rounded ${hide} ${bg} ${
          props.className || ""
        }`}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
      >
        {props.children}
      </div>
    );
  }
);

const CCMIcon = ({ size }: { size: number }) => {
  return (
    <svg
      viewBox="0 0 29 29"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z" />
    </svg>
  );
};

interface TopBarProps extends MacActions {
  title: string;
  hide: boolean;
}

interface TopBarState {
  date: Date;
  showAppleMenu: boolean;
}

const TopBar = (props: TopBarProps) => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const spotlightBtnRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<TopBarState>({
    date: new Date(),
    showAppleMenu: false
  });

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [audio, audioState, controls, audioRef] = useAudio({
    src: music.audio,
    autoReplay: true
  });
  const { winWidth, winHeight } = useWindowSize();

  const { volume, wifi } = useStore((state) => ({
    volume: state.volume,
    wifi: state.wifi
  }));
  const { toggleFullScreen } = useStore((state) => ({
    toggleFullScreen: state.toggleFullScreen,
    setVolume: state.setVolume,
    setBrightness: state.setBrightness
  }));

  useInterval(() => {
    setState({
      ...state,
      date: new Date()
    });
  }, 60 * 1000);

  useEffect(() => {
    props.setSpotlightBtnRef(spotlightBtnRef);
    controls.volume(volume / 100);
  }, []);

  useEffect(() => {
    const isFull = isFullScreen();
    toggleFullScreen(isFull);
  }, [winWidth, winHeight]);

  const toggleAppleMenu = (): void => {
    setState({
      ...state,
      showAppleMenu: !state.showAppleMenu
    });
  };

  const logout = (): void => {
    controls.pause();
    props.setLogin(false);
  };

  const shut = (e: React.MouseEvent<HTMLLIElement>): void => {
    controls.pause();
    props.shutMac(e);
  };

  const restart = (e: React.MouseEvent<HTMLLIElement>): void => {
    controls.pause();
    props.restartMac(e);
  };

  const sleep = (e: React.MouseEvent<HTMLLIElement>): void => {
    controls.pause();
    props.sleepMac(e);
  };

  return (
    <div
      className={`w-full h-8 px-2 fixed top-0 hstack justify-between ${
        props.hide ? "z-0" : "z-20"
      } text-sm text-white bg-gray-700/10 backdrop-blur-2xl shadow transition`}
    >
      <div className="hstack space-x-1">
        <TopBarItem
          className="px-2"
          forceHover={state.showAppleMenu}
          onClick={toggleAppleMenu}
          ref={appleBtnRef}
        >
          <span className="i-ri:apple-fill text-base" />
        </TopBarItem>
        <TopBarItem
          className="font-semibold px-2"
          onMouseEnter={() => {
            if (state.showAppleMenu) toggleAppleMenu();
          }}
        >
          {props.title}
        </TopBarItem>
      </div>

      {/* Open this when clicking on Apple logo */}
      {state.showAppleMenu && (
        <AppleMenu
          logout={logout}
          shut={shut}
          restart={restart}
          sleep={sleep}
          toggleAppleMenu={toggleAppleMenu}
          btnRef={appleBtnRef}
        />
      )}

      <div className="hstack flex-row justify-end space-x-2">
        <TopBarItem hideOnMobile={true}>
          <Battery />
        </TopBarItem>
        <TopBarItem>
          <span>{format(state.date, "eee MMM d")}</span>
          <span>{format(state.date, "h:mm aa")}</span>
        </TopBarItem>
      </div>
    </div>
  );
};

export default TopBar;
