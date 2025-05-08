// Hämta data från databasen
let students = await dbQuery("SELECT Academic_Pressure, CGPA FROM results");

// Omvandla data till rätt format
let pressureLevels = students.map(s => s.Academic_Pressure);
let cgpaValues = students.map(s => s.CGPA);

// Visa en rubrik
addMdToPage("## Samband mellan akademisk stress och CGPA");

// Beräkna Pearson-korrelation
let correlation = s.sampleCorrelation(pressureLevels, cgpaValues);

addMdToPage(`
  ### Pearson-korrelation mellan akademisk stress och CGPA
  * **Korrelationskoefficient (r): ${correlation.toFixed(3)}**  
  * Om r ≈ **1** → starkt positivt samband (hög stress → hög CGPA)  
  * Om r ≈ **-1** → starkt negativt samband (hög stress → låg CGPA)  
  * Om r ≈ **0** → inget samband  
`);

addMdToPage(`Pearson test undersöker om en ökning i den ena variabeln hänger ihop med en ökning eller minskning i den andra och i så fall hur starkt det sambandet är.`)

// Skapa data för scatterplot
drawGoogleChart({
  type: 'ScatterChart',
  data: makeChartFriendly(students, 'Academic_Pressure', 'CGPA'),
  options: {
    title: 'Samband mellan akademisk stress och CGPA',
    hAxis: { title: 'Akademisk stress' },
    vAxis: { title: 'CGPA' },
    height: 500,
    width: 700,
    legend: 'none'
  }
});


// Dela upp grupper baserat på medianvärde av stress
let medianPressure = s.median(pressureLevels);
let highStressCGPA = students.filter(s => s.Academic_Pressure >= medianPressure).map(s => s.CGPA);
let lowStressCGPA = students.filter(s => s.Academic_Pressure < medianPressure).map(s => s.CGPA);

// Hypotesprövning med t-test
let pValue = s.tTestTwoSample(highStressCGPA, lowStressCGPA, { equalVariance: false });



// Visa medelvärden för båda grupper
addMdToPage(`
  ### Medelvärde av CGPA
  * **Studenter med hög stress:** ${s.mean(highStressCGPA).toFixed(2)}
  * **Studenter med låg stress:** ${s.mean(lowStressCGPA).toFixed(2)}
`);

addMdToPage(`Detta visar att skillnaden mellan personer med högstress och personer med låg stress har inte står skillnad i CGPA`)