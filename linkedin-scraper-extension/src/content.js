// content.js

// Function to extract company details from the LinkedIn company page
function scrapeCompanyDetails() {
	const companyDetails = {};
  
	// Extract company logo (if available)
	const logoElement = document.querySelector('.org-top-card-primary-content__logo');
	if (logoElement) {
	  companyDetails.logo = logoElement.src;
	}
	
	// Extract company name
	const companyNameElement = document.querySelector('.org-top-card-summary__title');
	  companyDetails.name = companyNameElement ? companyNameElement.innerText : '-';
  
	// Extract company description
	const descriptionElement = document.querySelector('.organization-about-module__content-consistant-cards-description');
	companyDetails.description = descriptionElement ? descriptionElement.innerText : '-';
  
	// Extract website
	const websiteElement = document.querySelector('a.org-top-card-primary-actions__action')
	companyDetails.website = websiteElement ? websiteElement.href : '-';	
  
	// Extract number of employees
	const employeesElement = document.querySelector('.link-without-visited-state.link-without-hover-state');
	companyDetails.employees = employeesElement ? employeesElement.innerText : '-';
  
	// Extract industry
	const industryElement = document.querySelectorAll('.org-top-card-summary-info-list__info-item')[0];
	companyDetails.industry = industryElement ? industryElement.innerText : '-';
  
	// Extract specialties
	const specialtiesElement = document.querySelector('.mb4.t-black--light.text-body-medium');
	companyDetails.specialties = specialtiesElement ? specialtiesElement.innerText : '-';
  
	// Extract headquarters
	const headquartersElement = document.querySelectorAll('.org-top-card-summary-info-list__info-item')[1];
	companyDetails.headquarters = headquartersElement ? headquartersElement.innerText : '-';
  
	// Extract founded year
	const foundedElement = document.querySelector('.org-about-company-module__founded');
	companyDetails.founded = foundedElement ? foundedElement.innerText : '-';

	companyDetails.url = window.location.href;
  
	return companyDetails;
  }

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'openPopup') {
        // Trigger the opening of the extension popup
        chrome.runtime.sendMessage({ action: 'openPopup' });
    }
});

  
  // Send scraped data to the backend
  function sendScrapedDataToBackend() {
	const companyDetails = scrapeCompanyDetails();
  
	fetch('http://localhost:3001/api/companies', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(companyDetails),
	})
	.then(response => {
	  if (!response.ok) {
		throw new Error('Failed to send scraped data to backend');
	  }
	})
	.catch(error => {
	  console.error('Error:', error);
	});
  }
  
  // Invoke the function to send scraped data to the backend
  sendScrapedDataToBackend();
  