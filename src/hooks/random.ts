import { useState } from "react";
import { draw, shuffle } from "radash";

export const useDraw = <T>(
  items: T[],
  excludeCurrent = false
): [T | null, () => void] => {
  const [randomPicked, setRandomPicked] = useState<T | null>(draw(items));

  return [
    randomPicked,
    () => {
      setRandomPicked((previousPicked) => {
        const baseItems = excludeCurrent
          ? items.filter((item) => item !== previousPicked)
          : items;

        return draw(baseItems)!;
      });
    },
  ];
};

export const useShuffle = <T>(items: T[]): [T[], () => void] => {
  const [shuffledItems, setShuffledItems] = useState<T[]>(shuffle(items));

  return [
    shuffledItems,
    () => {
      setShuffledItems(shuffle(items));
    },
  ];
};
