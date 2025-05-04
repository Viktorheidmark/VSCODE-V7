


addMdToPage('## Denna uppgift är en enkätundersökning kring om studerande på universitetsnivå i Indien anser sig vara deprimerade eller inte och hur detta korrelerar till deras studiebörda, arbetsbörda, antal timmar de arbetar/studerar per dag, hur mycket de sover, om de upplever att de äter hälsosamt eller inte etc.')


addMdToPage("50 students")

let studentss = await dbQuery("SELECT * FROM results LIMIT 50")
tableFromData({ data: studentss })

