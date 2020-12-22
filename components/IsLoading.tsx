import { faKeyboard, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Connection from "./Connection";
import Axios from "axios";

interface Props {
  body?: string;
}

const IsLoading: React.FunctionComponent<Props> = ({ body }) => {
  const [showConnectionField, setShowConnectionField] = useState<boolean>(
    false
  );
  const [count, setCount] = useState<number>(0);
  const setPower = () => {
    if (count === 5) {
      Axios.post(
        "http://" + localStorage.getItem("addr") + "/sony/system",
        {
          method: "setPowerStatus",
          id: 55,
          params: [{ status: true }],
          version: "1.0",
        },
        { headers: { "X-Auth-PSK": localStorage.getItem("key") } }
      )
        .then((resp) => {
          location.reload();
          // console.log(resp.data);
        })
        .catch((err) => {
          console.log(err, err.response);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Sony Bravia Controller</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={`This web controller utility is only for personal use locally!`}
        />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Connection
        show={showConnectionField}
        cbDismiss={() => setShowConnectionField(false)}
      />
      <div className="w-screen h-screen flex justify-center items-center transition ease-in-out duration-500 transform dark:bg-black">
        <span className="font-mono text-3xl animate-pulse">
          <span className="cursor-default dark:text-white">
            {body === "" ? (
              "Loading..."
            ) : body === "Launching..." ? (
              <div className="flex flex-col items-center">
                <div>
                  <div className="font-bold">{body}</div>
                  <div className="text-sm text-center">
                    - Make Sure TV's On{" "}
                    <span
                      onClick={() => {
                        setCount((pre) => pre + 1);
                        setPower();
                      }}
                    >
                      -
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => setShowConnectionField(true)}
                  className="flex items-center"
                >
                  <FontAwesomeIcon className="m-3" icon={faKeyboard} />
                  <span
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="ml-6 text-sm"
                  >
                    <FontAwesomeIcon icon={faSync} />
                  </span>
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
