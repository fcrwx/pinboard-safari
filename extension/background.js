const PINBOARD_API = "https://api.pinboard.in/v1";

async function getToken() {
  const { token } = await browser.storage.local.get("token");
  return token;
}

async function saveCurrentTab() {
  const token = await getToken();
  if (!token) {
    browser.runtime.openOptionsPage();
    return;
  }

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const params = new URLSearchParams({
    url: tab.url,
    description: tab.title || tab.url,
    auth_token: token,
    format: "json",
    toread: "no",
    shared: "no",
  });

  let diag = { when: new Date().toISOString(), url: tab.url };
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
  } catch (err) {
    diag.ok = false;
    diag.fetchError = String(err);
    flashBadge("!", "#c33");
  }
  await browser.storage.local.set({ lastResult: diag });
  console.log("Pinboard result:", diag);
}

function flashBadge(text, color) {
  browser.action.setBadgeText({ text });
  browser.action.setBadgeBackgroundColor({ color });
  setTimeout(() => browser.action.setBadgeText({ text: "" }), 2000);
}

browser.action.onClicked.addListener(saveCurrentTab);

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "open-pinboard",
    title: "Open pinboard.in",
    contexts: ["action"],
  });
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "open-pinboard") {
    browser.tabs.create({ url: "https://pinboard.in" });
  }
});
