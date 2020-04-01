function onLoadTheme() {
    let pref = localStorage.getItem("jcf_theme_pref");

    if (pref == "L") {
        document.body.parentElement.classList.add("light-body");
    } else {
        document.body.parentElement.classList.add("dark-body");
    }
}

function switchTheme() {
    let current = localStorage.getItem("jcf_theme_pref");

    if (current == "L") {
        document.body.parentElement.classList.replace("light-body", "dark-body");
        localStorage.setItem("jcf_theme_pref", "D");
    }
    else {
        document.body.parentElement.classList.replace("dark-body", "light-body");
        localStorage.setItem("jcf_theme_pref", "L");
    }
}

document.addEventListener("DOMContentLoaded", onLoadTheme)