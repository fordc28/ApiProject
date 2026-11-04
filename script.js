async function getLaunches(nextLaunch) {
    try {
        let name = document.getElementById("text").value;

        let url = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=6&mode=detailed&search=" + encodeURIComponent(name);

        let launchHolder = document.getElementById("launchHolder");

        // Show one launch at the top when the page opens
        if (nextLaunch) {
            url = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=1&mode=detailed";

            launchHolder = document.getElementById("nextLaunchHolder");
        }

        const response = await fetch(url);
        const json = await response.json();

        console.log(json);

        // Keep the current cards if the API returns an error
        if (!response.ok) {
            throw new Error("Could not load launches. Try again later.");
        }

        launchHolder.textContent = "";

        for (const launch of json.results) {
            // Create the card
            const card = document.createElement("div");
            card.classList.add("card");

            // Create the image
            if (launch.image) {
                const img = document.createElement("img");
                img.src = launch.image.image_url;
                img.alt = launch.name;

                card.append(img);
            }

            // Create the countdown
            const countdown = document.createElement("p");
            countdown.classList.add("countdown");
            countdown.dataset.launchTime = launch.net;

            card.append(countdown);

            // Create the container
            const container = document.createElement("div");
            container.classList.add("container");

            // Create the title
            const title = document.createElement("h4");
            title.textContent = launch.name;

            // Create the date
            const date = document.createElement("p");
            date.textContent = new Date(launch.net).toLocaleString();

            // Create the mission description
            const mission = document.createElement("p");

            if (launch.mission) {
                mission.textContent = launch.mission.description;
            }

            container.append(title);
            container.append(date);
            container.append(mission);

            // Create the video link
            if (launch.vid_urls && launch.vid_urls.length > 0) {
                const video = document.createElement("a");
                video.textContent = "Watch Launch";
                video.href = launch.vid_urls[0].url;
                video.target = "_blank";
                video.rel = "noopener";

                container.append(video);
            }

            card.append(container);
            launchHolder.append(card);
        }

        if (json.results.length === 0) {
            launchHolder.textContent = "No launches found.";
        }

        updateCountdowns();
    }
    catch (error) {
        console.log(error);

        if (nextLaunch) {
            document.getElementById("nextLaunchHolder").textContent =
                "Could not load next launch. Try again later.";
        }
        else {
            document.getElementById("launchHolder").textContent =
                "Could not load launches. Try again later.";
        }
    }
}

// Update the countdowns
function updateCountdowns() {
    const countdowns = document.getElementsByClassName("countdown");

    for (const countdown of countdowns) {
        const launchTime = new Date(countdown.dataset.launchTime).getTime();
        const now = new Date().getTime();
        const difference = launchTime - now;

        const days = Math.floor(difference / 86400000);
        const hours = Math.floor((difference / 3600000) % 24);
        const minutes = Math.floor((difference / 60000) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        countdown.textContent = "Launch in: " +
            days + "d " +
            hours + "h " +
            minutes + "m " +
            seconds + "s";
    }
}

// Load the next launch automatically
getLaunches(true);

// Update the countdowns every second
setInterval(updateCountdowns, 1000);