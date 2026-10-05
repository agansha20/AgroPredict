/* ==================================================
   AgroPredict - Shared Behaviour
   ================================================== */


/* ==================================================
   PAGES
   ================================================== */

const PAGES = {
    login: "index.html",
    signup: "signup.html",
    home: "home.html",
    crop: "crop-guide.html",
    cropResult: "crop-result.html",
    yield: "yield.html",
    yieldResult: "yield-result.html",
    history: "history.html",
    profile: "profile.html",
    edit: "edit-profile.html"
};


/* ==================================================
   API
   ================================================== */

const API = "https://agropredict-production.up.railway.app";


/* ==================================================
   HELPERS
   ================================================== */

function $(id) {
    return document.getElementById(id);
}


function num(id) {

    const element = $(id);

    if (!element) {
        return 0;
    }

    return parseFloat(element.value) || 0;
}


/* ==================================================
   LOCAL STORAGE
   ================================================== */

const store = {

    get: function (key, defaultValue) {

        const value =
            localStorage.getItem(
                "agro_" + key
            );

        return value !== null
            ? value
            : defaultValue;
    },

    set: function (key, value) {

        localStorage.setItem(
            "agro_" + key,
            value
        );
    }
};


/* ==================================================
   NAVIGATION
   ================================================== */

function go(key) {

    console.log(
        "NAVIGATE:",
        key
    );

    if (PAGES[key]) {

        window.location.href =
            PAGES[key];

        return;
    }

    if (
        typeof key === "string" &&
        key.endsWith(".html")
    ) {

        window.location.href =
            key;

        return;
    }

    console.error(
        "Unknown page:",
        key
    );
}


/* ==================================================
   CROP RECOMMENDATION
   ================================================== */

function recommendCrop(
    n,
    p,
    ph,
    t,
    h,
    r
) {

    if (
        r > 150 &&
        h > 70
    ) {

        return "Rice";
    }


    if (
        t >= 18 &&
        t <= 27 &&
        r >= 60 &&
        r <= 120
    ) {

        return "Maize";
    }


    if (
        n > 90 &&
        t > 24
    ) {

        return "Cotton";
    }


    if (
        t < 20 &&
        r < 100
    ) {

        return "Wheat";
    }


    if (ph < 6) {

        return "Potato";
    }


    return "Rice";
}


/* ==================================================
   YIELD
   ================================================== */

const perHa = {

    rice: 4.2,
    wheat: 3.5,
    maize: 5.5,
    cotton: 2,
    sugarcane: 70,
    potato: 22,
    tomato: 30

};


function estimateYield(
    crop,
    area,
    fertilizer,
    rainfall
) {

    const cropName =
        String(crop || "")
            .trim()
            .toLowerCase();


    const base =
        perHa[cropName] || 3;


    const fert =
        Number(fertilizer) || 0;


    const rain =
        Number(rainfall) || 0;


    const fieldArea =
        Number(area) || 1;


    const boost =
        1 +
        Math.min(fert, 200) / 1000 +
        (
            rain >= 50 &&
            rain <= 250
                ? 0.05
                : 0
        );


    return +(
        base *
        fieldArea *
        boost
    ).toFixed(1);
}


/* ==================================================
   GET LOGGED USER
   ================================================== */

function getLoggedUser() {

    const saved =
        localStorage.getItem(
            "agro_user"
        );


    if (!saved) {

        return null;
    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        return null;
    }
}


/* ==================================================
   GET USER ID
   ================================================== */

function getUserId() {

    let userId =
        localStorage.getItem(
            "userId"
        );


    if (!userId) {

        userId =
            sessionStorage.getItem(
                "userId"
            );
    }


    if (!userId) {

        const user =
            getLoggedUser();


        if (
            user &&
            user.id !== undefined &&
            user.id !== null
        ) {

            userId =
                user.id;
        }
    }


    return userId;
}


/* ==================================================
   LOGIN
   ================================================== */

