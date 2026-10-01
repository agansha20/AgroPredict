console.log("AGROPREDICT APP LOADED");

const API = "";


// =====================================================
// PAGE PATHS
// =====================================================

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
    editProfile: "edit-profile.html"
};


// =====================================================
// LOCAL STORAGE HELPERS
// =====================================================

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get(key) {
    const value = localStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
}

function remove(key) {
    localStorage.removeItem(key);
}


// =====================================================
// CURRENT USER
// =====================================================

function getCurrentUser() {

    const user = get("agro_user");

    if (user) {
        return user;
    }

    return null;
}


function getUserId() {

    const user = getCurrentUser();

    if (user && user.id) {
        return Number(user.id);
    }

    const storedId = localStorage.getItem("agro_user_id");

    if (storedId) {
        return Number(storedId);
    }

    return null;
}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function goTo(page) {

    if (PAGES[page]) {
        window.location.href = PAGES[page];
        return;
    }

    window.location.href = page;
}


// =====================================================
// BACK BUTTON
// =====================================================

function goBack() {

    console.log("BACK BUTTON CLICKED");

    /*
     * If browser has previous page,
     * go back to it.
     */
    if (window.history.length > 1) {

        window.history.back();

        return;
    }

    /*
     * Fallback to home page.
     */
    window.location.href = PAGES.home;
}


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const email = document.querySelector("#loginEmail");
    const password = document.querySelector("#loginPassword");

    if (!email || !password) {
        console.error("Login fields not found");
        return;
    }

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {

        alert("Please enter email and password");

        return;
    }

    try {

        console.log("LOGIN REQUEST");

        const response = await fetch(
            `${API}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                message: text
            };
        }

        console.log("LOGIN RESPONSE:", data);

        if (!response.ok) {

            alert(
                data.message ||
                data.error ||
                "Login failed"
            );

            return;
        }

        save(
            "agro_user",
            data.user
        );

        localStorage.setItem(
            "agro_user_id",
            data.user.id
        );

        console.log("LOGIN SUCCESS");
        console.log("USER:", data.user);

        window.location.href = PAGES.home;

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        alert(
            "Cannot connect to server. Make sure Spring Boot is running."
        );
    }
}


// =====================================================
// SIGNUP
// =====================================================

async function signup() {

    const name =
        document.querySelector("#name");

    const email =
        document.querySelector("#email");

    const password =
        document.querySelector("#password");

    if (!name || !email || !password) {

        console.error(
            "Signup fields not found"
        );

        return;
    }

    const nameValue =
        name.value.trim();

    const emailValue =
        email.value.trim();

    const passwordValue =
        password.value.trim();

    if (
        !nameValue ||
        !emailValue ||
        !passwordValue
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/api/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: nameValue,
                        email: emailValue,
                        password: passwordValue
                    })
                }
            );

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                message: text
            };
        }

        console.log(
            "SIGNUP RESPONSE:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                data.error ||
                "Signup failed"
            );

            return;
        }

        alert(
            "Signup successful! Please login."
        );

        window.location.href =
            PAGES.login;

    } catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem("agro_user");
    localStorage.removeItem("agro_user_id");
    localStorage.removeItem("agro_crop");
    localStorage.removeItem("agro_yield");
    localStorage.removeItem("recommendedCrop");

    window.location.href =
        PAGES.login;
}


// =====================================================
// CROP RECOMMENDATION
// =====================================================

async function recommendCrop() {

    const userId =
        getUserId();

    if (!userId) {

        alert(
            "Please login first."
        );

        window.location.href =
            PAGES.login;

        return;
    }

    const nitrogen =
        document.querySelector("#cn");

    const phosphorus =
        document.querySelector("#cp");

    const ph =
        document.querySelector("#cph");

    const temperature =
        document.querySelector("#ct");

    const humidity =
        document.querySelector("#ch");

    const rainfall =
        document.querySelector("#cr");

    if (
        !nitrogen ||
        !phosphorus ||
        !ph ||
        !temperature ||
        !humidity ||
        !rainfall
    ) {

        console.error(
            "Crop fields not found"
        );

        return;
    }

    const n =
        Number(nitrogen.value);

    const p =
        Number(phosphorus.value);

    const phValue =
        Number(ph.value);

    const temp =
        Number(temperature.value);

    const humidityValue =
        Number(humidity.value);

    const rainfallValue =
        Number(rainfall.value);

    if (
        Number.isNaN(n) ||
        Number.isNaN(p) ||
        Number.isNaN(phValue) ||
        Number.isNaN(temp) ||
        Number.isNaN(humidityValue) ||
        Number.isNaN(rainfallValue)
    ) {

        alert(
            "Please enter all crop parameters."
        );

        return;
    }

    const requestData = {

        userId: Number(userId),

        nitrogen: n,

        phosphorus: p,

        ph: phValue,

        temperature: temp,

        humidity: humidityValue,

        rainfall: rainfallValue
    };

    console.log(
        "CROP REQUEST:",
        requestData
    );

    try {

        const response =
            await fetch(
                `${API}/api/crop/recommend`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                message: text
            };
        }

        console.log(
            "CROP STATUS:",
            response.status
        );

        console.log(
            "CROP RESPONSE:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                data.error ||
                "Crop recommendation failed"
            );

            return;
        }

        save(
            "agro_crop",
            data
        );

        localStorage.setItem(
            "recommendedCrop",
            data.recommendedCrop
        );

        console.log(
            "RECOMMENDED CROP:",
            data.recommendedCrop
        );

        window.location.href =
            PAGES.cropResult;

    } catch (error) {

        console.error(
            "CROP ERROR:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// LOAD CROP RESULT
// =====================================================

function loadCropResult() {

    const cropResult =
        get("agro_crop");

    const cropOutput =
        document.querySelector("#cropOut");

    if (!cropOutput) {
        return;
    }

    if (
        cropResult &&
        cropResult.recommendedCrop
    ) {

        cropOutput.textContent =
            cropResult.recommendedCrop;

        return;
    }

    const savedCrop =
        localStorage.getItem(
            "recommendedCrop"
        );

    if (savedCrop) {

        cropOutput.textContent =
            savedCrop;

    } else {

        cropOutput.textContent =
            "No recommendation";
    }
}


// =====================================================
// YIELD PREDICTION
// =====================================================

async function predictYield() {

    const userId =
        getUserId();

    if (!userId) {

        alert(
            "Please login first."
        );

        window.location.href =
            PAGES.login;

        return;
    }

    const crop =
        document.querySelector("#yc");

    const area =
        document.querySelector("#ya");

    const soil =
        document.querySelector("#ys");

    const temperature =
        document.querySelector("#yt");

    const fertilizer =
        document.querySelector("#yf");

    const rainfall =
        document.querySelector("#yr");

    if (
        !crop ||
        !area ||
        !soil ||
        !temperature ||
        !fertilizer ||
        !rainfall
    ) {

        console.error(
            "Yield fields not found"
        );

        return;
    }

    const cropValue =
        crop.value.trim();

    const areaValue =
        Number(area.value);

    const soilValue =
        soil.value.trim();

    const temperatureValue =
        Number(temperature.value);

    const fertilizerValue =
        fertilizer.value.trim();

    const rainfallValue =
        Number(rainfall.value);

    console.log(
        "YIELD FORM VALUES:",
        {
            crop: cropValue,
            area: areaValue,
            soil: soilValue,
            temperature: temperatureValue,
            fertilizer: fertilizerValue,
            rainfall: rainfallValue
        }
    );

    if (!cropValue) {

        alert(
            "Please enter crop."
        );

        return;
    }

    if (
        Number.isNaN(areaValue) ||
        areaValue <= 0
    ) {

        alert(
            "Please enter valid area."
        );

        return;
    }

    if (
        Number.isNaN(temperatureValue)
    ) {

        alert(
            "Please enter temperature."
        );

        return;
    }

    if (
        Number.isNaN(rainfallValue) ||
        rainfallValue < 0
    ) {

        alert(
            "Please enter valid rainfall."
        );

        return;
    }

    /*
     * IMPORTANT:
     * Soil and temperature are frontend fields.
     * Current YieldPrediction backend model stores:
     * userId, crop, area, fertilizer, rainfall.
     */

    const requestData = {

        userId: Number(userId),

        crop: cropValue,

        area: areaValue,

        fertilizer: fertilizerValue,

        rainfall: rainfallValue
    };

    console.log(
        "YIELD REQUEST DATA:",
        requestData
    );

    try {

        const response =
            await fetch(
                `${API}/api/yield/predict`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );

        const text =
            await response.text();

        console.log(
            "YIELD STATUS:",
            response.status
        );

        console.log(
            "YIELD RAW RESPONSE:",
            text
        );

        let data;

        try {

            data =
                JSON.parse(text);

        } catch (error) {

            data = {
                message: text
            };
        }

        console.log(
            "YIELD RESPONSE:",
            data
        );

        if (!response.ok) {

            console.error(
                "YIELD REQUEST FAILED:",
                data
            );

            alert(
                data.message ||
                data.error ||
                `Yield prediction failed (${response.status})`
            );

            return;
        }

        const yieldResult = {

            ...data,

            soil:
                soilValue,

            temperature:
                temperatureValue
        };

        save(
            "agro_yield",
            yieldResult
        );

        console.log(
            "PREDICTED YIELD:",
            data.predictedYield
        );

        window.location.href =
            PAGES.yieldResult;

    } catch (error) {

        console.error(
            "YIELD ERROR:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// LOAD YIELD RESULT
// =====================================================

function loadYieldResult() {

    const result =
        get("agro_yield");

    if (!result) {
        return;
    }

    const cropOutput =
        document.querySelector(
            "#yieldCrop"
        );

    const areaOutput =
        document.querySelector(
            "#yieldArea"
        );

    const fertilizerOutput =
        document.querySelector(
            "#yieldFertilizer"
        );

    const rainfallOutput =
        document.querySelector(
            "#yieldRainfall"
        );

    const soilOutput =
        document.querySelector(
            "#yieldSoil"
        );

    const temperatureOutput =
        document.querySelector(
            "#yieldTemperature"
        );

    const resultOutput =
        document.querySelector(
            "#yieldOut"
        );

    if (cropOutput) {

        cropOutput.textContent =
            result.crop || "-";
    }

    if (areaOutput) {

        areaOutput.textContent =
            result.area ?? "-";
    }

    if (fertilizerOutput) {

        fertilizerOutput.textContent =
            result.fertilizer || "-";
    }

    if (rainfallOutput) {

        rainfallOutput.textContent =
            result.rainfall ?? "-";
    }

    if (soilOutput) {

        soilOutput.textContent =
            result.soil || "-";
    }

    if (temperatureOutput) {

        temperatureOutput.textContent =
            result.temperature ?? "-";
    }

    if (resultOutput) {

        if (
            result.predictedYield !==
                undefined &&
            result.predictedYield !==
                null
        ) {

            resultOutput.textContent =
                Number(
                    result.predictedYield
                ).toFixed(2);

        } else {

            resultOutput.textContent =
                "-";
        }
    }
}


// =====================================================
// CROP HISTORY
// =====================================================

async function loadCropHistory() {

    const userId =
        getUserId();

    if (!userId) {
        return [];
    }

    try {

        const response =
            await fetch(
                `${API}/api/crop/history/${userId}`
            );

        const text =
            await response.text();

        if (!response.ok) {

            console.error(
                "Crop history failed:",
                text
            );

            return [];
        }

        try {

            return JSON.parse(text);

        } catch (error) {

            console.error(
                "Invalid crop history response"
            );

            return [];
        }

    } catch (error) {

        console.error(
            "CROP HISTORY ERROR:",
            error
        );

        return [];
    }
}


// =====================================================
// YIELD HISTORY
// =====================================================

async function loadYieldHistory() {

    const userId =
        getUserId();

    if (!userId) {
        return [];
    }

    try {

        const response =
            await fetch(
                `${API}/api/yield/history/${userId}`
            );

        const text =
            await response.text();

        if (!response.ok) {

            console.error(
                "Yield history failed:",
                text
            );

            return [];
        }

        try {

            return JSON.parse(text);

        } catch (error) {

            console.error(
                "Invalid yield history response"
            );

            return [];
        }

    } catch (error) {

        console.error(
            "YIELD HISTORY ERROR:",
            error
        );

        return [];
    }
}


// =====================================================
// UPDATE HISTORY COUNTS
// =====================================================
function updateHistoryCounts(cropCount, yieldCount) {

    const totalCount = cropCount + yieldCount;

    // History page statistics
    const cropElement = document.getElementById("hc");
    const yieldElement = document.getElementById("hy");
    const totalElement = document.getElementById("ht");

    if (cropElement) {
        cropElement.textContent = cropCount;
    }

    if (yieldElement) {
        yieldElement.textContent = yieldCount;
    }

    if (totalElement) {
        totalElement.textContent = totalCount;
    }

    console.log("HISTORY COUNTS UPDATED");
    console.log("Crop:", cropCount);
    console.log("Yield:", yieldCount);
    console.log("Total:", totalCount);
}
// =====================================================
// DISPLAY HISTORY
// =====================================================

async function loadHistoryPage() {

    const userId =
        getUserId();

    if (!userId) {

        console.warn(
            "No logged-in user for history"
        );

        return;
    }

    const cropHistory =
        await loadCropHistory();

    const yieldHistory =
        await loadYieldHistory();

    console.log(
        "CROP HISTORY:",
        cropHistory
    );

    console.log(
        "YIELD HISTORY:",
        yieldHistory
    );


    // Update counts
    updateHistoryCounts(
        cropHistory.length,
        yieldHistory.length
    );


    // =================================================
    // CROP HISTORY CONTAINER
    // =================================================

    const cropContainer =
        document.querySelector(
            "#cropHistory"
        );

    if (cropContainer) {

        cropContainer.innerHTML = "";

        if (
            !cropHistory ||
            cropHistory.length === 0
        ) {

            cropContainer.innerHTML =
                "<p>No crop history found.</p>";

        } else {

            cropHistory.forEach(
                item => {

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "history-item";

                    div.innerHTML = `
                        <strong>
                            ${item.recommendedCrop || "-"}
                        </strong>
                        <br>
                        N: ${item.nitrogen ?? "-"}
                        |
                        P: ${item.phosphorus ?? "-"}
                        |
                        pH: ${item.ph ?? "-"}
                        <br>
                        Temperature:
                        ${item.temperature ?? "-"}
                        |
                        Humidity:
                        ${item.humidity ?? "-"}
                        <br>
                        Rainfall:
                        ${item.rainfall ?? "-"}
                    `;

                    cropContainer.appendChild(
                        div
                    );
                }
            );
        }
    }


    // =================================================
    // YIELD HISTORY CONTAINER
    // =================================================

    const yieldContainer =
        document.querySelector(
            "#yieldHistory"
        );

    if (yieldContainer) {

        yieldContainer.innerHTML = "";

        if (
            !yieldHistory ||
            yieldHistory.length === 0
        ) {

            yieldContainer.innerHTML =
                "<p>No yield history found.</p>";

        } else {

            yieldHistory.forEach(
                item => {

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "history-item";

                    div.innerHTML = `
                        <strong>
                            ${item.crop || "-"}
                        </strong>
                        <br>
                        Area:
                        ${item.area ?? "-"}
                        <br>
                        Fertilizer:
                        ${item.fertilizer || "-"}
                        <br>
                        Rainfall:
                        ${item.rainfall ?? "-"}
                        <br>
                        Predicted Yield:
                        ${
                            item.predictedYield != null
                            ? Number(
                                item.predictedYield
                              ).toFixed(2)
                            : "-"
                        }
                    `;

                    yieldContainer.appendChild(
                        div
                    );
                }
            );
        }
    }
}


// =====================================================
// CLEAR CROP HISTORY
// =====================================================

async function clearCropHistory() {

    const userId =
        getUserId();

    if (!userId) {
        return;
    }

    const confirmed =
        confirm(
            "Clear all crop history?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/api/crop/history/${userId}`,
                {
                    method: "DELETE"
                }
            );

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                message: text
            };
        }

        console.log(
            "CLEAR CROP HISTORY:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                data.error ||
                "Failed to clear history"
            );

            return;
        }

        alert(
            "Crop history cleared."
        );

        await loadHistoryPage();

    } catch (error) {

        console.error(
            "CLEAR CROP HISTORY ERROR:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// CLEAR YIELD HISTORY
// =====================================================

async function clearYieldHistory() {

    const userId =
        getUserId();

    if (!userId) {
        return;
    }

    const confirmed =
        confirm(
            "Clear all yield history?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/api/yield/history/${userId}`,
                {
                    method: "DELETE"
                }
            );

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = {
                message: text
            };
        }

        console.log(
            "CLEAR YIELD HISTORY:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                data.error ||
                "Failed to clear history"
            );

            return;
        }

        alert(
            "Yield history cleared."
        );

        await loadHistoryPage();

    } catch (error) {

        console.error(
            "CLEAR YIELD HISTORY ERROR:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// PROFILE
// =====================================================

// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    const name = document.querySelector("#pn");
    const email = document.querySelector("#pe");
    const phone = document.querySelector("#pp");

    if (name) {
        name.textContent = user.name || "-";
    }

    if (email) {
        email.textContent = user.email || "-";
    }

    if (phone) {
        phone.textContent = user.phone || "-";
    }
}

// =====================================================
// EDIT PROFILE
// =====================================================

function loadEditProfile() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    const name = document.querySelector("#en");
    const phone = document.querySelector("#ep");
    const email = document.querySelector("#ee");

    if (name) {
        name.value = user.name || "";
    }

    if (phone) {
        phone.value = user.phone || "";
    }

    if (email) {
        email.value = user.email || "";
    }
}

