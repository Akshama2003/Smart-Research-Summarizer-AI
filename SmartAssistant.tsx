import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// Mock Document Content for demonstration
const MOCK_DOCUMENT_CONTENT = `
Section 1: Introduction to AI in Healthcare

Artificial Intelligence (AI) is rapidly transforming various sectors, with healthcare being one of the most promising. AI's capabilities in data analysis, pattern recognition, and predictive modeling offer unprecedented opportunities to improve patient outcomes, streamline operations, and reduce costs. The integration of AI technologies, such as machine learning and natural language processing, is leading to significant advancements in diagnostics, personalized medicine, and drug discovery.

Section 2: AI in Diagnostics

One of the most impactful applications of AI in healthcare is in diagnostics. Machine learning algorithms can analyze vast amounts of medical images (X-rays, MRIs, CT scans) with remarkable accuracy, often surpassing human capabilities in identifying subtle anomalies that might indicate early-stage diseases like cancer or retinopathy. For instance, deep learning models trained on millions of medical images can detect cancerous lesions in radiology scans with high sensitivity and specificity. This not only aids in earlier detection but also reduces the workload on radiologists.

Section 3: Personalized Medicine and Drug Discovery

AI plays a crucial role in advancing personalized medicine by analyzing genomic data, patient medical history, and lifestyle factors to tailor treatments to individual patients. This approach promises more effective therapies with fewer side effects. Furthermore, in drug discovery, AI accelerates the identification of potential drug candidates, predicts their efficacy and toxicity, and optimizes molecular structures. This drastically cuts down the time and cost associated with traditional drug development processes, potentially bringing life-saving drugs to market much faster.

Section 4: Ethical Considerations and Future Outlook

Despite the immense potential, the deployment of AI in healthcare raises important ethical questions, including data privacy, algorithmic bias, and accountability. Ensuring the fairness and transparency of AI systems is paramount. Future developments are expected to see AI playing an even more central role, from robotic surgery to proactive health management, emphasizing the need for robust regulatory frameworks and interdisciplinary collaboration.
`;

interface AskAnythingEntry {
  question: string;
  answer: string;
  justification: string;
}

interface ChallengeQuestion {
  id: number;
  question: string;
  correctAnswerKeywords: string[];
  documentReference: string;
  userAnswer?: string;
  assistantFeedback?: string;
  isCorrect?: boolean;
}

const MOCK_CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: 1,
    question: "According to the document, what is one significant way AI improves diagnostics?",
    correctAnswerKeywords: ["medical images", "cancer", "retinopathy", "scans"],
    documentReference: "Section 2: AI in Diagnostics."
  },
  {
    id: 2,
    question: "Besides diagnostics, name another area where AI is crucial in healthcare, as mentioned in the document.",
    correctAnswerKeywords: ["personalized medicine", "drug discovery", "genomic data"],
    documentReference: "Section 3: Personalized Medicine and Drug Discovery."
  },
  {
    id: 3,
    question: "What ethical concerns are highlighted regarding AI deployment in healthcare?",
    correctAnswerKeywords: ["data privacy", "algorithmic bias", "accountability", "fairness", "transparency"],
    documentReference: "Section 4: Ethical Considerations and Future Outlook."
  },
];

