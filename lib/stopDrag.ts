import type { SyntheticEvent } from "react";

const stop = (e: SyntheticEvent) => e.stopPropagation();

/** Spread on interactive bits inside a draggable ticket so they don't start a drag. */
export const stopDrag = {
  onMouseDown: stop,
  onTouchStart: stop,
  onPointerDown: stop,
  onKeyDown: stop,
};
