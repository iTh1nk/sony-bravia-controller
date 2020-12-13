import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";
import { useEffect, useReducer } from "react";
import Axios from "axios";

const Title = styled.div(() => [
  tw`text-purple-800 font-semibold text-lg mr-2`,
]);
const SubTitle = styled.div(() => [tw`text-purple-800`]);
const Button = styled.button(() => [tw`mx-2 my-1 rounded-sm px-1`]);

type exInStArr = {
  uri: string;
  title: string;
  label: string;
  icon: string;
  connection: boolean;
};
type StatusAction =
  | { type: "exInSt"; payload: Array<exInStArr> }
  | { type: "dismissModal" }
  | { type: "showModal" }
  | { type: "powerSwitch"; payload: string };

type StatusState = {
  isModal: boolean;
  modalBody: any;
  exInSt: Array<exInStArr>;
  powerSt: string;
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
  }
}
const initialStates: StatusState = {
  isModal: false,
  modalBody: [],
  exInSt: [],
  powerSt: "",
};

export default function IndexPage() {
  const [state, dispatch] = useReducer(statusReducer, initialStates);

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
  }, []);

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

  return (
    <Container
      modalTitle={"Status"}
      modalBody={JSON.stringify(state.modalBody)}
      isModal={state.isModal}
      cbIsModal={(e) => dispatch({ type: "dismissModal" })}
    >
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
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Volume</Title>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Input</Title>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Panel</Title>
          </div>
        </div>
      </div>
    </Container>
  );
}
