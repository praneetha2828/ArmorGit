function PullRequestHeader({ currentPR }) {
  return (

    <div className="pr-header">

      <div>

        <h2>📌 Pull Request #{currentPR.id}</h2>

        <span className="branch">
          🌿 main → main
        </span>

      </div>

      <div
        className={
          currentPR.diff.includes("SYSTEM OVERRIDE")
            ? "risk high"
            : "risk low"
        }
      >
        {currentPR.diff.includes("SYSTEM OVERRIDE")
          ? "🔴 HIGH RISK"
          : "🟢 LOW RISK"}
      </div>

    </div>

  );
}

export default PullRequestHeader;