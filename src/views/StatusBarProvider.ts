import * as vscode from 'vscode';
import { UsageData } from '../types/Usage';

export class StatusBarProvider {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'antigravity-usage.showDashboard';
        this.statusBarItem.show();
    }

    /**
     * Update status bar with usage data
     */
    updateStatusBar(data: UsageData): void {
        const avgPercentage = (
            data.geminiPro.percentage +
            data.geminiFlash.percentage +
            data.claude.percentage
        ) / 3;

        const emoji = this.getEmoji(avgPercentage);
        const text = `${emoji} ${Math.round(avgPercentage)}%`;

        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = this.buildTooltip(data);
    }

    /**
     * Get emoji based on percentage
     */
    private getEmoji(percentage: number): string {
        if (percentage > 30) return '🟢';
        if (percentage > 10) return '🟡';
        return '🔴';
    }

    /**
     * Build tooltip with detailed quota info
     */
    private buildTooltip(data: UsageData): string {
        const lines = [
            '🤖 Antigravity Usage Tracker',
            '',
            `Gemini Pro: ${Math.round(data.geminiPro.percentage)}% (${data.geminiPro.remaining}/${data.geminiPro.total})`,
            `Gemini Flash: ${Math.round(data.geminiFlash.percentage)}% (${data.geminiFlash.remaining}/${data.geminiFlash.total})`,
            `Claude: ${Math.round(data.claude.percentage)}% (${data.claude.remaining}/${data.claude.total})`,
            '',
            `Reset: ${this.formatResetTime(data.geminiPro.resetTime)}`,
        ];

        return lines.join('\n');
    }

    /**
     * Format reset time as relative string
     */
    private formatResetTime(resetTime: Date): string {
        const now = new Date();
        const diff = resetTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    dispose(): void {
        this.statusBarItem.dispose();
    }
}
