// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');

app.use(cors());
// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/linkedinScraper', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define MongoDB schema and model for company information
const companySchema = new mongoose.Schema({
  visitedCompanies: [
    {
    name: String,
    website: String,
	  description: String,
	  logo: String,
	  industry: String,
	  headquarters: String,
	  specialities: String,
	  employees: String,
	  founded: String,
	  url: String,
      // Add more fields as needed
    }
  ]
});

const Company = mongoose.model('Company', companySchema);

// Middleware
app.use(bodyParser.json());

// API endpoints
app.post('/api/companies', async (req, res) => {
  try {
    const { name, website, description, logo, industry, headquarters, employees, founded, specialties, url } = req.body;
    const newCompany = { name, website, description, logo, industry, headquarters, employees, founded, specialties, url }; // Create a new company object

    // Find the company document based on the URL
    let company = await Company.findOne({ 'visitedCompanies.url': url });

    if (!company) {
      // If the company document doesn't exist, create a new one
      company = new Company();
    }

    // Add the new company to the visitedCompanies array
    company.visitedCompanies.push(newCompany);

    // Save the company document
    await company.save();

    res.status(201).json({ message: 'Company information saved successfully' });
  } catch (error) {
    console.error('Error saving company information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies', async (req, res) => {
	try {
	  const url = req.query.url; // Extract URL from query parameters

	  const company = await Company.findOne({ 'visitedCompanies.url': url });
  
	  if (!company) {
		  return res.status(404).json({ error: 'Company not found' });
	  }
  
	  // Find the specific company within the visitedCompanies array
	  const visitedCompany = company.visitedCompanies.find(company => company.url === url);
  
	  if (!visitedCompany) {
		return res.status(404).json({ error: 'Company not found' });
	  }
  
	  res.json(visitedCompany);
	} catch (error) {
	  console.error('Error retrieving company:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

  app.get('/api/companyList', async (req,res) => {
    try {
      const companyList = await Company.find();

      const response = companyList.map(item => {
        if (item.visitedCompanies.length > 0) {
          return item.visitedCompanies[0];
        }
      }).filter(Boolean);

      console.log(response);

      res.json(response);
      
    } catch (error) {
      console.error('Error retrieving company:', error);
  	  res.status(500).json({ error: 'Internal server error' });
    }
  })


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
