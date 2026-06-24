/* 四年级语文词语默写 — 核心逻辑
   功能：选课 -> 报词(拼音+语音) -> Canvas手写 -> 对照自评 -> 错词入库
   错词库存 localStorage，离线可用，无需后端。 */

(function () {
  "use strict";

  const DATA = window.YUWEN_DATA || { lessons: [] };
  const WRONG_KEY = "yuwen_wrongbook_v1";

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
    const existing = list.find(w => w.word === item.word);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.ts = Date.now();
    } else {
      list.push({ word: item.word, pinyin: item.pinyin || "", count: 1, ts: Date.now() });
    }
    saveWrong(list);
  }
  function removeWrong(word) {
    saveWrong(loadWrong().filter(w => w.word !== word));
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

  // ---------- 语音报词（浏览器 TTS） ----------
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.8;   // 放慢，适合小朋友
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  }

  // ---------- Canvas 手写板 ----------
  function HandwritingPad(canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false, dirty = false;

    function resize() {
      // 适配高清屏，保持清晰
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#1f2937";
    }

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function start(e) {
      e.preventDefault();
      drawing = true; dirty = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end(e) { if (e) e.preventDefault(); drawing = false; }

    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end, { passive: false });
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("resize", resize);

    resize();

    return {
      resize,
      clear() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        dirty = false;
      },
      isEmpty() { return !dirty; },
      toImage() { return canvas.toDataURL("image/png"); }
    };
  }

  // ---------- 默写会话状态 ----------
  let session = null; // { words:[], idx:0, results:[] }
  let pad = null;

  function startSession(words, title) {
    session = { words: words.slice(), idx: 0, results: [], title: title || "默写" };
    document.getElementById("dictation-title").textContent = title || "默写";
    show("screen-dictation");
    loadCurrentWord();
  }

  function loadCurrentWord() {
    const w = session.words[session.idx];
    document.getElementById("prompt-pinyin").textContent = w.pinyin || "　";
    document.getElementById("progress").textContent = (session.idx + 1) + " / " + session.words.length;
    // 关键：进入默写页后画布才可见，此时重新量尺寸并清空，否则画布 0×0 画不出线
    if (pad) { pad.resize(); pad.clear(); }
  }

  function submitWriting() {
    if (pad && pad.isEmpty()) {
      flash("还没写呢，先写一写吧 ✍️");
      return;
    }
    const w = session.words[session.idx];
    document.getElementById("correct-word").textContent = w.word;
    document.getElementById("correct-pinyin").textContent = w.pinyin || "";
    document.getElementById("my-writing").src = pad ? pad.toImage() : "";
    show("screen-check");
  }

  function judge(isRight) {
    const w = session.words[session.idx];
    session.results.push({ word: w.word, pinyin: w.pinyin, right: isRight });
    if (!isRight) {
      addWrong(w);
      updateWrongBadge();
    } else {
      // 写对了：如果它在错词本里，订正成功就移除
      removeWrong(w.word);
      updateWrongBadge();
    }
    session.idx++;
    if (session.idx >= session.words.length) {
      showResult();
    } else {
      show("screen-dictation");
      loadCurrentWord();
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
        chip.textContent = r.word;
        box.appendChild(chip);
      });
    }
    // 记住本轮错词，供"立刻订正"用
    showResult._wrong = wrongList.map(r => ({ word: r.word, pinyin: r.pinyin }));
    show("screen-result");
  }

  // ---------- 首页：渲染课文列表 ----------
  function renderLessons() {
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";
    DATA.lessons.forEach(L => {
      const card = document.createElement("div");
      card.className = "lesson-card";
      card.innerHTML =
        '<div class="lc-unit">第' + L.unit + '单元</div>' +
        '<div class="lc-title">' + L.lesson + '. ' + L.title + '</div>' +
        '<div class="lc-count">' + L.words.length + ' 个词语</div>';
      card.addEventListener("click", () => startSession(L.words, L.lesson + ". " + L.title));
      list.appendChild(card);
    });
  }

  // ---------- 错词本默写 ----------
  function startWrongBook() {
    const list = loadWrong();
    if (list.length === 0) {
      flash("错词本是空的，先去默写吧 📖");
      return;
    }
    const words = list.map(w => ({ word: w.word, pinyin: w.pinyin }));
    startSession(words, "📕 错词订正");
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
    pad = new HandwritingPad(document.getElementById("pad"));

    document.getElementById("btn-clear").addEventListener("click", () => pad.clear());
    document.getElementById("btn-submit").addEventListener("click", submitWriting);
    document.getElementById("btn-right").addEventListener("click", () => judge(true));
    document.getElementById("btn-wrong").addEventListener("click", () => judge(false));
    document.getElementById("btn-wrongbook").addEventListener("click", startWrongBook);
    document.getElementById("btn-retry-wrong").addEventListener("click", () => {
      const w = showResult._wrong || [];
      if (w.length) startSession(w, "📕 错词订正");
    });
    document.querySelectorAll("[data-back]").forEach(b => {
      b.addEventListener("click", () => { window.speechSynthesis && window.speechSynthesis.cancel(); show("screen-home"); });
    });
  }

  // ---------- 启动 ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderLessons();
    updateWrongBadge();
    bind();
  });
})();
