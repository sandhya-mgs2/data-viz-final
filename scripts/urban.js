const fs = require('fs');

// Read the CSV file
const csvData = fs.readFileSync('urban-area-long-term.csv', 'utf8');

// Split the CSV data by lines and remove empty lines
const lines = csvData.split('\n').filter(line => line.trim() !== '');

// Create a map to store area values by country
const countryData = new Map();

// Iterate through the lines and collect data for each country
lines.forEach(line => {
    const [country, , year, area] = line.split(',');
    const parsedYear = parseInt(year);
    const parsedArea = parseFloat(area);
    
    // Store area values for 1990 and 2023
    if (parsedYear === 1990 || parsedYear === 2023) {
        if (!countryData.has(country)) {
            countryData.set(country, {});
        }
        countryData.get(country)[parsedYear] = parsedArea;
    }
});

// Calculate growth rate for each country
const countryGrowthRates = [];
countryData.forEach((data, country) => {
    const area1990 = data[1990];
    const area2023 = data[2023];
    const growthRate = (((area2023 - area1990) / area1990)/(10))*100;
    console.log(country, area1990, area2023)
    countryGrowthRates.push({ country, growthRate });
});

// Export data to a new CSV file
const csvOutput = countryGrowthRates.map(entry => `${entry.country},${entry.growthRate.toFixed(4)}`).join('\n');
fs.writeFileSync('urban-area-growth-rate-1990-2023-decade.csv', csvOutput);

console.log('Data exported to urban-area-growth-rate-1990-2023.csv');
