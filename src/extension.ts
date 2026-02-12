import * as vscode from 'vscode';
import { UsageService } from './services/UsageService';
import { StatusBarProvider } from './views/StatusBarProvider';
import { DashboardProvider } from './views/DashboardProvider';

let usageService: UsageService;
let statusBarProvider: StatusBarProvider;
let dashboardProvider: DashboardProvider;
let refreshInterval: NodeJS.Timeout;

export function activate(context: vscode.ExtensionContext) {
    console.log('Antigravity Usage Tracker is now active!');

    // Initialize services
    usageService = new UsageService();
    statusBarProvider = new StatusBarProvider();
    dashboardProvider = new DashboardProvider(context.extensionUri);

    // Register webview provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            DashboardProvider.viewType,
            dashboardProvider
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('antigravity-usage.refresh', async () => {
            await refreshUsageData();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('antigravity-usage.showDashboard', () => {
            vscode.commands.executeCommand('antigravity-usage-dashboard.focus');
        })
    );

    // Initial data fetch
    refreshUsageData();

    // Set up periodic refresh (every 30 seconds)
    refreshInterval = setInterval(() => {
        refreshUsageData();
    }, 30000);

    context.subscriptions.push({
        dispose: () => {
            clearInterval(refreshInterval);
            statusBarProvider.dispose();
        },
    });
}

async function refreshUsageData() {
    try {
        const data = await usageService.fetchUsageData();
        statusBarProvider.updateStatusBar(data);
        dashboardProvider.updateDashboard(data);
    } catch (error) {
        console.error('Failed to refresh usage data:', error);
    }
}

export function deactivate() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}
