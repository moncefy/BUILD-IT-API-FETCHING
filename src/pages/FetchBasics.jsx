import { useState, useEffect } from "react";

export default function FetchBasics() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [imageUrl, setImageUrl] = useState(null);
  const [logs, setLogs] = useState([]);
  const [responseData, setResponseData] = useState(null);

  // Add log entry
  const addLog = (message, type = "info") => {
    setLogs((prev) => [...prev, { message, type, timestamp: Date.now() }]);
  };

  // Reset function
  const reset = () => {
    setStep(0);
    setStatus("idle");
    setImageUrl(null);
    setLogs([]);
    setResponseData(null);
  };

  async function runFetch() {
    reset();
    setStatus("loading");

    addLog("Starting fetch request...", "info");

    // Step 1: Browser sending request
    setTimeout(() => {
      setStep(1);
      addLog("Browser sending HTTP request to API...", "info");
    }, 500);

    try {
      // Step 2: API processing
      setTimeout(() => {
        setStep(2);
        addLog("API processing request...", "info");
      }, 1400);

      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      );

      addLog(`Response received. Status: ${response.status}`, "success");

      if (!response.ok) {
        throw new Error(`HTTP Error. Status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);

      addLog("JSON parsed successfully.", "success");

      // Step 3: Updating UI
      setTimeout(() => {
        setStep(3);
        addLog("Updating UI with fetched data...", "info");
      }, 2400);

      setTimeout(() => {
        setImageUrl(data[0].url);
        setStatus("success");
        addLog("Image rendered successfully.", "success");
      }, 3200);
    } catch (error) {
      setStatus("error");
      addLog(`Error: ${error.message}`, "error");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold mb-3">
            We don't just code.
            <span className="text-indigo-400"> We visualize.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Watch how{" "}
            <code className="bg-zinc-800 px-2 py-1 rounded text-indigo-300">
              fetch()
            </code>{" "}
            works in real-time, step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Code Section */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Code example</h3>
              <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">
                JavaScript
              </span>
            </div>

            <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
              <code>{`async function fetchData() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search"
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  return data[0].url;
}`}</code>
            </pre>

            <div className="flex gap-3 mt-4">
              <button
                onClick={runFetch}
                disabled={status === "loading"}
                className="flex-1 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100"
              >
                {status === "loading" ? "Running..." : "Run fetch()"}
              </button>
              <button
                onClick={reset}
                className="px-5 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
            <h3 className="font-semibold text-lg mb-6">Visual data flow</h3>

            <div className="flex items-center justify-between gap-3 mb-6">
              <FlowBox
                label="Browser"
                icon=""
                active={step >= 1}
                completed={step > 1}
              />
              <FlowArrow active={step >= 1} animated={step === 1} />
              <FlowBox
                label="API"
                icon=""
                active={step >= 2}
                completed={step > 2}
              />
              <FlowArrow active={step >= 2} animated={step === 2} />
              <FlowBox
                label="UI"
                icon=""
                active={step >= 3}
                completed={step === 3}
              />
            </div>

            <div className="bg-black rounded-lg p-4 border border-zinc-800">
              <p className="text-sm mb-2">
                <span className="text-zinc-400">Current Step:</span>
              </p>
              <p className="text-lg font-semibold">
                {step === 0 && "Idle - Ready to start"}
                {step === 1 && "Sending request to API..."}
                {step === 2 && "Receiving and parsing response..."}
                {step === 3 && "Updating UI with data"}
              </p>

              {/* Progress bar */}
              <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logs and Result Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Console Logs */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span>Console Logs</span>
              {logs.length > 0 && (
                <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                  {logs.length}
                </span>
              )}
            </h3>

            <div className="bg-black rounded-lg p-4 border border-zinc-800 h-64 overflow-y-auto font-mono text-xs space-y-2">
              {logs.length === 0 ? (
                <p className="text-zinc-500 text-center mt-20">
                  No logs yet. Click "Run fetch()" to start.
                </p>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${log.type === "error"
                        ? "bg-red-950/30 text-red-400"
                        : log.type === "success"
                          ? "bg-green-950/30 text-green-400"
                          : "bg-zinc-800 text-zinc-300"
                      } animate-fade-in`}
                  >
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
            <h3 className="font-semibold text-lg mb-4">Result</h3>

            <div className="bg-black rounded-lg p-6 border border-zinc-800 min-h-64 flex items-center justify-center">
              {status === "idle" && (
                <div className="text-center text-zinc-500">
                  <p className="text-2xl mb-4">No data yet</p>
                  <p>Click "Run fetch()" to fetch a random cat image.</p>
                </div>
              )}

              {status === "loading" && (
                <div className="text-center">
                  <p className="text-2xl mb-4">Loading…</p>
                  <p className="text-yellow-400 font-medium">
                    Fetching data...
                  </p>
                </div>
              )}

              {status === "success" && imageUrl && (
                <div className="text-center w-full animate-fade-in">
                  <img
                    src={imageUrl}
                    alt="Random cat"
                    className="mx-auto rounded-lg max-h-52 object-cover shadow-lg mb-4"
                  />
                  <div className="bg-green-950/30 border border-green-800 rounded-lg p-3">
                    <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                      <span>Data fetched and rendered successfully.</span>
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="text-center">
                  <p className="text-2xl mb-4">Error</p>
                  <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                    <p className="text-red-400 font-medium">Request failed</p>
                    <p className="text-zinc-400 text-sm mt-2">
                      Check console logs for details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Data (if available) */}
        {responseData && (
          <div className="mt-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl animate-fade-in">
            <h3 className="font-semibold text-lg mb-4">Raw Response Data</h3>
            <pre className="bg-black rounded-lg p-4 border border-zinc-800 text-xs text-zinc-300 overflow-auto max-h-48">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function FlowBox({ label, icon, active, completed }) {
  return (
    <div
      className={`w-28 h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-500 ${completed
          ? "border-green-500 bg-green-950/20 text-green-400 shadow-lg shadow-green-500/20"
          : active
            ? "border-indigo-400 bg-indigo-950/20 text-indigo-400 shadow-lg shadow-indigo-500/20 scale-110"
            : "border-zinc-700 text-zinc-400 bg-zinc-950/50"
        }`}
    >
      <div className={`text-3xl mb-1 ${active ? "animate-pulse" : ""}`}>
        {icon}
      </div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}

function FlowArrow({ active, animated }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`transition-all duration-500 ${active ? "text-indigo-400" : "text-zinc-700"
          }`}
      >
        <span className={`text-2xl ${animated ? "animate-pulse" : ""}`}>
          →
        </span>
      </div>
    </div>
  );
}
