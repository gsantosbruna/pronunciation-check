// audioRecorder.ts
import { Word } from "@/shared/speechToText/interfaces";

export async function initializeAudioRecorder(
  lang: string,
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
  setTranscribedWords: React.Dispatch<React.SetStateAction<Word[]>>,
  setResult: React.Dispatch<React.SetStateAction<string | null>>,
  chunks: React.MutableRefObject<Blob[]>
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);

      newMediaRecorder.onstart = () => {
        chunks.current = [];
      };

      newMediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      newMediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks.current, {
            type: "audio/webm",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onerror = function (err) {
            console.error("Error playing audio:", err);
          };
          audio.play();
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async function () {
            const base64Audio = reader.result?.toString().split(",")[1]; // Remove the data URL prefix

            const response = await fetch("/api/speechToTextGoogle", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ audio: base64Audio, lang: lang }),
            });

            const data = await response.json();
            if (response.status !== 200) {
              throw new Error(
                data.error || `Request failed with status ${response.status}`
              );
            }

            setTranscribedWords(data.result.words[0] ?? []);
            setResult(data.result.text);
          };
        } catch (error: any) {
          console.error(error);
          alert(error.message);
        }
      };

      setMediaRecorder(newMediaRecorder);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }
}
