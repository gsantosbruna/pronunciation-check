const synth = window.speechSynthesis;

if (!synth) {
  alert("Aw... your browser does not support Speech Synthesis");
}

export const speak = (textValue: string, lang: string) => {
  const synth = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(textValue);

  const voice = synth.getVoices().find((voice) => voice.lang === lang);
  utterance.voice = voice!;
  utterance.rate = 0.8;

  synth.speak(utterance);
};
