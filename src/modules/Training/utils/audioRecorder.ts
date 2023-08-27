import { Word } from "@/shared/speechToText/interfaces";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();
const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

async function convertToLinearWav(inputpath: string) {
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  await ffmpeg.writeFile("input.mp4", await fetchFile(inputpath));
  await ffmpeg.exec(["-i", "input.mp4", "output.wav"]);
  const data = (await ffmpeg.readFile("output.wav")) as any;
  const blob = new Blob([data.buffer], { type: "audio/wav" });
  return blob;
}

export async function initializeAudioRecorder(
  lang: string,
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
  setTranscribedWords: React.Dispatch<React.SetStateAction<Word[]>>,
  setResult: React.Dispatch<React.SetStateAction<string | null>>,
  chunks: React.MutableRefObject<Blob[]>
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const constraints = {
        audio: {
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
          volume: 1.0,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
            type: newMediaRecorder.mimeType,
          });

          const audioUrl = URL.createObjectURL(audioBlob);
          let blob = audioBlob;
          if (newMediaRecorder.mimeType === "audio/mp4") {
            blob = await convertToLinearWav(audioUrl);
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
              alert(
                "Apparently you are using an iOS device, so we are converting your audio to wav, it might take a while for each audio. I am sorry for the inconvenience."
              );
            }
          }

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async function () {
            const base64Audio = reader.result?.toString().split(",")[1]; // Remove the data URL prefix

            const response = await fetch("/api/speechToTextGoogle", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                audio: base64Audio,
                lang: lang,
                type: newMediaRecorder.mimeType,
              }),
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
