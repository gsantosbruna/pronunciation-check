import React from "react";
import { Paper } from "@mui/material";
import TrainingCard from "../Card";
import { Word } from "@/shared/speechToText/interfaces";

export default function AlmostWords({
  almostWords,
  lang,
}: {
  almostWords: Word[];
  lang: string;
}) {
  return (
    <div>
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
  );
}
