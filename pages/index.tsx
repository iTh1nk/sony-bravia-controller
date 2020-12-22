import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";
import { useEffect, useReducer } from "react";
import Axios from "axios";
import IsLoading from "../components/IsLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowCircleLeft,
  faArrowLeft,
  faAsterisk,
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
  faSlash,
  faStepBackward,
  faStepForward,
  faStop,
  faUndo,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import {
  IRCC_POWER,
  IRCC_INPUT,
  IRCC_SYNCMENU,
  IRCC_HDMI1,
  IRCC_HDMI2,
  IRCC_HDMI3,
  IRCC_HDMI4,
  IRCC_NUM1,
  IRCC_NUM2,
  IRCC_NUM3,
  IRCC_NUM4,
  IRCC_NUM5,
  IRCC_NUM6,
  IRCC_NUM7,
  IRCC_NUM8,
  IRCC_NUM9,
  IRCC_NUM0,
  IRCC_DOT,
  IRCC_CC,
  IRCC_RED,
  IRCC_GREEN,
  IRCC_YELLOW,
  IRCC_BLUE,
  IRCC_UP,
  IRCC_DOWN,
  IRCC_RIGHT,
  IRCC_LEFT,
  IRCC_CONFIRM,
  IRCC_HELP,
  IRCC_DISPLAY,
  IRCC_OPTIONS,
  IRCC_BACK,
  IRCC_HOME,
  IRCC_VOLUP,
  IRCC_VOLDOWN,
  IRCC_MUTE,
  IRCC_AUDIO,
  IRCC_CHANNELUP,
  IRCC_CHANNELDOWN,
  IRCC_PLAY,
  IRCC_PAUSE,
  IRCC_STOP,
  IRCC_FLASHPLUS,
  IRCC_FLASHMINUS,
  IRCC_PREV,
  IRCC_NEXT,
} from "../data/IRCCCode";
import { faSourcetree } from "@fortawesome/free-brands-svg-icons";
import FormTextInput from "../components/TextInput";
import Connection from "../components/Connection";
import { Menu, Transition } from "@headlessui/react";

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
  refresh: number;
  isLoading: boolean;
  loadingBody: string;
  formCtlKeypad: boolean;
  showSysInfo: boolean;
  connectionInfo: {
    addr: string;
    key: string;
    show: boolean;
    pass: boolean;
  };
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
  refresh: 0,
  isLoading: true,
  loadingBody: "Launching...",
  formCtlKeypad: false,
  showSysInfo: false,
  connectionInfo: {
    addr: "",
    key: "",
    show: false,
    pass: false,
  },
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
  | { type: "loadingBody"; payload: string }
  | { type: "formCtlKeypad"; payload: boolean }
  | { type: "showSysInfo" }
  | {
      type: "connectionInfo";
      payload: { addr: string; key: string; show: boolean; pass: boolean };
    };

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
        refresh: state.refresh + 1,
      };
    case "isLoading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "loadingBody":
      return {
        ...state,
        loadingBody: action.payload,
      };
    case "formCtlKeypad":
      return {
        ...state,
        formCtlKeypad: action.payload,
      };
    case "showSysInfo":
      return {
        ...state,
        showSysInfo: !state.showSysInfo,
      };
    case "connectionInfo":
      return {
        ...state,
        connectionInfo: {
          addr: action.payload.addr,
          key: action.payload.key,
          show: action.payload.show,
          pass: action.payload.pass,
        },
      };
  }
}

