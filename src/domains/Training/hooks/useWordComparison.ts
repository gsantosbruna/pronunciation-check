import { useState, useEffect } from "react";
import { Word } from "../interfaces/word";
import { compareWords } from "../utils/wordComparison";

export function useWordComparison(
  text: string,
  transcribedWords: Word[],
  setIsPronounciationCheckLoading: (isLoading: boolean) => void
) {
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [almostWords, setAlmostWords] = useState<Word[]>([]);

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
  }, [text, transcribedWords, setIsPronounciationCheckLoading]);

  return { matchedWords, missingWords, almostWords };
}
