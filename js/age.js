




// Första dataladdningen: Visa statistik för alla studenter innan könsval
let studentsAll = await dbQuery("SELECT Age, Gender FROM results");
let allAgeData = studentsAll.map(s => [s.Age]);

// Logga resultaten för alla studenter
console.log("Alla studenter: ", studentsAll);

drawGoogleChart({
    type: 'Histogram',
    data: makeChartFriendly(allAgeData, 'Age'),
    options: {
        height: 500,
        width: 1250,
        histogram: { bucketSize: 5 },
        hAxis: { title: 'Ålder' },
        vAxis: { title: 'Antal studenter' }
    }
});

addMdToPage("## Översikt över åldern för alla studenter");
addMdToPage("Som vi kan se från histogrammet, är majoriteten av studenterna mellan 20-25 år gamla. För studenterna i denna undersökning varierar åldrarna från 15 till 35 år.");




