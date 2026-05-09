const statusEl = document.getElementById("status");

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = cls || "";
}

async function save(shared) {
  setStatus("Saving…");
  try {
    const res = await browser.runtime.sendMessage({ type: "save", shared });
    if (res?.ok) {
      setStatus("Saved.", "ok");
      setTimeout(() => window.close(), 600);
    } else if (res?.needsToken) {
      setStatus("Set your token in Options.", "err");
    } else {
      setStatus("Save failed.", "err");
    }
  } catch (e) {
    setStatus("Save failed.", "err");
  }
}

document.getElementById("save-public").addEventListener("click", () => save("yes"));
document.getElementById("save-private").addEventListener("click", () => save("no"));
document.getElementById("open-pinboard").addEventListener("click", () => {
  browser.tabs.create({ url: "https://pinboard.in" });
  window.close();
});