async function loginUser() {

    console.log(
        "LOGIN FUNCTION STARTED"
    );


    const emailElement =
        $("le");

    const passwordElement =
        $("lp");


    if (!emailElement) {

        console.error(
            "Email input #le not found"
        );

        alert(
            "Email field not found."
        );

        return;
    }


    if (!passwordElement) {

        console.error(
            "Password input #lp not found"
        );

        alert(
            "Password field not found."
        );

        return;
    }


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value.trim();


    if (!email) {

        alert(
            "Please enter your email."
        );

        emailElement.focus();

        return;
    }


    if (!password) {

        alert(
            "Please enter your password."
        );

        passwordElement.focus();

        return;
    }


    try {

        console.log(
            "CALLING LOGIN API"
        );


        const response =
            await fetch(
                API + "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


        console.log(
            "LOGIN STATUS:",
            response.status
        );


        let data = {};


        try {

            data =
                await response.json();

        } catch (jsonError) {

            console.error(
                "Response JSON error:",
                jsonError
            );

        }


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        if (response.ok) {

            const user =
                data.user || data;


            localStorage.setItem(
                "agro_user",
                JSON.stringify(user)
            );


            if (
                user &&
                user.id !== undefined &&
                user.id !== null
            ) {

                localStorage.setItem(
                    "userId",
                    String(user.id)
                );
            }


            store.set(
                "name",
                user.name || ""
            );


            store.set(
                "email",
                user.email || email
            );


            alert(
                data.message ||
                "Login successful!"
            );


            window.location.href =
                "home.html";


            return;
        }


        if (
            data.message ===
            "Invalid password"
        ) {

            alert(
                "Incorrect password."
            );

            passwordElement.value = "";

            passwordElement.focus();

            return;
        }


        if (
            data.message ===
            "User not found"
        ) {

            alert(
                "Email not registered."
            );

            emailElement.focus();

            return;
        }


        alert(
            data.message ||
            "Login failed."
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        alert(
            "Cannot connect to server. Make sure Spring Boot is running on port 8080."
        );
    }
}


/* ==================================================
   SIGNUP
   ================================================== */

async function signupUser() {

    console.log(
        "SIGNUP FUNCTION STARTED"
    );


    /*
       Supports both:
       sn = name
       su = name
    */

    const nameElement =
        $("sn") || $("su");


    const emailElement =
        $("se");


    const passwordElement =
        $("sp");


    if (!nameElement) {

        alert(
            "Name field not found."
        );

        return;
    }


    if (!emailElement) {

        alert(
            "Email field not found."
        );

        return;
    }


    if (!passwordElement) {

        alert(
            "Password field not found."
        );

        return;
    }


    const name =
        nameElement.value.trim();


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value.trim();


    if (!name) {

        alert(
            "Please enter your name."
        );

        nameElement.focus();

        return;
    }


    if (!email) {

        alert(
            "Please enter your email."
        );

        emailElement.focus();

        return;
    }


    if (!password) {

        alert(
            "Please enter your password."
        );

        passwordElement.focus();

        return;
    }


    try {

        const response =
            await fetch(
                API + "/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                data.message ||
                "Signup successful!"
            );


            store.set(
                "name",
                name
            );


            store.set(
                "email",
                email
            );


            window.location.href =
                "index.html";


            return;
        }


        if (
            data.message ===
            "Email already exists"
        ) {

            alert(
                "This email is already registered."
            );

            emailElement.focus();

            return;
        }


        alert(
            data.message ||
            "Signup failed."
        );


    } catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );


        alert(
            "Cannot connect to server. Make sure Spring Boot is running on port 8080."
        );
    }
}


/* ==================================================
   LOGOUT
   ================================================== */

function logoutUser() {

    localStorage.removeItem(
        "agro_user"
    );

    localStorage.removeItem(
        "userId"
    );

    sessionStorage.removeItem(
        "userId"
    );

    window.location.href =
        "index.html";
}


/* ==================================================
   CROP RECOMMEND
   ================================================== */

