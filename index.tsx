/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
// Fix: Import `CSSProperties` to allow using CSS custom properties in style objects.
import {useState, useRef, useEffect, useMemo, CSSProperties} from 'react';
import ReactDOM from 'react-dom/client';

type Message = {
  role: 'user' | 'ai';
  text: string;
  files?: string[];
};

const INITIAL_MESSAGE: Message = { role: 'ai', text: 'Greetings! Ask me anything.' };

function LoadingScreen({ onLoaded, theme }: { onLoaded: () => void, theme: string }) {
  const [isExiting, setIsExiting] = useState(false);

  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00'];
  const numPixels = 400; // 20x20 grid

  const handleClick = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Set timeout to match the animation duration in CSS
    setTimeout(() => {
      onLoaded();
    }, 1000); 
  };

  const pixels = useMemo(() => {
    if (!isExiting || theme !== 'retro') return null;
    return Array.from({ length: numPixels }).map((_, i) => (
      <div
        key={i}
        className="pixel"
        // Fix: Cast the style object to `CSSProperties` to correctly type the '--pixel-color' custom property.
        style={{
          '--pixel-color': colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 0.4}s`,
        } as CSSProperties}
      />
    ));
  }, [isExiting, theme]);

  return (
    <div 
      id="loading-overlay" 
      className={isExiting ? 'exiting' : ''} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Loading screen, click to start"
    >
      <div className="loading-content">
        <pre className="dancing-figure">
{` /\\_/\\
( ^w^ )
(") (")`}
        </pre>
        <h1 className="loading-title">Go JnX!</h1>
        <p className="loading-text">Click anywhere to start</p>
      </div>
      <div className="pixel-grid">
        {pixels}
      </div>
    </div>
  );
}


function NavBar({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
  const isInfoActive = ['info', 'ai-responses', 'sources', 'core-capabilities'].includes(currentPage);
  return (
    <nav className="nav-bar">
      <button
        className={`nav-button ${currentPage === 'jnx' ? 'active' : ''}`}
        onClick={() => setCurrentPage('jnx')}
        aria-current={currentPage === 'jnx'}
      >
        JnX
      </button>
      <button
        className={`nav-button ${currentPage === 'chat' ? 'active' : ''}`}
        onClick={() => setCurrentPage('chat')}
        aria-current={currentPage === 'chat'}
      >
        Chat
      </button>
      <button
        className={`nav-button ${isInfoActive ? 'active' : ''}`}
        onClick={() => setCurrentPage('info')}
        aria-current={isInfoActive}
      >
        Info
      </button>
    </nav>
  );
}

function CoreCapabilitiesPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="instructions-container">
      <button onClick={() => setCurrentPage('info')} className="back-button">&larr; Back to Info</button>
      <h2>Core Capabilities: How I Can Help</h2>
      <p>I can assist with a wide range of tasks, grouped into the following categories:</p>

      <h3>1. Informative/Fact-based</h3>
      <ul>
        <li><strong>Direct Answers:</strong> Provide specific facts, definitions, dates, or names.</li>
        <li><strong>Explanations:</strong> Break down complex topics, concepts, or processes.</li>
        <li><strong>Summaries:</strong> Condense longer texts or conversations into key points.</li>
        <li><strong>Comparisons:</strong> Highlight similarities and differences between subjects.</li>
        <li><strong>Analyses:</strong> Examine topics from various angles, discuss implications, or interpret data.</li>
      </ul>

      <h3>2. Creative/Generative</h3>
      <ul>
        <li><strong>Stories & Narratives:</strong> Craft original fiction, short stories, or plot outlines.</li>
        <li><strong>Poetry:</strong> Generate poems in various styles and themes.</li>
        <li><strong>Scripts & Dialogues:</strong> Write dialogue for plays, screenplays, or conversational scenarios.</li>
        <li><strong>Brainstorming & Ideation:</strong> Generate lists of ideas, concepts, names, or solutions.</li>
        <li><strong>Humor:</strong> Create jokes, witty remarks, or humorous scenarios.</li>
      </ul>
      
      <h3>3. Structured Text Generation</h3>
      <ul>
          <li><strong>Articles & Essays:</strong> Write full-length informational pieces or academic essays.</li>
          <li><strong>Reports:</strong> Generate structured reports, including findings and recommendations.</li>
          <li><strong>Emails & Letters:</strong> Draft professional or personal correspondence.</li>
          <li><strong>Marketing Copy:</strong> Create slogans, product descriptions, or social media posts.</li>
          <li><strong>Technical Documentation:</strong> Generate user manuals or instructions (within my knowledge limits).</li>
          <li><strong>Code Snippets:</strong> Write, explain, or debug code in various programming languages.</li>
      </ul>

      <h3>4. Conversational/Interactive</h3>
      <ul>
          <li><strong>Dialogue:</strong> Engage in a back-and-forth conversation, answering follow-up questions and maintaining context.</li>
          <li><strong>Role-playing:</strong> Adopt a specific persona (e.g., a historical figure, a customer service agent) and respond as them.</li>
          <li><strong>Q&A:</strong> Provide detailed answers to specific questions, often involving multiple steps.</li>
      </ul>

      <h3>5. Transformative/Manipulative</h3>
      <ul>
          <li><strong>Rewriting/Paraphrasing:</strong> Express existing text in different words, tones, or styles.</li>
          <li><strong>Translating:</strong> Convert text from one language to another.</li>
          <li><strong>Editing/Proofreading:</strong> Identify and suggest corrections for grammar, spelling, or clarity.</li>
          <li><strong>Adapting:</strong> Change the audience, tone, or format of a piece of writing (e.g., turning a technical report into a layman's explanation).</li>
      </ul>

      <h3>6. Advisory/Guidance (with Disclaimers)</h3>
      <ul>
          <li><strong>Recommendations:</strong> Offer suggestions or advice based on provided criteria (e.g., book recommendations, recipe ideas).</li>
          <li><strong>Instructions:</strong> Provide step-by-step guides for tasks or processes.</li>
      </ul>
      <p><strong>Important Note:</strong> Any advice I offer is generated based on my training data and should not be taken as professional, legal, medical, or financial advice. Always consult qualified professionals for critical decisions.</p>

      <h3>Key Characteristics of My Responses</h3>
      <ul>
        <li><strong>Context-aware:</strong> I strive to understand the nuances of your prompt and the preceding conversation.</li>
        <li><strong>Adaptable Tone:</strong> I can adjust my tone from formal to informal, empathetic, humorous, or neutral, as requested.</li>
        <li><strong>Variable Length:</strong> Responses can range from a single word to extensive multi-paragraph texts.</li>
        <li><strong>Structured:</strong> I can use bullet points, numbered lists, tables, and other formatting to improve readability.</li>
        <li><strong>Instruction-following:</strong> I aim to follow specific instructions regarding format, length, style, and content.</li>
      </ul>
    </div>
  );
}


function AIResponseTypesPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="instructions-container">
      <button onClick={() => setCurrentPage('info')} className="back-button">&larr; Back to Info</button>
      <h2>AI Response Types</h2>
      <p>The AI can generate a wide variety of responses based on your prompts. Here are some of the key types:</p>
      
      <h3>Text Generation & Summarization</h3>
      <p>You can ask the AI to write creative content like stories, poems, or song lyrics. It can also help with practical tasks like drafting emails, creating marketing copy, or summarizing long articles to save you time.</p>

      <h3>Question Answering</h3>
      <p>Ask factual questions on a wide range of topics. However, remember that the AI can make mistakes, so it's always a good idea to verify critical information from reliable sources.</p>

      <h3>Code Generation & Explanation</h3>
      <p>Provide a task and ask for code in a specific programming language. You can also paste an existing code snippet and ask for a detailed explanation of what it does, how it works, or how to debug it.</p>

      <h3>Creative Ideation</h3>
      <p>Feeling stuck? Use the AI for brainstorming. Ask it for blog post ideas, creative titles for a project, or unique angles for a marketing campaign. It's a great tool for sparking new ideas.</p>

      <h3>Image Analysis</h3>
      <p>When you upload an image, you can ask the AI to describe it, identify objects within it, translate text in the image, or even generate a creative story or poem inspired by the visual.</p>
    </div>
  );
}

function SourcesAndLimitationsPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="instructions-container">
      <button onClick={() => setCurrentPage('info')} className="back-button">&larr; Back to Info</button>
      <h2>Sources & Limitations</h2>
      
      <h3>Sources</h3>
      <p>The AI's knowledge comes from being trained on a massive and diverse dataset of text and code from the public internet. It learns patterns, facts, context, and reasoning styles from this data. It is not browsing the web in real-time to answer your questions.</p>

      <h3>Limitations</h3>
      <ul>
        <li><strong>Knowledge Cutoff:</strong> The AI's knowledge is not live and may not include information about very recent events that occurred after its last training update.</li>
        <li><strong>Potential for Inaccuracy:</strong> The AI can make mistakes, misunderstand complex nuances, or generate incorrect information. Always double-check important facts, especially for academic or professional use.</li>
        <li><strong>No Personal Opinions or Beliefs:</strong> The AI does not have consciousness, feelings, or personal experiences. Its responses are generated based on the patterns in its training data, not personal beliefs.</li>
        <li><strong>Privacy:</strong> For your own safety and privacy, do not share sensitive personal information (like passwords, phone numbers, or credit card details) in the chat.</li>
      </ul>
    </div>
  );
}

function InfoPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="instructions-container">
      <h2>How to Use Chat and JnX</h2>
      <p>Welcome! This is an interactive application powered by Gemini. Here are some tips to get you started:</p>
      
      <h3>AI's Capabilities</h3>
      <ul>
        <li><a href="#" className="info-link" onClick={(e) => { e.preventDefault(); setCurrentPage('ai-responses'); }}>AI Response Types</a></li>
        <li><a href="#" className="info-link" onClick={(e) => { e.preventDefault(); setCurrentPage('sources'); }}>Sources and Limitations</a></li>
        <li><a href="#" className="info-link" onClick={(e) => { e.preventDefault(); setCurrentPage('core-capabilities'); }}>Core Capabilities: How I can Help</a></li>
      </ul>

      <h3>Using the Chat Tab</h3>
      <p>Simply type your message in the input box at the bottom and press "Send" or hit Enter. The AI will respond to your prompts.</p>
      <ul>
        <li>Click the paperclip icon to open the file selector and upload images (JPEG, PNG, etc.) to ask questions about them.</li>
        <li>Selected files appear as "chips" above the input box. You can remove a file by clicking the '×' on its chip.</li>
        <li>Click the "Clear" button in the top right corner to erase the current conversation and start fresh.</li>
      </ul>

      <h3>Using the Prompt Improver (JnX)</h3>
      <p>Navigate to the "JnX" tab to access a powerful tool for refining your prompts. Start with a basic idea, and the AI will help you improve it in a two-step process, resulting in a more detailed and effective prompt that you can use in the Chat tab or elsewhere.</p>
      
      <h3>Example Prompts</h3>
      <ul>
        <li><strong>For text:</strong> "Write a short story about a robot who discovers music."</li>
        <li><strong>With an image:</strong> Upload a picture of your pet and ask, "What kind of adventures would this animal go on?"</li>
        <li><strong>For code:</strong> "Explain this Python function to me in simple terms."</li>
      </ul>
    </div>
  );
}

type Answer = {
  text: string;
  files: File[];
};

function JnXPage({ onCopyToChat }: { onCopyToChat: (prompt: string) => void }) {
  // State management
  const [stage, setStage] = useState('initial'); // 'initial', 'questions', 'final'
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [firstImprovedPrompt, setFirstImprovedPrompt] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: Answer }>({});
  const [finalPrompt, setFinalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [error, setError] = useState('');

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  const handleReset = () => {
    setStage('initial');
    setOriginalPrompt('');
    setFirstImprovedPrompt('');
    setQuestions([]);
    setAnswers({});
    setFinalPrompt('');
    setError('');
    setCopySuccess('');
  };

  // First AI call to get initial improvement and questions
  const handleGenerate = async () => {
    if (!originalPrompt.trim()) return;
    setIsLoading(true);
    setFirstImprovedPrompt('');
    setQuestions([]);
    setAnswers({});
    setFinalPrompt('');
    setCopySuccess('');
    setError('');

    const systemPrompt = `You are an expert prompt engineer. Your task is to analyze the user's prompt and do two things:
1. Rewrite the prompt to be more effective, clear, and structured for a large language model. This version should be a significant improvement.
2. Generate 2-3 concise, clarifying questions that, if answered by the user, would help you create an even more detailed and superior final prompt.

User Prompt: "${originalPrompt}"`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              improvedPrompt: {
                type: Type.STRING,
                description: 'The rewritten, more effective prompt.',
              },
              questions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of clarifying questions for the user.',
              },
            },
            required: ['improvedPrompt', 'questions'],
          },
        },
      });

      const responseJson = JSON.parse(response.text);
      setFirstImprovedPrompt(responseJson.improvedPrompt);
      setQuestions(responseJson.questions || []);
      setStage('questions');
    } catch (err) {
      console.error('Error generating improved prompt:', err);
      setError('Sorry, something went wrong. Please try again.');
      setStage('initial');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Second AI call to refine prompt with answers
  const handleRefine = async () => {
    setIsLoading(true);
    setFinalPrompt('');
    setCopySuccess('');
    setError('');

    const refinementContext = questions.map((q, i) => {
      const answerText = answers[i]?.text?.trim() || '(No text answer provided)';
      const fileNames = answers[i]?.files.map(f => f.name).join(', ');
      let context = `Question: ${q}\nAnswer: ${answerText}`;
      if (fileNames) {
          context += `\nAttached Files: ${fileNames}`;
      }
      return context;
    }).join('\n\n');

    const systemPrompt = `You are a world-class prompt engineer. You have already provided an initial improved prompt, which the user may have edited. Now, the user has also answered some clarifying questions. Your task is to synthesize all this information—the user's potentially edited prompt and their new answers—to create a final, comprehensive, and highly effective prompt.

Base Prompt (from previous step, possibly edited by user):
"""
${firstImprovedPrompt}
"""

User's Answers to Clarifying Questions:
"""
${refinementContext}
"""

Generate the final, superior prompt based on all this information. Do not ask more questions. Output only the final prompt text itself.`;

    try {
       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });
      setFinalPrompt(response.text);
      setStage('final');
    } catch (err) {
       console.error('Error refining prompt:', err);
      setError('Sorry, something went wrong during refinement. Please try again.');
      setStage('questions'); // Go back to the questions stage
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerTextChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: {
        text: value,
        files: prev[index]?.files || [],
      },
    }));
    if (error) setError('');
  };

  const handleAnswerFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnswers(prev => ({
        ...prev,
        [index]: {
          text: prev[index]?.text || '',
          files: [...(prev[index]?.files || []), ...Array.from(e.target.files!)],
        },
      }));
      if (e.target) e.target.value = ''; // Allow re-selecting the same file
    }
  };

  const handleRemoveAnswerFile = (questionIndex: number, fileIndexToRemove: number) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      const answer = newAnswers[questionIndex];
      if (answer) {
        answer.files = answer.files.filter((_, index) => index !== fileIndexToRemove);
      }
      return newAnswers;
    });
  };

  const handleCopy = () => {
    const textToCopy = stage === 'final' ? finalPrompt : firstImprovedPrompt;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleUseInChat = () => {
    const textToUse = stage === 'final' ? finalPrompt : firstImprovedPrompt;
    if (!textToUse) return;
    onCopyToChat(textToUse);
  };
  
  return (
    <div className="jnx-container">
      <div className="jnx-header">
        <div>
          <h2>JnX Prompt Improver</h2>
          <p>A multi-step process to refine your ideas into powerful prompts.</p>
        </div>
        {stage !== 'initial' && (
          <button onClick={handleReset} className="jnx-reset-button">
            Start Over
          </button>
        )}
      </div>

      {error && <div className="jnx-error-message">{error}</div>}

      {['initial', 'questions', 'final'].includes(stage) && (
        <div className="jnx-input-section">
          <label htmlFor="original-prompt">Step 1: Your Initial Prompt</label>
          <textarea
            id="original-prompt"
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            placeholder="e.g., write a story about a dragon"
            rows={4}
            disabled={isLoading || stage !== 'initial'}
          />
          {stage === 'initial' && (
            <button onClick={handleGenerate} disabled={isLoading || !originalPrompt.trim()} className="jnx-button">
              {isLoading ? 'Improving...' : 'Improve Prompt'}
            </button>
          )}
        </div>
      )}

      {isLoading && stage === 'initial' && (
        <div className="loading-indicator" role="status" aria-label="Improving prompt">
          IMPROVING...
        </div>
      )}

      {['questions', 'final'].includes(stage) && firstImprovedPrompt && (
        <div className="jnx-output-section">
          <div className="jnx-output-header">
            <label htmlFor="improved-prompt">Suggested Prompt (V1):</label>
            {stage === 'questions' && (
              <div className="jnx-button-group">
                <button onClick={handleUseInChat} className="jnx-secondary-button">Use in Chat</button>
                <button onClick={handleCopy} className="copy-button">
                  {copySuccess || 'Copy'}
                </button>
              </div>
            )}
          </div>
          <textarea
            id="improved-prompt"
            value={firstImprovedPrompt}
            onChange={(e) => setFirstImprovedPrompt(e.target.value)}
            rows={8}
          />
        </div>
      )}

      {stage === 'questions' && questions.length > 0 && (
         <div className="jnx-questions-section">
          <label>Step 2: Answer Questions to Refine Further</label>
           <div className="jnx-questions-list">
             {questions.map((q, index) => (
              <div key={index} className="jnx-question-item">
                <p>{index + 1}. {q}</p>
                 <div className="jnx-answer-input-wrapper">
                  <textarea
                    value={answers[index]?.text || ''}
                    onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                    placeholder="Your answer... (optional)"
                    rows={2}
                    disabled={isLoading}
                  />
                  <input
                    type="file"
                    // Fix: Use a block body for the ref callback to ensure a void return type and prevent a TypeScript error.
                    ref={el => { fileInputRefs.current[index] = el; }}
                    onChange={(e) => handleAnswerFileChange(index, e)}
                    style={{ display: 'none' }}
                    multiple
                    accept="image/*"
                  />
                  <button type="button" onClick={() => fileInputRefs.current[index]?.click()} disabled={isLoading} className="icon-button" aria-label={`Attach files to answer ${index + 1}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                </div>
                {answers[index]?.files?.length > 0 && (
                  <div className="file-preview-container">
                    {answers[index].files.map((file, fileIndex) => (
                      <div key={fileIndex} className="file-chip">
                        <span>{file.name}</span>
                        <button onClick={() => handleRemoveAnswerFile(index, fileIndex)}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
           </div>
           {isLoading && stage === 'questions' && (
              <div className="loading-indicator" role="status" aria-label="Refining prompt">
                REFINING...
              </div>
            )}
          <button onClick={handleRefine} disabled={isLoading} className="jnx-button">
            {isLoading ? 'Refining...' : 'Generate Final Prompt'}
          </button>
         </div>
      )}

      {stage === 'final' && finalPrompt && (
        <div className="jnx-output-section final">
          <div className="jnx-output-header">
            <label htmlFor="final-prompt">Final Prompt (V2):</label>
            <div className="jnx-button-group">
              <button onClick={handleUseInChat} className="jnx-secondary-button">Use in Chat</button>
              <button onClick={handleCopy} className="copy-button">
                {copySuccess || 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            id="final-prompt"
            value={finalPrompt}
            onChange={(e) => setFinalPrompt(e.target.value)}
            rows={12}
          />
        </div>
      )}
    </div>
  );
}


function App() {
  const [chatHistory, setChatHistory] = useState<Message[]>([INITIAL_MESSAGE]);
  const [userInput, setUserInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('jnx');
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState('retro');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldPreventScrollDown = useRef(false);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (currentPage !== 'chat' || shouldPreventScrollDown.current) {
      shouldPreventScrollDown.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, currentPage]);

  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData,
      },
    };
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = userInput.trim();
    if (!prompt && files.length === 0) return;

    setIsLoading(true);
    const userMessageIndex = chatHistory.length;
    const userMessage: Message = { role: 'user', text: prompt, files: files.map(f => f.name) };
    setChatHistory(prev => [...prev, userMessage, { role: 'ai', text: '' }]);
    
    const localFiles = [...files];
    setUserInput('');
    setFiles([]);

    try {
      const fileParts = await Promise.all(
        localFiles.map(fileToGenerativePart)
      );

      const contents = { parts: [...fileParts, { text: prompt }] };

      const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      for await (const chunk of response) {
        setChatHistory(prev => {
          const newHistory = [...prev];
          const lastMessage = newHistory[newHistory.length - 1];
          lastMessage.text += chunk.text;
          return newHistory;
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setChatHistory(prev => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];
        lastMessage.text = 'Sorry, something went wrong. Please try again.';
        return newHistory;
      });
    } finally {
      setIsLoading(false);
      const userMessageElement = document.getElementById(`message-${userMessageIndex}`);
      if (userMessageElement) {
        shouldPreventScrollDown.current = true;
        userMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleClearChat = () => {
    setChatHistory([INITIAL_MESSAGE]);
    setUserInput('');
    setFiles([]);
  };

  const handleCopyToChat = (prompt: string) => {
    setUserInput(prompt);
    setCurrentPage('chat');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'retro' ? 'modern' : 'retro'));
  };

  if (!isLoaded) {
    return <LoadingScreen onLoaded={() => setIsLoaded(true)} theme={theme} />;
  }

  return (
    <div className="container">
      <header className="app-header">
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="header-controls">
          {currentPage === 'chat' && (
            <button onClick={handleClearChat} disabled={isLoading} className="clear-button-header">
              Clear
            </button>
          )}
          <button onClick={toggleTheme} className="theme-toggle-button" aria-label={`Switch to ${theme === 'retro' ? 'modern' : 'retro'} theme`}>
            {theme === 'retro' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>
      <main className="content-area">
        {currentPage === 'chat' ? (
          <>
            <div className="response-container">
              {chatHistory.map((message, index) => (
                <div key={index} id={`message-${index}`} className={`message-bubble ${message.role}`}>
                  {message.files && message.files.length > 0 && (
                    <div className="message-files">
                      {message.files.map((fileName, fileIndex) => (
                        <span key={fileIndex} className="message-file-chip">{fileName}</span>
                      ))}
                    </div>
                  )}
                  <p>{message.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {isLoading && (
              <div className="loading-indicator" role="status" aria-label="Loading">
                LOADING...
              </div>
            )}

            <div className="form-container">
              {files.length > 0 && (
                <div className="file-preview-container">
                  {files.map((file, index) => (
                    <div key={index} className="file-chip">
                      <span>{file.name}</span>
                      <button onClick={() => handleRemoveFile(index)}>&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="prompt-form">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  multiple
                  accept="image/*"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="icon-button" aria-label="Attach files">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type or paste a prompt..."
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                <button type="submit" disabled={isLoading || (!userInput && files.length === 0)} aria-label="Send message">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z"/></svg>
                </button>
              </form>
            </div>
          </>
        ) : currentPage === 'jnx' ? (
          <JnXPage onCopyToChat={handleCopyToChat} />
        ) : currentPage === 'info' ? (
          <InfoPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'ai-responses' ? (
          <AIResponseTypesPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'core-capabilities' ? (
          <CoreCapabilitiesPage setCurrentPage={setCurrentPage} />
        ) : (
          <SourcesAndLimitationsPage setCurrentPage={setCurrentPage} />
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);