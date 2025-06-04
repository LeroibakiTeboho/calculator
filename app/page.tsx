"use client";
import { useState, useEffect, useRef } from "react";

// Define types
type Operation = "+" | "-" | "×" | "÷" | "^" | null;
type ScientificFunction =
  | "sin"
  | "cos"
  | "tan"
  | "log"
  | "ln"
  | "exp"
  | "sqrt"
  | "pi"
  | "e"
  | "fact"
  | "^";
type MemoryOperation = "MC" | "MR" | "M+" | "M-";
type ClearOperation = "AC" | "C" | "CE";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | ".";
type InputChar =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "."
  | "("
  | ")"
  | "π"
  | "e";

export default function Home() {
  // Calculator state with explicit types
  const [input, setInput] = useState<string>("0");
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isScientificMode, setIsScientificMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle digit input with proper typing
  const handleInputChar = (char: InputChar) => {
    if (isCalculating) {
      setInput(char === "." ? "0." : char);
      setIsCalculating(false);
    } else {
      setInput(input === "0" && char !== "." ? char : input + char);
    }
  };

  // Handle operations with proper typing
  const handleOperation = (op: Operation | "=") => {
    if (op === "=") {
      calculateResult();
      return;
    }

    setPreviousInput(input);
    setOperation(op);
    setIsCalculating(true);
  };

  // Calculate result
  const calculateResult = () => {
    if (!operation || previousInput === null) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(input);
    let result;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
      case "^":
        result = Math.pow(prev, current);
        break;
      default:
        return;
    }

    // Add to history
    const historyEntry = `${previousInput} ${operation} ${input} = ${result}`;
    setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);

    setInput(String(result));
    setOperation(null);
    setPreviousInput(null);
    setIsCalculating(true);
  };

  // Scientific functions
  const handleScientific = (func: ScientificFunction) => {
    const value = parseFloat(input);
    let result: number;

    switch (func) {
      case "sin":
        result = Math.sin(value);
        break;
      case "cos":
        result = Math.cos(value);
        break;
      case "tan":
        result = Math.tan(value);
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "ln":
        result = Math.log(value);
        break;
      case "exp":
        result = Math.exp(value);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "pi":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      case "fact":
        result = Array.from({ length: value }, (_, i) => i + 1).reduce(
          (acc, val) => acc * val,
          1
        );
        break;
      case "^":
        // Handle exponent separately since it requires two operands
        setPreviousInput(input);
        setOperation("^");
        setIsCalculating(true);
        return;
      default:
        return;
    }

    // Add to history
    const historyEntry = `${func}(${input}) = ${result}`;
    setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);

    setInput(String(result));
    setIsCalculating(true);
  };

  // Memory functions
  const handleMemory = (memOp: MemoryOperation) => {
    const value = parseFloat(input);

    switch (memOp) {
      case "MC":
        setMemory(0);
        break;
      case "MR":
        setInput(String(memory));
        break;
      case "M+":
        setMemory((prev) => prev + value);
        break;
      case "M-":
        setMemory((prev) => prev - value);
        break;
      default:
        return;
    }
  };

  // Clear functions
  const handleClear = (type: ClearOperation) => {
    if (type === "AC") {
      setInput("0");
      setPreviousInput(null);
      setOperation(null);
      setIsCalculating(false);
    } else if (type === "C") {
      setInput("0");
    } else if (type === "CE") {
      setHistory([]);
    }
  };

  // Toggle scientific mode
  const toggleScientificMode = () => {
    setIsScientificMode(!isScientificMode);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/\d/.test(e.key)) {
        handleInputChar(e.key as Digit);
      } else if (e.key === ".") {
        handleInputChar(".");
      } else if (
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/"
      ) {
        let op: Operation | null = null;
        if (e.key === "+") op = "+";
        if (e.key === "-") op = "-";
        if (e.key === "*") op = "×";
        if (e.key === "/") op = "÷";
        if (op) handleOperation(op);
      } else if (e.key === "Enter" || e.key === "=") {
        handleOperation("=");
      } else if (e.key === "Escape") {
        handleClear("AC");
      } else if (e.key === "Backspace") {
        setInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, operation, previousInput, isCalculating]);

  // Theme classes
  const themeClasses =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

  const buttonClasses =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white"
      : "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800";

  const displayClasses =
    theme === "dark"
      ? "bg-gray-800 text-green-400"
      : "bg-gray-200 text-green-700";

  const historyClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-gray-50 border-gray-300";

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${themeClasses}`}
    >
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          ref={videoRef}
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Calculator */}
      <div
        className={`relative z-10 w-full ${
          isScientificMode ? "max-w-xl" : "max-w-md"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Advanced Calculator
        </h1>

        <div
          className={`rounded-xl shadow-2xl overflow-hidden ${
            theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
          }`}
        >
          {/* Display Area */}
          <div className={`p-5 ${displayClasses} transition-all duration-300`}>
            <div className="text-right text-sm min-h-[24px] opacity-70">
              {previousInput} {operation}
            </div>
            <div className="text-right text-3xl md:text-4xl font-mono font-bold min-h-[48px] overflow-x-auto whitespace-nowrap">
              {input}
            </div>
            <div className="text-right text-sm mt-1 opacity-70">
              Memory: {memory}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 flex justify-between items-center">
            <button
              onClick={toggleScientificMode}
              className={`px-3 py-1 rounded-lg text-sm ${buttonClasses} transition-all`}
            >
              {isScientificMode ? "Basic" : "Scientific"}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleMemory("MC")}
                className={`px-3 py-1 rounded-lg text-sm ${buttonClasses}`}
              >
                MC
              </button>
              <button
                onClick={() => handleMemory("MR")}
                className={`px-3 py-1 rounded-lg text-sm ${buttonClasses}`}
              >
                MR
              </button>
              <button
                onClick={() => handleMemory("M+")}
                className={`px-3 py-1 rounded-lg text-sm ${buttonClasses}`}
              >
                M+
              </button>
              <button
                onClick={() => handleMemory("M-")}
                className={`px-3 py-1 rounded-lg text-sm ${buttonClasses}`}
              >
                M-
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${buttonClasses}`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Calculator Body */}
          <div className="p-4">
            {/* Scientific Functions */}
            {isScientificMode && (
              <div className="grid grid-cols-5 gap-3 mb-3">
                <button
                  onClick={() => handleScientific("sin")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  sin
                </button>
                <button
                  onClick={() => handleScientific("cos")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  cos
                </button>
                <button
                  onClick={() => handleScientific("tan")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  tan
                </button>
                <button
                  onClick={() => handleScientific("log")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  log
                </button>
                <button
                  onClick={() => handleScientific("ln")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  ln
                </button>

                <button
                  onClick={() => handleScientific("pi")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  π
                </button>
                <button
                  onClick={() => handleScientific("e")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  e
                </button>
                <button
                  onClick={() => handleScientific("exp")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  e<sup>x</sup>
                </button>
                <button
                  onClick={() => handleScientific("sqrt")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  √
                </button>
                <button
                  onClick={() => handleScientific("^")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  x<sup>y</sup>
                </button>

                <button
                  onClick={() => handleScientific("fact")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  n!
                </button>
                <button
                  onClick={() => handleInputChar("(")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  (
                </button>
                <button
                  onClick={() => handleInputChar(")")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  )
                </button>
                <button
                  onClick={() => handleOperation("^")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  ^
                </button>
              </div>
            )}

            {/* Main Keypad */}
            <div
              className={`grid ${
                isScientificMode ? "grid-cols-5" : "grid-cols-4"
              } gap-3`}
            >
              {/* Clear Buttons */}
              <button
                onClick={() => handleClear("AC")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-red-500 hover:bg-red-400"
                } text-white`}
              >
                AC
              </button>
              <button
                onClick={() => handleClear("C")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-red-500 hover:bg-red-400"
                } text-white`}
              >
                C
              </button>
              <button
                onClick={() => handleClear("CE")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-red-500 hover:bg-red-400"
                } text-white`}
              >
                CE
              </button>
              <button
                onClick={() => handleOperation("÷")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-400"
                } text-white`}
              >
                ÷
              </button>
              {isScientificMode && (
                <button
                  onClick={() => handleScientific("inv")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  1/x
                </button>
              )}

              {/* Number 7-9 and multiply */}
              <button
                onClick={() => handleInputChar("7")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                7
              </button>
              <button
                onClick={() => handleInputChar("8")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                8
              </button>
              <button
                onClick={() => handleInputChar("9")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                9
              </button>
              <button
                onClick={() => handleOperation("×")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-400"
                } text-white`}
              >
                ×
              </button>
              {isScientificMode && (
                <button
                  onClick={() => handleScientific("square")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  x²
                </button>
              )}

              {/* Number 4-6 and subtract */}
              <button
                onClick={() => handleInputChar("4")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                4
              </button>
              <button
                onClick={() => handleInputChar("5")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                5
              </button>
              <button
                onClick={() => handleInputChar("6")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                6
              </button>
              <button
                onClick={() => handleOperation("-")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-400"
                } text-white`}
              >
                -
              </button>
              {isScientificMode && (
                <button
                  onClick={() => handleScientific("cube")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  x³
                </button>
              )}

              {/* Number 1-3 and add */}
              <button
                onClick={() => handleInputChar("1")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                1
              </button>
              <button
                onClick={() => handleInputChar("2")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                2
              </button>
              <button
                onClick={() => handleInputChar("3")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                3
              </button>
              <button
                onClick={() => handleOperation("+")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-400"
                } text-white`}
              >
                +
              </button>
              {isScientificMode && (
                <button
                  onClick={() => handleScientific("10x")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  10<sup>x</sup>
                </button>
              )}

              {/* Number 0, decimal point, equals */}
              <button
                onClick={() => handleInputChar("0")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses} ${
                  isScientificMode ? "col-span-2" : "col-span-1"
                }`}
              >
                0
              </button>
              {!isScientificMode && (
                <button
                  onClick={() => handleInputChar("00")}
                  className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
                >
                  00
                </button>
              )}
              <button
                onClick={() => handleInputChar(".")}
                className={`p-3 rounded-xl font-medium text-xl ${buttonClasses}`}
              >
                .
              </button>
              <button
                onClick={() => handleOperation("=")}
                className={`p-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-green-500 hover:bg-green-400"
                } text-white ${isScientificMode ? "col-span-1" : "col-span-1"}`}
              >
                =
              </button>
              {isScientificMode && (
                <button
                  onClick={() => handleScientific("mod")}
                  className={`p-3 rounded-xl font-medium ${buttonClasses}`}
                >
                  mod
                </button>
              )}
            </div>
          </div>

          {/* History Log */}
          <div
            className={`p-4 mt-4 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Calculation History</h2>
              <span className="text-sm opacity-70">{history.length} items</span>
            </div>
            <div
              className={`max-h-40 overflow-y-auto rounded-lg p-3 ${historyClasses}`}
            >
              {history.length > 0 ? (
                <ul className="space-y-2">
                  {history.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm p-2 rounded bg-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer"
                      onClick={() => {
                        const result = item.split("=").pop()?.trim() || "0";
                        setInput(result);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center opacity-50 py-4">No history yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm opacity-70">
          <p>Advanced Calculator with Next.js & Tailwind CSS</p>
          <p className="mt-1">
            Supports keyboard input: digits, +, -, *, /, Enter, Backspace, Esc
          </p>
        </div>
      </div>
    </div>
  );
}
