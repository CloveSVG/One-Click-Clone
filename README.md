# One-Click Clone

**[English](#english) | [中文](#中文)**

<a id="english"></a>

## English

### No code. No frontend skills. Just tell AI which website to clone.

One-Click Clone is an open-source AI skill that lets you replicate any website with a single command. The AI opens a browser, inspects the page, downloads every asset, extracts exact styles, and builds a working Next.js clone — all without you writing a single line of code.

**Current fidelity: ~70–80%** on landing pages, including layout, colors, animations, and interactive elements.

### See It In Action

> Left: Clone | Right: Original

![Kling AI comparison](docs/demo-screenshots/showcase-kling.png)

We've tested on multiple sites — **Kling AI**, **Claude Cowork**, **Linear**, **Vercel**, **Gemini** — the methodology works across different design systems and frameworks.

### Quick Start

**Step 1: Install** (paste this to your AI)

```
Help me install the One-Click-Clone site-clone skill from https://github.com/CloveSVG/One-Click-Clone.
Install only, don't run a clone yet. After install, check browser automation is available, then ask me which site to clone.
```

**Step 2: Clone**

```
/site-clone https://any-website.com
```

That's it. The AI handles everything:

```
① Browser    →  Opens Chrome, visits target, scrolls to trigger all content
② Assets     →  Downloads every image, video, font locally
③ Styles     →  Extracts exact CSS via getComputedStyle, to the pixel
④ Layout     →  Breaks page into independent sections
⑤ Build      →  Dispatches parallel AI agents to code simultaneously
⑥ Verify     →  Compares with original, fixes discrepancies on the spot
```

### How It Actually Works

This isn't traditional "write HTML, adjust CSS" web development. The AI uses **multimodal capabilities** to:

- **See** the website through browser automation (click, scroll, hover)
- **Understand** layout patterns, design tokens, color systems, animations
- **Extract** exact computed styles, not approximations
- **Build** each section in parallel via isolated agent worktrees
- **Learn** from each clone through a built-in experience accumulation system

### Platform Support

| Platform | Status | Skill File |
|----------|--------|-----------|
| **Claude Code** | Fully tested | `.claude/skills/site-clone/SKILL.md` |
| **Cursor** | Compatible | `.cursor/commands/site-clone.md` |
| **Windsurf** | Compatible | `.windsurf/workflows/site-clone.md` |
| **Codex CLI** | Compatible | `.codex/skills/site-clone/SKILL.md` |
| **Trae / Cline / Copilot / Gemini CLI** | Compatible | See repo for configs |

> Claude Code is battle-tested. Other platforms are compatible but less tested — the core SKILL.md methodology is universal.

### This Is a Framework, Not a Walled Garden

The core is a **600+ line structured methodology** (SKILL.md) that teaches any AI how to clone websites. You can feed this pattern to any AI tool with browser control.

It's been optimized for Claude Code, so the first attempt on other platforms may not be perfect. But the methodology — survey, extract, blueprint, build, verify — is universal. **Copy it, adapt it, make it yours.**

### FAQ

**Can I use this if I can't code?** Yes. You just talk to the AI.

**How long does a clone take?** Simple pages: 5–10 min. Complex: 15–60 min.

**What tech stack?** Next.js + TypeScript + Tailwind CSS. Deploy to Vercel instantly.

---

<a id="中文"></a>

## 中文

### 一行代码不用写，只要会说中文，就能让 AI 高完成度复刻一个网站。

One-Click Clone 是一个开源的 AI Skill。你只需要告诉 AI 你想复刻哪个网站，它就会自动打开浏览器、扫描页面、下载所有资源、提取精确样式、编写代码，给你一个可运行的网站克隆版。

**当前还原度：大约 70%~80%**。不是只还原一个静态壳子，连整体布局、配色、动画效果，基本都能跑出来。

### 先看效果

> 左：克隆版 ｜ 右：原版

![可灵 AI 对比](docs/demo-screenshots/showcase-kling.png)

不只测了一个网站。可灵 AI、Claude Code、Linear、Vercel、Gemini 都测过，效果都还不错。这套流程不是碰巧对一个案例有效，而是真的已经有一定可用性了。

### 它能帮你做什么

- **建站学习** — 看别人怎么做的，拆解学习最快
- **快速验证想法** — 几分钟出一个可交互的 Demo
- **给客户出 Demo** — 先给客户看效果，效率翻倍

### 快速开始

**第一步：安装 Skill**（把这段话丢给你的 AI）

```
帮我从 https://github.com/CloveSVG/One-Click-Clone 下载 site-clone skill 并安装到当前项目中。
只安装，不要执行克隆。安装完后：
1. 检查浏览器自动化是否可用（Playwright MCP / Browser MCP / Chrome MCP），如果不可用，指导我安装
2. 所有就绪后，问我想克隆哪个网站，给几个示例供选择
```

**第二步：克隆**

```
/site-clone https://你想克隆的网站.com
```

搞定。AI 全自动完成 6 个步骤：

```
① 打开浏览器    →  访问目标网站，自动滚动触发所有内容
② 下载资源      →  图片、视频、图标、字体全部下载到本地
③ 提取样式      →  对每个元素读取精确 CSS，精确到像素
④ 分析布局      →  拆成独立区块：导航栏、Hero、卡片、Footer
⑤ 并行编码      →  多个 AI Agent 同时写不同区块的代码
⑥ 组装验证      →  拼到一起，逐屏对比原版，发现不对立即修
```

### 原理：让 AI 自己去「点、看、学」

这不是传统手写 HTML、手调样式的方式，而是利用 AI 的**多模态能力**：

- AI 主动识别网页的布局、格式、设计模式、配色
- 通过浏览器自动化点击、滚动、悬停，提取每个状态
- 多个 Agent 并行写代码，每个负责一个区块
- 内置经验积累系统，每次克隆后学习反馈，下次更好

### 门槛真的很低

你**不需要**会前端，**不需要**写一行代码。只要会跟 AI 说清楚需求，哪怕你只会讲中文，也能跑起来。

这个版本直接开源免费给大家。

### 平台支持

| 平台 | 状态 | Skill 文件 |
|------|------|-----------|
| **Claude Code** | 完整测试 | `.claude/skills/site-clone/SKILL.md` |
| **Cursor** | 兼容 | `.cursor/commands/site-clone.md` |
| **Windsurf** | 兼容 | `.windsurf/workflows/site-clone.md` |
| **Codex CLI** | 兼容 | `.codex/skills/site-clone/SKILL.md` |
| **Trae / Cline / Copilot / Gemini CLI** | 兼容 | 详见仓库配置文件 |

<details>
<summary><b>Claude Code 详细教程</b></summary>

确保有 Chrome 浏览器 + [Claude in Chrome 插件](https://chromewebstore.google.com/)，安装后在 Claude Code 中运行 `/chrome` 选择 **Enabled by default** 即可。

</details>

<details>
<summary><b>其他平台教程</b></summary>

需要额外安装浏览器 MCP：
- **Playwright MCP**（推荐）：设置 → MCP → 添加 → 命令填 `npx @playwright/mcp@latest`
- **Browser MCP**：去 https://browsermcp.io/ 装 Chrome 扩展

然后把仓库中对应平台的 Skill 文件复制到项目的相同路径下。

</details>

### 这是一个框架和模式，不是封闭花园

核心是一套 **600 多行的结构化方法论**（SKILL.md），教任何 AI 如何克隆网站。你可以把这个模式喂给任何有浏览器控制能力的 AI 工具。

第一次效果可能不完美——毕竟这是针对 Claude Code 特化的——但方法论是通用的。**随意复制，自由改造，这个 pattern 是属于大家的。**

### 为什么开源

我的技术能力其实很有限。虽然在很多官网类页面上已经适配得比较成熟，但在更多场景里的适配和测试还远远不够。所以更希望开源出来，让更多小伙伴一起完善它、扩展它。

这本来就是我的个人兴趣项目。一周从 0 到 1 做出来，熬了很多夜，也掉了不少头发。我不打算靠它赚钱。但我真的希望有人能基于它，做出更有意思、甚至能商业化的产品，真正帮别人创造价值，甚至赚到钱。

**希望大家都能用这个工具，打造出属于自己的产品，赚到钱。**

### 常见问题

**Q: 完全不会写代码，能用吗？** 能。代码是 AI 写的，不是你。

**Q: 克隆一个网站要多久？** 简单页面 5-10 分钟，复杂页面 15-60 分钟。

**Q: 用什么技术栈？** Next.js + TypeScript + Tailwind CSS，直接部署 Vercel。

---

- 如果觉得有用，给个 star 就是最大的支持
- 如果不想给，也完全没关系，用得开心就好
- 如果有问题想交流，欢迎 [open an issue](https://github.com/CloveSVG/One-Click-Clone/issues) 或 mention [@CloveSVG](https://github.com/CloveSVG)

**MIT License** — 随便用，不用问。

<p align="center">
  <b>Powered by Clove 深思圈</b>
</p>
