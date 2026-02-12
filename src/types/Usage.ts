export interface ModelQuota {
    modelName: string;
    remaining: number;
    total: number;
    percentage: number;
    resetTime: Date;
    status: 'healthy' | 'warning' | 'critical';
}

export interface UsageData {
    geminiPro: ModelQuota;
    geminiFlash: ModelQuota;
    claude: ModelQuota;
    lastUpdated: Date;
}

export interface GetUserStatusResponse {
    quotas: {
        [key: string]: {
            remaining: number;
            total: number;
            resetTime: string;
        };
    };
    promptCredits?: number;
    flowCredits?: number;
}
