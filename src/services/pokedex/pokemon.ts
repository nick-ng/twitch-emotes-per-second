import type { PokedexEntry } from "../../schemas";

export const getPokemon = (name: string): PokedexEntry | null => {
  switch (name) {
    case "Kilowattrel":
      return {
        name,
        types: ["electric", "flying"],
        abilities: ["wind-power", "vold-absorb"],
        hiddenAbility: "competitive",
        baseStats: {
          hp: 70,
          atk: 70,
          def: 60,
          spa: 105,
          spd: 60,
          spe: 125,
        },
      };
    case "Mimikyu":
      return {
        name,
        types: ["ghost", "fairy"],
        abilities: ["disguise"],
        hiddenAbility: null,
        baseStats: {
          hp: 55,
          atk: 90,
          def: 80,
          spa: 50,
          spd: 105,
          spe: 96,
        },
      };
    case "Armarouge":
      return {
        name,
        types: ["fire", "psychic"],
        abilities: ["flash-fire"],
        hiddenAbility: "weak-armor",
        baseStats: {
          hp: 85,
          atk: 60,
          def: 100,
          spa: 125,
          spd: 80,
          spe: 75,
        },
      };
    case "Tinkaton":
      return {
        name,
        types: ["fairy", "steel"],
        abilities: ["mold-breaker", "own-tempo"],
        hiddenAbility: "pickpocket",
        baseStats: {
          hp: 85,
          atk: 75,
          def: 77,
          spa: 70,
          spd: 105,
          spe: 94,
        },
      };
    case "Cyclizar":
      return {
        name,
        types: ["dragon", "normal"],
        abilities: ["shed-skin"],
        hiddenAbility: "regenerator",
        baseStats: {
          hp: 70,
          atk: 95,
          def: 65,
          spa: 85,
          spd: 65,
          spe: 121,
        },
      };
    case "Grafaiai":
      return {
        name,
        types: ["poison", "normal"],
        abilities: ["unburden", "poison-touch"],
        hiddenAbility: "prankster",
        baseStats: {
          hp: 63,
          atk: 95,
          def: 65,
          spa: 80,
          spd: 72,
          spe: 110,
        },
      };
    case "Toedscruel":
      return {
        name,
        types: ["ground", "grass"],
        abilities: ["mycelium-might"],
        hiddenAbility: null,
        baseStats: {
          hp: 80,
          atk: 70,
          def: 65,
          spa: 80,
          spd: 120,
          spe: 100,
        },
      };
    case "Orthworm":
      return {
        name,
        types: ["steel"],
        abilities: ["earth-eater"],
        hiddenAbility: "sand-veil",
        baseStats: {
          hp: 70,
          atk: 85,
          def: 145,
          spa: 60,
          spd: 55,
          spe: 65,
        },
      };
    case "Clodsire":
      return {
        name,
        types: ["poison", "ground"],
        abilities: ["poison-point", "water-absorb"],
        hiddenAbility: "unaware",
        baseStats: {
          hp: 130,
          atk: 75,
          def: 60,
          spa: 45,
          spd: 100,
          spe: 20,
        },
      };
    case "Farigiraf":
      return {
        name,
        types: ["normal", "psychic"],
        abilities: ["cud-chew", "armor-tail"],
        hiddenAbility: "sap-sipper",
        baseStats: {
          hp: 120,
          atk: 90,
          def: 70,
          spa: 110,
          spd: 70,
          spe: 60,
        },
      };
    case "Bombirdier":
      return {
        name,
        types: ["flying", "dark"],
        abilities: ["big-pecks", "keen-eye"],
        hiddenAbility: "rocky-payload",
        baseStats: {
          hp: 70,
          atk: 103,
          def: 85,
          spa: 60,
          spd: 85,
          spe: 82,
        },
      };
    case "Mabosstiff":
      return {
        name,
        types: ["dark"],
        abilities: ["intimidate", "guard-dog"],
        hiddenAbility: "stakeout",
        baseStats: {
          hp: 80,
          atk: 120,
          def: 90,
          spa: 60,
          spd: 70,
          spe: 85,
        },
      };
    case "Garganacl":
      return {
        name,
        types: ["rock"],
        abilities: ["purifying-salt", "sturdy"],
        hiddenAbility: "clear-body",
        baseStats: {
          hp: 100,
          atk: 100,
          def: 130,
          spa: 45,
          spd: 90,
          spe: 35,
        },
      };
    case "Lycanroc": // Midnight form because bulkier
      return {
        name,
        types: ["rock"],
        abilities: ["keen-eye", "sand-rush", "vital-spirit", "tough-claws"],
        hiddenAbility: "steadfast, no-guard",
        baseStats: {
          hp: 85,
          atk: 115,
          def: 75,
          spa: 55,
          spd: 75,
          spe: 82,
        },
      };
    case "Cetitan":
      return {
        name,
        types: ["ice"],
        abilities: ["thick-fat", "slush-rush"],
        hiddenAbility: "sheer-force",
        baseStats: {
          hp: 170,
          atk: 113,
          def: 65,
          spa: 45,
          spd: 55,
          spe: 73,
        },
      };
    case "Ceruledge":
      return {
        name,
        types: ["fire", "ghost"],
        abilities: ["flash-fire"],
        hiddenAbility: "weak-armor",
        baseStats: {
          hp: 75,
          atk: 125,
          def: 80,
          spa: 60,
          spd: 100,
          spe: 85,
        },
      };
    case "Pawmot":
      return {
        name,
        types: ["electric", "fighting"],
        abilities: ["volt-absorb", "natural-cure"],
        hiddenAbility: "iron-fist",
        baseStats: {
          hp: 70,
          atk: 115,
          def: 70,
          spa: 70,
          spd: 60,
          spe: 105,
        },
      };
    case "Kingambit":
      return {
        name,
        types: ["dark", "steel"],
        abilities: ["defiant", "supreme-overlord"],
        hiddenAbility: "pressure",
        baseStats: {
          hp: 100,
          atk: 135,
          def: 120,
          spa: 60,
          spd: 85,
          spe: 50,
        },
      };
    case "Dondozo":
      return {
        name,
        types: ["water"],
        abilities: ["unaware", "oblivious"],
        hiddenAbility: "water-veil",
        baseStats: {
          hp: 150,
          atk: 100,
          def: 115,
          spa: 65,
          spd: 65,
          spe: 35,
        },
      };
    case "Dachsbun":
      return {
        name,
        types: ["fairy"],
        abilities: ["well-baked-body"],
        hiddenAbility: "aroma-veil",
        baseStats: {
          hp: 57,
          atk: 80,
          def: 115,
          spa: 50,
          spd: 80,
          spe: 95,
        },
      };
    case "Maushold":
      return {
        name,
        types: ["normal"],
        abilities: ["friend-guard", "cheek-pouch"],
        hiddenAbility: "technician",
        baseStats: {
          hp: 74,
          atk: 75,
          def: 70,
          spa: 65,
          spd: 75,
          spe: 111,
        },
      };
    case "Revavroom":
      return {
        name,
        types: ["steel", "poison"],
        abilities: ["overcoat"],
        hiddenAbility: "filter",
        baseStats: {
          hp: 80,
          atk: 119,
          def: 90,
          spa: 54,
          spd: 67,
          spe: 90,
        },
      };
    case "Klawf":
      return {
        name,
        types: ["rock"],
        abilities: ["anger-shell", "shell-armor"],
        hiddenAbility: "regenerator",
        baseStats: {
          hp: 70,
          atk: 100,
          def: 115,
          spa: 35,
          spd: 55,
          spe: 75,
        },
      };
    case "Annihilape":
      return {
        name,
        types: ["fighting", "ghost"],
        abilities: ["vital-spirit", "inner-focus"],
        hiddenAbility: "defiant",
        baseStats: {
          hp: 110,
          atk: 115,
          def: 80,
          spa: 50,
          spd: 90,
          spe: 90,
        },
      };
    case "Glimmora":
      return {
        name,
        types: ["rock", "poison"],
        abilities: ["toxic-debris"],
        hiddenAbility: "corrosion",
        baseStats: {
          hp: 83,
          atk: 55,
          def: 90,
          spa: 130,
          spd: 81,
          spe: 86,
        },
      };
    case "Baxcalibur":
      return {
        name,
        types: ["dragon", "ice"],
        abilities: ["thermal-exchange"],
        hiddenAbility: "ice-body",
        baseStats: {
          hp: 115,
          atk: 145,
          def: 92,
          spa: 75,
          spd: 86,
          spe: 87,
        },
      };
    case "Veluza":
      return {
        name,
        types: ["water", "psychic"],
        abilities: ["mold-breaker"],
        hiddenAbility: "sharpness",
        baseStats: {
          hp: 90,
          atk: 102,
          def: 73,
          spa: 78,
          spd: 65,
          spe: 70,
        },
      };
    case "Dudunsparce":
      return {
        name,
        types: ["normal"],
        abilities: ["serene-grace", "run-away"],
        hiddenAbility: "rattled",
        baseStats: {
          hp: 125,
          atk: 100,
          def: 80,
          spa: 85,
          spd: 75,
          spe: 55,
        },
      };
    case "Houndstone":
      return {
        name,
        types: ["ghost"],
        abilities: ["sand-rush"],
        hiddenAbility: "fluffy",
        baseStats: {
          hp: 72,
          atk: 101,
          def: 100,
          spa: 50,
          spd: 97,
          spe: 68,
        },
      };
    case "Wugtrio":
      return {
        name,
        types: ["water"],
        abilities: ["gooey", "rattled"],
        hiddenAbility: "sand-veil",
        baseStats: {
          hp: 35,
          atk: 100,
          def: 50,
          spa: 50,
          spd: 70,
          spe: 120,
        },
      };
    case "Espathra":
      return {
        name,
        types: ["psychic"],
        abilities: ["opportunist", "frisk"],
        hiddenAbility: "speed-boost",
        baseStats: {
          hp: 95,
          atk: 60,
          def: 60,
          spa: 101,
          spd: 60,
          spe: 105,
        },
      };
    case "Arboliva":
      return {
        name,
        types: ["grass", "normal"],
        abilities: ["seed-sower"],
        hiddenAbility: "harvest",
        baseStats: {
          hp: 78,
          atk: 69,
          def: 90,
          spa: 125,
          spd: 109,
          spe: 39,
        },
      };
    case "Scovillain":
      return {
        name,
        types: ["grass", "fire"],
        abilities: ["chlorophyll", "insomnia"],
        hiddenAbility: "moody",
        baseStats: {
          hp: 65,
          atk: 108,
          def: 65,
          spa: 108,
          spd: 65,
          spe: 75,
        },
      };
    case "Indeedee": // higher of each stat
      return {
        name,
        types: ["psychic", "normal"],
        abilities: ["own-tempo", "inner-focus", "synchronize"],
        hiddenAbility: "psychic-surge",
        baseStats: {
          hp: 70,
          atk: 65,
          def: 65,
          spa: 105,
          spd: 105,
          spe: 95,
        },
      };
    case "Palafin": // Normal form
      return {
        name,
        types: ["water"],
        abilities: ["zero-to-hero"],
        hiddenAbility: null,
        baseStats: {
          hp: 100,
          atk: 70,
          def: 72,
          spa: 53,
          spd: 62,
          spe: 100,
        },
      };
    case "Flamigo":
      return {
        name,
        types: ["flying", "fighting"],
        abilities: ["scrappy", "tangled-feet"],
        hiddenAbility: "costar",
        baseStats: {
          hp: 82,
          atk: 115,
          def: 74,
          spa: 75,
          spd: 64,
          spe: 90,
        },
      };
    case "Rabsca":
      return {
        name,
        types: ["bug", "psychic"],
        abilities: ["synchronize"],
        hiddenAbility: "telepathy",
        baseStats: {
          hp: 75,
          atk: 50,
          def: 85,
          spa: 115,
          spd: 100,
          spe: 45,
        },
      };
    case "Bellibolt":
      return {
        name,
        types: ["electric"],
        abilities: ["electromorphosis", "static"],
        hiddenAbility: "damp",
        baseStats: {
          hp: 109,
          atk: 64,
          def: 91,
          spa: 103,
          spd: 83,
          spe: 45,
        },
      };
    case "Oricorio": // Baile Style
      return {
        name,
        types: ["fire", "flying"],
        abilities: ["dancer"],
        hiddenAbility: null,
        baseStats: {
          hp: 75,
          atk: 70,
          def: 70,
          spa: 98,
          spd: 70,
          spe: 93,
        },
      };
    case "Squawkabilly":
      return {
        name,
        types: ["normal", "flying"],
        abilities: ["intimidate", "hustle"],
        hiddenAbility: "guts",
        baseStats: {
          hp: 82,
          atk: 96,
          def: 51,
          spa: 45,
          spd: 51,
          spe: 92,
        },
      };
    case "Brambleghast":
      return {
        name,
        types: ["grass", "ghost"],
        abilities: ["wind-rider"],
        hiddenAbility: "infiltrator",
        baseStats: {
          hp: 55,
          atk: 115,
          def: 70,
          spa: 80,
          spd: 70,
          spe: 90,
        },
      };
    case "Toxtricity":
      return {
        name,
        types: ["electric", "poison"],
        abilities: ["punk-rock", "plus", "minus"],
        hiddenAbility: "technician",
        baseStats: {
          hp: 75,
          atk: 98,
          def: 70,
          spa: 114,
          spd: 70,
          spe: 75,
        },
      };
    case "Tatsugiri":
      return {
        name,
        types: ["dragon", "water"],
        abilities: ["commander"],
        hiddenAbility: "storm-drain",
        baseStats: {
          hp: 68,
          atk: 50,
          def: 60,
          spa: 120,
          spd: 95,
          spe: 82,
        },
      };
    case "Eiscue": // higher of each stat
      return {
        name,
        types: ["ice"],
        abilities: ["ice-face"],
        hiddenAbility: null,
        baseStats: {
          hp: 75,
          atk: 80,
          def: 110,
          spa: 65,
          spd: 90,
          spe: 130,
        },
      };
    default:
      return null;
  }
};
