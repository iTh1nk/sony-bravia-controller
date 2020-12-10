import React, { useState } from "react";
import Axios from "axios";

interface Props {
  status: boolean;
  light: number;
}

const Toggle: React.FunctionComponent<Props> = ({ status, light }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(status);

  const handleOnClick = () => {
    setToggle(!toggle);
    Axios.put(process.env.REACT_APP_API + "/lights/" + light + "/state", {
      on: !toggle,
    })
      .then((resp) => {
        // console.log(resp.data);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  return (
    <div>
      <label
        onClick={() => handleOnClick()}
        className="mt-2 inline-flex items-center cursor-pointer"
      >
        <span className="relative">
          <span
            className={
              (toggle ? " bg-purple-600 " : " bg-gray-400 ") +
              "block w-12 h-6 rounded-full shadow-inner duration-300 ease-in-out"
            }
          ></span>
          <span
            className={
              (toggle ? " translate-x-6 " : " ") +
              "transform absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out"
            }
          ></span>
        </span>
      </label>
    </div>
  );
};

export default Toggle;
