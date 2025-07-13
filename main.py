import { useState, useRef } from 'react';

export default function SmartResearchSummarizer() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizQuestion, setQuizQuestion] = useState<string>('');
  const [quizUserAnswer, setQuizUserAnswer] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [quizSourceSnippet, setQuizSourceSnippet] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate file upload process
  const handleFileUpload = (file: File | null) => {
    if (file) {
      setIsLoading(true);
      setUploadedFileName(file.name);
      // Clear previous states
      setSummary('');
      setAnswer('');
      setQuizQuestion('');
      setQuizUserAnswer('');
      setQuizFeedback('');
      setQuizSourceSnippet('');
      setCurrentQuestion('');
      setIsQuizMode(false); // Exit quiz mode on new file upload

      // Simulate API call delay for processing document
      setTimeout(() => {
        setIsLoading(false);
        setSummary(`This document is about the advancements in AI-powered research assistants, focusing on their ability to summarize complex information, provide interactive Q&A, and create logic-based quizzes. It highlights the use of natural language processing and machine learning models to enhance understanding and retention of information from various document types. Built with Python, LangChain, and Streamlit, powered by OpenAI API and PDF parsing libraries.`);
      }, 2000);
    }
  };

  // Simulate Q&A submission
  const handleAskQuestion = () => {
    if (currentQuestion.trim() === '') {
      setAnswer('Please enter a question to get an answer.');
      return;
    }
    setIsLoading(true);
    setAnswer(''); // Clear previous answer
    setTimeout(() => {
      setIsLoading(false);
      const lowerCaseQuestion = currentQuestion.toLowerCase();
      if (lowerCaseQuestion.includes('what is the document about') || lowerCaseQuestion.includes('main topic')) {
        setAnswer('The document discusses AI-powered research assistants, focusing on smart summarization, interactive Q&A, and logic-based quizzes for enhanced information processing. Source: Introduction paragraph, lines 1-3.');
      } else if (lowerCaseQuestion.includes('technologies used') || lowerCaseQuestion.includes('built with')) {
        setAnswer('The application is built with Python, LangChain, and Streamlit, powered by OpenAI API and PDF parsing libraries. Source: Description section, bullet points.');
      } else if (lowerCaseQuestion.includes('features')) {
        setAnswer('Key features include Document-aware Q&A, Auto-summary (≤150 words), "Challenge Me" quiz mode, and Answer explanations with source snippets. Source: Features section.');
      } else {
        setAnswer('I am sorry, I do not have enough information to answer that based on the current document. Please try another question.');
      }
    }, 1500);
  };

  // Simulate entering quiz mode
  const handleChallengeMe = () => {
    setIsQuizMode(true);
    setQuizUserAnswer('');
    setQuizFeedback('');
    setQuizSourceSnippet('');
    setQuizQuestion('Based on the document, which specific feature helps users test their understanding with logic-based questions?');
  };

  // Simulate quiz answer submission
  const handleSubmitQuizAnswer = () => {
    if (quizUserAnswer.trim() === '') {
      setQuizFeedback('Please enter your answer before submitting.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (quizUserAnswer.toLowerCase().includes('challenge me') || quizUserAnswer.toLowerCase().includes('quiz mode')) {
        setQuizFeedback('Correct! The "Challenge Me" quiz mode is designed for testing understanding with logic-based questions.');
        setQuizSourceSnippet('Source: Features section, “Challenge Me” quiz mode.');
      } else {
        setQuizFeedback('Incorrect. The correct answer is related to the "Challenge Me" quiz mode feature.');
        setQuizSourceSnippet('Source: Features section, “Challenge Me” quiz mode.');
      }
    }, 1500);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50'); // Visual feedback for drag over
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans text-gray-800">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2">Smart Research Summarizer</h1>
          <p className="text-base sm:text-lg text-gray-600">
            An AI-powered assistant for document summarization, Q&A, and interactive quizzes.
          </p>
        </div>

        {/* File Upload Section */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200 mb-8"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files ? e.target.files[0] : null)}
            accept=".pdf,.txt,.docx"
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            <span className="font-semibold text-blue-700">Click to upload</span> or drag and drop your document (PDF, TXT, DOCX)
          </p>
          {uploadedFileName && (
            <p className="mt-2 text-sm text-green-700">
              File uploaded: <span className="font-medium">{uploadedFileName}</span>
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-blue-600 font-medium">Processing document, please wait...</p>
          </div>
        )}

        {summary && (
          <div className="bg-blue-50 p-6 rounded-lg mb-8 shadow-sm border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Auto-Summary</h2>
            <p className="text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {uploadedFileName && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Q&A Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Document-aware Q&A</h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                rows={3}
                placeholder="E.g., 'What are the main technologies used?' or 'Summarize the core features.'"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
              ></textarea>
              <button
                onClick={handleAskQuestion}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Thinking...' : 'Get Answer'}
              </button>
              {answer && (
                <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">Answer:</p>
                  <p className="text-gray-700 leading-relaxed">{answer}</p>
                </div>
              )}
            </div>

            {/* "Challenge Me" Quiz Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">“Challenge Me” Quiz Mode</h2>
              {!isQuizMode ? (
                <>
                  <p className="text-gray-600 mb-4">Test your understanding with logic-based quizzes generated from the document.</p>
                  <button
                    onClick={handleChallengeMe}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-auto"
                    disabled={isLoading}
                  >
                    Start Quiz
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Question:</p>
                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-md border border-blue-200">{quizQuestion}</p>
                  </div>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                    rows={2}
                    placeholder="Type your answer here..."
                    value={quizUserAnswer}
                    onChange={(e) => setQuizUserAnswer(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleSubmitQuizAnswer}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Checking...' : 'Submit Answer'}
                  </button>
                  {quizFeedback && (
                    <div className={`mt-5 p-4 rounded-lg ${quizFeedback.includes('Correct') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <p className={`font-medium ${quizFeedback.includes('Correct') ? 'text-green-800' : 'text-red-800'} mb-2`}>
                        {quizFeedback.includes('Correct') ? 'Feedback: Correct!' : 'Feedback: Incorrect!'}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{quizFeedback}</p>
                      {quizSourceSnippet && (
                        <p className="text-sm text-gray-600 mt-2 italic">{quizSourceSnippet}</p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setIsQuizMode(false);
                      setQuizFeedback('');
                      setQuizSourceSnippet('');
                      setQuizUserAnswer('');
                    }}
                    className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Exit Quiz Mode
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-medium text-gray-800 text-lg mb-2">Document-aware Q&A</h3>
              <p className="text-gray-600 text-sm">Ask any question based on your uploaded document.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h3 className="font-medium text-gray-800 text-lg mb-2">Auto-summary</h3>
              <p className="text-gray-600 text-sm">Concise summaries (≤150 words) of complex documents.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="font-medium text-gray-800 text-lg mb-2">“Challenge Me” Quiz Mode</h3>
              <p className="text-gray-600 text-sm">Logic-based quizzes to test your understanding.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.971a.75.75 0 01.968-.088l4.428 2.051a.75.75 0 010 1.356l-4.428 2.051a.75.75 0 01-.968-.088L2.27 10.999A.75.75 0 012 10.5v-1c0-.28.18-.53.447-.626l5.781-2.285zM15 15.75a.75.75 0 100 1.5.75.75 0 000-1.5zM17.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM19.5 8.25a.75.75 0 100 1.5.75.75 0 000-1.5z" />
              </svg>
              <h3 className="font-medium text-gray-800 text-lg mb-2">Answer Explanations</h3>
              <p className="text-gray-600 text-sm">Detailed explanations with source snippets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
