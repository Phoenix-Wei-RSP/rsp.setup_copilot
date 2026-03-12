export default {
    order: 1,
    name: 'header',
    category: 'common',
    generate: (ctx) => {
        const date = new Date().toISOString().split('T')[0];
        return `# RSP Setup Copilot — Installation Guide

**Version**: ${ctx.version}  
**Generated**: ${date}  
**Repository**: ${ctx.repoUrl}  
**Documentation**: ${ctx.webUrl}

## Instructions

Copy the entire content below and paste it into your GitHub Copilot agent chat. The agent will automatically configure the \`.rsp/\` directory in your project and create symlinks to \`.github/\`.

---

**Agent Instructions Begin Here:**

You will receive a series of instructions to configure the \`.rsp/\` directory structure and create symlinks to \`.github/\`. Follow each step carefully.`;
    }
};
