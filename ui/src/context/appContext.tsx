import React from "react";

export interface IAppContext {}

export interface IAppContextNoneAction {
  type: "NONE";
}

export type AppContextAction = IAppContextNoneAction;

const initialContext: IAppContext = {};

const appReducer = (
  state: IAppContext,
  action: AppContextAction
): IAppContext => {
  switch (action.type) {
    case "NONE":
      return {
        ...state
      };
    default:
      throw new Error(`action out of range in appReducer. type=${action.type}`);
  }
};

const appContext = React.createContext(initialContext);
export const useAppContext = () => React.useContext(appContext);
export const AppContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [store, dispatch] = React.useReducer(appReducer, initialContext);

  const contextValue: IAppContext = {
    ...store
    // setSomeValue: (oldValue) => dispatch(...)
  };

  return (
    <appContext.Provider value={contextValue}>{children}</appContext.Provider>
  );
};