async function recommendUserCrop() {

    const userId =
        getUserId();


    if (!userId) {

        alert(
            "Please login first."
        );

        go("login");

        return;
    }


    const n =
        num("cn");

    const p =
        num("cp");

    const ph =
        num("cph");

    const t =
        num("ct");

    const h =
        num("ch");

    const r =
        num("cr");


    const crop =
        recommendCrop(
            n,
            p,
            ph,
            t,
            h,
            r
        );


    try {

        const response =
            await fetch(
                API +
                "/api/crop/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId:
                            Number(userId),

                        nitrogen:
                            n,

                        phosphorus:
                            p,

                        ph:
                            ph,

                        temperature:
                            t,

                        humidity:
                            h,

                        rainfall:
                            r
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Crop recommendation request failed"
            );
        }


        const data =
            await response.json();


        store.set(
            "crop",
            data.recommendedCrop ||
            crop
        );


        store.set(
            "cropCount",
            Number(
                store.get(
                    "cropCount",
                    0
                )
            ) + 1
        );


        go("cropResult");


    } catch (error) {

        console.error(
            "Crop recommendation error:",
            error
        );


        alert(
            "Unable to save crop recommendation."
        );
    }
}


/* ==================================================
   YIELD PREDICTION
   ================================================== */

async function predictYield() {

    const cropElement =
        $("yc");


    if (!cropElement) {

        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        alert(
            "Please login first."
        );

        go("login");

        return;
    }


    const crop =
        cropElement.value.trim();


    const area =
        num("ya");


    const fertilizer =
        num("yf");


    const rainfall =
        num("yr");


    try {

        const response =
            await fetch(
                API +
                "/api/yield/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId:
                            Number(userId),

                        crop:
                            crop,

                        area:
                            area,

                        fertilizer:
                            fertilizer,

                        rainfall:
                            rainfall
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Yield prediction request failed"
            );
        }


        const data =
            await response.json();


        const predictedYield =
            data.predictedYield ??
            estimateYield(
                crop,
                area,
                fertilizer,
                rainfall
            );


        store.set(
            "yield",
            predictedYield +
            " Tons"
        );


        store.set(
            "yieldCount",
            Number(
                store.get(
                    "yieldCount",
                    0
                )
            ) + 1
        );


        go("yieldResult");


    } catch (error) {

        console.error(
            "Yield prediction error:",
            error
        );


        alert(
            "Unable to save yield prediction."
        );
    }
}


/* ==================================================
   PROFILE SAVE
   ================================================== */

function saveProfile() {

    const user = getLoggedUser();

    if (!user || !user.id) {
        alert("Please login again.");
        go("login");
        return;
    }

    const nameElement = $("en");
    const phoneElement = $("ep");
    const emailElement = $("ee");

    const name = nameElement
        ? nameElement.value.trim()
        : "";

    const phone = phoneElement
        ? phoneElement.value.trim()
        : "";

    const email = emailElement
        ? emailElement.value.trim()
        : "";

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    fetch(API + "/api/auth/profile/" + user.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            email: email
        })
    })
    .then(async function (response) {

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Profile update failed"
            );
        }

        return data;
    })
    .then(function (data) {

        if (data.user) {

            localStorage.setItem(
                "agro_user",
                JSON.stringify(data.user)
            );

            if (data.user.id) {
                localStorage.setItem(
                    "userId",
                    String(data.user.id)
                );
            }

            store.set(
                "name",
                data.user.name || ""
            );

            store.set(
                "phone",
                data.user.phone || ""
            );

            store.set(
                "email",
                data.user.email || ""
            );
        }

        alert("Profile updated successfully!");

        go("profile");
    })
    .catch(function (error) {

        console.error(
            "Profile update error:",
            error
        );

        alert(
            error.message ||
            "Unable to update profile."
        );
    });
}
/* ==================================================
   HISTORY
   ================================================== */

function formatHistoryDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString();
}


/* ==================================================
   LOAD HISTORY
   ================================================== */

