document.addEventListener("click", e => {
  if (e.target.matches("[data-up-vote-btn]")) handleUpVote(e.target)
})

function handleUpVote(button) {
  button.disabled = true
  const suggestionCard = button.closest("[data-suggestion-id]")
  fetch("/up-vote-suggestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ suggestionId: suggestionCard.dataset.suggestionId }),
  })
    .then(res => res.json())
    .then(({ votes }) => {
      const upVoteCount = suggestionCard.querySelector("[data-up-vote-count]")
      upVoteCount.textContent = votes
    })
    .finally(() => {
      button.disabled = false
    })
}
