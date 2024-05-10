const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Function to scrape data from the URL
async function scrapeData(url, year) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Find the table with class "tablepress"
        const table = $('.tablepress').last();

        // Get the last row of the table footer
        const lastRow = table.find('tr').last();

        // Get the data from the 2nd and 3rd column of the last row
        const data2 = lastRow.find('td:nth-child(2)').text().trim().replaceAll(',', '');
        const data3 = lastRow.find('td:nth-child(3)').text().trim().replaceAll(',', '');

        return { year, data2, data3 };
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Function to store data in CSV format
function saveToCSV(data, filename) {
    const csvContent = `${data.year},${data.data2},${data.data3}\n`;
    fs.appendFileSync(filename, csvContent);
    console.log('Data saved to CSV:', filename);
}

// Main function to scrape data and save to CSV
async function main() {
    const filename = 'car_production_data.csv';
    fs.writeFileSync(filename, 'Year,Data2,Data3\n');

    for (let year = 2014; year <= 2023; year++) {
        const url = `https://www.oica.net/category/production-statistics/${year}-statistics/`;
        const data = await scrapeData(url, year);
        saveToCSV(data, filename);
    }
}

// Run the main function
main();
