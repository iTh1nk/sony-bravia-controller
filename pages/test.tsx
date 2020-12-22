import React, { useState } from "react";
import { Transition } from "@headlessui/react";

interface Props {}

const Test: React.FunctionComponent<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative ...">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="...">
        Options
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        {(ref) => (
          <div
            ref={ref}
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
          >
            <div className="rounded-md bg-purple-300 shadow-xs">Hello</div>
          </div>
        )}
      </Transition>
    </div>
  );
};

export default Test;
