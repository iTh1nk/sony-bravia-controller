import Axios from "axios";
import React, { useState } from "react";

interface Props {
  formCtlKeypad: boolean;
  cbFormCtlSubmit?: any;
  cbFormCtlKeypad: any;
}

const FormTextInput: React.FunctionComponent<Props> = ({
  formCtlKeypad,
  cbFormCtlKeypad,
  cbFormCtlSubmit,
}) => {
  const formCtlSubmit = () => {
    // dispatch({ type: "isLoading", payload: true });
    // dispatch({ type: "loadingBody", payload: "Launching Keypad..." });
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
        // dispatch({ type: "formCtlKeypad", payload: false });
        cbFormCtlKeypad();
        // dispatch({ type: "isLoading", payload: false });
        // dispatch({ type: "refresh" });
      })
      .catch((err) => {
        // dispatch({ type: "isLoading", payload: false });
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
        <div>
          <form>
            <input defaultValue="Hello" id="formCtl" />
            <br />
            <button
              onClick={() => formCtlSubmit()}
              className="m-3 bg-blue-300 p-1 rounded-sm"
              type="button"
            >
              Submit
            </button>
            <button
              onClick={() => cbFormCtlKeypad()}
              className="m-3 bg-blue-300 p-1 rounded-sm"
              type="button"
            >
              Dismiss
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormTextInput;
