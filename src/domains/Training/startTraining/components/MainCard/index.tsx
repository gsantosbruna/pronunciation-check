import React from "react";
import { Paper, CircularProgress } from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TrainingCard from "../Card";
import { Word } from "@/domains/Training/interfaces/word";
import styles from "/src/domains/Training/PhraseCard.module.css";

interface MainCardProps {
  text: string;
  lang: string;
  isLoading: boolean;
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  matchedWords: string[];
  missingWords: string[];
  almostWords: Word[];
}

export default function MainCard({
  text,
  lang,
  isLoading,
  recording,
  startRecording,
  stopRecording,
  matchedWords,
  missingWords,
  almostWords,
}: MainCardProps) {
  return (
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
            isLoading ? () => {} : recording ? stopRecording : startRecording
          }
        >
          <div className={styles.iconRecord}>
            {isLoading ? (
              <CircularProgress color="inherit" size={18} />
            ) : (
              <KeyboardVoiceIcon />
            )}
          </div>
          <p className={styles.textRecord}>
            {isLoading
              ? "Loading..."
              : recording
              ? "Stop Recording"
              : "Start Recording"}
          </p>
        </div>
      </div>
    </Paper>
  );
}
