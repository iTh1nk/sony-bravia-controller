import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";
import Head from "next/head";

interface Props {
  body?: string;
}

const IsLoading: React.FunctionComponent<Props> = ({ body }) => {
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
                    <a className="text-sm">
                      <FontAwesomeIcon
                        className="m-3 hover:rotate-90 duration-500 transform"
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
