"use client";
import React, { useState, useEffect, use, useCallback } from "react";
import { Word } from "@/shared/speechToText/interfaces";
import { initializeAudioRecorder } from "./utils/audioRecorder";
import { compareWords } from "./utils/wordComparison";
import TrainingCard from "./elements/Card";
import styles from "./PhraseCard.module.css";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { Paper } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CircularProgress } from "@mui/material";

export default function PhraseCard({
  text,
  lang,
  loading: isFfmpegloading,
  setLoading,
}: {
  text: string | ArrayBuffer;
  lang: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
      setLoading(true);
    } else {
      console.error("Media recorder not initialized");
    }
  }, [mediaRecorder, setLoading]);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    if (isFfmpegloading) {
      return;
    }
    initializeAudioRecorder(
      lang,
      setMediaRecorder,
      setTranscribedWords,
      setResult,
      chunks
    );
  }, [lang, chunks, isFfmpegloading]);

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
    setLoading(false);
  }, [text, transcribedWords]);

  const [parent, _] = useAutoAnimate(/* optional config */);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={styles.cards} ref={parent}>
        <Paper
          elevation={3}
          variant="elevation"
          sx={{ height: "100%", width: "100%" }}
        >
          <div>
            <TrainingCard
              text={text as string}
              matchedWords={matchedWords}
              missingWords={missingWords}
              almostWords={almostWords}
              lang={lang}
            />
            <div
              className={`${styles.bottom__record} ${styles.bottom}`}
              onClick={
                isFfmpegloading
                  ? () => {}
                  : recording
                  ? stopRecording
                  : startRecording
              }
            >
              <div className={styles.iconRecord}>
                {isFfmpegloading ? (
                  <CircularProgress color="inherit" size={18} />
                ) : (
                  <KeyboardVoiceIcon />
                )}
              </div>
              <p className={styles.textRecord}>
                {isFfmpegloading
                  ? "Loading..."
                  : recording
                  ? "Stop Recording"
                  : "Start Recording"}
              </p>
            </div>
          </div>
        </Paper>

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
