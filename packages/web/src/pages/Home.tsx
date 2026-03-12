import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>RSP Setup Copilot</h1>
        <p className="subtitle">Unified AI Configuration Generator for Company-Wide Projects</p>
      </header>
      
      <main>
        <section className="description">
          <h2>What is RSP Setup Copilot?</h2>
          <p>TODO: Explain that RSP Setup Copilot is a tool that generates an installation.md file.</p>
          <p>TODO: Describe the workflow: pasting into GitHub Copilot agent chat to automate workspace configuration.</p>
        </section>
        
        <section className="quick-start">
          <h2>Quick Start</h2>
          <ol className="steps">
            <li><strong>TODO:</strong> Download installation.md from the latest releases.</li>
            <li><strong>TODO:</strong> Open GitHub Copilot agent chat in your IDE.</li>
            <li><strong>TODO:</strong> Paste the contents of installation.md.</li>
            <li><strong>TODO:</strong> Let the agent automatically configure your .rsp/ directory and symlinks.</li>
            <li><strong>TODO:</strong> Start developing with your new skills and hooks!</li>
          </ol>
        </section>
        
        <section className="features">
          <h2>Feature Highlights</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Modular Architecture</h3>
              <p>TODO: Detail how the generator supports modular skill and hook inclusions.</p>
            </article>
            <article className="feature-card">
              <h3>Cross-Platform Symlinks</h3>
              <p>TODO: Detail the robust symlinking strategy for Windows/macOS/Linux.</p>
            </article>
            <article className="feature-card">
              <h3>One-Click Setup</h3>
              <p>TODO: Detail the zero-friction onboarding via Copilot agent chat.</p>
            </article>
            <article className="feature-card">
              <h3>Customizable Rules</h3>
              <p>TODO: Detail how teams can enforce custom cursorrules and workspace settings.</p>
            </article>
          </div>
        </section>
        
        <section className="cta">
          <Link to="/guide" className="btn-primary">View Installation Guide →</Link>
        </section>
      </main>
    </div>
  );
}
