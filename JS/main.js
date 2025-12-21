// ================= ГЛАВНАЯ ================= //
var swiper = new Swiper(".home__slider", {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
});

// ================= ГАЛЛЕРЕЯ ================= //
const galleryImages = document.querySelectorAll(".gallery__img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentIndex = 0;

if (galleryImages.length && lightbox && lightboxImg) {

    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            lightbox.classList.add("active");
            lightboxImg.src = img.src;
            document.body.style.overflow = "hidden";
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    function showImage(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "ArrowLeft") showImage(currentIndex - 1);
        if (e.key === "ArrowRight") showImage(currentIndex + 1);
        if (e.key === "Escape") {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}

// ================= CATEGORIES ANIMATION SAFE ================= //
const categoriesCards = document.querySelectorAll('.categories__card');

if (categoriesCards.length) {
    function showCards() {
        const triggerBottom = window.innerHeight * 0.85;

        categoriesCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('show');
            }
        });
    }

    window.addEventListener('scroll', showCards);
    window.addEventListener('load', showCards);
}

// ================= ОТЗЫВЫ ================= //
var customerSwiper = new Swiper(".customers__slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    navigation: {
        nextEl: ".customers__next",
        prevEl: ".customers__prev",
    },
    breakpoints: {
        800: { slidesPerView: 2 }
    }
});

// ================= REVIEWS MODAL ================= //
const modal = document.getElementById("reviewModal");
const openModal = document.getElementById("openReviewModal");
const closeModal = document.getElementById("closeReviewModal");

if (openModal && modal && closeModal) {
    openModal.addEventListener("click", () => modal.classList.add("active"));
    closeModal.addEventListener("click", () => modal.classList.remove("active"));
}

// ================= STAR RATING ================= //
const stars = document.querySelectorAll("#starRating i");
let selectedRating = 0;

stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => highlightStars(index));
    star.addEventListener("mouseleave", () => highlightStars(selectedRating - 1));
    star.addEventListener("click", () => selectStar(index));
});

function highlightStars(index) {
    stars.forEach((star, i) => {
        star.classList.toggle("active", i <= index);
    });
}

function selectStar(index) {
    selectedRating = index + 1;
    highlightStars(index);
}

// ================= REVIEWS LOCAL STORAGE ================= //
const STORAGE_KEY = "coffee_reviews";
let savedReviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
savedReviews.forEach(review => addReviewToSlider(review));

document.getElementById("reviewForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const text = document.getElementById("reviewText").value;

    if (selectedRating === 0) {
        alert("Пожалуйста, выберите оценку!");
        return;
    }

    const rating = "★".repeat(selectedRating) + "☆".repeat(5 - selectedRating);

    const newReview = {
        name,
        text,
        rating,
    };

    savedReviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReviews));
    addReviewToSlider(newReview);

    this.reset();
    selectedRating = 0;
    stars.forEach(star => star.classList.remove("active"));
    modal.classList.remove("active");

    alert("Спасибо за ваш отзыв! ☕");
});

function addReviewToSlider(review) {
    const container = document.getElementById("reviewsContainer");
    if (!container) return;

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    slide.innerHTML = `
        <article class="customers__card">
            <div class="customers__top">
                <img src="${review.photo}" class="customers__img">
                <div>
                    <h3 class="customers__name">${review.name}</h3>
                    <div class="customers__rating">${review.rating}</div>
                </div>
            </div>
            <p class="customers__text">${review.text}</p>
        </article>
    `;

    container.prepend(slide);
    customerSwiper.update();
}

