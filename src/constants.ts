export const intervals = [
  "seconde",
  "tierce",
  "quarte",
  "quinte",
  "sixte",
  "septième",
];

export const getSignName = (sign: 1 | -1) =>
  sign === 1 ? "ascendante" : "descendante";
