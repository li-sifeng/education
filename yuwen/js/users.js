/* 用户档案管理（本地多用户，无后端）
   - 所有数据存 localStorage，按设备隔离
   - 每个用户有独立的错词库/进度（key 带 uid）
   - 支持新建、切换、改名、删除、可选4位PIN
*/
(function () {
  "use strict";

  const USERS_KEY = "edu_users_v1";       // 用户列表
  const CURRENT_KEY = "edu_current_uid";  // 当前登录的用户 id

  // 头像可选表情，建用户时轮流分配
  const AVATARS = ["🐼", "🐯", "🦊", "🐰", "🐱", "🐶", "🐵", "🦁", "🐸", "🐨"];

  function uid() {
    return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  // 首次启动：如果一个用户都没有，预置示例用户（小胖 + 待定）
  function ensureSeed() {
    let list = loadUsers();
    if (list.length === 0) {
      list = [
        { id: uid(), name: "小胖", avatar: "🐼", pin: "" },
        { id: uid(), name: "小朋友2", avatar: "🐯", pin: "" }
      ];
      saveUsers(list);
    }
    return list;
  }

  function getCurrentId() { return localStorage.getItem(CURRENT_KEY) || ""; }
  function setCurrentId(id) { localStorage.setItem(CURRENT_KEY, id); }
  function getCurrent() {
    const id = getCurrentId();
    return loadUsers().find(u => u.id === id) || null;
  }

  function addUser(name) {
    const list = loadUsers();
    const avatar = AVATARS[list.length % AVATARS.length];
    const u = { id: uid(), name: name || "新同学", avatar: avatar, pin: "" };
    list.push(u);
    saveUsers(list);
    return u;
  }
  function renameUser(id, name) {
    const list = loadUsers();
    const u = list.find(x => x.id === id);
    if (u) { u.name = name; saveUsers(list); }
  }
  function setPin(id, pin) {
    const list = loadUsers();
    const u = list.find(x => x.id === id);
    if (u) { u.pin = pin || ""; saveUsers(list); }
  }
  function removeUser(id) {
    saveUsers(loadUsers().filter(u => u.id !== id));
    // 同时清掉该用户的错词库数据
    try { localStorage.removeItem("yuwen_wrongbook_" + id); } catch (e) {}
    if (getCurrentId() === id) localStorage.removeItem(CURRENT_KEY);
  }

  // 暴露给全局
  window.EduUsers = {
    AVATARS,
    ensureSeed, loadUsers, saveUsers,
    getCurrent, getCurrentId, setCurrentId,
    addUser, renameUser, setPin, removeUser
  };
})();
