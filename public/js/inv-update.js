const form = document.getElementById('updateForm');
form.addEventListener("change", () => {
    const updateBtn = document.querySelector("#updateBtn");
    updateBtn.removeAttribute("disabled");
});