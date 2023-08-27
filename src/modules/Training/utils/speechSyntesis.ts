let syth: SpeechSynthesis | null = null;

if (typeof window !== "undefined") {
  syth = window.speechSynthesis;
}

export const speak = (textValue: string, lang: string) => {
  const synth = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(textValue);

  const voice = synth.getVoices().find((voice) => voice.lang === lang);
  utterance.voice = voice!;
  utterance.rate = 0.5;

  synth.speak(utterance);
};
