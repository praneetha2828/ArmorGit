import { useState, useEffect } from "react";
function Landing({ onLaunch, isLeaving }) {
  const [title, setTitle] = useState("");
  useEffect(() => {

    const text = "ArmorGit";

    let index = 0;

    const interval = setInterval(() => {

        setTitle(text.slice(0, index + 1));

        index++;

        if (index === text.length) {
            clearInterval(interval);
        }

    }, 120);

    return () => clearInterval(interval);

  }, []);
  return (
    <div className="landing">

      <div className={`hero ${isLeaving ? "fade-out" : "fade-in"}`}>

        <div className="shield">

          🛡

        </div>

        <h1>{title}</h1>

        <p>
          AI-Powered Secure Pull Request Review
        </p>

        <button onClick={onLaunch}>
          Launch Dashboard →
        </button>

      </div>

    </div>
  );
}

export default Landing;