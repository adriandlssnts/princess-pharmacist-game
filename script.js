let level = 1;
let xp = 0;
let health = 100;

let patient;
let selectedDrug = "";
let selectedDose = "";
let selectedFreq = "";

const cases = [
  {
    name: "Luna",
    age: 25,
    weight: 70,
    condition: "Fever",
    allergies: [],
    options: ["Acetaminophen", "Ibuprofen"],
    doses: ["325 mg", "500 mg", "1000 mg"],
    freq: ["every 4 hours", "every 6 hours"],
    correct: {
      drug: "Acetaminophen",
      dose: "500 mg",
      freq: "every 6 hours"
    },
    explanation: "Typical adult dose is 500–1000 mg every 6 hours."
  },
  {
    name: "Noah",
    age: 6,
    weight: 20,
    condition: "Fever (Pediatric)",
    allergies: [],
    options: ["Acetaminophen", "Ibuprofen"],
    doses: ["100 mg", "200 mg", "400 mg"],
    freq: ["every 4 hours", "every 6 hours"],
    correct: {
      drug: "Acetaminophen",
      dose: "200 mg",
      freq: "every 6 hours"
    },
    explanation: "Pediatric dosing: ~10–15 mg/kg."
  }
];

function home() {
  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h3>Level ${level}</h3>
      <p>XP: ${xp}</p>
      <button class="btn" onclick="start()">Start Case</button>
    </div>
  `;
}

function start() {
  patient = cases[Math.floor(Math.random()*cases.length)];

  selectedDrug = "";
  selectedDose = "";
  selectedFreq = "";

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h3>${patient.name}</h3>
      <p>${patient.condition}</p>
      <p>Age: ${patient.age} | Weight: ${patient.weight}kg</p>
    </div>

    ${render("Drug", patient.options, "drug")}
    ${render("Dose", patient.doses, "dose")}
    ${render("Frequency", patient.freq, "freq")}

    <button class="btn" onclick="submit()">Submit</button>
    <p id="result"></p>
  `;
}

function render(title, options, type) {
  return `
    <div class="card">
      <h4>${title}</h4>
      ${options.map(o =>
        `<div class="choice" onclick="select('${type}','${o}')">${o}</div>`
      ).join("")}
    </div>
  `;
}

function select(type, value) {
  if (type === "drug") selectedDrug = value;
  if (type === "dose") selectedDose = value;
  if (type === "freq") selectedFreq = value;
}

function submit() {
  let correct = patient.correct;
  let result = document.getElementById("result");

  if (
    selectedDrug === correct.drug &&
    selectedDose === correct.dose &&
    selectedFreq === correct.freq
  ) {
    xp += 10;
    result.innerText = "Correct!";
  } else {
    health -= 20;
    result.innerText = "Incorrect. " + patient.explanation;
  }

  setTimeout(start, 2000);
}

home();