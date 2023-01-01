import type { MoveInfo } from "../../schemas";

export const getMove = (name: string): MoveInfo | null => {
  switch (name) {
    case "Aqua Cutter":
      return {
        name,
        power: 70,
        type: "water",
        damageClass: "physical",
      };
    case "Armor Cannon":
      return {
        name,
        power: 120,
        type: "fire",
        damageClass: "special",
      };
    case "Bitter Blade":
      return {
        name,
        power: 90,
        type: "fire",
        damageClass: "physical",
      };
    case "Chilling Water":
      return {
        name,
        power: 50,
        type: "water",
        damageClass: "special",
      };
    case "Double Shock":
      return {
        name,
        power: 120,
        type: "electric",
        damageClass: "physical",
      };
    case "Gigaton Hammer":
      return {
        name,
        power: 160,
        type: "steel",
        damageClass: "physical",
      };
    case "High Jump Kick":
      return {
        name,
        power: 130,
        type: "fighting",
        damageClass: "physical",
      };
    case "Hyper Drill":
      return {
        name,
        power: 100,
        type: "normal",
        damageClass: "physical",
      };
    case "Ice Spinner":
      return {
        name,
        power: 80,
        type: "ice",
        damageClass: "physical",
      };
    case "Kowtow Cleave":
      return {
        name,
        power: 85,
        type: "dark",
        damageClass: "physical",
      };
    case "Last Respects":
      return {
        name,
        power: 50,
        type: "ghost",
        damageClass: "physical",
      };
    case "Lumina Crash":
      return {
        name,
        power: 80,
        type: "psychic",
        damageClass: "special",
      };
    case "Mortal Spin":
      return {
        name,
        power: 30,
        type: "poison",
        damageClass: "physical",
      };
    case "Order Up":
      return {
        name,
        power: 80,
        type: "dragon",
        damageClass: "physical",
      };
    case "Pounce":
      return {
        name,
        power: 50,
        type: "bug",
        damageClass: "physical",
      };
    case "Rage Fist":
      return {
        name,
        power: 50,
        type: "ghost",
        damageClass: "physical",
      };
    case "Raging Bull":
      return {
        name,
        power: 90,
        type: 1,
        damageClass: "physical",
      };
    case "Salt Cure":
      return {
        name,
        power: 40,
        type: "rock",
        damageClass: "physical",
      };
    case "Spin Out":
      return {
        name,
        power: 100,
        type: "steel",
        damageClass: "physical",
      };
    case "Tera Blast":
      return {
        name,
        power: 80,
        type: "tera",
        damageClass: "both",
      };
    case "Trailblaze":
      return {
        name,
        power: 50,
        type: "grass",
        damageClass: "physical",
      };
    case "Triple Dive":
      return {
        name,
        power: 90, // 30, 3 hits
        type: "water",
        damageClass: "physical",
      };
    case "Twin Beam":
      return {
        name,
        power: 80,
        type: "psychic",
        damageClass: "special",
      };
    case "Wave Crash":
      return {
        name,
        power: 120,
        type: "water",
        damageClass: "physical",
      };
    case "Fillet Away":
    case "Tidy Up":
    case "Snowscape":
      return {
        name,
        power: null,
        type: "typeless",
        damageClass: "status",
      };
    default:
      return null;
  }
};
