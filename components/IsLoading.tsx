import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";

interface Props {
  body?: string;
}

const IsLoading: React.FunctionComponent<Props> = ({ body }) => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center transition ease-in-out duration-500 transform dark:bg-black">
        <span className="font-mono text-3xl animate-pulse">
          <span className="cursor-default dark:text-white">
            {body === "" ? (
              "Loading..."
            ) : body === "Launching..." ? (
              <div className="flex flex-col items-center">
                <div>
                  <div className="font-bold">{body}</div>
                  <div className="text-sm">- Make Sure TV's On -</div>
                </div>
                <div>
                  <Link href="/">
                    <a>
                      <FontAwesomeIcon
                        className="text-sm m-3 hover:rotate-90 duration-500 transform"
                        icon={faSync}
                      />
                    </a>
                  </Link>
                </div>
              </div>
            ) : (
              body
            )}
          </span>
        </span>
      </div>
    </>
  );
};

export default IsLoading;
