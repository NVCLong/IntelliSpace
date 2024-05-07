"use client"
import { createContext, useState } from "react";

// import { runChat } from "@/libs/gemini";

type ChatContextProps = {
  sendPrompt: (prompt: string) => Promise<void>;
  setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  setRecentPrompt: React.Dispatch<React.SetStateAction<string>>;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  startNewChat: () => void;
  prevPrompts: string[];
  recentPrompt: string;
  prompt: string;
  isPending: boolean;
  isGenerating: boolean;
  output: string;
  showResult: boolean;
};

export const ChatContext = createContext<ChatContextProps>({
  sendPrompt: async () => {},
  setPrevPrompts: () => {},
  setRecentPrompt: () => {},
  setPrompt: () => {},
  startNewChat: () => {},
  prevPrompts: [],
  recentPrompt: "",
  prompt: "",
  isPending: false,
  isGenerating: false,
  output: "",
  showResult: false,
});

export const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
  const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
  const [recentPrompt, setRecentPrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleNewChat = () => {
    setRecentPrompt("");
    setOutput("");
    setShowResult(false);
  };

  const handleSendPrompt = async (prompt: string) => {
    setIsGenerating(true);
    setIsPending(true);
    setRecentPrompt(prompt);
    setShowResult(true);

    setPrevPrompts((prev) => [...prev.filter((p) => p !== prompt), prompt]);

    // const { data, error } = await runChat(prompt);
    let formattedResponse = "";

    // if (error) {
    //   setOutput(`<span class="text-red-500">${error}</span>`);
    //   setIsPending(false);
    //   setIsGenerating(false);
    //   setShowResult(true);

    //   return;
    // }

    // data!.split("**").forEach((word, idx) => {
    //   if (idx === 0 || idx % 2 === 0) {
    //     formattedResponse += word;
    //   } else {
    //     formattedResponse += `<strong>${word}</strong>`;
    //   }
    // });

    formattedResponse = formattedResponse.split("*").join("<br />");

    setOutput("");
    setIsPending(false);

    await Promise.all(
      formattedResponse
        .split(" ")
        .map((word, idx) => simulateTypingEffect(idx, word + " "))
    );

    setPrompt("");
    setIsGenerating(false);
  };

  const simulateTypingEffect = (idx: number, nextWord: string): Promise<void> =>
    new Promise((resolve) =>
      setTimeout(() => {
        setOutput((prev) => prev + nextWord);
        resolve();
      }, 40 * idx)
    );

  return (
    <ChatContext.Provider
      value={{
        sendPrompt: handleSendPrompt,
        setPrevPrompts,
        setRecentPrompt,
        setPrompt,
        startNewChat: handleNewChat,
        prevPrompts,
        recentPrompt,
        prompt,
        isPending,
        isGenerating,
        output,
        showResult,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
