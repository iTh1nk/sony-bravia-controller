import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";
import { useEffect, useReducer } from "react";
import Axios from "axios";

const Title = styled.div(() => [
  tw`text-purple-800 font-semibold text-lg mr-2`,
]);
const SubTitle = styled.div(() => [tw`text-purple-800 py-2 px-1`]);
const Button = styled.button(() => [tw`mx-2 my-1 rounded-sm px-1`]);
const SubTitleSystemInfo = styled.div(() => [
  tw`text-purple-800 inline-block p-1 ml-2`,
]);

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
};
type StatusAction =
  | { type: "exInSt"; payload: Array<exInStArr> }
  | { type: "dismissModal" }
  | { type: "showModal" }
  | { type: "powerSwitch"; payload: string }
  | { type: "sourceList"; payload: Array<SourceList> }
  | { type: "systemInfo"; payload: Array<SystemInfo> }
  | { type: "volumeInfo"; payload: Array<VolumeInfo> };

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
        volumeInfo: action.payload
      };
  }
}

export default function IndexPage() {
  const [state, dispatch] = useReducer(statusReducer, initialStates);

  useEffect(() => {
    Axios.post(
      "http://10.0.0.98/sony/avContent",
      {
        method: "getSourceList",
        id: 1,
        params: [{ scheme: "extInput" }],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "sourceList", payload: resp.data.result[0] });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
    Axios.post(
      "http://10.0.0.98/sony/system",
      {
        method: "getSystemInformation",
        id: 33,
        params: [],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "systemInfo", payload: resp.data.result });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  }, []);
  useEffect(() => {
    Axios.post(
      "http://10.0.0.98/sony/system",
      {
        method: "getPowerStatus",
        id: 50,
        params: [],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "powerSwitch", payload: resp.data.result[0].status });
      })
      .catch((err) => {
        console.log(err, err.response);
      });
    Axios.post(
      "http://10.0.0.98/sony/audio",
      {
        method: "getVolumeInformation",
        id: 33,
        params: [],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        dispatch({ type: "volumeInfo", payload: resp.data.result[0] });
        console.log(resp.data.result[0]);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  });

  const inputCtl = (port) => {
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
        // console.clear();
        // console.log(resp.data.result[0]);
      })
      .catch((err) => {
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
        console.clear();
        console.log(resp.data.result[0]);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };
  const statusInput = () => {
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
        dispatch({ type: "showModal" });
        dispatch({ type: "exInSt", payload: resp.data.result[0] });
        console.clear();
        console.log(resp.data.result[0]);
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
  return (
    <Container
      modalTitle={"Status"}
      modalBody={JSON.stringify(state.modalBody)}
      isModal={state.isModal}
      cbIsModal={(e) => dispatch({ type: "dismissModal" })}
    >
      {/* Power */}
      <div className="p-6">
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
        <div className="mt-5">
          <div className="mb-2 cursor-pointer">
            <Title onClick={() => statusInput()}>- Input</Title>
          </div>
          <Button onClick={() => inputCtl(1)}>
            <SubTitle>HDMI 1</SubTitle>
          </Button>
          <Button onClick={() => inputCtl(2)}>
            <SubTitle>HDMI 2</SubTitle>
          </Button>
          <Button onClick={() => inputCtl(3)}>
            <SubTitle>HDMI 3</SubTitle>
          </Button>
          <Button onClick={() => inputCtl(4)}>
            <SubTitle>HDMI 4</SubTitle>
          </Button>
          <Button>
            <SubTitle>YouTube</SubTitle>
          </Button>
        </div>
        {/* Volume */}
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Volume</Title>
            <button onClick={() => muteCtl()}>
              Mute: {JSON.stringify(state.volumeInfo[0])}
            </button>
          </div>
        </div>
        {/* Control Panel */}
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Panel</Title>
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
