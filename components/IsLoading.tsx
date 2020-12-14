import React from "react";

interface Props {
  body?: string;
}

const IsLoading: React.FunctionComponent<Props> = ({ body }) => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center transition ease-in-out duration-500 transform dark:bg-black">
        <span className="font-mono text-3xl animate-pulse">
          <span className="visible md:hidden cursor-default dark:text-white">
            {body === "" ? "Loading..." : body}
          </span>
          <span className="hidden md:inline cursor-default dark:text-white">
            {body === "" ? "Loading..." : body}
          </span>
        </span>
      </div>
    </>
  );
};

export default IsLoading;
