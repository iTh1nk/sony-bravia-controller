import Axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Container from "../components/Container";
import Toggle from "../components/Toggle";

const Room = styled.div(() => [tw`font-mono font-bold text-blue-800`]);
const Light = styled.span(() => [tw`mr-3 text-purple-800 font-semibold`]);

interface Props {}
type DataLight = Array<{
  uniqueid: string;
  name: string;
  state: { on: boolean };
}>;

const Home: React.FunctionComponent<Props> = ({}) => {
  const [dataLights, setDataLights] = useState<DataLight>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    Axios.get(process.env.REACT_APP_API + "/lights")
      .then((resp) => {
        setDataLights(Object.values(resp.data));
      })
      .catch((err) => {
        console.log(err, err.response);
      });
    console.log(dataLights);
  });

  return (
    <div>
      <Container>
        <div className="flex flex-col justify-between m-auto max-w-3xl py-6 px-5">
          <div className="">
            <Room>院子</Room>
            {dataLights?.map((item, idx) =>
              item.name === "Light 1" ||
              item.name === "Light 2" ||
              item.name === "Light 3" ||
              item.name === "Light 4" ||
              item.name === "Light 9" ? (
                <div
                  key={item.uniqueid + item.state.on.toString()}
                  className="m-2 inline-block"
                >
                  <div className="ml-5 flex justify-start items-center">
                    <Light>{item.name}</Light>
                    <Toggle light={idx + 1} status={item.state.on} />
                  </div>
                </div>
              ) : null
            )}
          </div>
          <br />
          <div className="">
            <Room>厨房</Room>
            {dataLights?.map((item, idx) =>
              item.name === "Hue beyond up 1" ||
              item.name === "Hue beyond down 1" ||
              item.name === "Hue beyond down 2" ||
              item.name === "Hue beyond down 3" ? (
                <div
                  key={item.uniqueid + item.state.on.toString()}
                  className="m-2 inline-block"
                >
                  <div className="ml-5 flex justify-start items-center">
                    <Light>{item.name}</Light>
                    <Toggle light={idx + 1} status={item.state.on} />
                  </div>
                </div>
              ) : null
            )}
          </div>
          <br />
          <div className="">
            <Room
              onClick={() => setShowAll(!showAll)}
              className="underline cursor-pointer"
            >
              全部
            </Room>
            <div
              className={
                showAll
                  ? " duration-500 opacity-100 transform translate-y-1 "
                  : " invisible duration-500 opacity-0 "
              }
            >
              {dataLights?.map((item, idx) => (
                <div
                  key={item.uniqueid + item.state.on.toString()}
                  className="m-2 inline-block"
                >
                  <div className="ml-5 flex justify-start items-center">
                    <Light>{item.name}</Light>
                    <Toggle light={idx + 1} status={item.state.on} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
