import Axios from "axios";
import React, { useState } from "react";

interface Props {
  formCtlKeypad: boolean;
  cbFormCtlSubmit?: any;
  cbFormCtlKeypad: any;
}

const TextInput: React.FunctionComponent<Props> = ({
  formCtlKeypad,
  cbFormCtlKeypad,
  cbFormCtlSubmit,
}) => {
  const formCtlSubmit = () => {
    Axios.post(
      "http://10.0.0.98/sony/appControl",
      {
        method: "setTextForm",
        id: 601,
        params: [" TV"],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
      .then((resp) => {
        cbFormCtlKeypad();
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  return (
    <div
      className={`${
        formCtlKeypad ? `z-10 opacity-95` : `z-0 opacity-0`
      } absolute text-xl w-full h-full bg-gray-500 duration-500`}
    >
      <div className="flex justify-center mt-32">
        <div className="">
          <form>
            <div>
              <textarea
                className="rounded-md p-1 mb-8 w-80"
                defaultValue="Hello"
                id="formCtl"
              />
            </div>
            <div>
              <button
                onClick={() => formCtlSubmit()}
                className="mb-5 inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm transition duration-500 ease-in-out hover:text-black hover:bg-green-400 focus:outline-none focus:border-gray-400 focus:shadow-outline-orange sm:text-sm sm:leading-5"
                type="button"
              >
                Submit
              </button>
              <button
                onClick={() => cbFormCtlKeypad()}
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
  );
};

export default TextInput;
