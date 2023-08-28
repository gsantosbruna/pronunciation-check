import { useEffect, useRef, useState } from "react";
import { useFFmpegInitializer } from "./useFFmpegInitializer";
import { initializeAudioRecorder } from "../utils/audioRecorder";
import { Word } from "../interfaces/word";

export const useTranscription = (
  lang: string,
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>
) => {
  const { isFfmpegLoading } = useFFmpegInitializer();
  const chunks = useRef<Blob[]>([]);
  const [transcribedWords, setTranscribedWords] = useState<Word[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (isFfmpegLoading) {
      return;
    }
    initializeAudioRecorder(
      lang,
      setMediaRecorder,
      setTranscribedWords,
      setResult,
      chunks
    );
  }, [lang, chunks, isFfmpegLoading, setMediaRecorder]);

  return { transcribedWords, result, isFfmpegLoading };
};
