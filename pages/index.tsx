import Container from "../components/Container";
import Toggle from "../components/Toggle";
import styled from "styled-components";
import tw from "twin.macro";

const Title = styled.div(() => [
  tw`text-purple-800 font-semibold text-lg mr-2`,
]);
const SubTitle = styled.div(() => [tw`text-purple-800`]);
const Button = styled.button(() => [tw`mx-2 my-1 rounded-sm px-1`]);

export default function IndexPage() {
  return (
    <Container>
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
        <div>
          <div className="mb-2">
            <Title>- Volume</Title>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Title>- Input</Title>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Title>- Panel</Title>
          </div>
        </div>
      </div>
    </Container>
  );
}
