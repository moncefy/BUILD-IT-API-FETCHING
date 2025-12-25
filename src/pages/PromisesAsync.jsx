import { useState } from "react";

export default function PromisesAsync() {
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState("await");
    const [status, setStatus] = useState("idle");
    const [imageUrl, setImageUrl] = useState(null);
    const [logs, setLogs] = useState([]);
    const [executionTime, setExecutionTime] = useState(null);

    const addLog = (msg, type = "info") => {
        setLogs(prev => [...prev, { msg, type, timestamp: Date.now() }]);
    };

    const reset = () => {
        setStep(0);
        setStatus("idle");
        setImageUrl(null);
        setLogs([]);
        setExecutionTime(null);
    };

    async function runFlow(selectedMode) {
        reset();
        setMode(selectedMode);
        setStatus("loading");

        const startTime = Date.now();
        addLog(`Starting ${selectedMode === "then" ? ".then() chain" : "async/await"} pattern...`, "info");

        try {
            setTimeout(() => {
                setStep(1);
                addLog("Browser initiating fetch request", "info");
            }, 500);

            setTimeout(() => {
                setStep(2);
                addLog("Waiting for API response...", "info");
            }, 1200);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search"
            );

            addLog(`Response received with status: ${response.status}`, "success");

            if (!response.ok) {
                throw new Error("Request failed");
            }

            setTimeout(() => {
                setStep(3);
                if (selectedMode === "then") {
                    addLog("Executing .then() chain callbacks", "info");
                } else {
                    addLog("Executing await statement for JSON parsing", "info");
                }
            }, 2200);

            const data = await response.json();
            addLog("JSON data parsed successfully", "success");

            setTimeout(() => {
                setStep(4);
                setImageUrl(data[0].url);
                setStatus("success");
                const endTime = Date.now();
                setExecutionTime(endTime - startTime);
                addLog("UI updated with image", "success");
                addLog(`Total execution time: ${endTime - startTime}ms`, "info");
            }, 3200);

        } catch (error) {
            setStatus("error");
            addLog(`Error caught: ${error.message}`, "error");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="mb-10 text-center">
                    <h2 className="text-5xl font-bold mb-3">
                        Two ways to handle <span className="text-indigo-400">Promises</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                        Compare classic <code className="bg-zinc-800 px-2 py-1 rounded">.then()</code> chains
                        with modern <code className="bg-zinc-800 px-2 py-1 rounded">async/await</code> syntax.
                        Same functionality, different approaches.
                    </p>
                </div>

                {/* Pattern Selector */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex rounded-xl border-2 border-zinc-700 p-1 bg-zinc-900">
                        <button
                            onClick={() => setMode("then")}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === "then"
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            .then() Chain
                        </button>
                        <button
                            onClick={() => setMode("await")}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === "await"
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            async/await
                        </button>
                    </div>
                </div>

                {/* Code Comparison */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* .then() Code */}
                    <div className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all duration-300 shadow-2xl ${mode === "then"
                            ? "border-purple-500 shadow-purple-500/20"
                            : "border-zinc-800"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Promise Chain (.then)</h3>
                            <span className="text-xs bg-purple-600 px-3 py-1 rounded-full">Classic</span>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Style</div>
                                <div className="text-sm font-bold text-purple-400">Chaining</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Readability</div>
                                <div className="text-sm font-bold text-purple-400">Good</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Error Handling</div>
                                <div className="text-sm font-bold text-purple-400">.catch()</div>
                            </div>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
                            {`function fetchCatWithThen() {
  return fetch(
    "https://api.thecatapi.com/v1/images/search"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed");
      }
      return response.json();
    })
    .then((data) => {
      const url = data[0].url;
      console.log("Cat image:", url);
      return url;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}`}
                        </pre>

                        <div className="mt-4 space-y-2">
                            <CharacteristicBadge
                                icon="•"
                                text="Explicit promise chaining"
                                color="purple"
                            />
                            <CharacteristicBadge
                                icon="•"
                                text="Each .then() returns a new Promise"
                                color="purple"
                            />
                            <CharacteristicBadge
                                icon="•"
                                text="Good for simple sequential operations"
                                color="purple"
                            />
                            <CharacteristicBadge
                                icon="•"
                                text="Separate .catch() for error handling"
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* async/await Code */}
                    <div className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all duration-300 shadow-2xl ${mode === "await"
                            ? "border-indigo-500 shadow-indigo-500/20"
                            : "border-zinc-800"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Async/Await</h3>
                            <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">Modern</span>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Style</div>
                                <div className="text-sm font-bold text-indigo-400">Sequential</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Readability</div>
                                <div className="text-sm font-bold text-indigo-400">Excellent</div>
                            </div>
                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800">
                                <div className="text-zinc-400">Error Handling</div>
                                <div className="text-sm font-bold text-indigo-400">try/catch</div>
                            </div>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed">
                            {`async function fetchCatWithAwait() {
  try {
    const response = await fetch(
      "https://api.thecatapi.com/v1/images/search"
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const url = data[0].url;
    console.log("Cat image:", url);
    return url;
    
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}`}
                        </pre>

                        <div className="mt-4 space-y-2">
                            <CharacteristicBadge
                                icon="✓"
                                text="Reads like synchronous code"
                                color="indigo"
                            />
                            <CharacteristicBadge
                                icon="✓"
                                text="await pauses until Promise resolves"
                                color="indigo"
                            />
                            <CharacteristicBadge
                                icon="✓"
                                text="Easier to debug with breakpoints"
                                color="indigo"
                            />
                            <CharacteristicBadge
                                icon="✓"
                                text="Unified try/catch error handling"
                                color="indigo"
                            />
                        </div>
                    </div>
                </div>

                {/* Visual Flow Comparison */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* .then() Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">.then() Chain Flow</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label="fetch()"
                                    active={mode === "then" && step >= 1}
                                    completed={mode === "then" && step > 1}
                                />
                                <FlowArrow active={mode === "then" && step >= 1} />
                                <FlowBox
                                    label="Promise"
                                    active={mode === "then" && step >= 2}
                                    completed={mode === "then" && step > 2}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label=".then()"
                                    active={mode === "then" && step >= 3}
                                    completed={mode === "then" && step > 3}
                                />
                                <FlowArrow active={mode === "then" && step >= 3} />
                                <FlowBox
                                    label="response.json()"
                                    active={mode === "then" && step >= 3}
                                    completed={mode === "then" && step > 3}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label=".then()"
                                    active={mode === "then" && step >= 3}
                                    completed={mode === "then" && step > 3}
                                />
                                <FlowArrow active={mode === "then" && step >= 4} />
                                <FlowBox
                                    label="process data"
                                    active={mode === "then" && step >= 4}
                                    completed={mode === "then" && step >= 4}
                                />
                            </div>
                        </div>

                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Execution Model:</p>
                            <ul className="text-xs text-zinc-300 space-y-1">
                                <li>• Returns Promise immediately</li>
                                <li>• Each .then() creates new Promise</li>
                                <li>• Callbacks execute when resolved</li>
                                <li>• .catch() handles all errors in chain</li>
                            </ul>
                        </div>
                    </div>

                    {/* async/await Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">async/await Flow</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label="await fetch()"
                                    active={mode === "await" && step >= 1}
                                    completed={mode === "await" && step > 1}
                                />
                                <FlowArrow active={mode === "await" && step >= 1} />
                                <FlowBox
                                    label="pause here"
                                    active={mode === "await" && step >= 2}
                                    completed={mode === "await" && step > 2}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label="response ready"
                                    active={mode === "await" && step >= 2}
                                    completed={mode === "await" && step > 2}
                                />
                                <FlowArrow active={mode === "await" && step >= 2} />
                                <FlowBox
                                    label="check .ok"
                                    active={mode === "await" && step >= 2}
                                    completed={mode === "await" && step > 2}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FlowBox
                                    label="await .json()"
                                    active={mode === "await" && step >= 3}
                                    completed={mode === "await" && step > 3}
                                />
                                <FlowArrow active={mode === "await" && step >= 4} />
                                <FlowBox
                                    label="data ready"
                                    active={mode === "await" && step >= 4}
                                    completed={mode === "await" && step >= 4}
                                />
                            </div>
                        </div>

                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Execution Model:</p>
                            <ul className="text-xs text-zinc-300 space-y-1">
                                <li>• Execution pauses at each await</li>
                                <li>• Resumes when Promise resolves</li>
                                <li>• Linear, top-to-bottom reading</li>
                                <li>• try/catch wraps entire block</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Controls and Status */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Controls */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4">Run Simulation</h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 mb-4">
                            <p className="text-sm mb-2">
                                <span className="text-zinc-400">Current Step:</span>
                            </p>
                            <p className="text-base font-semibold">
                                {step === 0 && "Idle - Ready to start"}
                                {step === 1 && "Sending HTTP request"}
                                {step === 2 && "Waiting for API response"}
                                {step === 3 && (mode === "then"
                                    ? "Executing .then() chain callbacks"
                                    : "Executing await statements")}
                                {step === 4 && "Updating UI with fetched data"}
                            </p>

                            <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                />
                            </div>

                            {executionTime && (
                                <div className="mt-3 text-xs text-zinc-400">
                                    Execution completed in <span className="text-green-400 font-semibold">{executionTime}ms</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => runFlow(mode)}
                                disabled={status === "loading"}
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100"
                            >
                                {status === "loading" ? "Running..." : `Run ${mode === "then" ? ".then()" : "async/await"}`}
                            </button>
                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Console Logs */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <span>Console Logs</span>
                            {logs.length > 0 && (
                                <span className="text-xs bg-zinc-700 px-2 py-1 rounded">{logs.length}</span>
                            )}
                        </h3>

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-64 overflow-y-auto font-mono text-xs space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 text-center mt-24">
                                    Select a pattern and click "Run" to see execution logs
                                </p>
                            ) : (
                                logs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded animate-fade-in ${log.type === "error" ? "bg-red-950/30 text-red-400 border-l-2 border-red-500" :
                                                log.type === "success" ? "bg-green-950/30 text-green-400 border-l-2 border-green-500" :
                                                    "bg-zinc-800 text-zinc-300"
                                            }`}
                                    >
                                        {log.msg}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl mb-6">
                    <h3 className="font-semibold text-lg mb-4">Result</h3>

                    <div className="bg-black rounded-lg p-6 border border-zinc-800 min-h-80 flex items-center justify-center">
                        {status === "idle" && (
                            <div className="text-center text-zinc-500">
                                <div className="w-20 h-20 mx-auto mb-4 border-4 border-zinc-700 rounded-full flex items-center justify-center text-3xl">
                                    ?
                                </div>
                                <p className="text-lg">Select a pattern above and click "Run" to fetch data</p>
                            </div>
                        )}

                        {status === "loading" && (
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-yellow-400 font-medium text-lg">
                                    Fetching data using {mode === "then" ? ".then() chain" : "async/await"}...
                                </p>
                            </div>
                        )}

                        {status === "success" && imageUrl && (
                            <div className="text-center w-full animate-fade-in">
                                <img
                                    src={imageUrl}
                                    alt="Random cat"
                                    className="mx-auto rounded-lg max-h-96 object-cover shadow-lg mb-4"
                                />
                                <div className="bg-green-950/30 border border-green-800 rounded-lg p-4 inline-block">
                                    <p className="text-green-400 font-medium">
                                        Data successfully fetched using {mode === "then" ? ".then() chain" : "async/await"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 border-4 border-red-500 rounded-full flex items-center justify-center text-3xl text-red-500">
                                    ✕
                                </div>
                                <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                                    <p className="text-red-400 font-medium text-lg">Request failed</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-6 border border-indigo-800/30 shadow-2xl mb-6">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-300">When to Use Each Pattern</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ComparisonCard
                            title="Use .then() when:"
                            items={[
                                "Working with legacy code or libraries",
                                "Simple, short promise chains",
                                "You prefer functional programming style",
                                "Need explicit promise handling"
                            ]}
                            color="purple"
                        />
                        <ComparisonCard
                            title="Use async/await when:"
                            items={[
                                "Complex logic with multiple async operations",
                                "Better readability is important",
                                "Easier debugging with breakpoints needed",
                                "Modern codebases (recommended)"
                            ]}
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Key Insight */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-400">Key Insight</h3>
                    <p className="text-zinc-300">
                        Both patterns rely on the <strong>same underlying Promise mechanism</strong>.
                        The difference is purely syntactical - <code className="bg-zinc-800 px-2 py-1 rounded">async/await</code> is
                        syntactic sugar that makes Promise-based code look and behave more like synchronous code,
                        while <code className="bg-zinc-800 px-2 py-1 rounded">.then()</code> makes the asynchronous
                        nature more explicit through chaining.
                    </p>
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

function FlowBox({ label, active, completed }) {
    return (
        <div
            className={`flex-1 h-14 rounded-lg flex items-center justify-center border-2 text-xs font-medium transition-all duration-500 ${completed
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

function FlowArrow({ active }) {
    return (
        <span className={`text-lg transition-colors duration-500 ${active ? "text-indigo-400" : "text-zinc-700"
            }`}>
            →
        </span>
    );
}

function CharacteristicBadge({ icon, text, color }) {
    const colorClasses = {
        purple: "text-purple-400 bg-purple-950/20 border-purple-800/30",
        indigo: "text-indigo-400 bg-indigo-950/20 border-indigo-800/30"
    };

    return (
        <div className={`flex items-center gap-2 text-xs border rounded px-3 py-2 ${colorClasses[color]}`}>
            <span className="font-bold">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function ComparisonCard({ title, items, color }) {
    const colorClasses = {
        purple: "border-purple-800/30",
        indigo: "border-indigo-800/30"
    };

    return (
        <div className={`bg-zinc-900/50 border rounded-lg p-4 ${colorClasses[color]}`}>
            <h4 className="font-semibold text-sm mb-3 text-white">{title}</h4>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}