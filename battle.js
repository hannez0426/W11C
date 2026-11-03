

//Load saved Pokemon from cookies
let savedUserPokemon = Cookies.get("userPokemonSelection");
let savedComputerPokemon = Cookies.get("computerPokemonSelection");

// Redirect to homepage if no Pokemon is selected
if (!savedUserPokemon || !savedComputerPokemon) {

    window.location.replace("index.html");

} else {

    
    //Restore Pokemon data
  
    // Convert JSON strings back into objects
    let userPokemon = JSON.parse(savedUserPokemon);
    let computerPokemon = JSON.parse(savedComputerPokemon);

    // Restore saved health points
    let userCurrentHealth = Number(
        Cookies.get("userCurrentHealth") ?? userPokemon.health
    );

    let computerCurrentHealth = Number(
        Cookies.get("computerCurrentHealth") ?? computerPokemon.health
    );

    // Track whether the computer is attacking
    let isAttacking = false;

  
    //Select HTML elements
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

    
    //Display Pokemon information
    userName.innerText = userPokemon.name;
    userImage.src = userPokemon.image_url;
    userImage.alt = userPokemon.name;

    computerName.innerText = computerPokemon.name;
    computerImage.src = computerPokemon.image_url;
    computerImage.alt = computerPokemon.name;

  
    //Health bar colors
    function getHealthColor(percentage) {

        if (percentage > 50) {
            return "#36c477"; // Green
        } else if (percentage > 20) {
            return "#ffcb05"; // Yellow
        } else {
            return "#e63946"; // Red
        }
    }

    // Update health points and health bars
    function updateHealth() {

        userHealth.innerText = userCurrentHealth;
        computerHealth.innerText = computerCurrentHealth;

        // Calculate HP percentages
        let userPercentage =
            (userCurrentHealth / userPokemon.health) * 100;

        let computerPercentage =
            (computerCurrentHealth / computerPokemon.health) * 100;

        // Update health bar widths
        userHealthBar.style.width = userPercentage + "%";
        computerHealthBar.style.width = computerPercentage + "%";

        // Update health bar colors
        userHealthBar.style.background =
            getHealthColor(userPercentage);

        computerHealthBar.style.background =
            getHealthColor(computerPercentage);
    }

    
    //Save battle progress using cookies
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

    //Pokemon attack animations
    function playAnimation(image, animationClass) {

        // Remove previous animations
        image.classList.remove(
            "pokemon-attacking",
            "pokemon-damaged"
        );

        // Restart animation
        void image.offsetWidth;

        // Add new animation
        image.classList.add(animationClass);

        // Remove animation after 350 milliseconds
        setTimeout(function() {
            image.classList.remove(animationClass);
        }, 350);
    }

    //Enable or disable attack buttons
    function toggleAttackButtons(disabled) {

        let buttons = attackButtons.querySelectorAll("button");

        buttons.forEach(function(button) {
            button.disabled = disabled;
        });
    }

    //End the Battle
    function endBattle(winner) {

        // Save winner to cookies
        Cookies.set("battleWinner", winner, {
            expires: 7,
            sameSite: "Lax"
        });

        // Disable attack buttons
        toggleAttackButtons(true);

        isAttacking = false;

        if (winner === "user") {

            battleStatus.innerText =
                "🏆 YOU WIN!\n" +
                userPokemon.name + " defeated " +
                computerPokemon.name + "!";

        } else {

            battleStatus.innerText =
                "💀 GAME OVER!\n" +
                computerPokemon.name + " defeated " +
                userPokemon.name + "!";
        }
    }

    //Player attack and computer attack
    function playerAttack(attack) {

        // Prevent multiple attacks at the same time
        if (
            isAttacking ||
            userCurrentHealth <= 0 ||
            computerCurrentHealth <= 0
        ) {
            return;
        }

        // Lock attack buttons during the turn
        isAttacking = true;
        toggleAttackButtons(true);

        //Player attacks
        computerCurrentHealth = Math.max(
            0,
            computerCurrentHealth - attack.damage
        );

        // Play player attack animation
        playAnimation(userImage, "pokemon-attacking");
        playAnimation(computerImage, "pokemon-damaged");

        // Update health and save progress
        updateHealth();
        saveBattle();

        // Display player's attack message
        battleStatus.innerText =
            userPokemon.name + " used " + attack.name +
            "!\nIt dealt " + attack.damage + " damage!";

        // Check whether the player won
        if (computerCurrentHealth <= 0) {
            endBattle("user");
            return;
        }

        //Computer attacks after a delay
        setTimeout(function() {

            // Select a random computer attack
            let randomIndex = Math.floor(
                Math.random() * computerPokemon.attacks.length
            );

            let computerAttack =
                computerPokemon.attacks[randomIndex];

            // Computer attacks player
            userCurrentHealth = Math.max(
                0,
                userCurrentHealth - computerAttack.damage
            );

            // Play computer attack animation
            playAnimation(computerImage, "pokemon-attacking");
            playAnimation(userImage, "pokemon-damaged");

            // Update health and save progress
            updateHealth();
            saveBattle();

            // Display battle messages
            battleStatus.innerText =
                userPokemon.name + " used " + attack.name +
                " and dealt " + attack.damage + " damage!\n" +
                computerPokemon.name + " used " +
                computerAttack.name + " and dealt " +
                computerAttack.damage + " damage!";

            // Check whether the computer won
            if (userCurrentHealth <= 0) {
                endBattle("computer");
                return;
            }

            // Unlock buttons for the next turn
            isAttacking = false;
            toggleAttackButtons(false);

        }, 700);
    }

    //Create attack buttons
    userPokemon.attacks.forEach(function(attack) {

        let button = document.createElement("button");

        button.innerText =
            attack.name + " (" + attack.damage + " DMG)";

        button.addEventListener("click", function() {
            playerAttack(attack);
        });

        attackButtons.appendChild(button);
    });

   
    //Restart the game
    restartBtn.addEventListener("click", function() {

        // Clear saved battle cookies
        Cookies.remove("userPokemonSelection");
        Cookies.remove("computerPokemonSelection");
        Cookies.remove("userCurrentHealth");
        Cookies.remove("computerCurrentHealth");
        Cookies.remove("battleWinner");

        // Return to Pokemon selection page
        window.location.href = "index.html";
    });


    //Restore battle on page load
    updateHealth();

    // Check whether the saved battle already ended
    if (userCurrentHealth <= 0) {

        endBattle("computer");

    } else if (computerCurrentHealth <= 0) {

        endBattle("user");

    } else {

        battleStatus.innerText =
            "Battle ready!\nChoose an attack to continue!";
    }
}
