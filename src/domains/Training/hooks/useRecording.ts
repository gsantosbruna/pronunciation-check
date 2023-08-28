import { useCallback, useState, useEffect } from "react";

export function useRecording(mediaRecorder: MediaRecorder | null) {
  const [recording, setRecording] = useState(false);
  const [isPronounciationCheckLoading, setIsPronounciationCheckLoading] =
    useState(false);

  const startRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    } else {
      console.error("Media recorder not initialized");
    }
  }, [mediaRecorder]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setIsPronounciationCheckLoading(true);
    } else {
      console.error("Media recorder not initialized");
    }
  }, [mediaRecorder, setIsPronounciationCheckLoading]);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  return {
    startRecording,
    stopRecording,
    recording,
    isPronounciationCheckLoading,
    setIsPronounciationCheckLoading,
  };
}
