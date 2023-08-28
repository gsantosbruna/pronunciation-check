import React from "react";
import { Paper } from "@mui/material";
import TrainingCard from "..";

export default function MissingWords({
  missingWords,
  lang,
}: {
  missingWords: string[];
  lang: string;
}) {
  return (
    <>
      {missingWords.map((missingWord: string, index: any) => (
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
    </>
  );
}
