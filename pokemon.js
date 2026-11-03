// Pokémon data stored as objects inside an array
const pokemons = [
    {
        id: 1,
        name: "Pikachu",
        health: 100,
        image_url:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        attacks: [
            { name: "Thunderbolt", damage: 20 },
            { name: "Quick Attack", damage: 10 }
        ]
    },
    {
        id: 2,
        name: "Charmander",
        health: 100,
        image_url:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        attacks: [
            { name: "Flamethrower", damage: 20 },
            { name: "Scratch", damage: 10 }
        ]
    },
    {
        id: 3,
        name: "Squirtle",
        health: 100,
        image_url:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        attacks: [
            { name: "Water Gun", damage: 20 },
            { name: "Tackle", damage: 10 }
        ]
    }
];