// =====================================================
// SAVE PROFILE
// =====================================================

function saveProfile() {

    const user = getCurrentUser();

    if (!user) {
        alert("Please login first.");
        return;
    }

    const name = document.querySelector("#en");
    const phone = document.querySelector("#ep");
    const email = document.querySelector("#ee");

    if (!name || !phone || !email) {
        console.error("Profile fields not found");
        return;
    }

    user.name = name.value.trim();
    user.phone = phone.value.trim();
    user.email = email.value.trim();

    if (!user.name) {
        alert("Name cannot be empty.");
        return;
    }

    if (!user.email) {
        alert("Email cannot be empty.");
        return;
    }

    save("agro_user", user);

    alert("Profile updated successfully.");

    window.location.href = PAGES.profile;
}
// =====================================================
// DATA-DO BUTTON HANDLER
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-do]"
            );

        if (!button) {
            return;
        }

        /*
         * Prevent normal button/form behaviour.
         * This avoids accidental page reloads.
         */
        if (
            button.tagName === "BUTTON" ||
            button.tagName === "A"
        ) {

            event.preventDefault();
        }

        const action =
            button.dataset.do;

        console.log(
            "BUTTON ACTION:",
            action
        );


        switch (action) {

            // -----------------------------------------
            // BACK
            // -----------------------------------------

            case "back":

                goBack();

                break;


            // -----------------------------------------
            // LOGIN
            // -----------------------------------------

            case "login":

                login();

                break;


            // -----------------------------------------
            // SIGNUP
            // -----------------------------------------

            case "signup":

                signup();

                break;


            // -----------------------------------------
            // LOGOUT
            // -----------------------------------------

            case "logout":

                logout();

                break;


            // -----------------------------------------
            // CROP RECOMMENDATION
            // -----------------------------------------

            case "recommend":

                recommendCrop();

                break;


            // -----------------------------------------
            // YIELD PREDICTION
            // -----------------------------------------

            case "predict":

                predictYield();

                break;


            // -----------------------------------------
            // HISTORY
            // -----------------------------------------

            case "history":

                goTo("history");

                break;


            // -----------------------------------------
            // PROFILE
            // -----------------------------------------

            case "profile":

                goTo("profile");

                break;


            // -----------------------------------------
            // EDIT PROFILE
            // -----------------------------------------

            case "edit-profile":

                goTo("editProfile");

                break;


            // -----------------------------------------
            // SAVE PROFILE
            // -----------------------------------------

            case "save-profile":

                saveProfile();

                break;


            // -----------------------------------------
            // CROP PAGE
            // -----------------------------------------

            case "crop":

                goTo("crop");

                break;


            // -----------------------------------------
            // YIELD PAGE
            // -----------------------------------------

            case "yield":

                goTo("yield");

                break;


            // -----------------------------------------
            // HOME
            // -----------------------------------------

            case "home":

                goTo("home");

                break;


            // -----------------------------------------
            // CLEAR CROP HISTORY
            // -----------------------------------------

            case "clear-crop-history":

                clearCropHistory();

                break;

            case "clear-history":

                clearHistory();

                break;

            // -----------------------------------------
            // CLEAR YIELD HISTORY
            // -----------------------------------------

            case "clear-yield-history":

                clearYieldHistory();

                break;


            // -----------------------------------------
            // LOGIN PAGE
            // -----------------------------------------

            case "login-page":

                goTo("login");

                break;


            // -----------------------------------------
            // SIGNUP PAGE
            // -----------------------------------------

            case "signup-page":

                goTo("signup");

                break;


            // -----------------------------------------
            // UNKNOWN
            // -----------------------------------------

            default:

                console.warn(
                    "Unknown data-do action:",
                    action
                );

                break;
        }
    }
);


