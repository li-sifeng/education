/* 四年级英语听写 — 核心逻辑
   功能：选单元 -> 听英文发音 + 看中文 -> 键盘打英文 -> 自动判分 -> 错词入库
   错词库存 localStorage，离线可用，无需后端。 */

(function () {
  "use strict";

  const DATA = window.ENGLISH_DATA || { lessons: [] };
  const WRONG_KEY = "english_wrongbook_v1";
  let currentMode = "words"; // words | sentences | both

  // ---------- 错词库 ----------
  function loadWrong() {
    try { return JSON.parse(localStorage.getItem(WRONG_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWrong(list) {
    localStorage.setItem(WRONG_KEY, JSON.stringify(list));
  }
  function addWrong(item) {
    const list = loadWrong();
    const existing = list.find(w => w.en === item.en);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.ts = Date.now();
    } else {
      list.push({ en: item.en, zh: item.zh || "", count: 1, ts: Date.now() });
    }
    saveWrong(list);
  }
  function removeWrong(en) {
    saveWrong(loadWrong().filter(w => w.en !== en));
  }
  function updateWrongBadge() {
    const el = document.getElementById("wrong-count");
    if (el) el.textContent = loadWrong().length;
  }

  // ---------- 屏幕切换 ----------
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  // ---------- 语音报词（浏览器 TTS，英文发音） ----------
  let enVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices() || [];
    // 优先选英式/美式英语女声，发音更贴近教材录音
    enVoice =
      voices.find(v => /en-GB/i.test(v.lang) && /female|woman|Kate|Serena|Stephanie/i.test(v.name)) ||
      voices.find(v => /en-US/i.test(v.lang) && /female|woman|Samantha|Ava|Allison/i.test(v.name)) ||
      voices.find(v => /^en[-_]/i.test(v.lang)) ||
      null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    if (enVoice) u.voice = enVoice;
    u.rate = 0.78;  // 放慢，适合小朋友听写
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }

  // ---------- 答案标准化 & 判分 ----------
  // 忽略大小写、首尾空格、多余空格；把弯引号统一成直引号；
  // 句子忽略结尾标点 . ? ! 的差异（拼写对就算对）。
  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .trim()
      .replace(/[\u2018\u2019]/g, "'")     // 弯单引号 -> 直
      .replace(/[\u201C\u201D]/g, '"')     // 弯双引号 -> 直
      .replace(/\s+/g, " ")                // 多空格合一
      .replace(/[.?!]+$/g, "")             // 去掉结尾标点
      .trim();
  }
  function isCorrect(input, answer) {
    return normalize(input) === normalize(answer);
  }

  // ---------- 听写会话状态 ----------
  let session = null; // { items:[], idx:0, results:[], title }

  function buildItems(lesson, mode) {
    const words = (lesson.words || []).map(w => ({ en: w.en, zh: w.zh, kind: "word" }));
    const sents = (lesson.sentences || []).map(s => ({ en: s.en, zh: s.zh, kind: "sentence" }));
    if (mode === "words") return words;
    if (mode === "sentences") return sents;
    return words.concat(sents);
  }

  function startSession(items, title) {
    if (!items || items.length === 0) {
      flash("这个单元暂时没有可听写的内容 🙈");
      return;
    }
    session = { items: items.slice(), idx: 0, results: [], title: title || "听写" };
    document.getElementById("dictation-title").textContent = title || "听写";
    show("screen-dictation");
    loadCurrentItem();
  }

  function loadCurrentItem() {
    const it = session.items[session.idx];
    document.getElementById("prompt-zh").textContent = it.zh || "　";
    document.getElementById("progress").textContent =
      (session.idx + 1) + " / " + session.items.length;
    const input = document.getElementById("answer-input");
    input.value = "";
    input.focus();
    // 自动播放一次发音
    speak(it.en);
  }

  function submitAnswer() {
    const it = session.items[session.idx];
    const input = document.getElementById("answer-input");
    const raw = input.value;
    if (!raw.trim()) {
      flash("先把听到的英文打出来吧 ⌨️");
      input.focus();
      return;
    }
    const right = isCorrect(raw, it.en);
    session.results.push({ en: it.en, zh: it.zh, right: right, mine: raw.trim() });

    if (!right) { addWrong(it); }
    else { removeWrong(it.en); }
    updateWrongBadge();

    // 显示批改
    document.getElementById("check-verdict").textContent = right ? "✅" : "❌";
    document.getElementById("check-verdict").className =
      "check-verdict " + (right ? "ok" : "no");
    document.getElementById("check-head").textContent = right ? "写对啦！" : "再记一记～";
    document.getElementById("correct-en").textContent = it.en;
    document.getElementById("correct-zh").textContent = it.zh || "";
    const mine = document.getElementById("my-answer");
    mine.textContent = raw.trim();
    mine.className = "my-answer " + (right ? "ok" : "no");
    show("screen-check");
  }

  function nextItem() {
    session.idx++;
    if (session.idx >= session.items.length) {
      showResult();
    } else {
      show("screen-dictation");
      loadCurrentItem();
    }
  }

  function showResult() {
    const total = session.results.length;
    const right = session.results.filter(r => r.right).length;
    document.getElementById("score-right").textContent = right;
    document.getElementById("score-total").textContent = total;

    const wrongList = session.results.filter(r => !r.right);
    const box = document.getElementById("result-wrong-list");
    box.innerHTML = "";
    if (wrongList.length === 0) {
      box.innerHTML = '<div class="empty-tip">全对啦，太棒了！🌟</div>';
      document.getElementById("btn-retry-wrong").style.display = "none";
    } else {
      document.getElementById("btn-retry-wrong").style.display = "";
      wrongList.forEach(r => {
        const chip = document.createElement("div");
        chip.className = "wrong-chip";
        chip.innerHTML = '<span class="wc-en">' + r.en + '</span>' +
                         '<span class="wc-zh">' + (r.zh || "") + '</span>';
        box.appendChild(chip);
      });
    }
    showResult._wrong = wrongList.map(r => ({ en: r.en, zh: r.zh }));
    show("screen-result");
  }

  // ---------- 首页：渲染单元列表 ----------
  function renderLessons() {
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";
    DATA.lessons.forEach(L => {
      const wc = (L.words || []).length;
      const sc = (L.sentences || []).length;
      const card = document.createElement("div");
      card.className = "lesson-card";
      card.innerHTML =
        '<div class="lc-unit">Unit ' + L.unit + '</div>' +
        '<div class="lc-title">' + L.title + '</div>' +
        '<div class="lc-count">' + wc + ' 词 · ' + sc + ' 句</div>';
      card.addEventListener("click", () => {
        const items = buildItems(L, currentMode);
        startSession(items, "Unit " + L.unit + " · " + L.title);
      });
      list.appendChild(card);
    });
  }

  // ---------- 错词本听写 ----------
  function startWrongBook() {
    const list = loadWrong();
    if (list.length === 0) {
      flash("错词本是空的，先去听写吧 📖");
      return;
    }
    const items = list.map(w => ({ en: w.en, zh: w.zh, kind: "word" }));
    startSession(items, "📕 错词订正");
  }

  // ---------- 小提示 ----------
  let flashTimer = null;
  function flash(msg) {
    let el = document.getElementById("flash-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "flash-toast";
      el.style.cssText = "position:fixed;left:50%;bottom:40px;transform:translateX(-50%);background:rgba(31,41,55,.92);color:#fff;padding:12px 22px;border-radius:14px;font-size:16px;z-index:999;box-shadow:0 4px 14px rgba(0,0,0,.25);";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1600);
  }

  // ---------- 绑定事件 ----------
  function bind() {
    document.getElementById("btn-speak").addEventListener("click", () => {
      if (session) speak(session.items[session.idx].en);
    });
    document.getElementById("btn-replay").addEventListener("click", () => {
      if (session) speak(session.items[session.idx].en);
    });
    document.getElementById("btn-submit").addEventListener("click", submitAnswer);
    document.getElementById("btn-next").addEventListener("click", nextItem);
    document.getElementById("btn-wrongbook").addEventListener("click", startWrongBook);
    document.getElementById("btn-retry-wrong").addEventListener("click", () => {
      const w = showResult._wrong || [];
      if (w.length) startSession(w, "📕 错词订正");
    });

    // 回车提交 / 进入下一个
    document.getElementById("answer-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); submitAnswer(); }
    });
    document.addEventListener("keydown", (e) => {
      const checkVisible = document.getElementById("screen-check").classList.contains("active");
      if (checkVisible && e.key === "Enter") { e.preventDefault(); nextItem(); }
    });

    // 模式切换
    document.querySelectorAll(".seg-btn").forEach(b => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        currentMode = b.dataset.mode;
      });
    });

    // 返回
    document.querySelectorAll("[data-back]").forEach(b => {
      b.addEventListener("click", () => {
        window.speechSynthesis && window.speechSynthesis.cancel();
        show("screen-home");
      });
    });
  }

  // ---------- 启动 ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderLessons();
    updateWrongBadge();
    bind();
  });
})();
