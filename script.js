document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".container")
    const searchButton = document.getElementById("search-btn");
    const userNameInput =document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");




    function validateUsername(username){
        if(username.trim() == ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;  
        const isMatching = regex.test(username);
        if(!isMatching){
            return alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.innerHTML = `<span class="spinner"></span> Searching...`;
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }

            const parsedData = await response.json();
            console.log("Logging data:", parsedData);


            if (parsedData.status === "error") {
                statsContainer.innerHTML = `<p>User does not exist.</p>`;
                return; // Exit early
            }

            displayUserData(parsedData);

            localStorage.setItem("lastUser", username);

        } catch (error) {
            console.error("Error fetching data:", error);
            statsContainer.innerHTML = `<p>No data found. Please try again later.</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const totalQues = parsedData.totalQuestions;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;


        const totalQuesSolved = parsedData.totalSolved;
        const easyQuesSolved = parsedData.easySolved;
        const mediumQuesSolved = parsedData.mediumSolved;
        const hardQuesSolved = parsedData.hardSolved;

        updateProgress(easyQuesSolved, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(mediumQuesSolved, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(hardQuesSolved, totalHardQues, hardLabel, hardProgressCircle);


        const cardData = [
            {
                label: "Overall Submission",
                value: Object.values(parsedData.submissionCalendar)
                            .reduce((acc, count) => acc + count, 0)
            },
            {
                label: "Total Solved",
                value: parsedData.totalSolved.toLocaleString()
            },
            {
                label: "Acceptance Rate",
                value: parsedData.acceptanceRate + "%"
            },
            {
                label: "Ranking",
                value: "#" + parsedData.ranking.toLocaleString()
            }
        ];

        cardStatsContainer.innerHTML = cardData.map(
            data=> {
                return `
                    <div class ="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                    </div>
                  `  ;
            }
        ).join("");



    }

    const lastUser = localStorage.getItem("lastUser");
    if (lastUser) {
        const lastUserInfo = document.createElement("div");
        lastUserInfo.classList.add("last-user-info");
        lastUserInfo.innerHTML = `
            <p>Last searched user: <strong>${lastUser}</strong></p>
            <button id="load-last-user">Load</button>
        `;
        container.appendChild(lastUserInfo);

        document.getElementById("load-last-user").addEventListener("click", () => {
            userNameInput.value = lastUser;
            fetchUserDetails(lastUser);
        });
    }


    userNameInput.addEventListener("keypress", e => {
        if (e.key === "Enter") searchButton.click();
    });


    searchButton.addEventListener('click', function() {
        const username = userNameInput.value;
        console.log("logging username:", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

    
});

