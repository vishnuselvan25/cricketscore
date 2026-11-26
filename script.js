
// =====================================
// CRICKET LIVE SCORE APP
// =====================================

// API Configuration

const API_KEY = "YOUR_API_KEY";

const API_URL = "YOUR_CRICKET_API_ENDPOINT";


// HTML Elements

const matchContainer =
    document.getElementById("matchContainer");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("searchInput");


// Store matches

let matches = [];

let currentFilter = "all";


// =====================================
// FETCH API
// =====================================

async function loadMatches() {

    try {

        loading.classList.remove("hidden");

        errorMessage.classList.add("hidden");

        matchContainer.innerHTML = "";

        // API Request

        const response = await fetch(
            `${API_URL}?apikey=${API_KEY}&offset=0`
        );

        // Check response

        if (!response.ok) {

            throw new Error("Unable to fetch cricket data");

        }

        // Convert response into JSON

        const data = await response.json();

        // Store API data

        matches = data.data || [];

        // Display matches

        displayMatches(matches);

    }

    catch (error) {

        console.error("API Error:", error);

        errorMessage.textContent =
            "Unable to load matches. Check your API key and endpoint.";

        errorMessage.classList.remove("hidden");

    }

    finally {

        loading.classList.add("hidden");

    }

}


// =====================================
// DISPLAY MATCHES
// =====================================

function displayMatches(matchList) {

    matchContainer.innerHTML = "";

    if (matchList.length === 0) {

        matchContainer.innerHTML = `
            <div class="col-12 text-center">
                <h4>No matches found</h4>
            </div>
        `;

        return;

    }

    matchList.forEach(match => {

        const team1 = match.teams?.[0] || "Team 1";

        const team2 = match.teams?.[1] || "Team 2";

        const score1 = match.score?.[0];

        const score2 = match.score?.[1];

        const status = match.status || "Status unavailable";

        const matchName = match.name || `${team1} vs ${team2}`;

        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4";

        card.innerHTML = `

            <div class="match-card">

                <span class="status-badge">
                    ${match.matchType || "Cricket"}
                </span>

                <h5 class="mt-3 fw-bold">
                    ${matchName}
                </h5>

                <hr>

                <p class="team-name">
                    ${team1}
                </p>

                <p class="match-score">
                    ${score1
                        ? `${score1.inning}: ${score1.r || 0}/${score1.w || 0}`
                        : "Score unavailable"}
                </p>

                <p class="team-name">
                    ${team2}
                </p>

                <p class="match-score">
                    ${score2
                        ? `${score2.inning}: ${score2.r || 0}/${score2.w || 0}`
                        : "Score unavailable"}
                </p>

                <p class="match-status">
                    ${status}
                </p>

            </div>

        `;

        matchContainer.appendChild(card);

    });

}


// =====================================
// FILTER MATCHES
// =====================================

function filterMatches(type) {

    currentFilter = type;

    let filteredMatches = matches;

    if (type !== "all") {

        filteredMatches = matches.filter(match => {

            const status = (match.status || "").toLowerCase();

            if (type === "live") {
                return match.matchStarted && !match.matchEnded;
            }

            if (type === "upcoming") {
                return !match.matchStarted;
            }

            if (type === "completed") {
                return match.matchEnded;
            }

        });

    }

    displayMatches(filteredMatches);

}


// =====================================
// SEARCH MATCHES
// =====================================

function searchMatches() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const filteredMatches = matches.filter(match => {

        const matchName =
            (match.name || "").toLowerCase();

        const teams =
            (match.teams || [])
                .join(" ")
                .toLowerCase();

        return matchName.includes(searchValue) ||
               teams.includes(searchValue);

    });

    displayMatches(filteredMatches);

}


// =====================================
// INITIAL LOAD
// =====================================

loadMatches();
