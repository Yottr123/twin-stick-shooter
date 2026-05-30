export interface InputState {
  keys: Record<string, boolean>;
  mouseDown: boolean;
  mouseCanvas: { x: number; y: number };
  mouseWorld:  { x: number; y: number };
}

export function createInputState(): InputState {
  return {
    keys: {},
    mouseDown: false,
    mouseCanvas: { x: 0, y: 0 },
    mouseWorld:  { x: 0, y: 0 },
  };
}

const BLOCKED_KEYS = ["arrowup", "arrowdown", "arrowleft", "arrowright", " "];

/**
 * Attaches global keyboard listeners to the window.
 * Returns a cleanup function — call it in useEffect's return.
 */
export function attachKeyboardListeners(input: InputState): () => void {
  const onKey = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    input.keys[key] = e.type === "keydown";
    if (BLOCKED_KEYS.includes(key)) e.preventDefault();
  };

  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);

  return () => {
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
  };
}

/**
 * Updates mouseCanvas from a React MouseEvent on the canvas.
 */
export function updateMousePosition(
  input: InputState,
  clientX: number,
  clientY: number,
  rect: DOMRect
): void {
  input.mouseCanvas.x = clientX - rect.left;
  input.mouseCanvas.y = clientY - rect.top;
}

/**
 * Converts canvas-space mouse position to world-space.
 * Must be called each frame after camera position is known.
 */
export function syncMouseWorld(
  input: InputState,
  camX: number,
  camY: number
): void {
  input.mouseWorld.x = input.mouseCanvas.x + camX;
  input.mouseWorld.y = input.mouseCanvas.y + camY;
}
