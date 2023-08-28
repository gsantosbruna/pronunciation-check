import React from "react";
import styles from "./Card.module.css";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import { Word } from "@/domains/Training/interfaces/word";
import { speak } from "../../../utils/speechSyntesis";
import CircularProgressWithLabel from "@/domains/Training/startTraining/components/Card/CircularProgressWithLabel";

interface TrainingCardProps {
  text: string;
  matchedWords: string[];
  missingWords: string[];
  almostWords: Word[];
  lang: string;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  text,
  matchedWords,
  missingWords,
  almostWords,
  lang,
}) => {
  const renderWord = (word: string, index: number) => {
    const isMatched = matchedWords.includes(word);
    const isMissing = missingWords.includes(word);
    const isAlmost = almostWords.find((w) => w.word === word);

    const wordClassNames = `
            ${styles.word}
            ${isMatched ? styles.matched : ""}
            ${isMissing ? styles.missing : ""}
            ${isAlmost ? styles.almost : ""}
        `;

    return (
      <p key={`${word}-${index}`} className={wordClassNames}>
        {word}
      </p>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.phraseCard}>
        {typeof text === "string" && text.split(" ").map(renderWord)}
      </div>
      {almostWords.length > 0 && text === almostWords[0].word && (
        <CircularProgressWithLabel value={almostWords[0].confidence * 100} />
      )}
      <div className={styles.listen} onClick={() => speak(text, lang)}>
        <HeadphonesIcon />
      </div>
    </div>
  );
};

export default TrainingCard;
