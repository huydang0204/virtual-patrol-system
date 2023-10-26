export const MEDIUM_SCREEN_SIZE = "md";
export const SMALL_SCREEN_SIZE = "sm";

const SMALL_SIZE = 576;

export const getScreenSize = width => {
  return width <= SMALL_SIZE ? SMALL_SCREEN_SIZE : MEDIUM_SCREEN_SIZE;
};