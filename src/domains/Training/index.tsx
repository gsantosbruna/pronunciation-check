import React, { useState, useMemo } from "react";
import styles from "./PhraseCard.module.css";
import MainCard from "./startTraining/components/MainCard";
import MissingWords from "./startTraining/components/Card/MissingWords";
import AlmostWords from "./startTraining/components/Card/AlmostWords";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRecording } from "@/domains/Training/hooks/useRecording";
import { useTranscription } from "./hooks/useTranscription";
import { useWordComparison } from "./hooks/useWordComparison";

interface Props {
  text: string | ArrayBuffer;
  lang: string;
}

export default function PhraseCard({ text, lang }: Props) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const {
    startRecording,
    stopRecording,
    recording,
    isPronounciationCheckLoading,
    setIsPronounciationCheckLoading,
  } = useRecording(mediaRecorder);

  const { transcribedWords, isFfmpegLoading } = useTranscription(
    lang,
    setMediaRecorder
  );

  const { missingWords, almostWords, matchedWords } = useWordComparison(
    text as string,
    transcribedWords,
    setIsPronounciationCheckLoading
  );
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
        <div className={styles.cards} ref={parent}>
          <MainCard {...mainCardProps} />
          <MissingWords missingWords={missingWords} lang={lang} />
          <AlmostWords almostWords={almostWords} lang={lang} />
        </div>
      </div>
    </React.Fragment>
  );
}
