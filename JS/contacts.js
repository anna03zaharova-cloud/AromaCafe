fetch("Contacts.json")
    .then(res => res.json())
    .then(data => {
        contactAddress.textContent = data.address;
        contactPhone.textContent = data.phone;
        contactEmail.textContent = data.email;

        workWeekdays.textContent = data.workTime.weekdays;
        workWeekend.textContent = data.workTime.weekend;

        socialInstagram.href = data.socials.instagram;
        socialFacebook.href = data.socials.facebook;
        socialTelegram.href = data.socials.telegram;
    });

function updateStatus(){
    const status = document.getElementById("contactStatus");
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const open =
        (day >= 1 && day <= 5 && hour >= 8 && hour < 22) ||
        ((day === 0 || day === 6) && hour >= 9 && hour < 23);

    status.textContent = open ? "🟢 Сейчас открыто" : "🔴 Сейчас закрыто";
    status.className = "contacts-status " + (open ? "open" : "closed");
}

updateStatus();
setInterval(updateStatus, 60000);

document.getElementById("contactForm")?.addEventListener("submit", e => {
    e.preventDefault();

document.getElementById("formSuccess").style.display = "block";
    e.target.reset();

    setTimeout(() => {
document.getElementById("formSuccess").style.display = "none";
}, 4000);
});
