export const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    
    // Optional: Select a specific voice (e.g., a "Google US English" voice if available)
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices[0]; 

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Text-to-speech not supported in this browser.");
  }
};