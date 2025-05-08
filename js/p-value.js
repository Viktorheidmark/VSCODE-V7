

// Lägg till rubrik för sidan
addMdToPage(`
  ## Jämför Arbetstid/Studietid vs. CGPA
  Den här analysen undersöker hur arbetstid och studietid påverkar akademiska resultat (CGPA).
`);

// Hämta data från databasen om arbetstid, studietid och CGPA
let dataForChart = await dbQuery(
  `SELECT Work_Study_Hours, CGPA FROM results`
);

// Bearbeta och skapa data för scatter plot
let scatterData = [['Arbetstid/Studietid', 'CGPA']];

// Lägg till varje datapunkt till scatterData
dataForChart.forEach(row => {
  scatterData.push([row.Work_Study_Hours, row.CGPA]); // Lägg ihop arbetstid och studietid för att få en sammanlagd tid
});

google.charts.load('current', {
  'packages': ['corechart', 'scatter'],
  'language': 'sv' // Här kan du använda 'en' för engelska eller 'sv' för svenska
});

google.charts.setOnLoadCallback(() => {
  drawGoogleChart({
    type: 'ScatterChart',
    data: scatterData,
    options: {
      title: 'Arbetstid/Studietid vs. CGPA',
      hAxis: { title: 'Arbetstid + Studietid (timmar)' },
      vAxis: { title: 'CGPA' },
      height: 500,
      width: 800,
      legend: { position: 'none' }
    }
  });
});

// Regressionsanalys med hjälp av simple-statistics
let workStudyData = dataForChart.map(row => [row.Work_Study_Hours, row.CGPA]);

// Utför regressionsanalys (linjär regression)
let regressionResult = s.linearRegression(workStudyData);

// Beräkna regressionslinjens lutning och intercept
let slope = regressionResult.m;
let intercept = regressionResult.b;

// Skriv ut regressionsresultatet
console.log(`Regressionsanalys: Y = ${slope} * X + ${intercept}`);
addMdToPage(`
  ### Regressionsanalys
  Regressionsformeln för sambandet mellan arbetstid/studietid och CGPA är:
  Y = ${slope.toFixed(2)} * X + ${intercept.toFixed(2)}
  Där X är den totala tiden för arbetstid + studietid (i timmar), och Y är CGPA.
  Denna formel visar hur arbetstid och studietid påverkar CGPA.
`);








addMdToPage(`
*	Trots att man kanske skulle tro att mer tid på studier och arbete påverkar betyg, visar datan att det inte finns något tydligt linjärt samband här.
*	Punkterna i diagrammet är väldigt vertikala och visar att CGPA är ganska likt oavsett hur mycket tid studenten lägger ner på arbete + studier.
*	Den platta regressionslinjen (lutning ≈ 0) bekräftar detta.
`)