// CONTACT DATA //
fetch("contacts.json")
    .then(res => res.json())
    .then(data => {
        const infoList = document.getElementById("contactsInfo");

        infoList.innerHTML = `
            <li><i class='bx bx-map'></i>${data.address}</li>
            <li><i class='bx bx-phone'></i>${data.phone}</li>
            <li><i class='bx bx-envelope'></i>${data.email}</li>
            <li><i class='bx bx-time-five'></i>${data.workTime.weekdays}</li>
            <li><i class='bx bx-time-five'></i>${data.workTime.weekend}</li>
        `;

        const socials = document.getElementById("contactsSocials");
        socials.innerHTML = `
            <a href="${data.socials.instagram}" target="_blank"><i class='bx bxl-instagram'></i></a>
            <a href="${data.socials.facebook}" target="_blank"><i class='bx bxl-facebook'></i></a>
            <a href="${data.socials.telegram}" target="_blank"><i class='bx bxl-telegram'></i></a>
        `;
    })
    .catch(err => console.error("Ошибка загрузки contacts.json:", err));

/* ================== OPEN/CLOSED STATUS ================== */
function checkOpenStatus() {
    const statusEl = document.getElementById("contactStatus");
    if (!statusEl) return; // на всякий случай, чтобы не упало

    const now = new Date();
    const day = now.getDay();       // 0 = Вс, 1 = Пн, ..., 6 = Сб
    const hour = now.getHours();
    const minute = now.getMinutes();

    function inRange(startH, startM, endH, endM) {
        const nowMin = hour * 60 + minute;
        return nowMin >= startH * 60 + startM && nowMin <= endH * 60 + endM;
    }

    let isOpen = false;

    if (day >= 1 && day <= 5) {
        // Пн–Пт: 08:00–22:00
        isOpen = inRange(8, 0, 22, 0);
    } else {
        // Сб–Вс: 09:00–23:00
        isOpen = inRange(9, 0, 23, 0);
    }

    if (isOpen) {
        statusEl.textContent = "🟢 Открыто сейчас";
        statusEl.classList.add("contacts__status--open");
        statusEl.classList.remove("contacts__status--closed");
    } else {
        statusEl.textContent = "🔴 Закрыто";
        statusEl.classList.add("contacts__status--closed");
        statusEl.classList.remove("contacts__status--open");
    }
}

checkOpenStatus();
setInterval(checkOpenStatus, 60000); // обновляем каждую минуту

// ===== STORY MODAL (ABOUT US отдельная страница) ===== //

const storyBtn = document.getElementById("storyModalOpen");
const storyModal = document.getElementById("storyModal");
const storyModalClose = document.getElementById("storyModalClose");

if (storyBtn && storyModal && storyModalClose) {
    storyBtn.addEventListener("click", () => {
        storyModal.classList.add("story-modal--visible");
        document.body.style.overflow = "hidden";
    });

    storyModalClose.addEventListener("click", () => {
        storyModal.classList.remove("story-modal--visible");
        document.body.style.overflow = "";
    });

    storyModal.addEventListener("click", (e) => {
        if (e.target.classList.contains("story-modal__overlay")) {
            storyModal.classList.remove("story-modal--visible");
            document.body.style.overflow = "";
        }
    });
}

// ===== STATS COUNTER (ABOUT US) ===== //
const statsSection = document.querySelector(".stats__container");
const counters = document.querySelectorAll(".stats__number");
let statsStarted = false;

if (statsSection && counters.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsStarted) {
                statsStarted = true;

                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.counter, 10) || 0;
                    const suffix = counter.dataset.suffix || "";
                    let start = 0;
                    const duration = 1500;
                    const startTime = performance.now();

                    function animate(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const value = Math.floor(progress * target);
                        counter.textContent = value + suffix;
                        if (progress < 1) requestAnimationFrame(animate);
                    }

                    requestAnimationFrame(animate);
                });

                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
}

// ================= SIMPLE CART ================= //
const CART_KEY = "coffee_cart_simple";

// ---------- CART HELPERS ---------- //

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) return;

    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = total;
}

