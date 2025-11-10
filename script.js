
const grid = document.getElementById("grid");
const popover = document.getElementById("popover");
const greenBtn = document.getElementById("greenBtn");
const redBtn = document.getElementById("redBtn");
const resetBtn = document.getElementById("resetBtn");
let currentBox = null;

// Load saved statuses from localStorage
const savedStatuses = JSON.parse(localStorage.getItem("boxStatuses") || "{}");

for (let i = 1; i <= 4000; i++) {
  const box = document.createElement("div");
  box.className = "box";
  box.textContent = i;
  box.id = `box-${i}`;

  // Restore status if saved
  if (savedStatuses[i]) {
    box.classList.add(savedStatuses[i]);
    box.dataset.readonly = "true";
  }

  grid.appendChild(box);
}

function searchNumber() {
  const input = document.getElementById("searchInput");
  const number = parseInt(input.value);
  if (number >= 1 && number <= 4000) {
    const target = document.getElementById(`box-${number}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.backgroundColor = "#ffeb3b";
      setTimeout(() => {
        target.style.backgroundColor = "";
      }, 2000);
    }
  } else {
    alert("Please enter a number between 1 and 4000.");
  }
}

grid.addEventListener("click", (e) => {
  const box = e.target.closest(".box");
  if (!box || box.dataset.readonly === "true") return;

  currentBox = box;
  const rect = box.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;
  popover.style.display = "block";
});

greenBtn.onclick = () => updateStatus("green");
redBtn.onclick = () => updateStatus("red");

resetBtn.onclick = () => {
  // Clear all statuses
  for (let i = 1; i <= 4000; i++) {
    const box = document.getElementById(`box-${i}`);
    if (box) {
      box.classList.remove("green", "red");
      delete box.dataset.readonly;
    }
  }
  // Clear localStorage
  localStorage.removeItem("boxStatuses");
  // Clear savedStatuses object
  for (const key in savedStatuses) {
    delete savedStatuses[key];
  }
  popover.style.display = "none";
};

function updateStatus(status) {
  if (!currentBox || currentBox.dataset.readonly === "true") return;

  currentBox.classList.remove("green", "red");
  currentBox.classList.add(status);
  currentBox.dataset.readonly = "true";

  // Save to localStorage
  const boxId = currentBox.textContent;
  savedStatuses[boxId] = status;
  localStorage.setItem("boxStatuses", JSON.stringify(savedStatuses));

  popover.style.display = "none";
}

document.addEventListener("click", (e) => {
  if (!popover.contains(e.target) && !grid.contains(e.target)) {
    popover.style.display = "none";
  }
});
