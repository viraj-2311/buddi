import React from "react";
import useGlobalModal from "./useGlobalModal";
import GlobalModal from "./GlobalModal";

let GlobalModalContext;
let { Provider } = (GlobalModalContext = React.createContext());

let GlobalModalProvider = ({ children }) => {
  let { modal, initGlobalModal } = useGlobalModal();
  return (
    <Provider value={{ modal, initGlobalModal }}>
      <GlobalModal />
      {children}
    </Provider>
  );
};

export { GlobalModalContext, GlobalModalProvider };
