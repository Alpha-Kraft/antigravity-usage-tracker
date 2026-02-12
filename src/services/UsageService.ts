import axios from 'axios';
import { UsageData, ModelQuota, GetUserStatusResponse } from '../types/Usage';

export class UsageService {
    private readonly ANTIGRAVITY_PORT = 42424;
    private readonly API_ENDPOINT = `http://localhost:${this.ANTIGRAVITY_PORT}/GetUserStatus`;

    /**
     * Fetch usage data from Antigravity Language Server
     */
    async fetchUsageData(): Promise<UsageData> {
        try {
            const response = await axios.get<GetUserStatusResponse>(this.API_ENDPOINT, {
                timeout: 5000,
            });

            return this.parseResponse(response.data);
        } catch (error) {
            console.warn('Failed to fetch usage data from Antigravity, using mock data:', error);
            return this.getMockData();
        }
    }

    /**
     * Parse API response into UsageData format
     */
    private parseResponse(response: GetUserStatusResponse): UsageData {
        const quotas = response.quotas;

        return {
            geminiPro: this.parseModelQuota('Gemini Pro', quotas['gemini-pro'] || quotas['gemini_pro']),
            geminiFlash: this.parseModelQuota('Gemini Flash', quotas['gemini-flash'] || quotas['gemini_flash']),
            claude: this.parseModelQuota('Claude', quotas['claude'] || quotas['claude-sonnet']),
            lastUpdated: new Date(),
        };
    }

    /**
     * Parse individual model quota
     */
    private parseModelQuota(modelName: string, quota: any): ModelQuota {
        const remaining = quota?.remaining || 0;
        const total = quota?.total || 100;
        const percentage = total > 0 ? (remaining / total) * 100 : 0;
        const resetTime = quota?.resetTime ? new Date(quota.resetTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);

        return {
            modelName,
            remaining,
            total,
            percentage,
            resetTime,
            status: this.getStatus(percentage),
        };
    }

    /**
     * Determine status based on percentage
     */
    private getStatus(percentage: number): 'healthy' | 'warning' | 'critical' {
        if (percentage > 30) return 'healthy';
        if (percentage > 10) return 'warning';
        return 'critical';
    }

    /**
     * Mock data for development/testing
     */
    private getMockData(): UsageData {
        const now = new Date();
        const resetTime = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now

        return {
            geminiPro: {
                modelName: 'Gemini Pro',
                remaining: 75,
                total: 100,
                percentage: 75,
                resetTime,
                status: 'healthy',
            },
            geminiFlash: {
                modelName: 'Gemini Flash',
                remaining: 25,
                total: 100,
                percentage: 25,
                resetTime,
                status: 'warning',
            },
            claude: {
                modelName: 'Claude',
                remaining: 8,
                total: 100,
                percentage: 8,
                resetTime,
                status: 'critical',
            },
            lastUpdated: now,
        };
    }
}
