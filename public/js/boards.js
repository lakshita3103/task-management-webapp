const toggleButton = document.querySelector("#toggle-board-form");
const boardFormPanel = document.querySelector("[data-board-form-panel]");
const closeBoardFormButton = document.querySelector("[data-close-board-form]");
const boardSearchInput = document.querySelector("#board-search");
const boardCards = document.querySelectorAll("[data-board-card]");

if (toggleButton && boardFormPanel) {
  toggleButton.addEventListener("click", () => {
    boardFormPanel.classList.toggle("hidden");
    if (!boardFormPanel.classList.contains("hidden")) {
      const firstField = boardFormPanel.querySelector("input[name='title']");
      if (firstField) {
        firstField.focus();
      }
    }
  });
}

if (closeBoardFormButton && boardFormPanel) {
  closeBoardFormButton.addEventListener("click", () => {
    boardFormPanel.classList.add("hidden");
  });
}

if (boardSearchInput && boardCards.length) {
  boardSearchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();

    boardCards.forEach((card) => {
      const boardTitle = card.dataset.boardTitle || "";
      const isVisible = boardTitle.includes(searchTerm);
      card.classList.toggle("hidden", !isVisible);
    });
  });
}