const getMockAnswerAndJustification = (question: string): { answer: string; justification: string } => {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("diagnostics") || lowerQuestion.includes("x-rays") || lowerQuestion.includes("mris") || lowerQuestion.includes("ct scans")) {
    return {
      answer: "AI significantly improves diagnostics by analyzing vast amounts of medical images like X-rays, MRIs, and CT scans with high accuracy, often surpassing human capabilities in identifying early-stage diseases such as cancer or retinopathy.",
      justification: "This is supported by Section 2: AI in Diagnostics, which details AI's role in analyzing medical images for improved detection."
    };
  }
  if (lowerQuestion.includes("personalized medicine") || lowerQuestion.includes("drug discovery") || lowerQuestion.includes("genomic data") || lowerQuestion.includes("drug development")) {
    return {
      answer: "AI plays a crucial role in personalized medicine by analyzing genomic data and patient history to tailor treatments. In drug discovery, it accelerates the identification and optimization of drug candidates, reducing time and cost.",
      justification: "This is supported by Section 3: Personalized Medicine and Drug Discovery, which outlines AI's contributions to these areas."
    };
  }
  if (lowerQuestion.includes("ethical concerns") || lowerQuestion.includes("data privacy") || lowerQuestion.includes("bias") || lowerQuestion.includes("accountability") || lowerQuestion.includes("future")) {
    return {
      answer: "Key ethical concerns with AI in healthcare include data privacy, algorithmic bias, and accountability. Ensuring fairness and transparency of AI systems is paramount for future integration.",
      justification: "This is supported by Section 4: Ethical Considerations and Future Outlook, which discusses the ethical challenges and future implications."
    };
  }
  return {
    answer: "AI is transforming healthcare by improving patient outcomes, streamlining operations, and reducing costs through its capabilities in data analysis, pattern recognition, and predictive modeling.",
    justification: "This is supported by Section 1: Introduction to AI in Healthcare, which provides a general overview of AI's impact."
  };
};

const evaluateChallengeResponse = (userAnswer: string, question: ChallengeQuestion): { feedback: string; isCorrect: boolean } => {
  const lowerUserAnswer = userAnswer.toLowerCase();
  const foundKeywords = question.correctAnswerKeywords.filter(keyword =>
    lowerUserAnswer.includes(keyword)
  );

  const isCorrect = foundKeywords.length > 0; // Simple check: if any correct keyword is found

  if (isCorrect) {
    return {
      feedback: `That's correct! Your answer touches upon key aspects related to ${question.documentReference.split(':')[0].trim().toLowerCase().replace('section ', '')}.`,
      isCorrect: true
    };
  } else {
    // Provide a hint based on the document reference
    let hint = "";
    if (question.documentReference.includes("Section 2")) {
      hint = "Consider how AI helps in analyzing medical imagery for disease detection.";
    } else if (question.documentReference.includes("Section 3")) {
      hint = "Think about tailoring treatments and developing new medications.";
    } else if (question.documentReference.includes("Section 4")) {
      hint = "What are the social and moral considerations when using new technologies like AI?";
    } else {
      hint = "Revisit the document for more details on this topic.";
    }

    return {
      feedback: `Not quite. While your answer is noted, it doesn't fully capture the main points as described in the document. ${hint} (${question.documentReference})`,
      isCorrect: false
    };
  }
};

