import React, { useState } from 'react';
import { scrapeData } from './api';

const LinkedInData = () => {
  const [companyUrl, setCompanyUrl] = useState('');
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await scrapeData(companyUrl);
      setData(result);
    } catch (error) {
      console.error('Error scraping data:', error);
    }
  };

  return (
    <div>
      <h1>LinkedIn Data Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
          placeholder="Enter LinkedIn Company URL"
        />
        <button type="submit">Scrape Data</button>
      </form>
      {data && (
        <div>
          <h2>Scraped Data</h2>
          <p>{JSON.stringify(data)}</p>
        </div>
      )}
    </div>
  );
};

export default LinkedInData;
