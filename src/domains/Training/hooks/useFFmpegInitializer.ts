import { useState, useEffect } from "react";
import { initializeFFmpeg } from "../utils/audioRecorder";

export const useFFmpegInitializer = () => {
  
  const [isFfmpegLoading, setIsFfmpegLoading] = useState(true);
  const [ffmpegError, setFfmpegError] = useState<Error | null>(null);

  const initialize = async () => {
    try {
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        await initializeFFmpeg();
      }
    } catch (error: any) {
      setFfmpegError(error);
    }
    setIsFfmpegLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return { isFfmpegLoading, ffmpegError, initialize };
};
