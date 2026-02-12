# Antigravity Usage Tracker

A professional VS Code extension to monitor AI usage quotas for **Gemini Pro**, **Gemini Flash**, and **Claude** with a stunning glassmorphic dashboard.

## Features

- 🟢 **Real-time Status Bar**: Shows aggregated usage with emoji indicators (🟢🟡🔴)
- 📊 **Glassmorphic Dashboard**: Premium UI with vibrant gradients and smooth animations
- ⏱️ **Reset Time Countdown**: Track when your quotas will refresh
- 🔄 **Auto-refresh**: Updates every 30 seconds
- 💎 **Model-specific Cards**: Dedicated cards for each AI model with color-coded progress bars

## Installation

### From Source

1. Clone or download this repository
2. Open the folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch the extension in a new VS Code window

### From VSIX

1. Run `npm run package` to create a `.vsix` file
2. Install via VS Code: Extensions → Install from VSIX

## Usage

1. **Status Bar**: Click the status bar item (e.g., "🟢 75%") to open the dashboard
2. **Sidebar**: Open the "Antigravity Usage" view from the Activity Bar
3. **Refresh**: Click the 🔄 button in the dashboard to manually refresh data

## Requirements

- VS Code 1.80.0 or higher
- Antigravity IDE running on `localhost:42424` (for live data)

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Package extension
npm run package
```

## Publisher

**Alpha Kraft**

## License

ISC
