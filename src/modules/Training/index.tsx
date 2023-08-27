import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Word } from "@/shared/speechToText/interfaces";
import {
  initializeAudioRecorder,
  initializeFFmpeg,
} from "./utils/audioRecorder";
import { compareWords } from "./utils/wordComparison";
import styles from "./PhraseCard.module.css";
import MainCard from "./elements/MainCard";
import MissingWords from "./elements/MissingWords";
import AlmostWords from "./elements/AlmostWords";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CircularProgress, Paper } from "@mui/material";

interface Props {
  text: string | ArrayBuffer;
  lang: string;
}

export default function PhraseCard({ text, lang }: Props) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);
  const [transcribedWords, setTranscribedWords] = useState<Word[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [almostWords, setAlmostWords] = useState<Word[]>([]);

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

  const [isFfmpegLoading, setIsFfmpegLoading] = useState(true);
  const [ffmpegError, setFfmpegError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const initialize = async () => {
    try {
      setProgress(10);
      await initializeFFmpeg(setProgress);
    } catch (error: any) {
      setFfmpegError(error);
    }
    setProgress(100);
    setIsFfmpegLoading(false);
    setProgress(0);
  };

  useEffect(() => {
    initialize();
  }, []);

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
  }, [lang, chunks, isFfmpegLoading]);

  useEffect(() => {
    const [matchedWords, missingWords] = compareWords(text, transcribedWords);

    setMissingWords(missingWords);
    setAlmostWords(
      transcribedWords.filter((word) => {
        if (matchedWords.includes(word.word) && word.confidence < 0.9) {
          matchedWords.splice(matchedWords.indexOf(word.word), 1);
          return true;
        }
        return false;
      })
    );
    setMatchedWords(matchedWords);
    setIsPronounciationCheckLoading(false);
  }, [text, transcribedWords]);

  const [parent, _] = useAutoAnimate();

  const isLoading = isPronounciationCheckLoading || isFfmpegLoading;

  const mainCardProps = useMemo(
    () => ({
      text: text as string,
      lang,
      isLoading,
      recording,
      startRecording,
      stopRecording,
      matchedWords,
      missingWords,
      almostWords,
    }),
    [
      text,
      lang,
      isLoading,
      recording,
      startRecording,
      stopRecording,
      matchedWords,
      missingWords,
      almostWords,
    ]
  );

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isFfmpegLoading ? (
          <Paper
            elevation={3}
            variant="elevation"
            className={styles.loadingPaper}
          >
            <CircularProgress
              color="secondary"
              variant="determinate"
              value={progress}
            />
          </Paper>
        ) : (
          <div className={styles.cards} ref={parent}>
            <MainCard {...mainCardProps} />
            <MissingWords missingWords={missingWords} lang={lang} />
            <AlmostWords almostWords={almostWords} lang={lang} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
