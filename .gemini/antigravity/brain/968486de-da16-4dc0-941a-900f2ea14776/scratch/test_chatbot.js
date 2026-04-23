require('dotenv').config({ path: 'campbackend/.env' });
const chatbotService = require('./campbackend/services/chatbotService');

async function runTests() {
  const tests = [
    {
      name: "In-Scope Query (Data Science Fees)",
      query: "What are the fees for MSc Data Science?"
    },
    {
      name: "Out-of-Scope Query (General Knowledge)",
      query: "Who is the Prime Minister of India?"
    },
    {
      name: "Unclear Query",
      query: "tell me more"
    }
  ];

  console.log("🚀 Starting Chatbot Functional Tests...\n");

  for (const test of tests) {
    console.log(`----------------------------------------`);
    console.log(`TEST: ${test.name}`);
    console.log(`QUERY: "${test.query}"`);
    console.log(`WAITING FOR RESPONSE...`);
    
    try {
      const result = await chatbotService.sendMessage(test.query);
      console.log(`\nREPLY:\n${result.reply}`);
    } catch (error) {
      console.error(`ERROR: ${error.message}`);
    }
    console.log(`----------------------------------------\n`);
  }
}

runTests();
