import axios from 'axios';

const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

export const scrapeData = async (url) => {
  try {
    const response = await api.post('/scrape', { url });
    return response.data;
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
};
