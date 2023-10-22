import { useLayoutEffect, useRef, useState } from "react";

type UseRequestAnimationFrameCallbackData = {
  time: number;
  fps: number;
  counter: number;
  setStop: () => void;
  pause: boolean;
};

export type UseRequestAnimationFrameCallback = (
  data: UseRequestAnimationFrameCallbackData
) => void;

type UseRequestAnimationFrameParams = {
  stopValue: number | null;
  stopAfterTime?: boolean;
  clearTimerDelay: number | null;
  autoStopCb: () => void;
};

const defaultParams: UseRequestAnimationFrameParams = {
  stopValue: null,
  stopAfterTime: false,
  clearTimerDelay: null,
  autoStopCb: () => {},
};

export const useRequestAnimationFrame = (
  cb: UseRequestAnimationFrameCallback,
  _params: Partial<UseRequestAnimationFrameParams> = defaultParams
): [boolean, boolean, () => void, () => void] => {
  const params: UseRequestAnimationFrameParams = {
    ...defaultParams,
    ..._params,
  };
  const [stop, setStop] = useState(false);
  const [start, setStart] = useState(false);
  const timeRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const timestampRef = useRef<number | null>(null);
  const pauseTimestampRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const counterTimeRef = useRef(0);
  const lastCalledTimeRef = useRef(performance.now());

  const actionReset = () => {
    setStop(false);
    setStart(false);
    timeRef.current = 0;
    timerRef.current = null;
    pauseTimestampRef.current = 0;
    pauseTimeRef.current = 0;
    counterTimeRef.current = 0;
    timestampRef.current = null;
  };

  const actionStart = () => {
    setStart(!start);
  };

  const actionStop = () => {
    setStop(true);
  };

  const delayStop = () => {
    if (params.clearTimerDelay != null && params.clearTimerDelay > 0) {
      actionStart();
      setTimeout(() => {
        actionStop();
        params.autoStopCb();
      }, params.clearTimerDelay);
    } else {
      actionStop();
      params.autoStopCb();
    }
  };

  const actionStopCb = () => {
    actionStop();
    setTimeout(() => {
      cb({
        time: 0,
        counter: 0,
        fps: 0,
        ...cbData,
      });
    }, 10);
  };

  const pause = !start && timeRef.current > 0;

  const cbData = {
    setStop: actionStopCb,
    pause,
  };

  const animate = () => {
    const now = performance.now();
    const ms = now - (timestampRef.current ?? 0) - pauseTimeRef.current;
    const delta = (now - lastCalledTimeRef.current) / 1000;

    lastCalledTimeRef.current = performance.now();
    timeRef.current = ms;

    if (!pause && !params.stopAfterTime && ms >= (params.stopValue ?? 0)) {
      delayStop();
      return;
    }

    if (start && timeRef.current > 0) {
      cb({
        counter: counterTimeRef.current,
        time: timeRef.current,
        fps: parseFloat((1 / delta).toFixed(0)),
        ...cbData,
      });

      if (params.stopAfterTime && params.stopValue === counterTimeRef.current) {
        delayStop();
        return;
      }
      counterTimeRef.current++;
    }

    timerRef.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    if (start) {
      if (!timestampRef.current) {
        timestampRef.current = performance.now();
      } else {
        pauseTimeRef.current =
          pauseTimeRef.current +
          (performance.now() - pauseTimestampRef.current);
      }
      timerRef.current = requestAnimationFrame(animate);
    } else {
      if (timestampRef.current) {
        pauseTimestampRef.current = performance.now();
      }
    }

    if (!stop && pause) {
      cb({
        time: timeRef.current,
        counter: counterTimeRef.current,
        fps: 0,
        ...cbData,
      });
    }

    if (stop) {
      if (timerRef.current != null) {
        cancelAnimationFrame(timerRef.current);
      }
      actionReset();
      cb({
        time: 0,
        counter: 0,
        fps: 0,
        ...cbData,
      });
    }
    return () => {
      if (timerRef.current != null) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [start, stop]);

  return [start, pause, actionStart, actionStop];
};
