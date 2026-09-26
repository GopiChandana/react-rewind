The Google Gemini API free tier is the absolute best choice for your web performance analyzer project [1]. It gives you free access to industry-grade AI, includes a generous rate limit for testing, and allows recruiters to interact with your live app without costing you a cent [1].
Using the Gemini API directly ensures seamless integration with Google’s ecosystem, making it easy to feed data from tools like the Google PageSpeed Insights API straight into the AI for analysis.
### Top Free AI Options for Recruiters to See

* 
* Google Gemini API:
* Best For: Direct Google ecosystem synergy and robust multi-modal analysis.
   * Free Tier Allowances: The Gemini 1.5 Flash model offers 15 RPM (requests per minute) and 1,500 RPD (requests per day) completely free [1].
   * Recruiter Visibility: Recruiters can test your live web app freely within these daily limits without needing an API key or an account [1].
   * Key Advantage: Zero cost as long as you stay within the rate limits, with no credit card required to start [1].
* Groq Cloud API:
* Best For: Blazing fast text generation and performance optimization.
   * Free Tier Allowances: Provides generous, high-speed free tier access to open-source models like Llama 3 and Mixtral.
   * Recruiter Visibility: Ideal for production demos because response times are nearly instant, heavily impressing technical recruiters.
   * Key Advantage Available via a standard OpenAI-compatible SDK structure, making it highly portable.
* Hugging Face Inference API:
* Best For: Total flexibility with open-source models.
   * Free Tier Allowances: Free, rate-limited access to thousands of open-source models deployed on Hugging Face infrastructure.
   * Recruiter Visibility: Great for showing backend versatility, though public endpoints can occasionally face cold-start delays.
   * Key Advantage: Allows you to swap models (e.g., from Meta, Mistral, or Google) instantly by changing a single URL string.
* 

------------------------------
### Architecture for Your Web Performance Analyzer
To build this cleanly, structure your application data flow into three clear phases:

[User Input: URL] 
       │
       ▼
[Google PageSpeed Insights API] ──(JSON Metrics)──► [Your Backend / Frontend App]
                                                           │
                                                   (Format Prompt with Metrics)
                                                           │
                                                           ▼
                                                [Google Gemini API (Free Tier)]
                                                           │
                                                    (AI Suggestions)
                                                           │
                                                           ▼
                                                [Beautiful UI / Recruiter Dashboard]


   1. Metric Gathering: Your app takes a URL input and calls the [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) (which is also free) to extract Core Web Vitals like LCP, FID, and CLS.
   2. AI Prompting: Your code takes that raw JSON data, cleans it, and sends it to the Gemini 1.5 Flash model with a structured prompt (e.g., "Analyze these metrics and provide 3 punchy, actionable front-end fixes...").
   3. UI Presentation: Display the raw performance numbers in clean visual charts alongside the AI-generated optimization suggestions.

------------------------------
### How to Protect Your API Key from Recruiters
Since recruiters will be viewing and testing your live project (hosted on platforms like Vercel, Netlify, or GitHub Pages), you must secure your free API key so it is not stolen or abused.

* 
* Never Hardcode Keys: Do not write your API key directly into your frontend JavaScript or push it to a public GitHub repository.
* Use Serverless Functions: Keep the API key secure on the backend. If you use Next.js, use /api routes. If you use Vite or React, set up a tiny Node.js/Express backend or a free Vercel Serverless Function to handle the Gemini API call safely.
* Set Up Request Throttling: Implement basic rate limiting (like express-rate-limit) on your own backend route so a single user cannot spam your live site and exhaust your free daily Gemini quota.
* 

Would you like me to create a sample prompt structure for Gemini that formats raw JSON speed metrics into clean, user-friendly UI recommendations? Alternatively, I can provide a template for a secure Node.js serverless function to hide your API key. Let me know what you need next!

