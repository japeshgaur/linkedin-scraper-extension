const puppeteer = require('puppeteer');
export async function scrapeCompanyInfo(companyName) {
    // Use the companyName variable to construct the URL for the company's about page
    // const aboutPageURL = `https://www.linkedin.com/company/${companyName}/about`;

    // Fetch and scrape data from the about page URL
    // Add your scraping logic here

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Navigate to the "About" page of the company
	await page.goto(`https://www.linkedin.com/company/${companNname}/about`);

	// Wait for the desired element to appear
	await page.waitForSelector('.specialities');

	// Extract the specialities
	const specialities = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('.specialities')).map(elem => elem.textContent);
	});

	console.log('Specialities:', specialities);

	await browser.close();
}