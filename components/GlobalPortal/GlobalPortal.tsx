"use client";
import { createContext, ReactNode, useState } from "react";
import { createPortal } from "react-dom";

const PortalContext = createContext<HTMLDivElement | null>(null);

type PortalProviderProps = {
  children: ReactNode;
};

type PortalConsumerProps = {
  children: ReactNode;
};

const PortalProvider = ({ children }: PortalProviderProps) => {
  const [portalContainerRef, setPortalContainerRef] =
    useState<HTMLDivElement | null>(null);

  return (
    <PortalContext.Provider value={portalContainerRef}>
      {children}
      <div
        id="portal-container"
        ref={(elem) => {
          if (portalContainerRef !== null || elem === null) {
            return;
          }

          setPortalContainerRef(elem);
        }}
      />
    </PortalContext.Provider>
  );
};

const PortalConsumer = ({ children }: PortalConsumerProps) => {
  return (
    <PortalContext.Consumer>
      {(portalContainerRef) => {
        if (portalContainerRef === null) {
          return null;
        }

        return createPortal(children, portalContainerRef);
      }}
    </PortalContext.Consumer>
  );
};

export const GlobalPortal = {
  Provider: PortalProvider,
  Consumer: PortalConsumer,
};

export {
  PortalProvider as GlobalPortalProvider,
  PortalConsumer as GlobalPortalConsumer,
};
