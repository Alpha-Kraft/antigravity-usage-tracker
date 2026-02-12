import * as vscode from 'vscode';
import { UsageData } from '../types/Usage';
import * as path from 'path';

export class DashboardProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'antigravity-usage-dashboard';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'refresh':
                    // Trigger refresh via command
                    vscode.commands.executeCommand('antigravity-usage.refresh');
                    break;
            }
        });
    }

    /**
     * Update dashboard with new usage data
     */
    public updateDashboard(data: UsageData): void {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                data: {
                    geminiPro: data.geminiPro,
                    geminiFlash: data.geminiFlash,
                    claude: data.claude,
                    lastUpdated: data.lastUpdated.toISOString(),
                },
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'script.js')
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Antigravity Usage Tracker</title>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🤖 AI Usage Tracker</h1>
            <button id="refresh-btn" class="refresh-btn">🔄</button>
        </div>

        <div class="model-cards">
            <div class="model-card" id="gemini-pro-card">
                <div class="card-header">
                    <span class="model-icon">💎</span>
                    <h2>Gemini Pro</h2>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" id="gemini-pro-progress"></div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <span class="label">Remaining:</span>
                        <span class="value" id="gemini-pro-remaining">--</span>
                    </div>
                    <div class="stat">
                        <span class="label">Usage:</span>
                        <span class="value" id="gemini-pro-percentage">--%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Reset:</span>
                        <span class="value" id="gemini-pro-reset">--</span>
                    </div>
                </div>
            </div>

            <div class="model-card" id="gemini-flash-card">
                <div class="card-header">
                    <span class="model-icon">⚡</span>
                    <h2>Gemini Flash</h2>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" id="gemini-flash-progress"></div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <span class="label">Remaining:</span>
                        <span class="value" id="gemini-flash-remaining">--</span>
                    </div>
                    <div class="stat">
                        <span class="label">Usage:</span>
                        <span class="value" id="gemini-flash-percentage">--%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Reset:</span>
                        <span class="value" id="gemini-flash-reset">--</span>
                    </div>
                </div>
            </div>

            <div class="model-card" id="claude-card">
                <div class="card-header">
                    <span class="model-icon">🧠</span>
                    <h2>Claude</h2>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" id="claude-progress"></div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <span class="label">Remaining:</span>
                        <span class="value" id="claude-remaining">--</span>
                    </div>
                    <div class="stat">
                        <span class="label">Usage:</span>
                        <span class="value" id="claude-percentage">--%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Reset:</span>
                        <span class="value" id="claude-reset">--</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <span id="last-updated">Last updated: --</span>
        </div>
    </div>

    <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}
