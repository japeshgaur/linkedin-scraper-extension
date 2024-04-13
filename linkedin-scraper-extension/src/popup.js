document.addEventListener('DOMContentLoaded', function () {
	// Fetch and display details of the latest visited company
	fetchLatestCompanyDetails();
  });
  
  // Function to fetch and display details of the latest visited company
  async function fetchLatestCompanyDetails() {
	try {
	  // Extract the URL of the visited company
	  const companyURL = await extractCompanyURL();
	
	  if (companyURL) {
		// Fetch company details based on the URL
		const response = await fetch(`http://localhost:3000/api/companies?url=${companyURL}`);
		if (!response.ok) {
		  throw new Error('Failed to fetch company details');
		}
	
		const company = await response.json();
	
		// Display company details in the popup
		const companyDetails = document.getElementById('company-details');
		companyDetails.innerHTML = `
			<img src="${company.logo}" loading="lazy" alt="${company.name} logo" class="company-logo">
			<h3 class="company-name">${company.name}</h3>
			<p>${company.description}</p>
			<ul class="info-list">	
				<li class="list-item"><span class="first-child"><img src="svg/icon.svg"> <a href="${company.website}" target="_blank">${company.website}</a></span><span class="second-child type">Website</span> </li>
				<li class="list-item"><span class="first-child type"><img src="svg/Users.svg"> Employees</span><span class="second-child">${company.employees}</span></li>
				<li class="list-item"><span class="first-child type"><img src="svg/group_4.svg"> Industry</span><span class="second-child">${company.industry}</span></li>
				<li class="list-item"><span class="first-child type"><img src="svg/group_1.svg"> Specialities</span><span class="second-child">${company.specialities}</span></li>
				<li class="list-item"><span class="first-child type"><img src="svg/location.svg"> Headquarters</span><span class="second-child">${company.headquarters}</span></li>
				<li class="list-item"><span class="first-child type"><img src="svg/founded.svg"> Founded</span><span class="second-child">${company.founded}</span></li>
			</ul>
			<!-- Add more details as needed -->
		`;
	  } else {
		// Display a message if the current webpage is not a LinkedIn company page
		const companyDetails = document.getElementById('company-details');
		companyDetails.innerHTML = '<h2>This is not a LinkedIn company page</h2>';
	  }
	} catch (error) {
	  console.error('Error:', error);
	  // Display an error message if there is an error fetching data
	  const companyDetails = document.getElementById('company-details');
	  companyDetails.innerHTML = '<h2>Error fetching company details</h2>';
	}
  }
  
  // Function to extract the URL of the visited company from the current webpage
  function extractCompanyURL() {
	return new Promise((resolve, reject) => {
	  // Get the active tab in the current window
	  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		// Extract the URL from the tab object
		const url = tabs[0].url;
		
		if (url) {
		  resolve(url); // Resolve with the matched company URL
		} else {
		  reject(new Error('Not a LinkedIn company page')); // Reject with an error if the current webpage is not a LinkedIn company page
		}
	  });
	});
  }
  