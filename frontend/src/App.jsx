import PullRequestHeader from "./components/PullRequestHeader";
import RepositoryCard from "./components/RepositoryCard";
import StatsCards from "./components/StatsCards";
import TopBar from "./components/TopBar";
import Landing from "./pages/Landing";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [steps, setSteps] = useState([
    "⏳ Waiting to start review..."
    
  ]);

  const [showDashboard, setShowDashboard] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [mousePosition, setMousePosition] = useState({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  });

  const [glowPosition, setGlowPosition] = useState({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
});

  const [audit, setAudit] = useState([
    "No Violations"
  ]);
  const [prs, setPrs] = useState([]);
  const [selectedPR, setSelectedPR] = useState(null);
  const [currentPR, setCurrentPR] = useState(null);
  useEffect(() => {

  if (!selectedPR) return;

  fetch(`http://127.0.0.1:8000/prs/${selectedPR}`)
    .then(res => res.json())
    .then(data => {
      setCurrentPR(data);
    });

}, [selectedPR]);
  useEffect(() => {

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };

}, []);
useEffect(() => {

  let animationFrame;

  const animate = () => {

    setGlowPosition(prev => ({
      x: prev.x + (mousePosition.x - prev.x) * 0.12,
      y: prev.y + (mousePosition.y - prev.y) * 0.12,
    }));

    animationFrame = requestAnimationFrame(animate);

  };

  animate();

  return () => cancelAnimationFrame(animationFrame);

}, [mousePosition]);

useEffect(() => {

  fetch("http://127.0.0.1:8000/prs")
    .then(res => res.json())
    .then(data => {

      setPrs(data);

      if (data.length > 0) {
        setSelectedPR(data[0].id);
      }

    });

}, []);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const REVIEW_STEPS = [
  "📂 Reading Pull Request...",
  "📄 Downloading Changed Files...",
  "🛡 Capturing Execution Plan...",
  "🔐 Generating Intent Token...",
];

const reviewPR = async (prId) => {

  setStartTime(Date.now());
  setReviewSummary(null);
  console.log("Review button clicked");

  setStatus("Reviewing...");
  setProgress(0);
  setAudit([]);
  setSteps([]);

  for (let i = 0; i < REVIEW_STEPS.length; i++) {

    setSteps(prev => [...prev, REVIEW_STEPS[i]]);

    setProgress(((i + 1) / REVIEW_STEPS.length) * 100);

    await delay(300);

}
for (const file of currentPR.files) {

    setCurrentFile(file);

    setSteps(prev => [
        ...prev,
        `🔍 Scanning ${file}...`
    ]);

    await delay(400);

}
  setStatus("Checking...");
  setAudit([]);

  
  try {
    const response = await fetch("http://127.0.0.1:8000/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pr_id: prId
      })
    });

    console.log("HTTP Status:", response.status);

    const data = await response.json();

    console.log(data);

    if (data.status === "approved") {

      setSteps([
        "✅ Reading Pull Request",
        "✅ Downloading Changed Files",
        "✅ Execution Plan Captured",
        "✅ Intent Token Generated",
        "✅ No Prompt Injection Found",
        "✅ Review Completed"
      ]);

      setReviewSummary({
          files: currentPR.files.length,
          threats: 0,
          risk: "LOW",
          decision: "APPROVED",
          duration: ((Date.now() - startTime)/1000).toFixed(1)
      });
      setCurrentFile("");
      setProgress(100);
      setStatus("🟢 APPROVED");
      

      setAudit([
        "✅ Execution Plan Captured",
        "🔐 Intent Token Generated",
        "✅ review_code() executed",
        "✅ run_tests() executed",
        "🛡 ArmorIQ verified execution"
      ]);

    } else {

      setSteps([
        "✅ Reading Pull Request",
        "✅ Downloading Changed Files",
        "✅ Execution Plan Captured",
        "✅ Intent Token Generated",
        "🚨 Prompt Injection Detected",
        "🛑 Review Blocked"
      ]);

      
      setReviewSummary({
          files: currentPR.files.length,
          threats: 1,
          risk: "HIGH",
          decision: "BLOCKED",
          duration: ((Date.now() - startTime)/1000).toFixed(1)
      });
      setCurrentFile("");
      setProgress(100);
      setStatus("🛑 BLOCKED");

      setAudit([
        "✅ Execution Plan Captured",
        "🔐 Intent Token Generated",
        `🚨 Unauthorized Tool: ${data.attempted_tool}`,
        "❌ Tool not present in approved execution plan",
        "🛡 ArmorIQ blocked the invocation"
      ]);

    }

  } catch (err) {
    console.error(err);

    setStatus("❌ Backend Error");

    setAudit([
      "Could not connect to ArmorIQ backend.",
      "Check if FastAPI server is running."
    ]);
  }
};
if (!currentPR) {
  return <h2 style={{ color: "white" }}>Loading...</h2>;
}

