<div align="center">

# 🟩 Minecraft 史萊姆百科 Discord Bot

*一個使用 Discord.js v14 建構的 Minecraft 百科 Bot，支援 Slash Commands、自定義狀態，以及模組化的指令結構。*

[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18.0.0+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 目錄

- [📁 專案結構](#-專案結構)
- [⚙️ 環境需求](#️-環境需求)
- [🚀 快速開始](#-快速開始)
- [🎮 指令說明](#-指令說明)
- [➕ 如何新增指令](#-如何新增指令)
- [🔧 修改 Bot 狀態](#-修改-bot-狀態)
- [🛠️ 開發模式](#️-開發模式自動重啟)
- [❓ 常見問題](#-常見問題)

---

## 📁 專案結構

```text
minecraft-wiki-bot/
├── index.js                        # 主程式入口
├── deploy-commands.js              # 部署 Slash Commands 的腳本
├── package.json
├── .env                            # 環境變數（不可上傳至 Git！）
├── .env.example                    # 環境變數範本
├── .gitignore
└── container/
    ├── commands/
    │   ├── help.js                 # /幫助
    │   ├── wiki.js                 # /問百科
    │   └── ping.js                 # /測試伺服器
    └── events/
        ├── ready.js                # Bot 上線事件 + 自定義狀態
        └── interactionCreate.js    # Slash Command 處理器
````

-----

## ⚙️ 環境需求

| 工具 | 版本需求 | 備註 |
|:---|:---|:---|
| **Node.js** | `>= v18.0.0` | 運行環境 |
| **npm** | 隨 Node.js 附帶 | 套件管理 |

-----

## 🚀 快速開始

### 步驟 1 — 建立 Discord Bot

1.  前往 [Discord Developer Portal](https://discord.com/developers/applications)。
2.  點選 **New Application**，輸入名稱（例如：`史萊姆百科`）。
3.  前往左側 **Bot** 頁面 ➔ 點選 **Reset Token** ➔ 複製 Token。
4.  在同一頁面，向下滑動並開啟以下 **Privileged Gateway Intents** 權限：
      - `MESSAGE CONTENT INTENT` (若未來需要讀取訊息內容)
5.  前往 **OAuth2 ➔ URL Generator**，勾選 `bot` 與 `applications.commands`，產生邀請連結，將 Bot 加入你的伺服器。

### 步驟 2 — 設定環境變數

複製環境變數範本，並使用文字編輯器打開 `.env`：

```bash
cp .env.example .env
```

填寫你的設定值：

```env
DISCORD_TOKEN=你的_Bot_Token
CLIENT_ID=你的_Application_ID
```

> [\!NOTE]
> **Application ID** 可以在 Developer Portal 的 **General Information** 頁面中找到。

### 步驟 3 — 安裝依賴套件

```bash
npm install
```

### 步驟 4 — 部署 Slash Commands

```bash
npm run deploy
```

> [\!TIP]
> 這個步驟只需要執行 **一次**，或是每當你新增、修改、刪除指令時才需要重新執行。

### 步驟 5 — 啟動 Bot

```bash
npm start
```

Bot 成功上線後，終端機將顯示：

```text
✅ 已載入指令：幫助
✅ 已載入指令：問百科
✅ 已載入指令：測試伺服器
📡 已載入事件：ready
📡 已載入事件：interactionCreate

🎮 Bot 已上線！登入身份：史萊姆百科#1234
✨ 自定義狀態已設定：Idle · 正在玩 Minecraft 史萊姆百科 !
```

-----

## 🎮 指令說明

| 指令 | 說明 |
|:---|:---|
| `/幫助` | 顯示所有可用指令的清單 |
| `/問百科 <關鍵字>` | 查詢 Minecraft 生物、物品或機制的資訊 |
| `/測試伺服器` | 測試 Bot 的連線延遲與狀態 |

### 💡 `/問百科` 目前支援的關鍵字

| 關鍵字分類 | 可用關鍵字與內容 |
|:---|:---|
| **生物類** | `史萊姆` (生成位置、掉落物) <br> `苦力怕` (爆炸機制、貓咪剋制) <br> `末影龍` (Boss 攻略、末地水晶) |
| **物品類** | `鑽石` (最佳挖掘深度、幸運附魔) <br> `釀造台` (藥水製作基礎) |

-----

## ➕ 如何新增指令

1.  在 `container/commands/` 資料夾中新增一個 `.js` 檔案，例如 `enchant.js`。
2.  貼上並修改以下模板：

<!-- end list -->

```js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('指令名稱')           // 注意：必須全為小寫
    .setDescription('這裡是指令說明'),

  async execute(interaction, client) {
    await interaction.reply('Hello！這是一個新指令。');
  },
};
```

3.  執行 `npm run deploy` 重新部署指令。
4.  重新啟動 Bot：`npm start`。

-----

## 🔧 修改 Bot 狀態

若想更改 Bot 狀態列顯示的文字，請打開 `container/events/ready.js` 進行修改：

```js
client.user.setPresence({
  status: 'idle', // 可選：online | idle | dnd | invisible
  activities: [
    {
      name: 'Minecraft 史萊姆百科 !',
      type: ActivityType.Playing, // 可選：Playing | Watching | Listening | Competing
    },
  ],
});
```

-----

## 🛠️ 開發模式（自動重啟）

在開發過程中，建議使用開發模式，存檔時 Bot 會自動重新啟動：

```bash
npm run dev
```

> [\!NOTE]
> 此功能需要 Node.js `v18.11.0` 以上版本，底層使用了 Node 內建的 `--watch` 旗標。

-----

## ❓ 常見問題

**Q：執行 `npm run deploy` 後，Discord 上看不到指令？**  
A：全域的 Slash Commands 最多可能需要 **1 小時** 才會同步到所有伺服器。如果想立即測試，建議在開發階段改註冊為「Guild Commands（伺服器專屬指令）」，詳情可參考 Discord.js 官方文件。

**Q：Bot 上線了，但輸入指令卻沒有反應？**  
A：請確認你已正確執行 `npm run deploy`，並且在邀請 Bot 時，有確實勾選 `applications.commands` 權限。

**Q：`.env` 裡的 Token 到底是什麼？**  
A：Token 就如同 Bot 的帳號密碼。

> [\!WARNING]
> **絕對不要將 Token 分享給任何人，也絕對不要上傳到 GitHub 公開資源庫！** 若不慎洩漏，請立即回到 Developer Portal 點擊 "Reset Token" 重置。

-----

\<div align="center"\>
\<sub\>Built with ❤️ using Discord.js v14\</sub\>
\</div\>

```
```
