module.exports = (data) => `
You are a small business consultant...

Business Name: ${data.business_name}
Owner: ${data.owner_name}
Industry: ${data.industry}
What they sell: ${data.products_or_services}
Target Audience: ${data.target_audience}
Where they sell: ${data.sales_channels}
Main Struggle: ${data.main_struggle}

Create a 1-page audit with:
1. Intro summary
2. Top 3 Actionable Fixes
3. Marketing Moves
4. Bonus Tools

Friendly tone. No code formatting.
`;
