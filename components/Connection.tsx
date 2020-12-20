import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import React, { useState } from "react";

interface Props {
  show: boolean;
  cbDismiss: any;
}

type ConnectionInput = {
  addr: string;
  key: string;
};

const Connection: React.FunctionComponent<Props> = ({ show, cbDismiss }) => {
  const [connectionInput, setConnectionInput] = useState<ConnectionInput>({
    addr: "",
    key: "",
  });

  const onSubmit = () => {
    localStorage.setItem("addr", connectionInput.addr);
    localStorage.setItem("key", connectionInput.key);
  };

  return (
    <div>
      {/* Input Modal */}
      <div
        className={`${
          show ? `z-10 opacity-95` : `z-0 opacity-0`
        } absolute text-xl w-full h-full bg-gray-500 duration-500`}
      >
        <div className="flex justify-center mt-32">
          <div className="">
            <form>
              <div className="flex justify-center flex-col mb-8">
                <input
                  onChange={(e) => {
                    setConnectionInput({
                      ...connectionInput,
                      addr: e.target.value,
                    });
                  }}
                  className="rounded-md m-2 py-1 px-2"
                  placeholder="10.0.0.1"
                />
                <input
                  onChange={(e) => {
                    setConnectionInput({
                      ...connectionInput,
                      key: e.target.value,
                    });
                  }}
                  className="rounded-md m-2 py-1 px-2"
                  placeholder="Key"
                />
              </div>
              <div>
                <button
                  // onClick={() => {
                  //   setConnectionInput({ addr: "", key: "" });
                  // }}
                  className="mb-5 inline-flex justify-center w-full rounded-md border border-gray-700 px-4 py-2 bg-gray-600 text-base leading-6 font-medium text-gray-200 shadow-sm transition duration-500 ease-in-out hover:text-white hover:bg-black focus:outline-none focus:border-gray-400 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                  type="button"
                >
                  Clear
                </button>
                <button
                  onClick={() => onSubmit()}
                  className="mb-5 inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm transition duration-500 ease-in-out hover:text-black hover:bg-green-400 focus:outline-none focus:border-gray-400 focus:shadow-outline-orange sm:text-sm sm:leading-5"
                  type="button"
                >
                  Confirm
                </button>
                <button
                  onClick={() => cbDismiss()}
                  className="inline-flex justify-center w-full rounded-md border border-gray-700 px-4 py-2 bg-gray-800 text-base leading-6 font-medium text-gray-400 shadow-sm transition duration-500 ease-in-out hover:text-white hover:bg-black focus:outline-none focus:border-gray-400 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                  type="button"
                >
                  Dismiss
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connection;
