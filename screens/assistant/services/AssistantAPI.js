import { getToken } from '../../../utils/token';

// Sample responses for demonstration purposes
const SAMPLE_RESPONSES = {
  "website_creation": "I'd be happy to help you create a professional website for your business. Let's start by discussing what type of business you have and what features you need. Would you like to use one of our templates, or would you prefer a custom design?",
  
  "portfolio_templates": "For a portfolio website, I recommend our 'Showcase' or 'Gallery' templates, which are designed to highlight visual work in a modern, clean layout. The 'Professional' template is excellent for text-based portfolios. Would you like me to show you previews of these templates?",
  
  "seo_tips": "To improve your website's SEO, consider: 1) Adding relevant keywords to your titles and content, 2) Creating original, quality content regularly, 3) Optimizing images with alt text, 4) Ensuring your site loads quickly, and 5) Making your site mobile-friendly. Would you like me to help implement any of these?",
  
  "online_store": "Setting up an online store is straightforward with our e-commerce features. We can add product listings, secure payment processing, inventory management, and shipping options. Would you like to start with our 'Shop' template, or would you prefer to add e-commerce features to your existing design?",
  
  "default": "I'm here to help with your website. I can assist with design, content, functionality, and optimization. What specific aspect of your website would you like to work on today?"
};

// Function to identify the query type
const identifyQueryType = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("create") && (lowerText.includes("website") || lowerText.includes("site"))) {
    return "website_creation";
  }
  
  if (lowerText.includes("template") && lowerText.includes("portfolio")) {
    return "portfolio_templates";
  }
  
  if (lowerText.includes("seo") || (lowerText.includes("improve") && lowerText.includes("website"))) {
    return "seo_tips";
  }
  
  if (lowerText.includes("online store") || lowerText.includes("e-commerce") || lowerText.includes("ecommerce")) {
    return "online_store";
  }
  
  return "default";
};

class AssistantAPI {
  constructor() {
    this.apiEndpoint = 'https://api.example.com/assistant'; // Replace with your actual API endpoint
  }
  
  async sendMessage(message) {
    try {
      // In a real implementation, you would use fetch to send the message to your API
      // const token = await getToken();
      // const response = await fetch(this.apiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ message })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Server responded with ${response.status}`);
      // }
      // 
      // const data = await response.json();
      // return data.response;
      
      // For demo purposes, we're using a timeout to simulate the server response
      return new Promise((resolve) => {
        setTimeout(() => {
          const queryType = identifyQueryType(message);
          resolve(SAMPLE_RESPONSES[queryType] || SAMPLE_RESPONSES.default);
        }, 1000);
      });
    } catch (error) {
      console.error('Error sending message to assistant API:', error);
      throw new Error('Failed to communicate with assistant. Please try again.');
    }
  }
  
  async sendVoiceTranscription(transcription) {
    // In a real app, you might want to handle voice transcriptions differently
    // For this demo, we'll just use the same message handler
    return this.sendMessage(transcription);
  }
}

export default new AssistantAPI(); 