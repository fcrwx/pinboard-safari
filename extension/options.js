const tokenInput = document.getElementById("token");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");
const lastEl = document.getElementById("last");
const refreshBtn = document.getElementById("refresh");

async function loadLast() {
  const { lastResult } = await browser.storage.local.get("lastResult");
  lastEl.textContent = lastResult ? JSON.stringify(lastResult, null, 2) : "(none yet)";
}

(async () => {
  const { token } = await browser.storage.local.get("token");
  if (token) tokenInput.value = token;
  loadLast();
})();

refreshBtn.addEventListener("click", loadLast);

saveBtn.addEventListener("click", async () => {
  const token = tokenInput.value.trim();
  await browser.storage.local.set({ token });
  status.textContent = token ? "Saved." : "Cleared.";
  status.className = "status ok";
});
