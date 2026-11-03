
// Select the Pokémon container
const pokemonContainer =
    document.getElementById("pokemon-container");

const resumeBtn = document.getElementById("resume-btn");

// Display the three Pokémon cards
pokemons.forEach(function(pokemon) {

    const card = document.createElement("div");
    card.className = "pokemon-card";

    card.innerHTML = `
        <img src="${pokemon.image_url}"
             alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <p>HP: ${pokemon.health}</p>
        <button>Select ${pokemon.name}</button>
    `;

    // Start a new battle when selected
    card.querySelector("button").addEventListener(
        "click",
        function() {
            selectPokemon(pokemon);
        }
    );

    pokemonContainer.appendChild(card);
});

// Save Pokémon and battle state using cookies
function selectPokemon(selectedPokemon) {

    // Choose an enemy different from the selected Pokémon
    const enemies = pokemons.filter(function(pokemon) {
        return pokemon.id !== selectedPokemon.id;
    });

    const randomIndex =
        Math.floor(Math.random() * enemies.length);

    const enemyPokemon = enemies[randomIndex];

    // Save Pokémon objects as JSON strings
    Cookies.set(
        "userPokemonSelection",
        JSON.stringify(selectedPokemon),
        { expires: 7, sameSite: "Lax" }
    );

    Cookies.set(
        "computerPokemonSelection",
        JSON.stringify(enemyPokemon),
        { expires: 7, sameSite: "Lax" }
    );

    // Save current health points
    Cookies.set(
        "userCurrentHealth",
        selectedPokemon.health,
        { expires: 7, sameSite: "Lax" }
    );

    Cookies.set(
        "computerCurrentHealth",
        enemyPokemon.health,
        { expires: 7, sameSite: "Lax" }
    );

    // Clear previous battle result
    Cookies.remove("battleWinner");

    // Navigate to the battle page
    window.location.href = "battle.html";
}

// Show resume button if an unfinished battle exists
const savedUser = Cookies.get("userPokemonSelection");
const savedEnemy = Cookies.get("computerPokemonSelection");
const savedUserHP = Cookies.get("userCurrentHealth");
const savedEnemyHP = Cookies.get("computerCurrentHealth");

if (
    savedUser &&
    savedEnemy &&
    savedUserHP !== undefined &&
    savedEnemyHP !== undefined &&
    Number(savedUserHP) > 0 &&
    Number(savedEnemyHP) > 0
) {
    resumeBtn.hidden = false;
}
