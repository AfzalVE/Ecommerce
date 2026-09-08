// Replace with real API later
export const generateAIResponse = async (message) => {
  // Example logic (you can call OpenAI here)
  
  if (message.toLowerCase().includes("shoes")) {
    return "Here are some popular shoes in our store 👟";
  }

  return `AI Reply to: "${message}"`;
};