




// Hämta data från databasen
let data = await dbQuery(`
  SELECT Gender, Have_you_ever_had_suicidal_thoughts 
  FROM results
  WHERE Gender IN ('Male', 'Female')
`);

if (!data || data.length === 0) {
  console.error("Ingen data hämtades från databasen!");
} else {
  console.log("Data hämtad:", data);
}

// Skapa en struktur för att räkna svaren
let counts = {
  Male: { Yes: 0, No: 0 },
  Female: { Yes: 0, No: 0 }
};

// Räkna antal svar per kön
data.forEach(row => {
  let gender = row.Gender;
  let answer = row.Have_you_ever_had_suicidal_thoughts;

  if (counts[gender] !== undefined) {
    if (answer === 1) {
      counts[gender].Yes++;  // 1 = Ja
    } else if (answer === 0) {
      counts[gender].No++;   // 0 = Nej
    }
  }
});

// Förbered data för Google Charts
let chartData = [
  ["Kön", "Ja", "Nej"],
  ["Male", counts.Male.Yes, counts.Male.No],
  ["Female", counts.Female.Yes, counts.Female.No]
];

// Lägg till förklarande text
addMdToPage(`
  ## Jämförelse mellan män och kvinnor gällande självmordstankar
  Här analyseras svaren på frågan **"Har du någonsin haft självmordstankar?"** uppdelat på kön.

  - **Manliga studenter** som svarat "Ja": ${counts.Male.Yes}
  - **Manliga studenter** som svarat "Nej": ${counts.Male.No}
  - **Kvinnliga studenter** som svarat "Ja": ${counts.Female.Yes}
  - **Kvinnliga studenter** som svarat "Nej": ${counts.Female.No}

  **Denna jämförelse visar tydligt att exakt antal männ och kvinnor som svarat ja eller nej på frågan om personen har haft självmordstankar
  eller inte**.
  ## Man kan även se i Columncharten nedan en tydlig uppdelning av av där man kan se att män har mer självmordstankar än kvinnor.
  ** Vad säger detta? jo det är svårt att säga att så är fallet i denna undersökninig utan att se helheten av datan och vad som ligger bakom dessa siffror.
  man kan även se i detta diagram att det är även många fler som svarat nej på frågan och även fler män som svarat på frågan överlag så det kan göra att svars resultat inte blir helt korrekt.**
`);

// Rita diagrammet med Google Charts
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: 'Suicidala tankar hos män och kvinnor',
    hAxis: { title: 'Kön' },
    vAxis: { title: 'Antal svar' },
    height: 500,
    width: 800,
    legend: { position: 'top' },
    colors: ['#ff5252', '#2196f3']
  }
});