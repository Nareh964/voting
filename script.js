let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUsers = null;
let polls = JSON.parse(localStorage.getItem("polls")) || [];

function save(){
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("polls", JSON.stringify(polls));
}

function signup() {
    const name = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (!name || !pass) {
        alert("Enter username and password");
        return;
    }

    const role = (pass === "admin") ? "admin" : "usser";
    
    if (users.find(x => x.username === name)) {
        return alert("Username already exists");
    }
    
    users.push({ username: name, password: pass, role: role });
    save();
    alert(role === "admin" ? "Access to authentication granted" : "User created succesfully");
}

function login(){
    const name = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const user = users.find(x => x.username === name && x.password === pass);
    if (user) {
        currentUsers = user;
        document.getElementById("auth").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        document.getElementById("welcome-name").textContent = user.username;
        
        if (user.role === "admin") {
            document.getElementById("adminPanel").classList.remove("hidden");
        }
        
        showPolls();
        alert("Log in sucessful");
    }
    else{
        alert("Invalid username or password");
    }
}

function logout() {
    currentUsers = null;
    location.reload();
    alert("You have been logged out");
}

// Admin -> creating polls + saves votes
function createPoll() {
    const question = document.getElementById("pollQuestion").value;
    const option1 = document.getElementById("pollOption1").value;
    const option2 = document.getElementById("pollOption2").value;
    
    if (!question || !option1 || !option2) {
        alert("Enter a question in both options");
        return;
    }
    
    const poll = {
        id: Date.now(),
        question: question,
        options: [
            { text: option1, votes: 0 },
            { text: option2, votes: 0 }
        ],
        voters: [] 
    };
    
    polls.push(poll);
    save();
    alert("Poll created successfully!");
    document.getElementById("pollQuestion").value = "";
    document.getElementById("pollOption1").value = "";
    document.getElementById("pollOption2").value = "";
    showPolls();
}


function showPolls() {
    const container = document.getElementById("pollsContainer");
    container.innerHTML = "";
    
    polls.forEach(poll => {
        const userVote = poll.voters.find(v => v.username === currentUsers.username);
        const hasVoted = !!userVote;
        
       
        const pollDiv = document.createElement("div");
        pollDiv.className = "poll";

        const questionEl = document.createElement("h4");
        questionEl.textContent = poll.question;
        pollDiv.appendChild(questionEl);
        
        poll.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.textContent = opt.text + " (" + opt.votes + " votes)";
            if (userVote && userVote.optionIndex === idx) {
                btn.classList.add("voted");
               
            }
            btn.onclick = function() { vote(poll.id, idx); };
            pollDiv.appendChild(btn);
        });
        
        if (hasVoted) {
            const votedMsg = document.createElement("div");
            votedMsg.textContent = "Voted";
            votedMsg.classList.add("voted-msg");
            pollDiv.appendChild(votedMsg);
        }
        
        container.appendChild(pollDiv);
    });
}

//Saving and removing votes 
function vote(pollId, optionIndex) {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;
    
    const userVotedIndex = poll.options.findIndex(opt => poll.voters.some(v => v.username === currentUsers.username && v.optionIndex === poll.options.indexOf(opt)));
    const existingVote = poll.voters.find(v => v.username === currentUsers.username);
    
    if (existingVote) {
        
        poll.options[existingVote.optionIndex].votes--;
        poll.voters = poll.voters.filter(v => v.username !== currentUsers.username);
        save();
        showPolls();
        alert("Vote removed!");
    } else {
      
        poll.options[optionIndex].votes++;
        poll.voters.push({ username: currentUsers.username, optionIndex: optionIndex });
        save();
        showPolls();
        alert("Vote recorded!");
    }
}