// =====================================================
// FORM SUBMIT HANDLER
// =====================================================

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target;

        if (
            form.dataset &&
            form.dataset.do
        ) {

            event.preventDefault();

            const action =
                form.dataset.do;

            console.log(
                "FORM ACTION:",
                action
            );

            if (
                action === "login"
            ) {

                login();

            } else if (
                action === "signup"
            ) {

                signup();

            } else if (
                action === "recommend"
            ) {

                recommendCrop();

            } else if (
                action === "predict"
            ) {

                predictYield();
            }
        }
    }
);


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "APP INITIALIZATION START"
        );


        // ---------------------------------------------
        // Crop Result
        // ---------------------------------------------

        if (
            document.querySelector(
                "#cropOut"
            )
        ) {

            loadCropResult();
        }


        // ---------------------------------------------
        // Yield Result
        // ---------------------------------------------

        if (
            document.querySelector(
                "#yieldOut"
            ) ||
            document.querySelector(
                "#yieldCrop"
            )
        ) {

            loadYieldResult();
        }


        // ---------------------------------------------
        // History
        // ---------------------------------------------

        if (
            document.querySelector(
                "#cropHistory"
            ) ||
            document.querySelector(
                "#yieldHistory"
            ) ||
            document.querySelector(
                "#cropCount"
            ) ||
            document.querySelector(
                "#yieldCount"
            ) ||
            document.querySelector(
                "#historyCount"
            )
        ) {

            loadHistoryPage();
        }


        // ---------------------------------------------
        // Profile
        // ---------------------------------------------

        if (
    document.querySelector("#pn") ||
    document.querySelector("#pe") ||
    document.querySelector("#pp")
) {
    loadProfile();
}


        // ---------------------------------------------
        // Edit Profile
        // ---------------------------------------------

        if (
    document.querySelector("#en") ||
    document.querySelector("#ep") ||
    document.querySelector("#ee")
) {
    loadEditProfile();
}


        console.log(
            "APP INITIALIZATION COMPLETE"
        );
    }
);