const SmartAssistant = () => {
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<'initial' | 'main' | 'askAnything' | 'challengeMe' | 'challengeResults'>('initial');
  const [isProcessingDocument, setIsProcessingDocument] = useState<boolean>(false);

  // Ask Anything State
  const [askAnythingQuestion, setAskAnythingQuestion] = useState<string>('');
  const [askAnythingHistory, setAskAnythingHistory] = useState<AskAnythingEntry[]>([]);

  // Challenge Me State
  const [challengeQuestions, setChallengeQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [currentChallengeAnswer, setCurrentChallengeAnswer] = useState<string>('');

  useEffect(() => {
    if (documentContent) {
      // Simulate summary generation
      const words = documentContent.split(/\s+/);
      const summarizedWords = words.slice(0, 100).join(' '); // Limit to approx 100 words for <=150 constraint
      setSummary(summarizedWords + (words.length > 100 ? '...' : ''));
    }
  }, [documentContent]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessingDocument(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        // For actual implementation, PDF parsing would require a backend or a library like pdf.js
        // Here, we simulate by using the mock content for any file upload.
        setDocumentContent(MOCK_DOCUMENT_CONTENT);
        // In a real app, you'd send file.text() or file.arrayBuffer() to a backend
        // or a PDF parsing library here.
        setTimeout(() => { // Simulate processing delay
          setIsProcessingDocument(false);
          setCurrentMode('main');
        }, 1500);
      };

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // For PDF, we'd typically send it to a backend or use a library.
        // For this frontend-only component, we'll just use the mock content.
        reader.readAsDataURL(file); // Or reader.readAsArrayBuffer(file)
      } else {
        alert("Please upload a PDF or TXT file.");
        setIsProcessingDocument(false);
      }
    }
  };

  const handleAskAnythingSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!askAnythingQuestion.trim()) return;

    if (documentContent) {
      const { answer, justification } = getMockAnswerAndJustification(askAnythingQuestion);
      setAskAnythingHistory(prev => [...prev, { question: askAnythingQuestion, answer, justification }]);
      setAskAnythingQuestion(''); // Clear input
    }
  };

  const startChallengeMe = () => {
    setChallengeQuestions([...MOCK_CHALLENGE_QUESTIONS.map(q => ({ ...q, userAnswer: '', assistantFeedback: '', isCorrect: false }))]);
    setCurrentChallengeIndex(0);
    setCurrentChallengeAnswer('');
    setCurrentMode('challengeMe');
  };

  const handleChallengeAnswerSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!currentChallengeAnswer.trim()) return;

    const currentQ = challengeQuestions[currentChallengeIndex];
    if (currentQ) {
      const { feedback, isCorrect } = evaluateChallengeResponse(currentChallengeAnswer, currentQ);
      const updatedQuestions = [...challengeQuestions];
      updatedQuestions[currentChallengeIndex] = {
        ...currentQ,
        userAnswer: currentChallengeAnswer,
        assistantFeedback: feedback,
        isCorrect: isCorrect
      };
      setChallengeQuestions(updatedQuestions);
    }
  };

  const handleNextChallengeQuestion = () => {
    if (currentChallengeIndex < challengeQuestions.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setCurrentChallengeAnswer(''); // Clear answer for next question
    } else {
      setCurrentMode('challengeResults'); // All questions answered
    }
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 tracking-tight">
          Smart Assistant for Research
        </h1>
        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          Upload a document (PDF or TXT) to get insights, summaries, and challenge your comprehension.
        </p>

        <label htmlFor="document-upload" className="block text-center cursor-pointer">
          <div className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors duration-200 bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6H16a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V6m0 0l-3 3m3-3l3 3" />
            </svg>
            <p className="text-xl font-semibold text-blue-700">Click to Upload Document</p>
            <p className="text-gray-600 mt-2 text-base">(PDF or TXT file, Max 5MB for demo)</p>
          </div>
          <input
            id="document-upload"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {isProcessingDocument && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 inline-block"></div>
            <p className="text-blue-700 mt-3 font-medium">Processing document...</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMainInterface = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Document Loaded</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Document Summary</h2>
          <p className="text-gray-700 leading-relaxed text-base">
            {summary || 'No summary available.'}
          </p>
        </div>

        <div className="flex space-x-6">
          <button
            onClick={() => setCurrentMode('askAnything')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Ask Anything
          </button>
          <button
            onClick={startChallengeMe}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Challenge Me
          </button>
        </div>

        <button
          onClick={() => {
            setCurrentMode('initial');
            setDocumentContent(null);
            setSummary(null);
            setAskAnythingHistory([]);
          }}
          className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 text-base"
        >
          Upload New Document
        </button>
      </div>
    </div>
  );

  const renderAskAnythingMode = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Ask Anything About the Document</h1>

        <button
          onClick={() => setCurrentMode('main')}
          className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm"
        >
          ← Back to Main Menu
        </button>

        <form onSubmit={handleAskAnythingSubmit} className="mb-6">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none resize-y text-gray-800 text-base"
            rows={3}
            placeholder="Ask your question here, e.g., 'What is AI's role in drug discovery?'"
            value={askAnythingQuestion}
            onChange={(e) => setAskAnythingQuestion(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Get Answer
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation History</h2>
          {askAnythingHistory.length === 0 ? (
            <p className="text-gray-600 italic">No questions asked yet.</p>
          ) : (
            <div className="space-y-6">
              {askAnythingHistory.map((entry, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <p className="font-semibold text-blue-700 mb-2">Q: {entry.question}</p>
                  <p className="text-gray-800 mb-2">A: {entry.answer}</p>
                  <p className="text-sm text-gray-600 italic">Justification: {entry.justification}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChallengeMeMode = () => {
    const currentQ = challengeQuestions[currentChallengeIndex];

    if (!currentQ) {
      return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 text-center max-w-xl w-full">
            <p className="text-gray-700 text-xl font-semibold">No challenge questions available or an error occurred.</p>
            <button
              onClick={() => setCurrentMode('main')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Challenge Your Understanding</h1>

          <button
            onClick={() => setCurrentMode('main')}
            className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm"
          >
            ← Back to Main Menu
          </button>

          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-5">
            <p className="text-xl font-semibold text-green-700 mb-3">
              Question {currentChallengeIndex + 1} of {challengeQuestions.length}
            </p>
            <p className="text-gray-800 leading-relaxed text-lg">{currentQ.question}</p>
          </div>

          <form onSubmit={handleChallengeAnswerSubmit} className="mb-6">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none resize-y text-gray-800 text-base"
              rows={4}
              placeholder="Type your answer here..."
              value={currentChallengeAnswer}
              onChange={(e) => setCurrentChallengeAnswer(e.target.value)}
              disabled={!!currentQ.assistantFeedback} // Disable if already answered
            ></textarea>
            {!currentQ.assistantFeedback && ( // Show submit button only if not yet answered
              <button
                type="submit"
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                Submit Answer
              </button>
            )}
          </form>

          {currentQ.assistantFeedback && (
            <div className={`mt-8 p-5 rounded-lg border ${currentQ.isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
              <h2 className={`text-xl font-semibold mb-3 ${currentQ.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                Feedback
              </h2>
              <p className="text-gray-800 mb-3">{currentQ.assistantFeedback}</p>
              <p className="text-sm text-gray-600 italic">Reference: {currentQ.documentReference}</p>
              <button
                onClick={handleNextChallengeQuestion}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {currentChallengeIndex < challengeQuestions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChallengeResultsMode = () => {
    const correctCount = challengeQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = challengeQuestions.length;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Challenge Results</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8 text-center">
            <p className="text-2xl font-bold text-blue-700 mb-2">
              You answered {correctCount} out of {totalQuestions} questions correctly!
            </p>
            <p className="text-gray-700 text-lg">Great job challenging your comprehension!</p>
          </div>

          <div className="space-y-6">
            {challengeQuestions.map((q, index) => (
              <div key={q.id} className={`p-5 rounded-lg border ${q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-semibold text-gray-800 mb-2">Q{index + 1}: {q.question}</p>
                <p className="text-gray-700 mb-1">Your Answer: {q.userAnswer || 'Not answered'}</p>
                <p className={`font-semibold ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Feedback: {q.assistantFeedback}
                </p>
                <p className="text-sm text-gray-600 italic mt-2">Reference: {q.documentReference}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between space-x-4">
            <button
              onClick={startChallengeMe}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            >
              Try Again
            </button>
            <button
              onClick={() => setCurrentMode('main')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'initial':
        return renderWelcomeScreen();
      case 'main':
        return renderMainInterface();
      case 'askAnything':
        return renderAskAnythingMode();
      case 'challengeMe':
        return renderChallengeMeMode();
      case 'challengeResults':
        return renderChallengeResultsMode();
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderContent()}
    </div>
  );
};

export default SmartAssistant;
