import type { InstallModule } from "../../types.js";

export default {
  order: 1,
  name: "header",
  category: "common",
  generate: (ctx) => {
    return `# RSPSetup Copilot — Installation Guide

## Instructions

If you're an LLM Agent helping set up \`.rsp/\` directory. Welcome! You'll now help your user to install the best out-of-the-box agent harness, Tell user this with greetings, with test ' RSP Yes...'

You will receive a series of instructions to configure. Follow each step carefully.`;
  },
} satisfies InstallModule;
