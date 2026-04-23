let stackDepth = 0;
const MAX_STACK_DEPTH = 10;

export const incrementStackDepth = () => {
  stackDepth++;
  return stackDepth;
};

export const decrementStackDepth = () => {
  if (stackDepth > 0) stackDepth--;
  return stackDepth;
};

export const getStackDepth = () => stackDepth;

export const isStackFull = () => stackDepth >= MAX_STACK_DEPTH;
