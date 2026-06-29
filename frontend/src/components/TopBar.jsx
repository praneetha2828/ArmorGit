function TopBar() {
  return (
    <div className="topbar">

      <div>

        <h1>🛡 ArmorGit</h1>

        <p className="subtitle">
          AI-Powered Secure Pull Request Review
        </p>

      </div>

      <div className="github-status">

        <span className="green-dot"></span>

        Connected to GitHub

      </div>

    </div>
  );
}

export default TopBar;