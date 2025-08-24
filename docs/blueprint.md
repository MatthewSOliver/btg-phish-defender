# **App Name**: Phish Defender

## Core Features:

- Email Generation: Generate a list of emails (both phishing and safe) dynamically using the Gemini AI API, formatted as JSON objects with fields like sender, subject, body, and isPhishing (boolean). The AI will use tool use and reasoning to incorporate or exclude various markers that could identify phishing emails, or safe ones.
- Email Display: Display the generated emails in a clean, card-based layout within an inbox.
- Email Marking: Allow the user to mark each email as either 'Safe' or 'Phishing' using clearly labeled buttons. Each EmailCard will display either 'Safe' or 'Phishing', but never both, as set by the user.
- AI Feedback: After the user marks an email, provide AI-generated feedback explaining why the email is considered phishing or safe based on its content, sender, and other factors.
- Score Tracking: Track the user’s score (number of correct classifications) and overall progress (number of emails processed).
- Configuration Management: Store and retrieve application configuration such as Gemini AI keys.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB) to create a calm and trustworthy environment.
- Background color: Very light blue (#F0F8FF) for a clean and unobtrusive backdrop.
- Accent color: Soft orange (#FFB347) to draw attention to important actions and feedback.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Code font: 'Source Code Pro' for displaying any code snippets or technical details.
- Use simple, recognizable icons to represent safe and phishing emails (e.g., a shield for safe, a warning sign for phishing).
- Use subtle animations, like a gentle fade-in, to enhance user engagement when feedback appears or scores update.