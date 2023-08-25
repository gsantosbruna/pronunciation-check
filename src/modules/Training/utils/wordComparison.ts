// wordComparison.ts
import { Word } from "@/shared/speechToText/interfaces";

export function compareWords(
  text: string | ArrayBuffer | null,
  transcribedWords: Word[]
): [string[], string[]] {
  const cleanAndLowercase = (str: string) =>
    str.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();

  if (!text || transcribedWords.length === 0) {
    return [[], []];
  }

  const textWords = text.toString().split(" ");
  const transcrWords = transcribedWords.map((word) => word.word);

  let textIndex = textWords.length - 1;
  let transcrIndex = transcrWords.length - 1;
  const newMatchedWords: string[] = [];
  const newMissingWords: string[] = [];

  while (textIndex >= 0 && transcrIndex >= 0) {
    const textWord = cleanAndLowercase(textWords[textIndex]);
    const transcrWord = cleanAndLowercase(transcrWords[transcrIndex]);

    if (textWord === transcrWord) {
      newMatchedWords.unshift(textWords[textIndex]);
      textIndex--;
      transcrIndex--;
    } else {
      let foundMatch = false;
      for (let i = 1; i <= 3 && transcrIndex - i >= 0; i++) {
        const nextTranscrWord = cleanAndLowercase(
          transcrWords[transcrIndex - i]
        );
        if (textWord === nextTranscrWord) {
          foundMatch = true;
          newMatchedWords.unshift(textWords[textIndex]);
          transcrIndex -= i + 1;
          textIndex--;
          break;
        }
      }
      if (!foundMatch) {
        newMissingWords.unshift(textWords[textIndex]);
        textIndex--;
      }
    }
  }

  // add any remaining words in text to missingWords
  while (textIndex >= 0) {
    newMissingWords.unshift(textWords[textIndex]);
    textIndex--;
  }

  // compare from the start
  let startTextIndex = 0;
  let startTranscrIndex = 0;
  const startMatchedWords: string[] = [];
  const startMissingWords: string[] = [];

  if (newMissingWords.length > 0) {
    while (
      startTextIndex < textWords.length &&
      startTranscrIndex < transcrWords.length
    ) {
      const textWord = cleanAndLowercase(textWords[startTextIndex]);
      const transcrWord = cleanAndLowercase(transcrWords[startTranscrIndex]);

      if (textWord === transcrWord) {
        startMatchedWords.push(textWords[startTextIndex]);
        startTextIndex++;
        startTranscrIndex++;
      } else {
        let foundMatch = false;
        for (
          let i = 1;
          i <= 3 && startTranscrIndex + i < transcrWords.length;
          i++
        ) {
          const nextTranscrWord = cleanAndLowercase(
            transcrWords[startTranscrIndex + i]
          );
          if (textWord === nextTranscrWord) {
            foundMatch = true;
            startMatchedWords.push(textWords[startTextIndex]);
            startTranscrIndex += i + 1;
            startTextIndex++;
            break;
          }
        }
        if (!foundMatch) {
          startMissingWords.push(textWords[startTextIndex]);
          startTextIndex++;
        }
      }
    }

    // add any remaining words in text to missingWords
    while (startTextIndex < textWords.length) {
      startMissingWords.push(textWords[startTextIndex]);
      startTextIndex++;
    }
  }

  // compare the results and return them
  if (
    newMatchedWords.length + newMissingWords.length >=
    startMatchedWords.length + startMissingWords.length
  ) {
    return [newMatchedWords, newMissingWords];
  } else {
    return [startMatchedWords, startMissingWords];
  }
}
