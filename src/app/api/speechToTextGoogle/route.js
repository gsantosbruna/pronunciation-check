// Import necessary libraries
import { SpeechClient } from "@google-cloud/speech";
import { NextResponse } from "next/server";

const credential = (() => {
  try {
    return JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, "base64")
        .toString()
        .replace(/\n/g, "")
    );
  } catch (error) {
    return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  }
})();

const client = new SpeechClient({
  credentials: credential,
});

export async function POST(request) {
  const req = await request.json();
  const base64Audio = req.audio;
  const lang = req.lang;

  try {
    const result = await convertAudioToText(base64Audio, lang);
    return NextResponse.json({ result: result }, { status: 200 });
  } catch (error) {
    console.error(
      `Error with Google Cloud Speech-to-Text API request: ${error.message}`
    );
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}

async function convertAudioToText(audioData, lang) {
  const [response] = await client.recognize({
    audio: {
      content: audioData,
    },
    config: {
      encoding: "ENCODING_UNSPECIFIED",
      languageCode: lang,
      enableWordTimeOffsets: true,
      enableWordConfidence: true,
    },
  });

  const transcribedText = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  const words = response.results.map((result) => result.alternatives[0].words);

  return { transcribedText, words };
}
