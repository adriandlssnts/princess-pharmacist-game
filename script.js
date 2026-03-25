// ===== Game State =====
let level = parseInt(localStorage.getItem('level')||1);
let xp = parseInt(localStorage.getItem('xp')||0);
let health = parseInt(localStorage.getItem('health')||100);
let stageIndex = 0;
let patient;
let selectedDrug="", selectedDose="", selectedFreq="";
let completedCases = JSON.parse(localStorage.getItem('completedCases')||'[]');

const storyStages = [
  {stage:1,story:"Stage 1: Basic common conditions.",patients:[
    {name:"Luna",age:25,weight:70,condition:"Viral fever",allergies:[],options:["Acetaminophen","Ibuprofen"],doses:["500 mg","650 mg"],freq:["every 6 h","every 8 h"],correct:{drug:"Acetaminophen",dose:"500 mg",freq:"every 6 h",explanation:"Acetaminophen is commonly used for viral fever."}},
    {name:"Noah",age:6,weight:22,condition:"Pediatric fever",allergies:[],options:["Acetaminophen","Ibuprofen"],doses:["100 mg","220 mg"],freq:["every 6 h","every 8 h"],correct:{drug:"Acetaminophen",dose:"220 mg",freq:"every 6 h",explanation:"Pediatric acetaminophen is weight-based."}},
    {name:"Ava",age:32,weight:65,condition:"Tension headache",allergies:[],options:["Ibuprofen","Aspirin","Acetaminophen"],doses:["200 mg","400 mg"],freq:["every 6 h","every 8 h"],correct:{drug:"Ibuprofen",dose:"200 mg",freq:"every 6 h",explanation:"NSAID for mild/moderate headache."}},
    {name:"Ethan",age:40,weight:80,condition:"Common cold",allergies:[],options:["Acetaminophen","Antihistamine","Cough syrup"],doses:["5 ml","10 ml"],freq:["every 6 h","every 8 h"],correct:{drug:"Acetaminophen",dose:"500 mg",freq:"every 6 h",explanation:"Symptomatic relief for cold."}},
    {name:"Sophia",age:28,weight:60,condition:"Allergic rhinitis",allergies:[],options:["Loratadine","Diphenhydramine"],doses:["5 mg","10 mg"],freq:["once daily","twice daily"],correct:{drug:"Loratadine",dose:"10 mg",freq:"once daily",explanation:"Second-generation antihistamine."}},
    {name:"Mason",age:5,weight:20,condition:"Otitis media",allergies:[],options:["Amoxicillin","Azithromycin"],doses:["125 mg","250 mg"],freq:["every 8 h","once daily"],correct:{drug:"Amoxicillin",dose:"250 mg",freq:"every 8 h",explanation:"First-line for pediatric otitis media."}},
    {name:"Isabella",age:35,weight:68,condition:"Mild gastroenteritis",allergies:[],options:["Oral rehydration","Loperamide","Acetaminophen"],doses:["5 ml","10 ml"],freq:["every 6 h","every 8 h"],correct:{drug:"Oral rehydration",dose:"10 ml",freq:"every 6 h",explanation:"Primary supportive care."}},
    {name:"Jacob",age:45,weight:75,condition:"Mild hypertension",allergies:[],options:["Lisinopril","Amlodipine","Lifestyle"],doses:["10 mg","20 mg"],freq:["once daily"],correct:{drug:"Lifestyle",dose:"N/A",freq:"N/A",explanation:"Lifestyle modification first."}},
    {name:"Emma",age:10,weight:32,condition:"Mild intermittent asthma",allergies:[],options:["Albuterol inhaler","Montelukast"],doses:["2 puffs","5 mg"],freq:["as needed","once daily"],correct:{drug:"Albuterol inhaler",dose:"2 puffs",freq:"as needed",explanation:"Short-acting bronchodilator."}},
    {name:"William",age:50,weight:82,condition:"Hyperlipidemia",allergies:[],options:["Statin","Lifestyle"],doses:["10 mg","20 mg"],freq:["once daily"],correct:{drug:"Lifestyle",dose:"N/A",freq:"N/A",explanation:"Lifestyle modification emphasized."}}
  ]},
  {stage:2,story:"Stage 2: Chronic conditions.",patients:[
    {name:"Olivia",age:55,weight:70,condition:"Type 2 diabetes",allergies:[],options:["Metformin","Sulfonylurea"],doses:["500 mg","1000 mg"],freq:["once daily","twice daily"],correct:{drug:"Metformin",dose:"500 mg",freq:"twice daily",explanation:"Metformin first-line."}},
    {name:"Liam",age:60,weight:80,condition:"Hypertension stage 1",allergies:[],options:["Lisinopril","Amlodipine"],doses:["10 mg","20 mg"],freq:["once daily"],correct:{drug:"Lisinopril",dose:"10 mg",freq:"once daily",explanation:"ACE inhibitor first-line."}},
    {name:"Charlotte",age:45,weight:65,condition:"Asthma moderate persistent",allergies:[],options:["Fluticasone inhaler","Montelukast"],doses:["100 mcg","5 mg"],freq:["twice daily","once daily"],correct:{drug:"Fluticasone inhaler",dose:"100 mcg",freq:"twice daily",explanation:"Maintenance inhaled steroid."}},
    {name:"James",age:35,weight:75,condition:"Bacterial sinusitis",allergies:[],options:["Amoxicillin","Azithromycin"],doses:["500 mg","250 mg"],freq:["every 8 h","once daily"],correct:{drug:"Amoxicillin",dose:"500 mg",freq:"every 8 h",explanation:"First-line antibiotic."}},
    {name:"Amelia",age:42,weight:68,condition:"Gastroesophageal reflux",allergies:[],options:["Omeprazole","Ranitidine"],doses:["20 mg","150 mg"],freq:["once daily"],correct:{drug:"Omeprazole",dose:"20 mg",freq:"once daily",explanation:"PPI for reflux."}},
    {name:"Benjamin",age:50,weight:78,condition:"Chronic back pain",allergies:[],options:["Acetaminophen","NSAID"],doses:["500 mg","200 mg"],freq:["every 6 h","every 8 h"],correct:{drug:"Acetaminophen",dose:"500 mg",freq:"every 6 h",explanation:"Safe analgesic."}},
    {name:"Mia",age:7,weight:25,condition:"Allergic eczema",allergies:[],options:["Topical corticosteroid","Antihistamine"],doses:["0.5%","5 mg"],freq:["once daily","twice daily"],correct:{drug:"Topical corticosteroid",dose:"0.5%",freq:"twice daily",explanation:"Topical steroid for eczema."}},
    {name:"Alexander",age:65,weight:80,condition:"Chronic heart failure",allergies:[],options:["Furosemide","Spironolactone","ACE inhibitor"],doses:["20 mg","40 mg"],freq:["once daily","twice daily"],correct:{drug:"Furosemide",dose:"40 mg",freq:"once daily",explanation:"Loop diuretic for fluid management."}},
    {name:"Harper",age:30,weight:60,condition:"Migraine",allergies:[],options:["Sumatriptan","Ibuprofen"],doses:["50 mg","200 mg"],freq:["as needed"],correct:{drug:"Ibuprofen",dose:"200 mg",freq:"as needed",explanation:"NSAID for acute migraine."}},
    {name:"Daniel",age:40,weight:82,condition:"Mild depression",allergies:[],options:["SSRI","SNRI"],doses:["10 mg","20 mg"],freq:["once daily"],correct:{drug:"SSRI",dose:"10 mg",freq:"once daily",explanation:"SSRI for mild depression."}}
  ]}
];

