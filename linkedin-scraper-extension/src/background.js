chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete' && tab.url.includes('linkedin.com/company/')) {
	  chrome.scripting.executeScript({
		target: { tabId: tabId },
		files: ['content.js']
	  });
	}
  });
  