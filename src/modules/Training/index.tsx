"use client";
import React, { useState, useEffect, use, useCallback } from "react";
import { Word } from "@/shared/speechToText/interfaces";
import {
  ffmpeg,
  initializeAudioRecorder,
  initializeFFmpeg,
} from "./utils/audioRecorder";
import { compareWords } from "./utils/wordComparison";
import TrainingCard from "./elements/Card";
import styles from "./PhraseCard.module.css";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { Paper } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CircularProgress } from "@mui/material";
import MainCard from "./elements/MainCard";

export default function PhraseCard({
  text,
  lang,
}: {
  text: string | ArrayBuffer;
  lang: string;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [transcribedWords, setTranscribedWords] = useState<Word[]>([]);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [almostWords, setAlmostWords] = useState<Word[]>([]);

  const chunks = React.useRef<Blob[]>([]);

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

  const [isFfmpegLoading, setIsFfmpegLoading] = useState(true);
  const [ffmpegError, setFfmpegError] = useState<Error | null>(null);

  const initialize = async () => {
    try {
      await initializeFFmpeg();
      console.log("FFmpeg loaded", ffmpeg);
    } catch (error: any) {
      console.error(error);
      setFfmpegError(error);
    }
    setIsFfmpegLoading(false);
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

  const [parent, _] = useAutoAnimate(/* optional config */);

  const isLoading = isPronounciationCheckLoading || isFfmpegLoading;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={styles.cards} ref={parent}>
        <MainCard
          text={text as string}
          lang={lang}
          isLoading={isLoading}
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          matchedWords={matchedWords}
          missingWords={missingWords}
          almostWords={almostWords}
        />
        {missingWords.map((missingWord, index) => (
          <Paper
            key={`${missingWord}-${index}`}
            elevation={3}
            variant="elevation"
            sx={{ height: "100%", width: "100%" }}
          >
            <TrainingCard
              text={missingWord}
              matchedWords={[]}
              missingWords={[missingWord]}
              almostWords={[]}
              lang={lang}
            />
          </Paper>
        ))}
        {almostWords.map((almostWord, index) => (
          <Paper
            key={`${almostWord}-${index}`}
            elevation={3}
            variant="elevation"
            sx={{ height: "100%", width: "100%" }}
          >
            <TrainingCard
              text={almostWord.word}
              matchedWords={[]}
              missingWords={[]}
              almostWords={[almostWord]}
              lang={lang}
            />
          </Paper>
        ))}
      </div>
    </div>
  );
}
