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

        // Update localStorage with latest backend user
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