async function loadHistory() {

    const userId = getUserId();

    if (!userId) {
        console.log("No user logged in.");
        return;
    }


    /* ============================================
       CROP HISTORY
       ============================================ */

    try {

        const cropResponse =
            await fetch(
                API + "/api/crop/history/" + userId
            );

        if (!cropResponse.ok) {
            throw new Error(
                "Crop history request failed"
            );
        }

        const cropData =
            await cropResponse.json();

        const cropHistory =
            $("cropHistory");

        const cropCount =
            $("hc");

        if (cropCount) {
            cropCount.textContent =
                cropData.length;
        }

        if (cropHistory) {

            if (
                !cropData ||
                cropData.length === 0
            ) {

                cropHistory.innerHTML =
                    "<p>No crop recommendations yet.</p>";

            } else {

                cropHistory.innerHTML =
                    cropData.map(function (item) {

                        return `
                            <div class="history-item"
                                 onclick='showCropHistory(${JSON.stringify(item)})'>

                                <div>
                                    <strong>
                                        ${item.recommendedCrop || "Unknown Crop"}
                                    </strong>

                                    <small>
                                        ${formatHistoryDate(item.createdAt)}
                                    </small>
                                </div>

                                <span>View</span>

                            </div>
                        `;

                    }).join("");
            }
        }

    } catch (error) {

        console.error(
            "Crop history error:",
            error
        );
    }


    /* ============================================
       YIELD HISTORY
       ============================================ */

    try {

        const yieldResponse =
            await fetch(
                API + "/api/yield/history/" + userId
            );

        if (!yieldResponse.ok) {
            throw new Error(
                "Yield history request failed"
            );
        }

        const yieldData =
            await yieldResponse.json();

        const yieldHistory =
            $("yieldHistory");

        const yieldCount =
            $("hy");

        if (yieldCount) {
            yieldCount.textContent =
                yieldData.length;
        }

        if (yieldHistory) {

            if (
                !yieldData ||
                yieldData.length === 0
            ) {

                yieldHistory.innerHTML =
                    "<p>No yield predictions yet.</p>";

            } else {

                yieldHistory.innerHTML =
                    yieldData.map(function (item) {

                        return `
                            <div class="history-item"
                                 onclick='showYieldHistory(${JSON.stringify(item)})'>

                                <div>
                                    <strong>
                                        ${item.crop || "Unknown Crop"}
                                    </strong>

                                    <small>
                                        ${formatHistoryDate(item.createdAt)}
                                    </small>
                                </div>

                                <span>View</span>

                            </div>
                        `;

                    }).join("");
            }
        }

    } catch (error) {

        console.error(
            "Yield history error:",
            error
        );
    }


    /* ============================================
       TOTAL
       ============================================ */

    const totalCount =
        $("ht");

    if (totalCount) {

        const cropCountValue =
            Number(
                $("hc")
                    ? $("hc").textContent
                    : 0
            );

        const yieldCountValue =
            Number(
                $("hy")
                    ? $("hy").textContent
                    : 0
            );

        totalCount.textContent =
            cropCountValue +
            yieldCountValue;
    }
}


/* ==================================================
   CROP HISTORY DETAILS
   ================================================== */

function showCropHistory(item) {

    const modal =
        $("historyModal");

    const title =
        $("modalTitle");

    const details =
        $("modalDetails");

    if (
        !modal ||
        !title ||
        !details
    ) {
        return;
    }

    title.textContent =
        "Crop Recommendation";

    details.innerHTML = `

        <p>
            <strong>Recommended Crop:</strong>
            ${item.recommendedCrop || "-"}
        </p>

        <p>
            <strong>Nitrogen:</strong>
            ${item.nitrogen ?? "-"}
        </p>

        <p>
            <strong>Phosphorus:</strong>
            ${item.phosphorus ?? "-"}
        </p>

        <p>
            <strong>pH:</strong>
            ${item.ph ?? "-"}
        </p>

        <p>
            <strong>Temperature:</strong>
            ${item.temperature ?? "-"} °C
        </p>

        <p>
            <strong>Humidity:</strong>
            ${item.humidity ?? "-"} %
        </p>

        <p>
            <strong>Rainfall:</strong>
            ${item.rainfall ?? "-"} mm
        </p>

        <p>
            <strong>Date:</strong>
            ${formatHistoryDate(item.createdAt)}
        </p>

    `;

    modal.classList.add("show");
}


/* ==================================================
   YIELD HISTORY DETAILS
   ================================================== */

function showYieldHistory(item) {

    const modal =
        $("historyModal");

    const title =
        $("modalTitle");

    const details =
        $("modalDetails");

    if (
        !modal ||
        !title ||
        !details
    ) {
        return;
    }

    title.textContent =
        "Yield Prediction";

    details.innerHTML = `

        <p>
            <strong>Crop:</strong>
            ${item.crop || "-"}
        </p>

        <p>
            <strong>Area:</strong>
            ${item.area ?? "-"} acres
        </p>

        <p>
            <strong>Fertilizer:</strong>
            ${item.fertilizer || "-"}
        </p>

        <p>
            <strong>Rainfall:</strong>
            ${item.rainfall ?? "-"} mm
        </p>

        <p>
            <strong>Predicted Yield:</strong>
            ${item.predictedYield ?? "-"} Tons
        </p>

        <p>
            <strong>Date:</strong>
            ${formatHistoryDate(item.createdAt)}
        </p>

    `;

    modal.classList.add("show");
}


