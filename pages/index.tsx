import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";
import { useEffect } from "react";
import Axios from "axios";

const Title = styled.div(() => [
  tw`text-purple-800 font-semibold text-lg mr-2`,
]);
const SubTitle = styled.div(() => [tw`text-purple-800`]);
const Button = styled.button(() => [tw`mx-2 my-1 rounded-sm px-1`]);

export default function IndexPage() {
  // useEffect(() => {
  //   Axios.post(
  //     "http://10.0.0.98/sony/appControl",
  //     { method: "getApplicationList", id: 60, params: [], version: "1.0" },
  //     { headers: { "X-Auth-PSK": "mac" } }
  //   )
  //     .then((resp) => {
  //       console.log(resp);
  //     })
  //     .catch((err) => {
  //       console.log(err, err.response);
  //     });
  // });
  const testButton = () => {
    Axios.post(
      "http://10.0.0.98/sony/appControl",
      { method: "getApplicationList", id: 60, params: [], version: "1.0" },
      { headers: { "X-Auth-PSK": "mac" } }
    )
      .then((resp) => {
        console.clear();
        console.log(resp.data.result[0]);
        alert(JSON.stringify(resp.data.result[0]));
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  return (
    <Container>
      <button
        className="text-center w-full mt-5 border border-purple-300"
        onClick={() => testButton()}
      >
        TEST
      </button>
      <div className="p-6">
        <div className="flex flex-row justify-start items-center">
          <Title>
            <div className="pr-3">- Power</div>
          </Title>
          <Toggle status={true} light={1} />
        </div>
        <div className="mt-5">
          <div className="mb-2">
            <Title>- Input</Title>
          </div>
          <Button>
            <SubTitle>HDMI 1</SubTitle>
          </Button>
          <Button>
            <SubTitle>HDMI 2</SubTitle>
          </Button>
          <Button>
            <SubTitle>HDMI 3</SubTitle>
          </Button>
          <Button>
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
