import { useCallback, useState } from "react";
import { draw, shuffle } from "radash";

export const useDraw = <T>(
  items: T[],
  excludeCurrent = false,
  getDraw: (items: T[]) => T | null = draw
): [T | null, () => void] => {
  const [randomPicked, setRandomPicked] = useState<T | null>(getDraw(items));

  const redraw = useCallback(() => {
    const baseItems = excludeCurrent
      ? items.filter((item) => item !== randomPicked)
      : items;
    const drawn = getDraw(baseItems);
    setRandomPicked(drawn);
  }, [items, excludeCurrent, getDraw, randomPicked, setRandomPicked]);

  return [randomPicked, redraw];
};

export const useShuffle = <T>(items: T[]): [T[], () => void] => {
  const [shuffledItems, setShuffledItems] = useState<T[]>(shuffle(items));

  const reshuffle = useCallback(() => {
    setShuffledItems(shuffle(items));
  }, [items, setShuffledItems]);

  return [shuffledItems, reshuffle];
};
