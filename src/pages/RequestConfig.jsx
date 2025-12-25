import { useState } from "react";

export default function RequestConfig() {
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [responseStatus, setResponseStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("GET");
    const [configDetails, setConfigDetails] = useState({
        method: null,
        headers: null,
        body: null
    });

    const addLog = (msg, type = "info") => {
        setLogs(prev => [...prev, { msg, type, timestamp: Date.now() }]);
    };

    const reset = () => {
        setStep(0);
        setStatus("idle");
        setResponseStatus(null);
        setLogs([]);
        setConfigDetails({ method: null, headers: null, body: null });
    };

    async function runConfiguredFetch() {
        reset();
        setStatus("loading");

        addLog("Initializing fetch request configuration...", "info");

        setTimeout(() => {
            setStep(1);
            addLog("Browser preparing fetch() call", "info");
        }, 500);

        try {
            setTimeout(() => {
                setStep(2);
                setConfigDetails(prev => ({ ...prev, method: selectedMethod }));
                addLog(`Setting HTTP method: ${selectedMethod}`, "info");
            }, 1200);

            setTimeout(() => {
                setStep(3);
                setConfigDetails(prev => ({
                    ...prev,
                    headers: {
                        "Content-Type": "application/json",
                        "x-demo-client": "build-it-api-fetching"
                    }
                }));
                addLog("Attaching request headers", "info");
                addLog("Header: Content-Type: application/json", "success");
                addLog("Header: x-demo-client: build-it-api-fetching", "success");
            }, 2200);

            setTimeout(() => {
                setStep(4);
                if (selectedMethod !== "GET") {
                    setConfigDetails(prev => ({
                        ...prev,
                        body: { demo: true, timestamp: Date.now() }
                    }));
                    addLog("Preparing request body (JSON)", "info");
                } else {
                    addLog("No body needed for GET request", "info");
                }
            }, 3200);

            setTimeout(() => {
                setStep(5);
                addLog("Sending HTTP request to API...", "info");
            }, 4000);

            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search",
                {
                    method: selectedMethod,
                    headers: {
                        "Content-Type": "application/json",
                        "x-demo-client": "build-it-api-fetching",
                    },
                }
            );

            setTimeout(() => {
                setStep(6);
                addLog("API processing request...", "info");
            }, 4500);

            setResponseStatus(response.status);
            addLog(`Response received with status: ${response.status}`, "success");

            if (!response.ok) {
                throw new Error("Request failed");
            }

            setTimeout(() => {
                setStep(7);
                addLog("Parsing HTTP response...", "info");
            }, 5000);

            await response.json();
            addLog("Response data parsed successfully", "success");

            setTimeout(() => {
                setStatus("success");
                addLog("Request completed successfully", "success");
            }, 5500);

        } catch (error) {
            setStatus("error");
            addLog(`Request failed: ${error.message}`, "error");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="mb-10 text-center">
                    <h2 className="text-5xl font-bold mb-3">
                        Configuring a <span className="text-indigo-400">fetch()</span> request
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                        The second argument to <code className="bg-zinc-800 px-2 py-1 rounded">fetch()</code> controls
                        HTTP method, headers, and body. Learn how these options shape your requests.
                    </p>
                </div>

                {/* Method Selector */}
                <div className="mb-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-center">Select HTTP Method</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {["GET", "POST", "PUT", "PATCH", "DELETE"].map(method => (
                            <MethodButton
                                key={method}
                                method={method}
                                active={selectedMethod === method}
                                onClick={() => setSelectedMethod(method)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Code Example */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Request Configuration</h3>
                            <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">
                                Method: {selectedMethod}
                            </span>
                        </div>

                        <pre className="bg-black rounded-lg p-5 text-sm text-zinc-200 overflow-auto border border-zinc-800 leading-relaxed mb-4">
                            {`async function fetchConfigured() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search",
    {
      method: "${selectedMethod}",
      headers: {
        "Content-Type": "application/json",
        "x-demo-client": "build-it-api-fetching"
      }${selectedMethod !== "GET" ? `,
      body: JSON.stringify({
        demo: true,
        timestamp: Date.now()
      })` : ""}
    }
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  return data;
}`}
                        </pre>

                        {/* Configuration Details */}
                        <div className="space-y-4">
                            <ConfigSection
                                title="Method"
                                icon="M"
                                active={configDetails.method !== null}
                            >
                                <p className="text-sm text-zinc-300">
                                    <strong className="text-indigo-400">{selectedMethod}</strong> -
                                    {selectedMethod === "GET" && " Retrieve data from server"}
                                    {selectedMethod === "POST" && " Create new resource"}
                                    {selectedMethod === "PUT" && " Replace entire resource"}
                                    {selectedMethod === "PATCH" && " Update part of resource"}
                                    {selectedMethod === "DELETE" && " Remove resource"}
                                </p>
                            </ConfigSection>

                            <ConfigSection
                                title="Headers"
                                icon="H"
                                active={configDetails.headers !== null}
                            >
                                {configDetails.headers ? (
                                    <div className="space-y-1 text-xs">
                                        {Object.entries(configDetails.headers).map(([key, value]) => (
                                            <div key={key} className="bg-zinc-950 p-2 rounded border border-zinc-800">
                                                <span className="text-indigo-400 font-mono">{key}:</span>
                                                <span className="text-zinc-300 ml-2">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">Headers will appear here during execution</p>
                                )}
                            </ConfigSection>

                            <ConfigSection
                                title="Body"
                                icon="B"
                                active={configDetails.body !== null}
                            >
                                {selectedMethod !== "GET" ? (
                                    configDetails.body ? (
                                        <pre className="text-xs bg-zinc-950 p-3 rounded border border-zinc-800 text-zinc-300">
                                            {JSON.stringify(configDetails.body, null, 2)}
                                        </pre>
                                    ) : (
                                        <p className="text-sm text-zinc-500">Body will be added during execution</p>
                                    )
                                ) : (
                                    <p className="text-sm text-zinc-500">GET requests do not include a body</p>
                                )}
                            </ConfigSection>
                        </div>
                    </div>

                    {/* Visual Flow */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-6">Configuration Flow</h3>

                        <div className="space-y-6">
                            {/* Building Config */}
                            <div>
                                <p className="text-sm text-zinc-400 mb-3">Step 1: Building Configuration</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FlowBox
                                            label="Browser"
                                            active={step >= 1}
                                            completed={step > 1}
                                        />
                                        <FlowArrow active={step >= 1} />
                                        <FlowBox
                                            label="Method"
                                            active={step >= 2}
                                            completed={step > 2}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FlowBox
                                            label="Headers"
                                            active={step >= 3}
                                            completed={step > 3}
                                        />
                                        <FlowArrow active={step >= 3} />
                                        <FlowBox
                                            label="Body"
                                            active={step >= 4}
                                            completed={step > 4}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Request/Response */}
                            <div>
                                <p className="text-sm text-zinc-400 mb-3">Step 2: Request/Response Cycle</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FlowBox
                                            label="HTTP Request"
                                            active={step >= 5}
                                            completed={step > 5}
                                        />
                                        <FlowArrow active={step >= 5} />
                                        <FlowBox
                                            label="API Server"
                                            active={step >= 6}
                                            completed={step > 6}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FlowBox
                                            label="HTTP Response"
                                            active={step >= 7}
                                            completed={step >= 7}
                                        />
                                        <FlowArrow active={step >= 7} />
                                        <FlowBox
                                            label="Parse Data"
                                            active={step >= 7}
                                            completed={step >= 7}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Step Info */}
                        <div className="mt-6 bg-black rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-2">Current Step:</p>
                            <p className="text-base font-semibold">
                                {step === 0 && "Idle - Ready to start"}
                                {step === 1 && "Browser preparing fetch() call"}
                                {step === 2 && "Setting HTTP method"}
                                {step === 3 && "Attaching request headers"}
                                {step === 4 && "Preparing request body"}
                                {step === 5 && "Sending HTTP request"}
                                {step === 6 && "API processing request"}
                                {step === 7 && "Receiving and parsing response"}
                            </p>

                            <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(step / 7) * 100}%` }}
                                />
                            </div>

                            {responseStatus && (
                                <div className="mt-3 text-sm">
                                    <span className="text-zinc-400">Response Status: </span>
                                    <span className={`font-semibold ${responseStatus >= 200 && responseStatus < 300 ? "text-green-400" :
                                            responseStatus >= 400 && responseStatus < 500 ? "text-yellow-400" :
                                                "text-red-400"
                                        }`}>
                                        {responseStatus}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls and Logs */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    {/* Controls */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
                        <h3 className="font-semibold text-lg mb-4">Run Simulation</h3>

                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={runConfiguredFetch}
                                disabled={status === "loading"}
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100"
                            >
                                {status === "loading" ? "Running..." : `Run ${selectedMethod} Request`}
                            </button>
                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all duration-200"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Status Display */}
                        <div className="bg-black rounded-lg p-4 border border-zinc-800">
                            {status === "idle" && (
                                <div className="text-center text-zinc-500 py-4">
                                    <div className="w-12 h-12 mx-auto mb-3 border-2 border-zinc-700 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">?</span>
                                    </div>
                                    <p>Select a method and click "Run" to start</p>
                                </div>
                            )}
                            {status === "loading" && (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-yellow-400 font-medium">Sending configured request...</p>
                                </div>
                            )}
                            {status === "success" && (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-2xl text-green-400">✓</span>
                                    </div>
                                    <p className="text-green-400 font-medium">Request completed successfully</p>
                                </div>
                            )}
                            {status === "error" && (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-2xl text-red-400">✕</span>
                                    </div>
                                    <p className="text-red-400 font-medium">Request failed</p>
                                </div>
                            )}
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

                        <div className="bg-black rounded-lg p-4 border border-zinc-800 h-72 overflow-y-auto font-mono text-xs space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 text-center mt-28">
                                    Click "Run" to see execution logs
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

                {/* Reference Documentation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <ReferenceCard
                        title="HTTP Methods"
                        items={[
                            { label: "GET", desc: "Retrieve data (default)" },
                            { label: "POST", desc: "Create new resource" },
                            { label: "PUT", desc: "Replace entire resource" },
                            { label: "PATCH", desc: "Partial update" },
                            { label: "DELETE", desc: "Remove resource" }
                        ]}
                    />
                    <ReferenceCard
                        title="Common Headers"
                        items={[
                            { label: "Content-Type", desc: "Format of body data" },
                            { label: "Authorization", desc: "Authentication token" },
                            { label: "Accept", desc: "Expected response format" },
                            { label: "User-Agent", desc: "Client information" }
                        ]}
                    />
                    <ReferenceCard
                        title="Body Formats"
                        items={[
                            { label: "JSON", desc: "JSON.stringify(object)" },
                            { label: "FormData", desc: "File uploads, forms" },
                            { label: "URLSearchParams", desc: "URL encoded data" },
                            { label: "Blob", desc: "Binary data, files" }
                        ]}
                    />
                </div>

                {/* Key Points */}
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-6 border border-indigo-800/30 shadow-2xl">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-300">Key Configuration Points</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KeyPoint
                            title="Method Required"
                            description="Always specify the HTTP method. Defaults to GET if omitted."
                        />
                        <KeyPoint
                            title="Headers Optional"
                            description="Add headers for authentication, content type, or custom metadata."
                        />
                        <KeyPoint
                            title="Body for Mutations"
                            description="Only POST, PUT, PATCH need body. Must stringify JSON objects."
                        />
                        <KeyPoint
                            title="Check response.ok"
                            description="Always validate the response status before parsing data."
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

function MethodButton({ method, active, onClick }) {
    const colors = {
        GET: "from-blue-600 to-blue-700",
        POST: "from-green-600 to-green-700",
        PUT: "from-yellow-600 to-yellow-700",
        PATCH: "from-orange-600 to-orange-700",
        DELETE: "from-red-600 to-red-700"
    };

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${active
                    ? `bg-gradient-to-br ${colors[method]} border-transparent shadow-lg scale-105`
                    : "border-zinc-700 bg-zinc-950 hover:border-zinc-600"
                }`}
        >
            <div className="font-bold text-lg mb-1">{method}</div>
            <div className="text-xs text-zinc-400">
                {method === "GET" && "Read"}
                {method === "POST" && "Create"}
                {method === "PUT" && "Replace"}
                {method === "PATCH" && "Update"}
                {method === "DELETE" && "Remove"}
            </div>
        </button>
    );
}

function ConfigSection({ title, icon, active, children }) {
    return (
        <div className={`border rounded-lg p-4 transition-all duration-300 ${active
                ? "border-indigo-500 bg-indigo-950/20"
                : "border-zinc-700 bg-zinc-950"
            }`}>
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${active ? "bg-indigo-600" : "bg-zinc-700"
                    }`}>
                    {icon}
                </div>
                <h4 className="font-semibold text-sm">{title}</h4>
            </div>
            {children}
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

function ReferenceCard({ title, items }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
            <h4 className="font-semibold text-sm mb-4 text-indigo-300">{title}</h4>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded p-2">
                        <div className="font-mono text-xs text-indigo-400 mb-1">{item.label}</div>
                        <div className="text-xs text-zinc-400">{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KeyPoint({ title, description }) {
    return (
        <div className="bg-zinc-900/50 border border-indigo-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-indigo-300 mb-2">{title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        </div>
    );
}