// @ts-check

(function () {
    const vscode = acquireVsCodeApi();

    // DOM elements
    const refreshBtn = document.getElementById('refresh-btn');
    const lastUpdatedEl = document.getElementById('last-updated');

    const models = ['gemini-pro', 'gemini-flash', 'claude'];

    // Event listeners
    refreshBtn?.addEventListener('click', () => {
        vscode.postMessage({ type: 'refresh' });
    });

    // Handle messages from extension
    window.addEventListener('message', (event) => {
        const message = event.data;

        switch (message.type) {
            case 'update':
                updateDashboard(message.data);
                break;
        }
    });

    /**
     * Update dashboard with new data
     */
    function updateDashboard(data) {
        updateModelCard('gemini-pro', data.geminiPro);
        updateModelCard('gemini-flash', data.geminiFlash);
        updateModelCard('claude', data.claude);

        // Update last updated timestamp
        const lastUpdated = new Date(data.lastUpdated);
        lastUpdatedEl.textContent = `Last updated: ${formatTime(lastUpdated)}`;
    }

    /**
     * Update individual model card
     */
    function updateModelCard(modelId, modelData) {
        const card = document.getElementById(`${modelId}-card`);
        const progressBar = document.getElementById(`${modelId}-progress`);
        const remainingEl = document.getElementById(`${modelId}-remaining`);
        const percentageEl = document.getElementById(`${modelId}-percentage`);
        const resetEl = document.getElementById(`${modelId}-reset`);

        if (!card || !progressBar || !remainingEl || !percentageEl || !resetEl) {
            return;
        }

        // Update progress bar
        progressBar.style.width = `${modelData.percentage}%`;

        // Update stats
        remainingEl.textContent = `${modelData.remaining}/${modelData.total}`;
        percentageEl.textContent = `${Math.round(modelData.percentage)}%`;
        resetEl.textContent = formatResetTime(new Date(modelData.resetTime));

        // Update status class
        card.classList.remove('status-healthy', 'status-warning', 'status-critical');
        card.classList.add(`status-${modelData.status}`);

        // Animate card entrance
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }

    /**
     * Format reset time as relative string
     */
    function formatResetTime(resetTime) {
        const now = new Date();
        const diff = resetTime.getTime() - now.getTime();

        if (diff < 0) {
            return 'Expired';
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    /**
     * Format time as HH:MM:SS
     */
    function formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
})();
