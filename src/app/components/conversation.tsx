'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

interface ConversationData {
  source: 'ai' | 'user';
  message: string;
}

interface ErrorData {
  response?: {
    data?: { [key: string]: unknown };
  };
  message?: string;
}

export function Conversation() {
  const normalDuck = '/heartduck.png';
  const talkingDuck = '/talkingduck.gif';
  const finishConvo = '/finishlesson.png';
  const heartDuck = '/heartduck.png';
  const newlesson = '/newlesson.png';

  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [topic, setTopic] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<string>('');
  const [currAnswer, setCurrAnswer] = useState<string>('');
  const [currScore, setCurrScore] = useState<number>(0);
  const [duckImg, setDuckImg] = useState<string>(normalDuck);
  const [data, setData] = useState<ConversationData | null>(null);
  const [conversationEnded, setConversationEnded] = useState(false);

  const generateImg = useCallback(async (topic: string, userAnswer: string) => {
    const prompt = `A realistic sketch illustrating ${topic}. The image should reflect the user's idea: "${userAnswer}"`;

    try {
      const imageRes = await fetch('/api/get-luma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const imageData = await imageRes.json();
      if (imageRes.ok) {
        console.log("Image URL:", imageData.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate image:', (err as Error).message);
    }
  }, []);

  const calculateScore = useCallback(async () => {
    try {
      const response = await fetch('/api/open-ai/calcScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: topic,
          question: currQuestion,
          userAnswer: currAnswer,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrScore(currScore + data.score);
      }
    } catch (err) {
      console.error('Failed to calculate score:', (err as Error).message);
    }
  }, [topic, currQuestion, currAnswer, currScore]);

  useEffect(() => {
    if (currAnswer !== '') {
      calculateScore();
      generateImg(topic, currAnswer);
    }
  }, [currAnswer, topic, calculateScore, generateImg]);

  useEffect(() => {
    if (!data) return;

    if (data.source === 'ai') {
      setCurrQuestion(data.message);
    } else if (data.source === 'user') {
      setCurrAnswer(data.message);
    }
  }, [data]);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (messageData: ConversationData) => {
      setData(messageData);
      setWords(messageData.message.split(' '));
      setWordIndex(0);
    },
    onError: (err: ErrorData) => {
      console.error('Error:', err.message);
    },
  });

  useEffect(() => {
    if (wordIndex < words.length) {
      setDuckImg(talkingDuck);
      const timeout = setTimeout(() => {
        setWordIndex((prev) => prev + 1);
      }, 260);
      return () => clearTimeout(timeout);
    } else {
      setDuckImg(normalDuck);
    }
  }, [wordIndex, words]);

  const startConversationWithTopic = async (userInput: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch('/api/open-ai/genFirstQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      const generatedSubject = data.question;

      if (!generatedSubject) return;

      setTopic(userInput);

      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID || "",
        dynamicVariables: {
          subject_description: generatedSubject,
        },
      });

    } catch (err) {
      console.error('Failed to start conversation:', (err as Error).message);
    }
  };

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setConversationEnded(true);
    setCurrQuestion('');
    setCurrAnswer('');
    setWords([]);
    setWordIndex(0);
    setTopic('');
    setIsConversationStarted(false);
    setUserInput('');
    setDuckImg(normalDuck);
  }, [conversation]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsConversationStarted(true);
    await startConversationWithTopic(userInput);
  };

  if (conversationEnded) {
    return (
      <div className="flex bg-[url('/background.png')] bg-cover bg-center w-screen">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="font-bold text-2xl">What a great conversation!</h1>
          <h2 className="mt-4 font-bold text-2xl">Score: {currScore / 5}%</h2>
          <Image
            width={300}
            height={200}
            className="cursor-pointer"
            onClick={() => {
              window.location.href = '/learn';
              setCurrScore(0);
            }}
            src={newlesson}
            alt="New Lesson"
          />
          <Image width={400} height={400} src={heartDuck} alt="Heart Duck" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/pond.PNG')" }}>
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-3/4 z-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-2">Topic: {topic}</h1>
        <div className="flex items-center w-full justify-between">
          <span>Mastery:</span>
          <div className="relative w-3/4 bg-gray-200 rounded-full h-4 mx-2">
            <div className="bg-[#5e8c61] h-4 rounded-full" style={{ width: `${Math.max((currScore / 500) * 100, 0)}%` }}></div>
          </div>
          <span>{`${currScore / 5}%`}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {isConversationStarted ? (
          <div className="flex flex-col items-center gap-4">
            <div className="mt-20">
              <Image width={128} height={128} src={duckImg} alt="Duck" />
            </div>

            <div className="mt-8">
              <Image
                width={200}
                height={200}
                onClick={stopConversation}
                src={finishConvo}
                className="cursor-pointer"
                alt="Finish Lesson"
              />
            </div>
          </div>
        ) : (
          <div className="text-center mt-10">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Enter a topic..."
                className="p-2 border"
              />
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Start</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}