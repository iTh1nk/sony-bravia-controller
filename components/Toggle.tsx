import React, { useState } from "react";
import Axios from "axios";

interface Props {
  status: boolean;
}

const Toggle: React.FunctionComponent<Props> = ({ status }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(status);

  const handleOnClick = () => {
    setToggle(!toggle);
    Axios.post(
      "http://10.0.0.98/sony/system",
      {
        method: "setPowerStatus",
        id: 55,
        params: [{ status: !toggle }],
        version: "1.0",
      },
      { headers: { "X-Auth-PSK": process.env.NEXT_PUBLIC_KEY } }
    )
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