export default function IndexPage() {
  const [state, dispatch] = useReducer(statusReducer, initialStates);

  useEffect(() => {
    dispatch({
      type: "connectionInfo",
      payload: {
        ...state.connectionInfo,
        addr: localStorage.getItem("addr"),
        key: localStorage.getItem("key"),
      },
    });
    Axios.all([
      Axios.post(
        "http://" + localStorage.getItem("addr") + "/sony/avContent",
        {
          method: "getSourceList",
          id: 1,
          params: [{ scheme: "extInput" }],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": localStorage.getItem("key") } }
      ),
      Axios.post(
        "http://" + localStorage.getItem("addr") + "/sony/system",
        {
          method: "getSystemInformation",
          id: 33,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": localStorage.getItem("key") } }
      ),
      Axios.post(
        "http://" + localStorage.getItem("addr") + "/sony/system",
        {
          method: "getPowerStatus",
          id: 50,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": localStorage.getItem("key") } }
      ),
      Axios.post(
        "http://" + localStorage.getItem("addr") + "/sony/audio",
        {
          method: "getVolumeInformation",
          id: 33,
          params: [],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": localStorage.getItem("key") } }
      ),
    ])
      .then(
        Axios.spread((...resp) => {
          dispatch({
            type: "connectionInfo",
            payload: {
              ...state.connectionInfo,
              addr: localStorage.getItem("addr"),
              key: localStorage.getItem("key"),
              pass: true,
            },
          });
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
        dispatch({
          type: "connectionInfo",
          payload: { ...state.connectionInfo, show: true, pass: false },
        });
        console.log(errors);
      });
  }, [state.refresh]);

  const inputCtl = (port) => {
    dispatch({ type: "isLoading", payload: true });
    dispatch({ type: "loadingBody", payload: "Changing Source..." });
    Axios.post(
      "http://" + state.connectionInfo.addr + "/sony/avContent",
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
      { headers: { "X-Auth-PSK": state.connectionInfo.key } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh" });
      })
      .catch((err) => {
        dispatch({ type: "isLoading", payload: false });
        console.log(err, err.response);
      });
  };
  const muteCtl = () => {
    Axios.post(
      "http://" + state.connectionInfo.addr + "/sony/audio",
      {
        method: "setAudioMute",
        id: 601,
        params: [{ status: !state.volumeInfo[0].mute }],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": state.connectionInfo.key } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh" });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const volumeCtl = (str) => {
    Axios.post(
      "http://" + state.connectionInfo.addr + "/sony/audio",
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
      { headers: { "X-Auth-PSK": state.connectionInfo.key } }
    )
      .then((resp) => {
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh" });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  // const statusInput = () => {
  //   dispatch({ type: "isLoading", payload: true });
  //   dispatch({ type: "loadingBody", payload: "Getting Input Status..." });
  //   Axios.post(
  //     "http://" + state.connectionInfo.addr + "/sony/avContent",
  //     {
  //       method: "getCurrentExternalInputsStatus",
  //       id: 105,
  //       params: [],
  //       version: "1.0",
  //     },
  //     { headers: { "X-Auth-PSK": state.connectionInfo.key } }
  //   )
  //     .then((resp) => {
  //       dispatch({ type: "isLoading", payload: false });
  //       dispatch({ type: "showModal" });
  //       dispatch({ type: "exInSt", payload: resp.data.result[0] });
  //       dispatch({ type: "refresh"});
  //     })
  //     .catch((err) => {
  //       console.log(err, err.response);
  //     });
  // };
  const activeAppCtl = (appURI, appName) => {
    dispatch({ type: "isLoading", payload: true });
    dispatch({ type: "loadingBody", payload: `Launching ${appName}` });
    Axios.post(
      "http://" + state.connectionInfo.addr + "/sony/appControl",
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
      { headers: { "X-Auth-PSK": state.connectionInfo.key } }
    )
      .then((resp) => {
        console.log(resp.data.result[0]);
        dispatch({ type: "isLoading", payload: false });
        dispatch({ type: "refresh" });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  const funcIRCC = (code) => {
    const headers = {
      "Content-Type": "text/xml; charset=UTF-8",
      "X-Auth-PSK": state.connectionInfo.key,
      SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
    };
    const body = `
    <s:Envelope
      xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
      s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <s:Body>
          <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
              <IRCCCode>${code}</IRCCCode>
          </u:X_SendIRCC>
      </s:Body>
    </s:Envelope>  
  `;
    Axios.post("http://" + state.connectionInfo.addr + "/sony/ircc", body, {
      headers: headers,
    })
      .then((resp) => {
        // console.log(resp);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
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
    <div className="">
      {/* Text Input Modal */}
      <FormTextInput
        formCtlKeypad={state.formCtlKeypad}
        cbFormCtlKeypad={() =>
          dispatch({ type: "formCtlKeypad", payload: false })
        }
      />
      {/* Main Body */}
      <div className="opacity-95">
        <Container
          modalTitle={"We0mmm"}
          modalBody={JSON.stringify(state.modalBody)}
          isModal={state.isModal}
          cbIsModal={(e) => dispatch({ type: "dismissModal" })}
        >
          {/* Connection Status Bar */}
          <div className={`${state.connectionInfo.show ? `inline` : `hidden`}`}>
            <Connection
              show={state.connectionInfo.show}
              cbDismiss={() =>
                dispatch({
                  type: "connectionInfo",
                  payload: { ...state.connectionInfo, show: false },
                })
              }
            />
          </div>
          {/* Status Show */}
          <div
            onClick={() =>
              dispatch({
                type: "connectionInfo",
                payload: { ...state.connectionInfo, show: true },
              })
            }
            className="text-left px-6 pt-2 items-center flex justify-center"
          >
            {state.connectionInfo.pass ? (
              <div className="flex justify-center items-center">
                <div className="text-xs mr-3">
                  <FontAwesomeIcon
                    className="animate-ping-slow text-green-600"
                    icon={faCircle}
                  />
                </div>
                <div>Connected: {state.connectionInfo.addr}</div>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <div className="text-xs mr-3 inline-block">
                  <FontAwesomeIcon
                    className="animate-ping-slow text-red-600"
                    icon={faCircle}
                  />
                </div>
                <div className="text-red-600">Disconnected...</div>
              </div>
            )}
          </div>
          {/* Top Control Icons */}
          <div className="text-center px-6 pt-3">
            <FontAwesomeIcon
              onClick={() => {
                funcIRCC(IRCC_HOME);
              }}
              className="mx-3 cursor-pointer text-xl text-purple-800"
              icon={faHome}
            />
            <FontAwesomeIcon
              onClick={() => {
                dispatch({ type: "formCtlKeypad", payload: true });
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
          <div className="z-0 px-6 py-3">
            <div className="z-0 flex flex-row justify-center items-center">
              <Title>
                <div className="pr-3">Power</div>
              </Title>
              <div className="z-0">
                <Toggle
                  key={state.powerSt}
                  status={state.powerSt === "active" ? true : false}
                />
              </div>
            </div>
            {/* Input */}
            <div className="mt-3">
              <div className="mb-2 cursor-pointer">
                {/* <Title>- Source</Title> */}
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
                      src={
                        "http://" +
                        state.connectionInfo.addr +
                        "/DIAL/icon/com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity.png"
                      }
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
                      src={
                        "http://" +
                        state.connectionInfo.addr +
                        "/DIAL/icon/com.sony.dtv.com.amazon.amazonvideo.livingroom.com.amazon.ignition.IgnitionActivity.png"
                      }
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
                      src={
                        "http://" +
                        state.connectionInfo.addr +
                        "/DIAL/icon/com.sony.dtv.com.netflix.ninja.com.netflix.ninja.MainActivity.png"
                      }
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
                      src={
                        "http://" +
                        state.connectionInfo.addr +
                        "/DIAL/icon/com.sony.dtv.com.disney.disneyplus.com.bamtechmedia.dominguez.main.MainActivity.png"
                      }
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
                      src={
                        "http://" +
                        state.connectionInfo.addr +
                        "/DIAL/icon/com.sony.dtv.com.nest.android.com.obsidian.v4.tv.home.TvHomeActivity.png"
                      }
                      alt="Nest Icon"
                    />
                  </Button>
                </div>
              </div>
            </div>
            {/* Volume */}
            <div className="mt-3">
              <div className="mb-2">
                {/* <Title>- Volume</Title> */}
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
            {/* Web */}

            <div className="mt-3">
              <div className="mb-2">{/* <Title>- Web</Title> */}</div>
            </div>
            {/* Control Panel */}
            <div className="mt-3">
              <div className="mb-2">{/* <Title>- Panel</Title> */}</div>
              <div className="ml-5 flex flex-col justify-center">
                <div className="flex justify-center mt-3">
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_PLAY)}
                      className="mx-8 cursor-pointer"
                      icon={faPlay}
                    />
                  </SubTitlePanel>
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_PAUSE)}
                      className="mx-8 cursor-pointer"
                      icon={faPause}
                    />
                  </SubTitlePanel>
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_STOP)}
                      className="mx-8 cursor-pointer"
                      icon={faStop}
                    />
                  </SubTitlePanel>
                </div>
                <div className="flex justify-center mt-3">
                  <SubTitlePanel></SubTitlePanel>
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_UP)}
                      className="text-2xl cursor-pointer"
                      icon={faChevronUp}
                    />
                  </SubTitlePanel>
                  <SubTitlePanel></SubTitlePanel>
                </div>
                <div className="flex justify-center mt-8">
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_LEFT)}
                      className="text-2xl cursor-pointer"
                      icon={faChevronLeft}
                    />
                  </SubTitlePanel>
                  <SubTitlePanel>
                    <span className="mx-12 text-2xl cursor-pointer">
                      <FontAwesomeIcon
                        onClick={() => funcIRCC(IRCC_CONFIRM)}
                        icon={faCircle}
                      />
                    </span>
                  </SubTitlePanel>
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_RIGHT)}
                      className="text-2xl cursor-pointer"
                      icon={faChevronRight}
                    />
                  </SubTitlePanel>
                </div>
                <div className="flex justify-center mt-8">
                  <SubTitlePanel></SubTitlePanel>
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => funcIRCC(IRCC_DOWN)}
                      className="text-2xl cursor-pointer"
                      icon={faChevronDown}
                    />
                  </SubTitlePanel>
                  <SubTitlePanel></SubTitlePanel>
                </div>
                <div className="flex justify-center mt-3 text-xl">
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => {
                        funcIRCC(IRCC_PREV);
                      }}
                      className="mx-8 cursor-pointer"
                      icon={faStepBackward}
                    />
                  </SubTitlePanel>
                  {/* <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => {}}
                      className="mx-2 cursor-pointer"
                      icon={faBackward}
                    />
                  </SubTitlePanel> */}
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => {
                        funcIRCC(IRCC_BACK);
                      }}
                      className="mx-8 cursor-pointer"
                      icon={faArrowCircleLeft}
                    />
                  </SubTitlePanel>
                  {/* <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => {}}
                      className="mx-2 cursor-pointer"
                      icon={faForward}
                    />
                  </SubTitlePanel> */}
                  <SubTitlePanel>
                    <FontAwesomeIcon
                      onClick={() => {
                        funcIRCC(IRCC_NEXT);
                      }}
                      className="mx-8 cursor-pointer"
                      icon={faStepForward}
                    />
                  </SubTitlePanel>
                </div>
              </div>
            </div>
            {/* System Info */}
            <div className="mt-5">
              <div className="mb-2">
                <Title>
                  <span
                    onClick={() => {
                      dispatch({ type: "showSysInfo" });
                    }}
                    className="cursor-pointer border-b border-purple-800"
                  >
                    TV Info
                  </span>
                </Title>
                <Menu>
                  <Transition
                    show={state.showSysInfo}
                    enter="transition ease-out duration-500"
                    enterFrom="opacity-0 -translate-y-1 transform"
                    enterTo="opacity-100 translate-y-0 transform"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 translate-y-0 transform"
                    leaveTo="opacity-0 -translate-y-1 transform"
                  >
                    <div className="mt-3">
                      {state.showSysInfo
                        ? Object.keys(state.systemInfo[0])?.map((item, idx) => (
                            <div key={idx}>
                              <SubTitleSystemInfo>
                                {item.toUpperCase()}:
                              </SubTitleSystemInfo>
                              {Object.values(state.systemInfo[0])?.map(
                                (itemSub, idxSub) =>
                                  idx !== idxSub ? null : (
                                    <div key={idxSub} className="inline-block">
                                      <SubTitleSystemInfo>
                                        <span className="underline">
                                          {itemSub}
                                        </span>
                                      </SubTitleSystemInfo>
                                    </div>
                                  )
                              )}
                            </div>
                          ))
                        : null}
                    </div>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