// ---------- PRICE CALC ---------- //
function calculatePrice(card) {
    const category = card.dataset.category;
    const discount = Number(card.dataset.discount || 0);

    let basePrice = 0;

    // 🍰 ДЕСЕРТЫ / ЗЕРНО
    if (category === "dessert" || category === "beans") {
        basePrice = Number(card.dataset.price || 0);
    }
    // ☕ НАПИТКИ
    else {
        const size =
            card.querySelector(".size-options .active")?.dataset.size || "M";

        basePrice =
            size === "S"
                ? Number(card.dataset.priceS)
                : size === "L"
                ? Number(card.dataset.priceL)
                : Number(card.dataset.priceM);

        // сироп
        const syrup = card.querySelector(".syrup-select")?.value;
        if (syrup && syrup !== "Без сиропа") {
            basePrice += 3;
        }
    }

    const finalPrice = discount
        ? basePrice * (1 - discount / 100)
        : basePrice;

    return {
        base: Number(basePrice.toFixed(2)),
        final: Number(finalPrice.toFixed(2))
    };
}

function updateCardPrice(card) {
    const priceEl = card.querySelector(".product-card__price");
    if (!priceEl) return;

    const { base, final } = calculatePrice(card);

    priceEl.classList.remove("animate");
    void priceEl.offsetWidth; // reset animation
    priceEl.classList.add("animate");

    if (base > final) {
        priceEl.innerHTML = `
            <span class="product-card__price-old">${base} rub</span>
            <span class="product-card__price-new">${final} rub</span>
        `;
    } else {
        priceEl.innerHTML = `
            <span class="product-card__price-new">${final} rub</span>
        `;
    }
}

// ---------- ADD TO CART ---------- //
document.addEventListener("click", e => {
    const btn = e.target.closest(".product-card__add");
    if (!btn) return;

    const card = btn.closest(".product-card");
    const cart = getCart();
    const priceData = calculatePrice(card);

    const item = {
    id: card.dataset.id,
    title: card.dataset.title,
    img: card.dataset.img,
    category: card.dataset.category,

    size: card.dataset.category === "drink"
        ? card.querySelector(".size-options .active")?.dataset.size
        : null,

    milk: card.dataset.category === "drink"
        ? card.querySelector(".milk-select")?.value
        : null,

    syrup: card.dataset.category === "drink"
        ? card.querySelector(".syrup-select")?.value
        : null,

    price: priceData.final,     // ✅ цена со скидкой
    oldPrice: priceData.base,   // ✅ оригинальная цена
    qty: 1
};

    // ищем такой же товар
    const existing = cart.find(i =>
        i.id === item.id &&
        i.size === item.size &&
        i.milk === item.milk &&
        i.syrup === item.syrup
    );

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }

    saveCart(cart);
    updateCartCount();
});

document.addEventListener("click", (e) => {
    const sizeBtn = e.target.closest(".size-options button");
    if (!sizeBtn) return;

    const group = sizeBtn.closest(".size-options");
    group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    sizeBtn.classList.add("active");

    const card = sizeBtn.closest(".product-card");
    updateCardPrice(card);

    const priceEl = card.querySelector(".product-card__price");

    if (priceEl) {
    const priceData = calculatePrice(card);

        priceEl.innerHTML = `
        ${priceData.final}
        <span class="product-card__currency">rub</span>
`;
    }
});

// ---------- INIT ---------- //
document.addEventListener("DOMContentLoaded", updateCartCount);

