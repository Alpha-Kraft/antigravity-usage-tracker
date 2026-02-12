# Local Tracking Capabilities

The Antigravity Usage Tracker is designed to operate entirely locally, respecting user privacy. While its primary focus is Quota and Cache monitoring, the architecture can be extended to track other local development metrics using standard VS Code APIs and Node.js system modules.

## Feasible Local Metrics

### 1. Editor Activity
**Source:** `vscode.workspace` and `vscode.window` APIs
- **File Edits:** Track lines of code added/removed per session using `onDidChangeTextDocument`.
- **Active Time:** Monitor `onDidChangeWindowState` and `onDidChangeActiveTextEditor` to calculate "in-zone" coding time.
- **Language Usage:** Aggregate file extensions opened to show language breakdown charts (e.g., "70% TypeScript, 20% CSS").

### 2. Terminal Usage
**Source:** `vscode.window.onDidWriteTerminalData`
- **Command Frequency:** Parse terminal output stream (locally) to count common commands (e.g., `git status`, `npm test`).
- **Error Detection:** Detect common error patterns in terminal output (e.g., "build failed") to suggest troubleshooting steps.

### 3. Git Activity
**Source:** VS Code Git Extension API (`vscode.extensions.getExtension('vscode.git')`)
- **Commit Velocity:** Track local commits per hour/day.
- **Branch Complexity:** Visualize local branch structure and merge frequency.
- **Staging Habits:** Monitor how often files are staged vs. committed.

### 4. System Resources
**Source:** Node.js `os` module or `pidusage` package
- **Extension CPU/RAM:** Monitor the resource footprint of the Antigravity extension itself.
- **Agent Process:** Track the memory usage of the underlying Language Server process (`pid` is already known by `ProcessFinder`).

### 5. Local Error Logs
**Source:** Log files in `~/.gemini/antigravity/logs`
- **Error Parsing:** Read local log files to summarize error rates and types (already partially implemented in Diagnostics).
- **Crash Reporting:** Detect if the Agent process restarts frequently.

## Implementation Guidelines

To implement these features while maintaining the "Local Only" promise:
1.  **Storage:** Store all metrics in `globalState` (Memento) or local JSON files (e.g., `~/.gemini/antigravity/metrics.json`).
2.  **No Telemetry:** Ensure no data is sent to any external endpoint.
3.  **Visualization:** Use the existing WebView architecture (e.g., `UsageChart`) to visualize these new metrics.
