const tokenInput = document.getElementById("token");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

(async () => {
  const { token } = await browser.storage.local.get("token");
  if (token) tokenInput.value = token;
})();

saveBtn.addEventListener("click", async () => {
  const token = tokenInput.value.trim();
  await browser.storage.local.set({ token });
  status.textContent = token ? "Saved." : "Cleared.";
  status.className = "status ok";
});
