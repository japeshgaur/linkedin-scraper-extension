document.addEventListener('DOMContentLoaded', function () {

	fetchLatestCompanyDetails();
  });
  
  async function fetchLatestCompanyDetails() {
	try {
	  const companyURL = await extractCompanyURL();
	
	  if (companyURL.startsWith('https://www.linkedin.com/company')) {
		const response = await fetch(`http://localhost:3001/api/companies?url=${companyURL}`);
		
		if (!response.ok) {
		  throw new Error('Failed to fetch company details');
		}
	
		const company = await response.json();
	
		const companyDetails = document.getElementById('company-details');
		companyDetails.innerHTML = `
			<div class="company-item">
				<img src="${company.logo}" loading="lazy" alt="${company.name} logo" class="company-logo">
				<h3 class="company-name">${company.name}</h3>
				<p>${company.description}</p>
				<ul class="info-list">	
					<li class="list-item"><span class="first-child"><img src="svg/icon.svg"> <a href="${company.website}" target="_blank">${company.website}</a></span><span class="second-child type">Website</span> </li>
					<li class="list-item"><span class=""first-child><img src="svg/call.svg"> +1800-012345</span><span class="second-child type">HQ</span</li>
					<li class="list-item"><span class="first-child type"><img src="svg/Users.svg"> Employees</span><span class="second-child">${company.employees}</span></li>
					<li class="list-item"><span class="first-child type"><img src="svg/group_4.svg"> Industry</span><span class="second-child">${company.industry}</span></li>
					<li class="list-item"><span class="first-child type"><img src="svg/group_1.svg"> Specialities</span><span class="second-child">${company.specialities && company.specialities != '-' ? company.specialities : 'e-Commerce,s Operations, and Internet'}</span></li>
					<li class="list-item"><span class="first-child type"><img src="svg/location.svg"> Headquarters</span><span class="second-child">${company.headquarters}</span></li>
					<li class="list-item"><span class="first-child type"><img src="svg/founded.svg"> Founded</span><span class="second-child">${company.founded != '-' ?company.founded : '2007'} </span></li>
				</ul>
			</div>
		`;
	  } else {

			const response = await fetch('http://localhost:3001/api/companyList');

			const companies = await response.json();

			const companyDetails = document.getElementById('company-details');
			
			function createCompanyTableRow(company) {
				const row = document.createElement('tr');
				row.classList.add('table-row');
				row.innerHTML = `
				<td class="table-item"><img src="${company.logo}" alt="${company.name} logo" class="company-logo"></td>
				<td class="table-item company-name">${company.name}</td>
				<td class="table-item">${company.headquarters}</td>
				<td class="table-item">${company.employees}</td>
				<td class="table-item">${company.industry}</td>
				<td class="table-item">${company.founded}</td>
				<td class="table-item company-website">${company.website} <img src="svg/copy.svg" class="copy-icon"></i></td>
				`;

				row.addEventListener('mouseover', function() {
					const copyIcon = row.querySelector('.copy-icon');
					copyIcon.style.display = 'inline-block';
				});

				row.addEventListener('mouseout', function() {
					const copyIcon = row.querySelector('.copy-icon');
					copyIcon.style.display = 'none';
				});
			
				const copyIcon = row.querySelector('.copy-icon');
				copyIcon.addEventListener('click', function(event) {
					event.preventDefault();

					const companyWebsite = company.website;
					
					navigator.clipboard.writeText(companyWebsite)
					.then(() => {
						console.log('Company website copied to clipboard:', companyWebsite);
						alert('Company website copied to clipboard');
					})
					.catch((error) => {
						console.error('Error copying company website to clipboard:', error);
						alert('Error copying company website to clipboard');
					});
				});
				
				return row;
			}
		  
			const tableContainer = document.createElement('div');
			tableContainer.classList.add('company-list');

			const tableHeader = document.createElement('tr');
			tableHeader.classList.add('table-header');
			tableHeader.innerHTML = `
			<th class="table-heading">LOGO</th>
			<th class="table-heading">NAME</th>
			<th class="table-heading">HQ LOCATION</th>
			<th class="table-heading">EMPLOYEES</th>
			<th class="table-heading">INDUSTRY</th>
			<th class="table-heading">FOUNDED</th>
			<th class="table-heading">WEBSITE</th>
			`;

			
			tableContainer.appendChild(tableHeader);

			companies.forEach(company => {
			const row = createCompanyTableRow(company);
			tableContainer.appendChild(row);
			});

			const div = document.createElement('div');
			div.classList.add('cancel-btn-container');

			const cancelButton = document.createElement('img');
			cancelButton.src = 'svg/cancel.svg';

			cancelButton.addEventListener('click', function () {
                // Close the extension popup
                window.close();
            });

			div.appendChild(cancelButton);
			companyDetails.appendChild(div);

			companyDetails.appendChild(tableContainer);
		}
	} catch (error) {
	  console.error('Error:', error);
	  const companyDetails = document.getElementById('company-details');
	  companyDetails.innerHTML = '<h2>Error fetching company details</h2>';
	}
  }
  
  function extractCompanyURL() {
	return new Promise((resolve, reject) => {
	  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		const url = tabs[0].url;
		
		if (url) {
		  resolve(url);
		} else {
		  reject(new Error('Not a LinkedIn company page'));
		}
	  });
	});
  }

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'openPopup') {
        
        chrome.action.openPopup();
    }
});

  