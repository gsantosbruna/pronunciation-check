import { Word } from "@/domains/Training/interfaces/word";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { get, set } from "idb-keyval";

export const ffmpeg = new FFmpeg();
let isFfmpegInitializing = false;
const baseURL = "https://unpkg.com/@ffmpeg/core@latest/dist/umd";

const KEY = "ffmpeg-core.wasm";

async function getFfmpegWasmPath() {
  let buffer = await get(KEY);
  if (!buffer) {
    console.log("fetching wasm file...");
    const response = await fetch(
      "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.wasm"
    );
    buffer = await response.arrayBuffer();
    set(KEY, buffer);
    console.log("wasm file fetched and stored in indexedDB");
  }
  console.log("wasm file loaded");
  const blob = new Blob([buffer], { type: "application/wasm" });
  const url = URL.createObjectURL(blob);

  return url;
}

async function getCachedUrl(url: string, type: string, key: string) {
  let buffer = await get(key);
  if (!buffer) {
    const response = await fetch(url);
    buffer = await response.arrayBuffer();
    set(key, buffer);
    console.log(`${type} file fetched and stored in indexedDB`);
  }
  const blob = new Blob([buffer], { type });
  const cachedUrl = URL.createObjectURL(blob);

  return cachedUrl;
}

export async function initializeFFmpeg() {
  try {
    if (ffmpeg.loaded || isFfmpegInitializing) {
      return;
    }
    isFfmpegInitializing = true;

    const coreUrl = await getCachedUrl(
      `${baseURL}/ffmpeg-core.js`,
      "text/javascript",
      "ffmpeg-core"
    );
    const wasmUrl = await getCachedUrl(
      `${baseURL}/ffmpeg-core.wasm`,
      "application/wasm",
      "ffmpeg-wasm"
    );

    await ffmpeg.load({
      coreURL: coreUrl,
      wasmURL: wasmUrl,
    });
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
  isFfmpegInitializing = false;
}

async function convertToLinearWav(inputpath: string) {
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