/* ==================================================
   CLOSE HISTORY MODAL
   ================================================== */

function closeHistory() {

    const modal =
        $("historyModal");

    if (modal) {
        modal.classList.remove("show");
    }
}
/* ==================================================
   DOM LOADED
   ================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "AGROPREDICT APP LOADED"
        );


        /* ============================================
           LOGIN
           ============================================ */

        const loginButton =
            document.querySelector(
                '[data-do="login"]'
            );


        if (loginButton) {

            console.log(
                "LOGIN BUTTON FOUND"
            );


            loginButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    console.log(
                        "LOGIN BUTTON CLICKED"
                    );


                    loginUser();

                }
            );
        }


        /* ============================================
           SIGNUP
           ============================================ */

        const signupButton =
            document.querySelector(
                '[data-do="signup"]'
            );


        if (signupButton) {

            signupButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    signupUser();

                }
            );
        }


        /* ============================================
           LOGOUT
           ============================================ */

        const logoutButton =
            document.querySelector(
                '[data-do="logout"]'
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logoutUser();

                }
            );
        }


        /* ============================================
           CROP BUTTON
           ============================================ */

        const cropButton =
            document.querySelector(
                '[data-do="recommend"]'
            );


        if (cropButton) {

            cropButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    recommendUserCrop();

                }
            );
        }


        /* ============================================
           YIELD BUTTON
           ============================================ */

        const yieldButton =
            document.querySelector(
                '[data-do="predict"]'
            );


        if (yieldButton) {

            yieldButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    predictYield();

                }
            );
        }


        /* ============================================
           PROFILE SAVE
           ============================================ */

        const doneButton =
            document.querySelector(
                '[data-do="done"]'
            );


        if (doneButton) {

            doneButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    saveProfile();

                }
            );
        }


        /* ============================================
           NAVIGATION
           ============================================ */

        const navigationButtons =
            document.querySelectorAll(
                "[data-go]"
            );


        navigationButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const destination =
                            button.getAttribute(
                                "data-go"
                            );


                        go(destination);

                    }
                );
            }
        );


        /* ============================================
           USER DISPLAY
           ============================================ */

        const user =
    getLoggedUser();


if (user) {

    const nameElements =
        document.querySelectorAll(
            "[data-user-name]"
        );


    nameElements.forEach(
        function (element) {

            element.textContent =
                user.name ||
                "User";

        }
    );


    const emailElements =
        document.querySelectorAll(
            "[data-user-email]"
        );


    emailElements.forEach(
        function (element) {

            element.textContent =
                user.email ||
                "";

        }
    );


    /* ============================================
       PROFILE PAGE
       ============================================ */

    const profileName =
        $("pn");

    const profileEmail =
        $("pe");

    const profilePhone =
        $("pp");


    if (profileName) {

        profileName.textContent =
            user.name ||
            "";

    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email ||
            "";

    }


    if (profilePhone) {

        profilePhone.textContent =
            user.phone ||
            "";

    }
}
/* ============================================
   HISTORY PAGE
   ============================================ */

if (
    window.location.pathname.endsWith(
        "history.html"
    )
) {

    loadHistory();

}

        /* ============================================
           RESULT VALUES
           ============================================ */

        const cropOutput =
            $("cropOut");


        if (cropOutput) {

            cropOutput.textContent =
                store.get(
                    "crop",
                    "Rice"
                );
        }


        const yieldOutput =
            $("yieldOut");


        if (yieldOutput) {

            yieldOutput.textContent =
                store.get(
                    "yield",
                    "0 Tons"
                );
        }


        console.log(
            "APP INITIALIZATION COMPLETE"
        );

    }
);

const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        const nav = menuToggle.closest("nav");

        if (nav) {
            nav.classList.toggle("menu-open");
        }
    });
}