// ===== Functions =====
const screen = document.getElementById("screen");

function saveProgress(){
  localStorage.setItem('level',level);
  localStorage.setItem('xp',xp);
  localStorage.setItem('health',health);
  localStorage.setItem('completedCases',JSON.stringify(completedCases));
  document.querySelector('.fill-xp').style.width = `${xp*2}%`;
  document.querySelector('.fill-health').style.width = `${health}%`;
}

function resetGame(){
  if(confirm("⚠️ Reset all progress?")){
    level=1; xp=0; health=100; stageIndex=0; completedCases=[];
    saveProgress(); showStageProgress();
  }
}

function exploreCases(){
  if(completedCases.length===0){ alert("No completed cases yet!"); return; }
  let html = `<div class="story-card"><h3>Completed Cases</h3></div>`;
  completedCases.forEach(p=>{
    html+=`<div class="card">
      <h4>${p.name} (${p.condition})</h4>
      <p>Age: ${p.age} | Weight: ${p.weight}kg</p>
      <p>Allergies: ${p.allergies.join(",")||"None"}</p>
      <p><strong>Answer:</strong> ${p.correct.drug}, ${p.correct.dose}, ${p.correct.freq}</p>
      <p>💡 ${p.correct.explanation}</p>
    </div>`;
  });
  html+=`<button class="nav-btn" onclick="showStageProgress()">Back to Game</button>`;
  screen.innerHTML = html;
}

