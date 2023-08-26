// audioRecorder.ts
import { Word } from "@/shared/speechToText/interfaces";
import { AudioContext, AudioWorkletNode } from "standardized-audio-context";

function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l]) * 0x7fff;
  }
  return buf;
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

      const handleAudio = (stream: MediaStream) => {
        const audioContext = new AudioContext({ sampleRate: 48000 });
        const input = audioContext.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode!(audioContext, "proc", {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        });
        input.connect(workletNode);
        workletNode.connect(audioContext.destination);
        workletNode.port.onmessage = (e) => {
          console.log(e.data);
          const float32Audio = e.data;
          const int16Audio = convertFloat32ToInt16(float32Audio);
          console.log(int16Audio);
          // chunks.current.push(new Blob([int16Audio]));
        };
      };
      // navigator.mediaDevices.getUserMedia(constraints).then(handleAudio);

      newMediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      newMediaRecorder.onstop = async () => {
        try {
          console.log({ chunks });
          const audioBlob = new Blob(chunks.current, {
            type: newMediaRecorder.mimeType,
          });
          console.log({ audioBlob });

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          // download audio to play
          // const a = document.createElement("a");
          // a.style.display = "none";
          // a.href = audioUrl;
          // a.download = `audio.${
          //   newMediaRecorder.mimeType.split("/")[1].split(";")[0]
          // }`;
          // document.body.appendChild(a);
          // a.click();

          // audio.play();
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async function () {
            console.log(reader);
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
