import { Link } from 'react-router-dom';

export default function Guide() {
  return (
    <div className="guide-page">
      <header className="hero">
        <h1>Installation Guide</h1>
        <p className="subtitle">Step-by-step instructions to initialize your workspace</p>
      </header>
      
      <main>
        <section className="checklist">
          <h2>Installation Checklist</h2>
          <ul className="todo-list">
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Download the latest release asset (installation.md)</label></li>
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Open your project in VS Code or Cursor</label></li>
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Open the GitHub Copilot / Agent Chat panel</label></li>
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Copy the entire contents of installation.md</label></li>
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Paste into chat and press enter</label></li>
            <li><label><input type="checkbox" disabled /> <strong>TODO:</strong> Accept file creations and symlink operations</label></li>
          </ul>
        </section>
        
        <section className="usage">
          <h2>Usage Examples</h2>
          <p>Once you have your installation.md, use it like this:</p>
          <div className="code-block">
            <pre><code>{`# TODO: Add real installation commands
# e.g., showing the prompt "Please run the setup steps in this markdown file:"
# followed by the pasted markdown content.
`}</code></pre>
          </div>
          
          <div className="code-block">
            <pre><code>{`# TODO: Show what happens when a team member runs the sync command
$ pnpm dlx @rsp/setup-copilot sync
`}</code></pre>
          </div>
          
          <div className="code-block">
            <pre><code>{`# TODO: Show how to extend the base configuration
$ pnpm dlx @rsp/setup-copilot add skill "playwright"
`}</code></pre>
          </div>
        </section>
        
        <section className="configuration">
          <h2>Configuration</h2>
          <article className="config-item">
            <h3>Custom Skills</h3>
            <p>TODO: Explain how to add or override custom skills in the .rsp/skills/ directory.</p>
          </article>
          <article className="config-item">
            <h3>Hook Configuration</h3>
            <p>TODO: Explain the process for hooking into pre-commit and post-merge lifecycle events.</p>
          </article>
          <article className="config-item">
            <h3>MCP Server Settings</h3>
            <p>TODO: Detail how to configure your MCP environment variables and endpoints.</p>
          </article>
        </section>
        
        <section className="faq">
          <h2>Frequently Asked Questions</h2>
          <dl className="qa-list">
            <div className="qa-item">
              <dt>Q: What is the .rsp/ directory?</dt>
              <dd>A: TODO: Explain that .rsp/ is the single source of truth for the workspace.</dd>
            </div>
            <div className="qa-item">
              <dt>Q: Why use symlinks to .github/?</dt>
              <dd>A: TODO: Explain how symlinks help keep platform-agnostic config separated from GitHub specifics.</dd>
            </div>
            <div className="qa-item">
              <dt>Q: Does this work on Windows?</dt>
              <dd>A: TODO: Detail the Windows support (elevation, developer mode, junction types).</dd>
            </div>
            <div className="qa-item">
              <dt>Q: Can I override default templates?</dt>
              <dd>A: TODO: Provide instructions on providing custom template overrides.</dd>
            </div>
            <div className="qa-item">
              <dt>Q: How do I update an existing project?</dt>
              <dd>A: TODO: Describe the sync command and update process.</dd>
            </div>
          </dl>
        </section>
        
        <section className="cta">
          <Link to="/" className="btn-secondary">← Back to Home</Link>
        </section>
      </main>
    </div>
  );
}
