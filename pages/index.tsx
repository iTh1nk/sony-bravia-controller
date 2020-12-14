import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";
import { useEffect, useReducer } from "react";
import Axios from "axios";
import IsLoading from "../components/IsLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircle,
  faForward,
  faHome,
  faKeyboard,
  faMinus,
  faPause,
  faPlay,
  faPlus,
  faStepBackward,
  faStepForward,
  faUndo,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { faSourcetree } from "@fortawesome/free-brands-svg-icons";

const Title = styled.div(() => [
  tw`text-purple-800 font-semibold text-lg mr-2`,
]);
const SubTitle = styled.div(() => [tw`text-purple-800 py-2 px-1`]);
const Button = styled.button(() => [tw`mx-2 my-1 rounded-sm px-1`]);
const SubTitleSystemInfo = styled.div(() => [
  tw`text-purple-800 inline-block break-all p-1 ml-2`,
]);
const SubTitlePanel = styled.span(() => [tw`text-purple-800 py-2 px-1`]);

type exInStArr = {
  uri: string;
  title: string;
  label: string;
  icon: string;
  connection: boolean;
};
type SourceList = {
  source: string;
};
type SystemInfo = {
  area: string;
  cid: string;
  generation: string;
  language: string;
  macAddr: string;
  model: string;
  name: string;
  product: string;
  region: string;
  serial: string;
};
type VolumeInfo = {
  volume: number;
  minVolume: number;
  mute: boolean;
  maxVolume: number;
  target: string;
};
type StatusState = {
  isModal: boolean;
  modalBody: any;
  exInSt: Array<exInStArr>;
  powerSt: string;
  sourceSt: Array<SourceList>;
  systemInfo: Array<SystemInfo>;
  volumeInfo: Array<VolumeInfo>;
  refresh: boolean;
  isLoading: boolean;
  loadingBody: string;
};
const initialStates: StatusState = {
  isModal: false,
  modalBody: [],
  exInSt: [],
  powerSt: "",
  sourceSt: [],
  systemInfo: [
    {
      area: "",
      cid: "",
      generation: "",
      language: "",
      macAddr: "",
      model: "",
      name: "",
      product: "",
      region: "",
      serial: "",
    },
  ],
  volumeInfo: [
    { volume: 0, minVolume: 0, mute: false, maxVolume: 100, target: "" },
  ],
  refresh: false,
  isLoading: true,
  loadingBody: "TV Offline",
};
type StatusAction =
  | { type: "exInSt"; payload: Array<exInStArr> }
  | { type: "dismissModal" }
  | { type: "showModal" }
  | { type: "powerSwitch"; payload: string }
  | { type: "sourceList"; payload: Array<SourceList> }
  | { type: "systemInfo"; payload: Array<SystemInfo> }
  | { type: "volumeInfo"; payload: Array<VolumeInfo> }
  | { type: "refresh" }
  | { type: "isLoading"; payload: boolean }
  | { type: "loadingBody"; payload: string };

function statusReducer(state: StatusState, action: StatusAction) {
  switch (action.type) {
    case "exInSt":
      return {
        ...state,
        exInSt: action.payload,
        modalBody: action.payload,
      };
    case "dismissModal":
      return {
        ...state,
        isModal: false,
      };
    case "showModal":
      return {
        ...state,
        isModal: true,
      };
    case "powerSwitch":
      return {
        ...state,
        powerSt: action.payload,
      };
    case "sourceList":
      return {
        ...state,
        sourceSt: action.payload,
      };
    case "systemInfo":
      return {
        ...state,
        systemInfo: action.payload,
      };
    case "volumeInfo":
      return {
        ...state,
        volumeInfo: action.payload,
      };
    case "refresh":
      return {
        ...state,
        refresh: !state.refresh,
      };
    case "isLoading":
      return {
        ...state,
        isLoading: action.payload,
      };
  }
}

