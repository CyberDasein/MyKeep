import { useState } from "react";
import { Button } from "@mantine/core";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceInput({
  setText,
}: {
  setText: (val: string) => void;
}) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU"; // Можно сменить язык
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.start();
  };

  return (
    <Button onClick={startListening} color={isListening ? "red" : "blue"}>
      🎤 {isListening ? "Говорите..." : "Запись"}
    </Button>
  );
}
