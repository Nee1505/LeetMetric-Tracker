document.addEventListener("DOMContentLoaded", function() {
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
            searchButton.textContent = "Searching...";
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

    }

    searchButton.addEventListener('click', function() {
        const username = userNameInput.value;
        console.log("logging username:", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
});