function showStageProgress(){
  const stage = storyStages[stageIndex];
  screen.innerHTML = `
    <div class="story-card">
      <h3>Stage ${stage.stage}</h3>
      <p>${stage.story}</p>
    </div>
    <div style="display:flex; justify-content:center; flex-wrap:wrap;">
      ${stageIndex>0?`<button class="nav-btn" onclick="prevStage()">⬅ Prev</button>`:""}
      <button class="nav-btn" onclick="startStage()">Start Stage ➡</button>
      <button class="nav-btn" onclick="exploreCases()">🔍 Explore</button>
      <button class="nav-btn" onclick="resetGame()">♻️ Reset</button>
    </div>
    <div class="card"><p>Level: ${level} | XP: ${xp}/50 | Health: ${health}</p></div>
  `;
}

function prevStage(){ stageIndex=Math.max(0,stageIndex-1); showStageProgress(); }

function startStage(){
  const stage = storyStages[stageIndex];
  let options = stage.patients.filter(p => !completedCases.includes(p));

  if(options.length===0){
    stageIndex++;
    if(stageIndex >= storyStages.length){
      screen.innerHTML = `
        <div class="congrats-screen">
          <h1>🎉 Congratulations, Angie! 🎉</h1>
          <p>You have successfully completed all patient cases!</p>
          <div class="sparkles">
            <span>✨</span><span>🌸</span><span>💖</span><span>✨</span><span>🌸</span>
          </div>
          <button class="nav-btn" onclick="resetGame()">♻️ Play Again</button>
        </div>
      `;
      return;
    }
    showStageProgress();
    return;
  }

  patient = pick(options);
  selectedDrug=""; selectedDose=""; selectedFreq="";
  screen.innerHTML = `
    <div class="card"><h3>${patient.name}</h3><p>${patient.condition}</p>
      <p>Age: ${patient.age} | Weight: ${patient.weight}kg</p>
      <p>Allergies: ${patient.allergies.join(",")||"None"}</p></div>
    ${renderChoices("Drug",patient.options,"drug")}
    ${renderChoices("Dose",patient.doses,"dose")}
    ${renderChoices("Frequency",patient.freq,"freq")}
    <button class="btn" onclick="submitAnswer()">Submit 👑</button>
    <button class="nav-btn" onclick="showStageProgress()">🏠 Back to Menu</button>
    <p id="result" class="result"></p>
  `;
}

function renderChoices(title,options,type){
  return `<div class="card"><h4>${title}</h4>`+
    options.map(o=>`<div class="choice" onclick="selectChoice('${type}','${o}',this)">${o}</div>`).join("")+
    `</div>`;
}

function selectChoice(type,value,el){
  if(type==="drug") selectedDrug=value;
  if(type==="dose") selectedDose=value;
  if(type==="freq") selectedFreq=value;
  Array.from(el.parentElement.children).forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");
}

function submitAnswer(){
  const result = document.getElementById("result");
  const correct = patient.correct;

  if(selectedDrug===correct.drug && selectedDose===correct.dose && selectedFreq===correct.freq){
    xp += 10;
    completedCases.push(patient); // ✅ Only correct
    result.innerHTML = `<p>✨ Correct!</p><p>${correct.explanation}</p>`;
    if(xp >= 50){ level++; xp=0; result.innerHTML += `<br><p>👑 Level Up!</p>`; }
  } else {
    health -= 20;
    result.innerHTML = `<p>❌ Incorrect.</p><p>Correct: ${correct.drug}, ${correct.dose}, ${correct.freq}</p><p>💡 ${correct.explanation}</p>`;
    if(health <= 0){ result.innerHTML += `<br><p>⚠️ Health depleted!</p>`; health = 100; }
  }

  saveProgress();
  setTimeout(startStage,3000);
}

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

window.onload = showStageProgress;