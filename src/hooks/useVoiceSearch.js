// src/hooks/useVoiceSearch.js
//
// AI FEATURE #1: Voice search (runs entirely in the browser, free, no API
// key, no backend). Uses the Web Speech API's SpeechRecognition, which is
// built into Chrome/Edge. Say an artist or song name and it fills in the
// search box for you.
//
// This is a good "first" AI feature because it needs zero new
// infrastructure - it's a hook you drop into Navbar's mic button.

import { useState, useRef, useCallback } from "react";

export function useVoiceSearch(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    if (!isSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isListening, isSupported, start, stop };
}
