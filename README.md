# 🎒 小学学习乐园 (education)

为小学生打造的网页学习工具，支持触摸屏手写。纯前端、离线可用、零后端。

在线访问：**https://li-sifeng.github.io/education/**

## 📚 模块

### 语文 (`yuwen/`)
部编版四年级上册 **词语默写**：
- 屏幕显示拼音提示，触摸屏手写词语
- 写完对照标准答案，自评对错
- 写错的词自动进 **错词本**，可单独订正，订正写对后自动移出
- 全册 8 单元 27 课，约 200 词（词库初稿，需对照课本校对）

> 数学等更多科目规划中。

## 🛠 技术

- 纯静态 HTML + CSS + JavaScript，无框架、无依赖
- 手写：HTML5 Canvas（触摸 + 鼠标）
- 错词存储：浏览器 localStorage
- 部署：GitHub Pages

## 📁 结构

```
education/
├── index.html        # 学科选择入口
└── yuwen/            # 语文模块
    ├── index.html
    ├── css/style.css
    ├── js/app.js
    └── data/words.js  # 词库（可编辑校对）
```

## ✏️ 校对/修改词库

编辑 `yuwen/data/words.js`，按现有结构增删改词语即可。`confidence: "check"` 的课文建议优先对照课本核对。

---

Made with 🧭 by 小胖 & 丰哥
