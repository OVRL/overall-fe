"use client";

import {
  ReactElement,
  ReactNode,
  useState,
  isValidElement,
} from "react";
import { AnimatePresence, motion } from "motion/react";

export const useFunnel = <T extends string>(defaultStep: T) => {
  const [history, setHistory] = useState<T[]>([defaultStep]);
  const [direction, setDirection] = useState<number>(0);

  const step = history[history.length - 1];

  const setStep = (nextStep: T) => {
    setDirection(1);
    setHistory((prev) => [...prev, nextStep]);
  };

  const goBack = () => {
    setDirection(-1);
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const Step = (props: { name: T; children: ReactNode }) => {
    return <>{props.children}</>;
  };

  const Funnel = ({
    children,
  }: {
    children: Array<ReactElement> | ReactElement;
  }) => {
    const targetStep = (Array.isArray(children) ? children : [children]).find(
      (child) => {
        if (!isValidElement(child)) return false;
        return (child.props as { name: T }).name === step;
      },
    );

    return (
      <AnimatePresence mode="wait" custom={direction}>
        {targetStep && (
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {targetStep}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return {
    Funnel: Object.assign(Funnel, { Step }),
    setStep,
    step,
    goBack,
    history,
  };
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};
