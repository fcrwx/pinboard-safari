const PINBOARD_API = "https://api.pinboard.in/v1";

async function getToken() {
  const { token } = await browser.storage.local.get("token");
  return token;
}

async function saveCurrentTab(shared) {
  const token = await getToken();
  if (!token) {
    browser.runtime.openOptionsPage();
    return { ok: false, needsToken: true };
  }

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return { ok: false };

  const params = new URLSearchParams({
    url: tab.url,
    description: tab.title || tab.url,
    auth_token: token,
    format: "json",
    toread: "no",
    shared: shared === "yes" ? "yes" : "no",
  });

  let diag = { when: new Date().toISOString(), url: tab.url, shared: params.get("shared") };
  try {
    const res = await fetch(`${PINBOARD_API}/posts/add?${params}`);
    const text = await res.text();
    diag.status = res.status;
    diag.body = text.slice(0, 500);
    let ok = false;
    try {
      const data = JSON.parse(text);
      ok = data.result_code === "done";
      diag.parsed = data;
    } catch (e) {
      ok = res.ok && /done/i.test(text);
      diag.parseError = String(e);
    }
    diag.ok = ok;
    flashBadge(ok ? "✓" : "!", ok ? "#2a7f3a" : "#c33");
    await browser.storage.local.set({ lastResult: diag });
    console.log("Pinboard result:", diag);
    return { ok };
  } catch (err) {
    diag.ok = false;
    diag.fetchError = String(err);
    flashBadge("!", "#c33");
    await browser.storage.local.set({ lastResult: diag });
    console.log("Pinboard result:", diag);
    return { ok: false };
  }
}

function flashBadge(text, color) {
  browser.action.setBadgeText({ text });
  browser.action.setBadgeBackgroundColor({ color });
  setTimeout(() => browser.action.setBadgeText({ text: "" }), 2000);
}

browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "save") {
    saveCurrentTab(msg.shared).then(sendResponse);
    return true;
  }
});
