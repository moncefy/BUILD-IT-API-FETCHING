import { useState } from "react";

export default function ErrorHandling() {
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState("success");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [logs, setLogs] = useState([]);
    const [errorDetails, setErrorDetails] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);

    const addLog = (msg, type = "info") => {
        setLogs((prev) => [...prev, { msg, type, timestamp: Date.now() }]);
    };

    const reset = () => {
        setStep(0);
        setStatus("idle");
        setMessage("");
        setLogs([]);
        setErrorDetails(null);
        setResponseStatus(null);
    };

    async function runRequest(selectedMode) {
        reset();
        setMode(selectedMode);
        setStatus("loading");

        addLog(`Starting ${selectedMode} scenario...`, "info");

        setTimeout(() => {
            setStep(1);
            addLog("Browser sending fetch request...", "info");
        }, 400);

        try {
            setTimeout(() => {
                setStep(2);
                addLog("Waiting for server response...", "info");
            }, 1000);

            let url = "https://api.thecatapi.com/v1/images/search";

            if (selectedMode === "http") {
                url = "https://api.thecatapi.com/v1/does-not-exist";
                addLog(
                    "Using invalid endpoint to trigger HTTP error",
                    "warning"
                );
            }

            if (selectedMode === "network") {
                url = "https://this-domain-will-not-resolve.example.test";
                addLog(
                    "Using unreachable domain to trigger network error",
                    "warning"
                );
            }

            const response = await fetch(url);
            setResponseStatus(response.status);

            addLog(
                `Response received - Status: ${response.status}`,
                response.ok ? "success" : "warning"
            );

            if (!response.ok) {
                addLog(`HTTP Error detected: ${response.status}`, "error");
                throw new Error("HTTP " + response.status);
            }

            setTimeout(() => setStep(3), 1800);

            if (selectedMode === "parsing") {
                addLog("Attempting to parse response...", "info");
                const text = await response.text();
                addLog("Forcing invalid JSON parse...", "warning");
                JSON.parse("invalid json content");
            } else {
                addLog("Parsing JSON response...", "info");
                await response.json();
            }

            setTimeout(() => {
                setStep(4);
                setStatus("success");
                setMessage("Everything went well. Data loaded successfully.");
                addLog("Request completed successfully.", "success");
            }, 2400);
        } catch (err) {
            console.error("Error demo:", err);
            setErrorDetails({
                name: err.name,
                message: err.message,
                type: getErrorType(err, mode),
            });

            setTimeout(() => {
                setStep(3);
                addLog(
                    `Error caught: ${err.name} - ${err.message}`,
                    "error"
                );
            }, 1800);

            setTimeout(() => {
                setStep(4);
                setStatus("error");
                const userMsg = getUserMessage(err, mode);
                setMessage(userMsg);
                addLog(`User message: ${userMsg}`, "info");
            }, 2600);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="mb-10 text-center">
                    <h2 className="text-5xl font-bold mb-3">
                        Handling <span className="text-red-400">errors</span> in fetch()
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                        Network requests can fail in different ways. Good error handling
                        means checking{" "}
                        <code className="bg-zinc-800 px-2 py-1 rounded text-red-300">
                            response.ok
                        </code>
                        , catching exceptions, and showing user-friendly messages.
                    </p>
                </div>

                {/* Scenario Selector */}
                <div className="mb-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-center">
                        Choose Error Scenario to Test
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <ScenarioButton
                            active={mode === "success"}
                            onClick={() => setMode("success")}
                            label="Success"
                            description="Normal request"
                            color="green"
                        />
                        <ScenarioButton
                            active={mode === "http"}
                            onClick={() => setMode("http")}
                            label="HTTP Error"
                            description="404 / 500 status"
                            color="yellow"
                        />
                        <ScenarioButton
                            active={mode === "network"}
                            onClick={() => setMode("network")}
                            label="Network Error"
                            description="No connection"
                            color="red"
                        />
                        <ScenarioButton
                            active={mode === "parsing"}
                            onClick={() => setMode("parsing")}
                            label="Parsing Error"
                            description="Invalid JSON"
                            color="purple"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => runRequest(mode)}
                            disabled={status === "loading"}
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 text-lg"
                        >
                            {status === "loading"
                                ? "Running..."
                                : `Run ${mode} scenario`}
                        </button>
                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all duration-200"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Code Example */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">try/catch Pattern</h3>
                            <span className="text-xs bg-red-600 px-3 py-1 rounded-full">
                                Error Handling
                            </span>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed mb-4">
                            {`async function safeFetch(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // HTTP 4xx / 5xx
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Request failed:", error);
    return { ok: false, error };
  }
}`}
                        </pre>

                        <div className="space-y-4">
                            <ErrorTypeCard
                                title="Network Errors"
                                description="Offline, DNS failure, CORS, server unreachable"
                                active={mode === "network"}
                            />
                            <ErrorTypeCard
                                title="HTTP Errors"
                                description="404, 500, 401, 403 (check response.ok)"
                                active={mode === "http"}
                            />
                            <ErrorTypeCard
                                title="Parsing Errors"
                                description="Invalid JSON, unexpected content format"
                                active={mode === "parsing"}
                            />
                        </div>
                    </div>

                    {/* Visual Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">
                            Visual Error Flow
                        </h3>

                        <div className="space-y-6">
                            {/* Step 1: Request */}
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="Browser"
                                    active={step >= 1}
                                    completed={step > 1}
                                />
                                <FlowArrow active={step >= 1} />
                                <FlowBox
                                    label="fetch(url)"
                                    active={step >= 1}
                                    completed={step > 1}
                                />
                                <FlowArrow active={step >= 1} />
                                <FlowBox
                                    label="Network"
                                    active={step >= 2}
                                    completed={step > 2}
                                />
                            </div>

                            {/* Step 2: Check Response */}
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="response.ok?"
                                    active={step >= 2}
                                    completed={step > 2}
                                    error={status === "error" && step >= 3}
                                />
                                <FlowArrow
                                    active={step >= 2}
                                    error={status === "error" && step >= 3}
                                />
                                <FlowBox
                                    label={status === "error" ? "Error" : "Parse JSON"}
                                    active={step >= 3}
                                    completed={step > 3}
                                    error={status === "error" && step >= 3}
                                />
                            </div>

                            {/* Step 3: Error Handling */}
                            <div className="flex items-center gap-3">
                                <FlowBox
                                    label="try { }"
                                    active={step >= 1}
                                    completed={step >= 3}
                                />
                                <FlowArrow active={step >= 3} error={status === "error"} />
                                <FlowBox
                                    label="catch (e)"
                                    active={status === "error" && step >= 3}
                                    error={status === "error" && step >= 3}
                                />
                                <FlowArrow active={step >= 4} />
                                <FlowBox
                                    label="Show UI"
                                    active={step >= 4}
                                    completed={step >= 4}
                                />
                            </div>
                        </div>

                        {/* Current Step Info */}
                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Current Step:</p>
                            <p className="text-base font-semibold">
                                {step === 0 && "Idle - Ready to start"}
                                {step === 1 && "Sending request from browser"}
                                {step === 2 &&
                                    "Waiting for API or network response"}
                                {step === 3 &&
                                    (status === "error"
                                        ? "Error thrown. Entering catch block..."
                                        : "Parsing JSON data successfully")}
                                {step === 4 &&
                                    (status === "error"
                                        ? "Showing user-friendly error message"
                                        : "Showing success message to user")}
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${status === "error"
                                            ? "bg-gradient-to-r from-red-500 to-orange-500"
                                            : "bg-gradient-to-r from-indigo-500 to-purple-500"
                                        }`}
                                    style={{ width: `${(step / 4) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Response Status */}
                        {responseStatus && (
                            <div className="mt-4 bg-black rounded-lg p-4 border border-zinc-800 animate-fade-in">
                                <p className="text-sm text-zinc-400 mb-2">
                                    HTTP Response Status:
                                </p>
                                <p
                                    className={`text-2xl font-bold ${responseStatus >= 200 && responseStatus < 300
                                            ? "text-green-400"
                                            : responseStatus >= 400 && responseStatus < 500
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                        }`}
                                >
                                    {responseStatus} {getStatusText(responseStatus)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
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

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-72 overflow-y-auto font-mono text-xs space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 text-center mt-28">
                                    Select a scenario and click "Run" to see logs.
                                </p>
                            ) : (
                                logs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded animate-fade-in ${log.type === "error"
                                                ? "bg-red-950/30 text-red-400 border-l-2 border-red-500"
                                                : log.type === "success"
                                                    ? "bg-green-950/30 text-green-400 border-l-2 border-green-500"
                                                    : log.type === "warning"
                                                        ? "bg-yellow-950/30 text-yellow-400 border-l-2 border-yellow-500"
                                                        : "bg-zinc-800 text-zinc-300"
                                            }`}
                                    >
                                        {log.msg}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* User Message Display */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4">User Message</h3>

                        <div className="bg-black rounded-lg p-6 border border-zinc-800 min-h-72 flex flex-col justify-center">
                            {status === "idle" && (
                                <div className="text-center text-zinc-500">
                                    <p className="text-3xl mb-4">No scenario running</p>
                                    <p>
                                        Choose a scenario and click "Run" to see how errors
                                        are handled.
                                    </p>
                                </div>
                            )}

                            {status === "loading" && (
                                <div className="text-center">
                                    <p className="text-3xl mb-4 animate-pulse">
                                        Processing...
                                    </p>
                                    <p className="text-yellow-400 font-medium text-lg">
                                        Processing request...
                                    </p>
                                </div>
                            )}

                            {status === "success" && (
                                <div className="text-center animate-fade-in">
                                    <div className="bg-green-950/30 border border-green-800 rounded-lg p-5">
                                        <p className="text-green-400 font-semibold text-lg mb-2">
                                            {message}
                                        </p>
                                        <p className="text-zinc-400 text-sm">
                                            No errors detected. Request completed successfully.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="text-center animate-fade-in">
                                    <div className="bg-red-950/30 border border-red-800 rounded-lg p-5 mb-4">
                                        <p className="text-red-400 font-semibold text-lg mb-2">
                                            {message}
                                        </p>
                                        <p className="text-zinc-400 text-sm">
                                            This is what the user sees.
                                        </p>
                                    </div>

                                    {errorDetails && (
                                        <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-left">
                                            <p className="text-xs text-zinc-500 mb-2">
                                                Technical Details (for developers):
                                            </p>
                                            <div className="space-y-1 text-xs">
                                                <p>
                                                    <span className="text-zinc-400">Type:</span>{" "}
                                                    <span className="text-red-400">
                                                        {errorDetails.type}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="text-zinc-400">Name:</span>{" "}
                                                    <span className="text-zinc-200">
                                                        {errorDetails.name}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="text-zinc-400">Message:</span>{" "}
                                                    <span className="text-zinc-200">
                                                        {errorDetails.message}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Practices Footer */}
                <div className="mt-6 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-6 border border-indigo-800/30 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-300">
                        Error Handling Best Practices
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <BestPracticeCard
                            title="Check response.ok"
                            description="HTTP errors will not throw automatically."
                        />
                        <BestPracticeCard
                            title="Use try/catch"
                            description="Wrap fetch and parsing operations."
                        />
                        <BestPracticeCard
                            title="User-friendly messages"
                            description="Hide technical details from users."
                        />
                        <BestPracticeCard
                            title="Log for debugging"
                            description="Keep detailed logs for developers."
                        />
                    </div>
                </div>
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

function ScenarioButton({ active, onClick, label, description, color }) {
    const colorClasses = {
        green: "border-green-500 bg-green-950/20 shadow-green-500/20",
        yellow: "border-yellow-500 bg-yellow-950/20 shadow-yellow-500/20",
        red: "border-red-500 bg-red-950/20 shadow-red-500/20",
        purple: "border-purple-500 bg-purple-950/20 shadow-purple-500/20",
    };

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${active
                    ? `${colorClasses[color]} shadow-lg scale-105`
                    : "border-zinc-700 bg-zinc-950 hover:border-zinc-600"
                }`}
        >
            <div className="font-semibold text-sm">{label}</div>
            <div className="text-xs text-zinc-400 mt-1">{description}</div>
        </button>
    );
}

function ErrorTypeCard({ title, description, active }) {
    return (
        <div
            className={`p-3 rounded-lg border transition-all duration-200 ${active
                    ? "border-red-500 bg-red-950/20"
                    : "border-zinc-700 bg-zinc-950"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{title}</h4>
                    <p className="text-xs text-zinc-400">{description}</p>
                </div>
            </div>
        </div>
    );
}

function FlowBox({ label, active, completed, error }) {
    return (
        <div
            className={`flex-1 h-16 rounded-lg flex items-center justify-center border-2 text-xs font-medium transition-all duration-500 ${error
                    ? "border-red-500 bg-red-950/20 text-red-400 shadow-lg shadow-red-500/20"
                    : completed
                        ? "border-green-500 bg-green-950/20 text-green-400"
                        : active
                            ? "border-indigo-400 bg-indigo-950/20 text-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                            : "border-zinc-700 text-zinc-500 bg-zinc-950"
                }`}
        >
            {label}
        </div>
    );
}

function FlowArrow({ active, error }) {
    return (
        <span
            className={`text-xl transition-colors duration-500 ${error ? "text-red-500" : active ? "text-indigo-400" : "text-zinc-700"
                }`}
        >
            →
        </span>
    );
}

function BestPracticeCard({ title, description }) {
    return (
        <div className="bg-zinc-900/50 border border-indigo-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-indigo-300 mb-1">
                {title}
            </h4>
            <p className="text-xs text-zinc-400">{description}</p>
        </div>
    );
}

function getUserMessage(error, mode) {
    const msg = String(error?.message || "");

    if (mode === "network" || msg.includes("Failed to fetch")) {
        return "Cannot connect to the server. Please check your internet connection.";
    }
    if (mode === "http" || msg.startsWith("HTTP ")) {
        return "The server returned an error response. Please try again later.";
    }
    if (mode === "parsing") {
        return "The server sent data in an unexpected format. Please contact support.";
    }
    return "Something went wrong. Please try again.";
}

function getErrorType(error, mode) {
    if (mode === "network") return "Network Error";
    if (mode === "http") return "HTTP Error";
    if (mode === "parsing") return "Parsing Error";
    return "Unknown Error";
}

function getStatusText(status) {
    const statusTexts = {
        200: "OK",
        404: "Not Found",
        500: "Internal Server Error",
        401: "Unauthorized",
        403: "Forbidden",
    };
    return statusTexts[status] || "";
}