// ================= CART PAGE RENDER ================= //
function renderCart() {
    const list = document.getElementById("cartList");
    const totalEl = document.getElementById("cartTotal");
    if (!list || !totalEl) return;

    const cart = getCart();
    list.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const optionsHTML =
            item.category === "drink"
                ? `
                <ul class="cart-item__options">
                    ${item.size ? `<li>☕ Размер: <b>${item.size}</b></li>` : ""}
                    ${item.milk ? `<li>🥛 Молоко: <b>${item.milk}</b></li>` : ""}
                    ${item.syrup && item.syrup !== "Без сиропа"? `<li>🍯 Сироп: <b>${item.syrup}</b></li>`: ""}
                </ul>`
                : "";

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item__info">
                <strong class="cart-item__title">${item.title}</strong>

                ${optionsHTML}

                <div class="cart-item__qty">
                    <button class="qty-btn minus">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn plus">+</button>
                </div>

                <div class="cart-item__price">
    ${
        item.oldPrice > item.price
            ? `<span class="cart-item__old">${item.oldPrice} rub</span>
            <span class="cart-item__new">${item.price} rub</span>`
            : `<span class="cart-item__new">${item.price} rub</span>`
    }
</div>
            </div>

            <button class="cart-item__remove">✖</button>
        `;

        // −
        div.querySelector(".minus").onclick = () => {
            if (item.qty > 1) {
                item.qty--;
            } else {
                cart.splice(index, 1);
            }
            saveCart(cart);
            renderCart();
            updateCartCount();
        };

        // +
        div.querySelector(".plus").onclick = () => {
            item.qty++;
            saveCart(cart);
            renderCart();
            updateCartCount();
        };

        // ✖
        div.querySelector(".cart-item__remove").onclick = () => {
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
            updateCartCount();
        };

        list.appendChild(div);
    });

    totalEl.textContent = `Итого: ${total.toFixed(2)} rub`;

    const checkoutBtn = document.getElementById("checkoutBtn");
        if (checkoutBtn) {
        checkoutBtn.style.display = cart.length ? "inline-flex" : "none";
}
}

// рендер при загрузке страницы
document.addEventListener("DOMContentLoaded", renderCart);

// ================= Фильтр для меню ================= //
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter__btn");
    const cards = document.querySelectorAll(".product-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // активная кнопка
            filterButtons.forEach(b => b.classList.remove("filter__btn--active"));
            btn.classList.add("filter__btn--active");

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const category = card.dataset.category; // drink / dessert / beans
                const type = card.dataset.type;         // hot / cold

                let show = false;

                if (filter === "all") {
                    show = true;
                } 
                else if (filter === "hot") {
                    show = category === "drink" && type === "hot";
                } 
                else if (filter === "cold") {
                    show = category === "drink" && type === "cold";
                } 
                else {
                    show = category === filter; // beans / dessert
                }

                card.style.display = show ? "block" : "none";
            });
        });
    });
});

// ================= Лайк карточки ================= //
document.addEventListener("click", (e) => {
    const likeBtn = e.target.closest(".product-card__like");
    if (!likeBtn) return;

    likeBtn.classList.toggle("liked");

    // меняем иконку: outline -> solid
    const icon = likeBtn.querySelector("i");
    if (!icon) return;

    if (likeBtn.classList.contains("liked")) {
        icon.classList.remove("bx-heart");
        icon.classList.add("bxs-heart");
    } else {
        icon.classList.remove("bxs-heart");
        icon.classList.add("bx-heart");
    }
});

// ================= PRODUCT OPTIONS INSERT (SAFE) =================
document.addEventListener("DOMContentLoaded", () => {
    const template = document.getElementById("productOptionsTemplate");
    if (!template) return;

    document.querySelectorAll(".product-card").forEach(card => {
        const category = card.dataset.category; // drink / dessert / beans
        const type = card.dataset.type;         // hot / cold

        // ❌ опции ТОЛЬКО для напитков
        if (category !== "drink") return;

        // ❌ чтобы не вставлять повторно
        if (card.querySelector(".product-options")) return;

        const clone = template.content.cloneNode(true);

        // ❌ запрещаем молоко для холодных напитков
        if (type === "cold") {
            const milkGroup = clone
                .querySelector(".milk-select")
                ?.closest(".option-group");

            if (milkGroup) milkGroup.remove();
        }

        const body = card.querySelector(".product-card__body");
        const footer = card.querySelector(".product-card__foot");

        if (body && footer) {
            body.insertBefore(clone, footer);
        }
    });
});

document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("syrup-select")) return;

    const card = e.target.closest(".product-card");
    updateCardPrice(card);
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".product-card").forEach(card => {
        updateCardPrice(card);
    });
});

// ================= ОФОРМЛЕНИЕ ЗАКАЗА ================= //

// ================= НАСТРОЙКИ ================= //
const MIN_PREP_MINUTES = 15;
const FREE_DELIVERY_FROM = 300;
const DELIVERY_PRICE = 25;

// ================= УТИЛИТЫ ================= //
function getCart() {
    return JSON.parse(localStorage.getItem("coffee_cart_simple") || "[]");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
}

// ================= ВРЕМЯ ================= //
function getReadyTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + MIN_PREP_MINUTES);
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function validateTime(time) {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);
    const selected = new Date();
    selected.setHours(h, m, 0, 0);
    if (selected <= now) selected.setDate(selected.getDate() + 1);
    return selected > now;
}

// ================= ТЕКСТ ДОСТАВКИ ================= //
function getDeliveryText(type, time) {
    if (type === "pickup") {
        return `
            ☕ <b>Самовывоз</b><br>
            Заказ будет готов к <b>${time}</b><br>
            г. Тирасполь, ул. Ленина, 15
        `;
    }

    return `
        🚚 <b>Доставка</b><br>
        Курьер привезёт заказ к <b>${time}</b><br>
        Пожалуйста, будьте на связи
    `;
}

// ================= КОРЗИНА ================= //
function renderCheckout() {
    const list = document.getElementById("checkoutCartList");
    if (!list) return;

    const cart = getCart();
    list.innerHTML = "";

    let sum = 0;

    cart.forEach(item => {
        sum += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "checkout-cart__item";
        div.innerHTML = `
            <b>${item.title}</b><br>
            ${item.size ? `Размер: ${item.size}` : ""}
            ${item.milk ? ` · Молоко: ${item.milk}` : ""}
            ${item.syrup ? ` · Сироп: ${item.syrup}` : ""}
            <br>Кол-во: ${item.qty} · ${item.price} rub
        `;
        list.appendChild(div);
    });

    document.getElementById("sumOrder").textContent = sum.toFixed(2);
    document.getElementById("sumDelivery").textContent = "0";
    document.getElementById("sumTotal").textContent = sum.toFixed(2);
}

// ================= ДОСТАВКА И СУММЫ ================= //
function renderCheckoutSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const deliveryType =
        document.querySelector('input[name="deliveryType"]:checked')?.value || "pickup";

    let deliveryPrice = 0;
    let deliveryText = "0";

    if (deliveryType === "delivery") {
        if (subtotal >= FREE_DELIVERY_FROM) {
            deliveryPrice = 0;
            deliveryText = "Бесплатно 🎉";
        } else {
            deliveryPrice = DELIVERY_PRICE;
            deliveryText = DELIVERY_PRICE.toFixed(2);
        }
    }

    document.getElementById("sumOrder").textContent = subtotal.toFixed(2);
    document.getElementById("sumDelivery").textContent = deliveryText;
    document.getElementById("sumTotal").textContent =
        (subtotal + deliveryPrice).toFixed(2);
}

// ================= ПОКАЗ ВРЕМЕНИ ТОЛЬКО ПРИ ДОСТАВКЕ ================= //
document.addEventListener("change", e => {
    if (e.target.name !== "deliveryType") return;

    const timeBlock = document.getElementById("deliveryTimeBlock");
    if (!timeBlock) return;

    if (e.target.value === "delivery") {
        timeBlock.classList.remove("hidden");
    } else {
        timeBlock.classList.add("hidden");

        const timeInput = document.getElementById("orderTime");
        if (timeInput) timeInput.value = "";

        document
            .querySelector('input[name="timeMode"][value="now"]')
            ?.click();
    }

    renderCheckoutSummary();
});

// ================= ВЫБОР ВРЕМЕНИ ================= //
document.addEventListener("change", e => {
    if (e.target.name !== "timeMode") return;

    const timeInput = document.getElementById("orderTime");
    if (!timeInput) return;

    if (e.target.value === "custom") {
        timeInput.classList.remove("hidden");
        timeInput.focus();
    } else {
        timeInput.classList.add("hidden");
        timeInput.value = "";
    }
});

// ================= ПОДТВЕРЖДЕНИЕ ЗАКАЗА ================= //
document.addEventListener("click", e => {
    const btn = e.target.closest(".checkout-confirm");
    if (!btn) return;

    e.preventDefault();

    const deliveryType =
        document.querySelector('input[name="deliveryType"]:checked')?.value || "pickup";

    const timeMode =
        document.querySelector('input[name="timeMode"]:checked')?.value || "now";

    let finalTime = "";

    if (deliveryType === "delivery") {
        if (timeMode === "custom") {
            const timeInput = document.getElementById("orderTime");
            if (!timeInput || !timeInput.value) {
                alert("⏰ Пожалуйста, выберите время доставки");
                return;
            }
            if (!validateTime(timeInput.value)) {
                alert("⏰ Выберите корректное время");
                return;
            }
            finalTime = timeInput.value;
        } else {
            finalTime = getReadyTime();
        }
    } else {
        finalTime = getReadyTime();
    }

    btn.classList.add("loading");
    btn.textContent = "Оформляем заказ…";

    setTimeout(() => {
        const modal = document.getElementById("orderModal");
        const orderNumberEl = document.getElementById("orderNumber");
        const modalText = modal.querySelector(".order-modal__text");

        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        orderNumberEl.textContent = "#" + orderNumber;
        modalText.innerHTML = getDeliveryText(deliveryType, finalTime);

        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        localStorage.removeItem("coffee_cart_simple");
        updateCartCount();

        btn.classList.remove("loading");
        btn.textContent = "Оплатить заказ";
    }, 1800);
});

// ================= МОДАЛКА ================= //
document.getElementById("orderModalClose")?.addEventListener("click", () => {
    document.getElementById("orderModal").classList.remove("active");
    document.body.style.overflow = "";
});

document.querySelector(".order-modal__overlay")?.addEventListener("click", () => {
    document.getElementById("orderModal").classList.remove("active");
    document.body.style.overflow = "";
});

// ================= INIT ================= //
document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();
    renderCheckoutSummary();
    updateCartCount();
});

// ================= BURGER MENU ================= //
const burger = document.getElementById("menu-icon");
const menu = document.querySelector(".menu");
const overlay = document.getElementById("navOverlay");

if (burger && menu && overlay) {
    burger.addEventListener("click", () => {
        menu.classList.toggle("active");
        overlay.classList.toggle("active");
        burger.classList.toggle("bx-x");
    });

    overlay.addEventListener("click", closeMenu);

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    function closeMenu() {
        menu.classList.remove("active");
        overlay.classList.remove("active");
        burger.classList.remove("bx-x");
    }
}

// ================= DARK MODE =================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// загрузка темы
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeToggle?.querySelector("i")?.classList.replace("bx-moon", "bx-sun");
}

themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");

    const icon = themeToggle.querySelector("i");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        icon.classList.replace("bx-moon", "bx-sun");
    } else {
        localStorage.setItem("theme", "light");
        icon.classList.replace("bx-sun", "bx-moon");
    }
});


// ================= FOOTER YEAR ================= //
document.getElementById("footerYear").textContent = new Date().getFullYear();













































// ================= ACTIVE MENU AUTO =================
const menuLinks = document.querySelectorAll(".menu__item a");

const currentPage = window.location.pathname.split("/").pop() || "index.html";

menuLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }
});
