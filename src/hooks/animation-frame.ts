import { useEffect, useState } from "react";

export const useAnimationFrameProgress = (
  onFinish?: () => void
): [boolean, number, (duration?: number) => void, () => void] => {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState(() => () => {});
  const [stop, setStop] = useState(() => () => {});

  useEffect(() => {
    let duration = 0;
    let elapsed = 0;
    let start: number | null = null;
    let animationFrameId: number | null = null;

    const tick: FrameRequestCallback = (time) => {
      if (start == null) {
        start = time;
      }

      elapsed = time - start;

      // Calculate progress
      const progress = (elapsed / duration) * 100;
      const flatProgress = Math.min(100, Math.round(progress * 100) / 100);
      setProgress(flatProgress);

      if (elapsed >= duration) {
        animationFrameId = null;
        setRunning(false);

        if (onFinish != null) {
          onFinish();
        }
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    setStart(() => (_duration = 2000) => {
      setProgress(0);
      setRunning(true);

      duration = _duration
      start = null;
      elapsed = 0;
      animationFrameId = requestAnimationFrame(tick);
    });

    setStop(() => () => {
      if (animationFrameId != null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      setRunning(false);
      setProgress(0);
    });

    return () => {
      if (animationFrameId != null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProgress, setRunning, setStart, setStop]);

  return [running, progress, start, stop];
};