if (!showDashboard) {
  return (
    <Landing
    isLeaving={isLeaving}
     onLaunch={() => {

    setIsLeaving(true);

    setTimeout(() => {

      setShowDashboard(true);

    }, 600);

  }}
    />
  );
}

  return (
  <>
    <div
      className="cursor-glow"
      style={{
        left: glowPosition.x,
        top: glowPosition.y,
      }}
    />
    
    <div className="app">

      <TopBar />

      <StatsCards prs={prs} />
      
      <RepositoryCard />

      <div className="layout">

        <div className="left">

          <PullRequestHeader currentPR={currentPR} />

          <div className="card">

            <h3>{currentPR.title}</h3>

            <p><b>Author:</b> {currentPR.author}</p>

            <div className="files">
              <h4>Files Changed</h4>

              <ul>
                  {currentPR.files.map((file) => (
                  <li key={file}>📄 {file}</li>
                  ))}
              </ul>
            </div>

          <div className="diff">

                {currentPR.diff.split("\n").map((line, index) => {

    const dangerous =
      line.includes("SYSTEM OVERRIDE") ||
      line.includes("Ignore previous") ||
      line.includes("rogue-crypt") ||
      line.includes("update_dependency_tree");

    const added = line.startsWith("+");

    return (
      <div
        key={index}
        className={
          dangerous
            ? "danger-line"
            : added
            ? "added-line"
            : "normal-line"
        }
      >
        {line || " "}
      </div>
    );

  })}

</div>

<select
  className="pr-select"
  value={selectedPR || ""}
  onChange={(e) => setSelectedPR(Number(e.target.value))}
>
  {prs.map((pr) => (
    <option key={pr.id} value={pr.id}>
      PR #{pr.id} - {pr.title}
    </option>
  ))}
</select>

<div className="buttons">
  <button onClick={() => reviewPR(selectedPR)}>
    Review PR
  </button>
</div>


          </div>

        </div>

        <div className="right">

          <div className="status">

    <h2>🤖 AI Review Pipeline</h2>
    <div className="progress-container">
    <div className="progress-bar"
          style={{ width: `${progress}%` }}>
    </div>
    {currentFile && (

    <div className="current-file">

        🔍 Currently scanning:

        <strong>{currentFile}</strong>

    </div>

)}
    </div>

<p className="progress-text">
  {Math.round(progress)}%
</p>

    <div className="timeline">

        {steps.map((step,index)=>(

            <div className="timeline-step" key={index}>

                {step}

            </div>

        ))}

    </div>

</div>

          <div className="audit">

  <h2>🛡 ArmorIQ Security Report</h2>

  <div className="security-card">

    <h4>Risk Level</h4>

    <p className={status.includes("BLOCKED") ? "risk-red" : "risk-green"}>
      {status.includes("BLOCKED") ? "🔴 HIGH" : "🟢 LOW"}
    </p>

  </div>

  <div className="security-card">

    <h4>Decision</h4>

    <p>{status}</p>

  </div>

  <div className="security-card">

    <h4>Audit Trail</h4>

    {audit.map((item,index)=>(
      <p key={index}>{item}</p>
    ))}

  </div>

</div>
{reviewSummary && (

<div className="summary-card">

<h2>📋 Review Summary</h2>

<p><strong>Files Scanned:</strong> {reviewSummary.files}</p>

<p><strong>Threats Found:</strong> {reviewSummary.threats}</p>

<p><strong>Risk:</strong> {reviewSummary.risk}</p>

<p><strong>Duration:</strong> {reviewSummary.duration}s</p>

<h3>{reviewSummary.decision}</h3>

</div>

)}

        </div>

      </div>

    </div>
    </>
  );

}
export default App;