export default function IndexPage() {
  const [state, dispatch] = useReducer(statusReducer, initialStates);

  useEffect(() => {
    Axios.all([
      Axios.post(
        "http://10.0.0.98/sony/avContent",
        {
          method: "getSourceList",
          id: 1,
          params: [{ scheme: "extInput" }],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
      ),
      Axios.post(
        "http://10.0.0.98/sony/system",
        {
          method: "getSystemInformation",
          id: 33,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
      ),
      Axios.post(
        "http://10.0.0.98/sony/system",
        {
          method: "getPowerStatus",
          id: 50,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
      ),
      Axios.post(
        "http://10.0.0.98/sony/audio",
        {
          method: "getVolumeInformation",
          id: 33,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
      ),
    ])
      .then(
        Axios.spread((...resp) => {
          dispatch({ type: "sourceList", payload: resp[0].data.result[0] });
          dispatch({ type: "systemInfo", payload: resp[1].data.result });
          dispatch({
            type: "powerSwitch",
            payload: resp[2].data.result[0].status,
          });
          dispatch({ type: "volumeInfo", payload: resp[3].data.result[0] });
          dispatch({ type: "isLoading", payload: false });
          console.log("Refreshed");
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }, [state.refresh]);

  const inputCtl = (port) => {
    dispatch({ type: "isLoading", payload: true });
    dispatch({ type: "loadingBody", payload: "Changing Source..." });
    Axios.post(
      "http://10.0.0.98/sony/avContent",
      {
        method: "setPlayContent",
        version: "1.0",
        id: 1,
        params: [
          {
            uri: `extInput:hdmi?port=${port}`,
          },
        ],
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh", payload: !state.refresh });
      })
      .catch((err) => {
        dispatch({ type: "isLoading", payload: false });
        console.log(err, err.response);
      });
  };
  const muteCtl = () => {
    Axios.post(
      "http://10.0.0.98/sony/audio",
      {
        method: "setAudioMute",
        id: 601,
        params: [{ status: !state.volumeInfo[0].mute }],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh", payload: !state.refresh });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const volumeCtl = (str) => {
    Axios.post(
      "http://10.0.0.98/sony/audio",
      {
        method: "setAudioVolume",
        id: 601,
        params: [
          {
            volume: str === "+" ? "+2" : str === "-" ? "-2" : str,
            target: "speaker",
          },
        ],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh", payload: !state.refresh });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const statusInput = () => {
    dispatch({ type: "isLoading", payload: true });
    dispatch({ type: "loadingBody", payload: "Getting Input Status..." });
    Axios.post(
      "http://10.0.0.98/sony/avContent",
      {
        method: "getCurrentExternalInputsStatus",
        id: 105,
        params: [],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "showModal" });
        dispatch({ type: "exInSt", payload: resp.data.result[0] });
        dispatch({ type: "refresh", payload: !state.refresh });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const activeAppCtl = (appURI, appName) => {
    dispatch({ type: "isLoading", payload: true });
    dispatch({ type: "loadingBody", payload: `Launching ${appName}` });
    Axios.post(
      "http://10.0.0.98/sony/appControl",
      {
        method: "setActiveApp",
        id: 601,
        params: [
          {
            // uri: "localapp://webappruntime?url=http%3A%2F%2Fyoutube.com%2F",
            uri: appURI,
          },
        ],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        console.log(resp.data.result[0]);
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh", payload: !state.refresh });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const formCtl = () => {};
  // *********************************************************************************************************************
  // *********************************************************************************************************************
  // *********************************************************************************************************************
  // ************  LINE  *****************************************************************************  LINE  ************
  // *********************************************************************************************************************
  // *********************************************************************************************************************
  // *********************************************************************************************************************

  if (state.isLoading) {
    return (
      <div>
        <IsLoading body={state.loadingBody} />
      </div>
    );
  }

  return (
    <Container
      modalTitle={"Status"}
      modalBody={JSON.stringify(state.modalBody)}
      isModal={state.isModal}
      cbIsModal={(e) => dispatch({ type: "dismissModal" })}
    >
      {/* Top Control Icons */}
      <div className="text-center px-6 pt-6">
        <FontAwesomeIcon
          onClick={() => {}}
          className="mx-3 cursor-pointer text-xl text-purple-800"
          icon={faHome}
        />
        <FontAwesomeIcon
          onClick={() => {
            formCtl();
          }}
          className="mx-3 cursor-pointer text-xl text-purple-800"
          icon={faKeyboard}
        />
        <FontAwesomeIcon
          onClick={() => {}}
          className="mx-3 cursor-pointer text-xl text-purple-800"
          icon={faSourcetree}
        />
      </div>
      {/* Power */}
      <div className="px-6 py-3">
        <div className="flex flex-row justify-start items-center">
          <Title>
            <div className="pr-3">- Power</div>
          </Title>
          <Toggle
            key={state.powerSt}
            status={state.powerSt === "active" ? true : false}
          />
        </div>
        {/* Input */}
        <div className="mt-3">
          <div className="mb-2 cursor-pointer">
            <Title onClick={() => statusInput()}>- Source</Title>
          </div>
          <div className="">
            <div className="flex items-center justify-center">
              <Button onClick={() => inputCtl(1)}>
                <SubTitle>HDMI1</SubTitle>
              </Button>
              <Button onClick={() => inputCtl(2)}>
                <SubTitle>HDMI2</SubTitle>
              </Button>
              <Button onClick={() => inputCtl(3)}>
                <SubTitle>HDMI3</SubTitle>
              </Button>
              <Button onClick={() => inputCtl(4)}>
                <SubTitle>HDMI4</SubTitle>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={() =>
                  activeAppCtl(
                    "com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity",
                    "YouTube"
                  )
                }
              >
                <img
                  width={50}
                  height={40}
                  src="http://10.0.0.98/DIAL/icon/com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity.png"
                  alt="YouTube Icon"
                />
              </Button>
              <Button
                onClick={() =>
                  activeAppCtl(
                    "com.sony.dtv.com.amazon.amazonvideo.livingroom.com.amazon.ignition.IgnitionActivity",
                    "PrimeVideo"
                  )
                }
              >
                <img
                  className="rounded-md"
                  width={40}
                  height={30}
                  src="http://10.0.0.98/DIAL/icon/com.sony.dtv.com.amazon.amazonvideo.livingroom.com.amazon.ignition.IgnitionActivity.png"
                  alt="Prime Video Icon"
                />
              </Button>
              <Button
                onClick={() =>
                  activeAppCtl(
                    "com.sony.dtv.com.netflix.ninja.com.netflix.ninja.MainActivity",
                    "Netflix"
                  )
                }
              >
                <img
                  className="rounded-md"
                  width={40}
                  height={30}
                  src="http://10.0.0.98/DIAL/icon/com.sony.dtv.com.netflix.ninja.com.netflix.ninja.MainActivity.png"
                  alt="Netflix Icon"
                />
              </Button>
              <Button
                onClick={() =>
                  activeAppCtl(
                    "com.sony.dtv.com.disney.disneyplus.com.bamtechmedia.dominguez.main.MainActivity",
                    "Disney+"
                  )
                }
              >
                <img
                  className="rounded-md"
                  width={40}
                  height={30}
                  src="http://10.0.0.98/DIAL/icon/com.sony.dtv.com.disney.disneyplus.com.bamtechmedia.dominguez.main.MainActivity.png"
                  alt="Disney+ Icon"
                />
              </Button>
              <Button
                onClick={() =>
                  activeAppCtl(
                    "com.sony.dtv.com.nest.android.com.obsidian.v4.tv.home.TvHomeActivity",
                    "Nest"
                  )
                }
              >
                <img
                  className="rounded-md"
                  width={40}
                  height={30}
                  src="http://10.0.0.98/DIAL/icon/com.sony.dtv.com.nest.android.com.obsidian.v4.tv.home.TvHomeActivity.png"
                  alt="Nest Icon"
                />
              </Button>
            </div>
          </div>
        </div>
        {/* Volume */}
        <div className="mt-3">
          <div className="mb-2">
            <Title>- Volume</Title>
            <div className="flex flex-col justify-center items-center">
              <div>
                <Button onClick={() => muteCtl()}>
                  <SubTitle>
                    <FontAwesomeIcon
                      className={`${
                        state.volumeInfo[0].mute ? `text-red-600` : ``
                      } text-xl`}
                      icon={faVolumeMute}
                    />
                  </SubTitle>
                </Button>
              </div>
              <div>
                <Button onClick={() => volumeCtl("+")}>
                  <SubTitle>
                    <FontAwesomeIcon className="text-xl" icon={faPlus} />
                  </SubTitle>
                </Button>
                <span>{state.volumeInfo[0].volume}</span>
                <Button onClick={() => volumeCtl("-")}>
                  <SubTitle>
                    <FontAwesomeIcon className="text-xl" icon={faMinus} />
                  </SubTitle>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Control Panel */}
        <div className="mt-3">
          <div className="mb-2">
            <Title>- Panel</Title>
          </div>
          <div className="ml-6 flex flex-col justify-center">
            <div className="flex justify-center mt-3">
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="mx-12 cursor-pointer"
                  icon={faPlay}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="mx-12 cursor-pointer"
                  icon={faPause}
                />
              </SubTitlePanel>
            </div>
            <div className="flex justify-center mt-3">
              <SubTitlePanel></SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="text-2xl cursor-pointer"
                  icon={faChevronUp}
                />
              </SubTitlePanel>
              <SubTitlePanel></SubTitlePanel>
            </div>
            <div className="flex justify-center mt-8">
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="text-2xl cursor-pointer"
                  icon={faChevronLeft}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <span className="px-12 text-2xl cursor-pointer">
                  <FontAwesomeIcon icon={faCircle} />
                </span>
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="text-2xl cursor-pointer"
                  icon={faChevronRight}
                />
              </SubTitlePanel>
            </div>
            <div className="flex justify-center mt-8">
              <SubTitlePanel></SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  className="text-2xl cursor-pointer"
                  icon={faChevronDown}
                />
              </SubTitlePanel>
              <SubTitlePanel></SubTitlePanel>
            </div>
            <div className="flex justify-center mt-3 text-xl">
              <SubTitlePanel>
                <FontAwesomeIcon
                  onClick={() => {}}
                  className="mx-2 cursor-pointer"
                  icon={faStepBackward}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  onClick={() => {}}
                  className="mx-2 cursor-pointer"
                  icon={faBackward}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  onClick={() => {}}
                  className="mx-6 cursor-pointer"
                  icon={faUndo}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  onClick={() => {}}
                  className="mx-2 cursor-pointer"
                  icon={faForward}
                />
              </SubTitlePanel>
              <SubTitlePanel>
                <FontAwesomeIcon
                  onClick={() => {}}
                  className="mx-2 cursor-pointer"
                  icon={faStepForward}
                />
              </SubTitlePanel>
            </div>
          </div>
        </div>
        {/* System Info */}
        <div className="mt-5">
          <div className="mb-2">
            <Title>System Info</Title>
            {Object.keys(state.systemInfo[0])?.map((item, idx) => (
              <div key={idx}>
                <SubTitleSystemInfo key={idx}>
                  {item.toUpperCase()}:{" "}
                </SubTitleSystemInfo>
                {Object.values(state.systemInfo[0])?.map((itemSub, idxSub) =>
                  idx !== idxSub ? null : (
                    <div key={idxSub} className="inline-block">
                      <SubTitleSystemInfo>
                        <span className="underline">{itemSub}</span>
                      </SubTitleSystemInfo>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
