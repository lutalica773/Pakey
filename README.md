<h4 align="right"><strong>English</strong> | <a href="README_CN.md">简体中文</a></h4>
<p align="center">
    <img src=https://gw.alipayobjects.com/zos/k/fa/logo-modified.png width=138/>
</p>
<h1 align="center">Pakey</h1>
<p align="center"><strong>Turn any webpage into a desktop app with one command, supports macOS, Windows, and Linux</strong></p>

## Features

- 🎐 **Lightweight**: Nearly 20 times smaller than Electron packages, typically around 5M
- 🚀 **Fast**: Built with Rust Tauri, much faster than traditional JS frameworks with lower memory usage
- ⚡ **Easy to use**: One-command packaging via CLI or online building, no complex configuration needed
- 📦 **Feature-rich**: Supports shortcuts, immersive windows, drag & drop, style customization, ad removal

## Getting Started

- **Beginners**: Download ready-made [Popular Packages](#popular-packages) or use [Online Building](docs/github-actions-usage.md) with no environment setup required
- **Developers**: Install [CLI Tool](docs/cli-usage.md) for one-command packaging of any website with customizable icons, window settings, and more
- **Advanced Users**: Clone the project locally for [Custom Development](#development), or check [Advanced Usage](docs/advanced-usage.md) for style customization and feature enhancement
- **Troubleshooting**: Check [FAQ](docs/faq.md) for common issues and solutions

<details>
<summary>🏂 You can download more applications from <a href="https://github.com/lutalica773/Pakey/releases">Releases</a>. <b>Click here to expand the shortcuts reference!</b></summary>

<br/>

| Mac                                                       | Windows/Linux                                       | Function                            |
| --------------------------------------------------------- | --------------------------------------------------- | ----------------------------------- |
| <kbd>⌘</kbd> + <kbd>[</kbd>                               | <kbd>Ctrl</kbd> + <kbd>←</kbd>                      | Return to the previous page         |
| <kbd>⌘</kbd> + <kbd>]</kbd>                               | <kbd>Ctrl</kbd> + <kbd>→</kbd>                      | Go to the next page                 |
| <kbd>⌘</kbd> + <kbd>↑</kbd>                               | <kbd>Ctrl</kbd> + <kbd>↑</kbd>                      | Auto scroll to top of page          |
| <kbd>⌘</kbd> + <kbd>↓</kbd>                               | <kbd>Ctrl</kbd> + <kbd>↓</kbd>                      | Auto scroll to bottom of page       |
| <kbd>⌘</kbd> + <kbd>r</kbd>                               | <kbd>Ctrl</kbd> + <kbd>r</kbd>                      | Refresh Page                        |
| <kbd>⌘</kbd> + <kbd>w</kbd>                               | <kbd>Ctrl</kbd> + <kbd>w</kbd>                      | Hide window, not quit               |
| <kbd>⌘</kbd> + <kbd>-</kbd>                               | <kbd>Ctrl</kbd> + <kbd>-</kbd>                      | Zoom out the page                   |
| <kbd>⌘</kbd> + <kbd>=</kbd>                               | <kbd>Ctrl</kbd> + <kbd>=</kbd>                      | Zoom in the Page                    |
| <kbd>⌘</kbd> + <kbd>0</kbd>                               | <kbd>Ctrl</kbd> + <kbd>0</kbd>                      | Reset the page zoom                 |
| <kbd>⌘</kbd> + <kbd>L</kbd>                               | <kbd>Ctrl</kbd> + <kbd>L</kbd>                      | Copy Current Page URL               |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>⌥</kbd> + <kbd>V</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>   | Paste and Match Style               |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>H</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd>   | Go to Home Page                     |
| <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>I</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>   | Toggle Developer Tools (Debug Only) |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>⌫</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Del</kbd> | Clear Cache & Restart               |

In addition, double-click the title bar to switch to full-screen mode. For Mac users, you can also use the gesture to go to the previous or next page and drag the title bar to move the window. The new menu also offers options for navigation, zoom, and window controls.

</details>

## Command-Line Packaging

![Pake](https://raw.githubusercontent.com/tw93/static/main/pake/pake1.gif)

```bash
# Install Pake CLI
pnpm install -g pake-cli

# Basic usage - automatically fetches website icon
pake https://github.com --name GitHub

# Advanced usage with custom options
pake https://weekly.tw93.fun --name Weekly --icon https://cdn.tw93.fun/pake/weekly.icns --width 1200 --height 800 --hide-title-bar
```

First-time packaging requires environment setup and may be slower, subsequent builds are fast. For complete parameter documentation, see [CLI Usage Guide](docs/cli-usage.md). Don't want to use CLI? Try [GitHub Actions Online Building](docs/github-actions-usage.md).

## Development

Requires Rust `>=1.85` and Node `>=22` (recommended LTS; `>=18` also works). For detailed installation guide, see [Tauri documentation](https://v2.tauri.app/start/prerequisites/). If unfamiliar with development environment, use the CLI tool instead.

```bash
# Install dependencies
pnpm i

# Local development [right-click to open debug mode]
pnpm run dev

# Build application
pnpm run build
```

For style customization, feature enhancement, container communication and other advanced features, see [Advanced Usage Documentation](docs/advanced-usage.md).

## Developers

Pakey's development can not be without these Hackers. They contributed a lot of capabilities for Pake. Also, welcome to follow them! ❤️

## Support

- If Pakey helped you, [share it] with friends or give it a star.
- Got ideas or bugs? Open an issue or PR, feel free to contribute your best AI model.
