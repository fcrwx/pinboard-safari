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

  try {
    const res = await fetch(`${PINBOARD_API}/posts/add?${params}`);
    const data = await res.json();
    if (data.result_code === "done") {
      flashBadge("✓", "#2a7f3a");
    } else {
      flashBadge("!", "#c33");
      console.error("Pinboard error:", data);
    }
  } catch (err) {
    flashBadge("!", "#c33");
    console.error(err);
  }
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