document.addEventListener("click", function (event) {

    const button = event.target.closest("[data-go]");

    if (!button) return;

    const page = button.dataset.go;

    console.log("DATA-GO CLICKED:", page);

    if (page === "crop") {
        window.location.href = "crop-guide.html";
    }

    else if (page === "yield") {
        window.location.href = "yield.html";
    }

    else if (page === "history") {
        window.location.href = "history.html";
    }

});


async function clearHistory() {

    const userId = getUserId();

    if (!userId) {
        alert("Please login first.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to clear all history?"
    );

    if (!confirmClear) {
        return;
    }

    try {

        const cropResponse = await fetch(
            `${API}/api/crop/history/${userId}`,
            {
                method: "DELETE"
            }
        );

        const yieldResponse = await fetch(
            `${API}/api/yield/history/${userId}`,
            {
                method: "DELETE"
            }
        );

        if (!cropResponse.ok || !yieldResponse.ok) {
            throw new Error("Failed to clear history");
        }

        // Clear local storage history also
        remove("agro_crop");
        remove("agro_yield");
        remove("recommendedCrop");

        alert("History cleared successfully.");

        loadHistoryPage();

    } catch (error) {

        console.error(
            "CLEAR HISTORY ERROR:",
            error
        );

        alert(
            "Unable to clear history."
        );
    }
}