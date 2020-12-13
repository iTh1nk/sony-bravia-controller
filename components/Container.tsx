import React from "react";
import Head from "next/head";
import styled from "styled-components";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Modal } from "./Modal";

const HeaderLink = styled.div(() => [
  tw`hover:text-black cursor-pointer ease-in-out duration-300 px-5 font-semibold hidden sm:inline`,
]);

interface Props {
  cbIsModal?: any;
  isModal?: boolean;
  modalTitle?: string;
  modalBody?: string;
  isNotConfirmBtn?: boolean;
  isNotCancelBtn?: boolean;
  isNotClose?: boolean;
}

const Container: React.FunctionComponent<Props> = ({
  children,
  isModal,
  modalTitle,
  modalBody,
  isNotCancelBtn,
  isNotClose,
  isNotConfirmBtn,
  cbIsModal,
}) => {
  return (
    <div className="">
      <Head>
        <title>{`Sony Bravia Controller`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={`This web controller utility is only for personal use locally!`}
        />
      </Head>
      <Modal
        isModal={isModal}
        title={modalTitle}
        isNotConfirmBtn={true}
        cbIsModal={() => cbIsModal()}
      >
        {modalBody}
      </Modal>
      {/* Header Bar */}
      <nav
        className="bg-gray-200 p-5 shadow-md bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/cat-blur-100.png')",
        }}
      >
        <div className="max-w-4xl flex justify-between m-auto">
          <a href="/">
            <div className="flex items-center">
              <img
                className="w-8 h-8 sm:w-12 sm:h-12"
                src="/favicon.ico"
                alt="logo"
              />
              <div className="font-bold font-mono ml-5 text-sm sm:text-lg text-blue-800 cursor-pointer transition duration-500 transform hover:-translate-y-1 hover:text-black ease-in-out">
                We0mmm
              </div>
            </div>
          </a>
          <div className="font-mono flex items-center text-purple-600">
            <HeaderLink>
              <a href="https://vzw.we0mmm.site">BillBook-v2</a>
            </HeaderLink>
            <HeaderLink>
              <a href="https://portfolio.we0mmm.site">Portfolio</a>
            </HeaderLink>
            <HeaderLink>
              <a href="/hue">Dev</a>
            </HeaderLink>
            <div className="ml-5 text-lg hover:text-black cursor-pointer ease-in-out duration-300 hidden sm:inline">
              <a href="https://github.com/iTh1nk">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Content */}
      <div className="w-full min-h-screen bg-no-repeat bg-cover bg-purple-100">
        {children}
      </div>
      {/* Footer */}
      <footer
        className="bg-gray-200 flex justify-center bottom-0 p-2 bg-no-repeat bg-cover"
        style={{
          // boxShadow: "0 -3px 3px -3px #555",
          backgroundImage: "url('/cat-blur-100.png')",
        }}
      >
        <div className="font-mono text-blue-800 text-xs hover:text-black cursor-pointer ease-in-out duration-300">
          <span role="img" aria-label="footer">
            ©️{" "}
          </span>
          2020 | We0mmm
        </div>
      </footer>
    </div>
  );
};

export default Container;
