
// POKÉMON BATTLE SIMULATOR

// Load saved Pokémon from cookies
let savedUserPokemon = Cookies.get("userPokemonSelection");
let savedComputerPokemon = Cookies.get("computerPokemonSelection");

// Redirect if no Pokémon were selected
if (!savedUserPokemon || !savedComputerPokemon) {
    window.location.replace("index.html");
} else {
    // Convert JSON strings back into objects
    let userPokemon = JSON.parse(savedUserPokemon);
    let computerPokemon = JSON.parse(savedComputerPokemon);

    // Restore current health from cookies
    let userCurrentHealth = Number(
        Cookies.get("userCurrentHealth") ?? userPokemon.health
    );

    let computerCurrentHealth = Number(
        Cookies.get("computerCurrentHealth") ?? computerPokemon.health
    );

    // Select HTML elements
    const userName = document.getElementById("user-name");
    const userImage = document.getElementById("user-image");
    const userHealth = document.getElementById("user-health");
    const userHealthBar = document.getElementById("user-health-bar");

    const computerName = document.getElementById("computer-name");
    const computerImage = document.getElementById("computer-image");
    const computerHealth = document.getElementById("computer-health");
    const computerHealthBar = document.getElementById("computer-health-bar");

    const attackButtons = document.getElementById("attack-buttons");
    const battleStatus = document.getElementById("battle-status");
    const restartBtn = document.getElementById("restart-btn");

    // Display Pokémon information
    userName.innerText = userPokemon.name;
    userImage.src = userPokemon.image_url;
    userImage.alt = userPokemon.name;

    computerName.innerText = computerPokemon.name;
    computerImage.src = computerPokemon.image_url;
    computerImage.alt = computerPokemon.name;

    // Update health points and health bars
    function updateHealth() {
        userHealth.innerText = userCurrentHealth;
        computerHealth.innerText = computerCurrentHealth;

        userHealthBar.style.width =
            (userCurrentHealth / userPokemon.health * 100) + "%";

        computerHealthBar.style.width =
            (computerCurrentHealth / computerPokemon.health * 100) + "%";
    }

    // Save current battle health using cookies
    function saveBattle() {
        Cookies.set("userCurrentHealth", userCurrentHealth, {
            expires: 7,
            sameSite: "Lax"
        });

        Cookies.set("computerCurrentHealth", computerCurrentHealth, {
            expires: 7,
            sameSite: "Lax"
        });
    }

    // Disable attack buttons after battle ends
    function endBattle(winner) {
        Cookies.set("battleWinner", winner, {
            expires: 7,
            sameSite: "Lax"
        });

        attackButtons.querySelectorAll("button").forEach(
            function(button) {
                button.disabled = true;
            }
        );

        battleStatus.innerText =
            winner === "user"
                ? "YOU WIN! Congratulations, Trainer!"
                : "GAME OVER! The computer wins!";
    }

    // Main battle function
    function playerAttack(attack) {

        // Prevent attacks after battle is finished
        if (userCurrentHealth <= 0 || computerCurrentHealth <= 0) {
            return;
        }

        // STEP 1: Player attacks computer
        computerCurrentHealth = Math.max(
            0,
            computerCurrentHealth - attack.damage
        );

        updateHealth();
        saveBattle();

        // STEP 2: Check if player wins
        if (computerCurrentHealth <= 0) {
            endBattle("user");
            return;
        }

        // STEP 3: Computer chooses a random attack
        let randomIndex = Math.floor(
            Math.random() * computerPokemon.attacks.length
        );

        let computerAttack = computerPokemon.attacks[randomIndex];

        // STEP 4: Computer attacks player
        userCurrentHealth = Math.max(
            0,
            userCurrentHealth - computerAttack.damage
        );

        updateHealth();
        saveBattle();

        // STEP 5: Check if computer wins
        if (userCurrentHealth <= 0) {
            endBattle("computer");
            return;
        }

        // Display battle updates
        battleStatus.innerText =
            userPokemon.name + " used " + attack.name +
            " and dealt " + attack.damage + " damage!\n" +
            computerPokemon.name + " used " +
            computerAttack.name + " and dealt " +
            computerAttack.damage + " damage!";
    }

    // Create attack buttons dynamically
    userPokemon.attacks.forEach(function(attack) {
        let button = document.createElement("button");

        button.innerText =
            attack.name + " (" + attack.damage + " DMG)";

        button.addEventListener("click", function() {
            playerAttack(attack);
        });

        attackButtons.appendChild(button);
    });

    // Start a new battle
    restartBtn.addEventListener("click", function() {
        Cookies.remove("userPokemonSelection");
        Cookies.remove("computerPokemonSelection");
        Cookies.remove("userCurrentHealth");
        Cookies.remove("computerCurrentHealth");
        Cookies.remove("battleWinner");

        window.location.href = "index.html";
    });

    // Restore battle display
    updateHealth();

    // Restore winner if the match already ended
    if (userCurrentHealth <= 0) {
        endBattle("computer");
    } else if (computerCurrentHealth <= 0) {
        endBattle("user");
    }
}
