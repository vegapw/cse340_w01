const pswBtn = document.querySelector("#showpsw");

if (pswBtn) {
    pswBtn.addEventListener("click", () => {
        const pswInput = document.querySelector("#account_password");
        const type = pswInput.getAttribute("type");
        if (type == "password"){
            pswInput.setAttribute("type", "text");
            pswBtn.innerHTML = "Hide Password";
        }
        else {
            pswInput.setAttribute("type", "password");
            pswBtn.innerHTML = "Show Password";
        }
    });
};
