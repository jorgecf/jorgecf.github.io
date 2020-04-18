function checkOffline() {
    if (navigator.onLine) {
        document.getElementById("offline-warning").style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", checkOffline)