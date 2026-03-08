🚀 Codelingo — AI Powered Coding Learning Platform

Codelingo is an AI-driven interactive coding learning platform designed to help students learn programming concepts through problem solving, AI feedback, and gamification.

Instead of memorizing syntax, Codelingo focuses on thinking like a programmer first, guiding learners through structured problem solving before writing code.

✨ Features
🧠 AI Thinking Lock

Before writing code, users must:

Select the correct algorithmic approach

Explain their reasoning

The AI evaluates their thinking and unlocks the code editor only if the approach is correct.

🎤 AI Interview Simulator

Practice technical interviews with AI.

Features:

AI generates DSA interview questions

User explains solution

AI evaluates reasoning and gives feedback + score

🏆 Mini Hackathons

Short coding challenges where users must:

Choose an approach

Explain logic

Write solution code

AI evaluates the submission and provides feedback.

🔎 AI Code Analyzer

Users can paste code and get:

Error detection

Code quality suggestions

Corrected version of code

💬 AI Mentor Community

A built-in chatbot where users can ask:

coding questions

algorithm doubts

programming concepts

The AI mentor provides beginner-friendly explanations.

🎮 Gamification System

Learning is gamified using:

XP system

Streak tracking

Hearts (lives)

Badges

Leagues

This motivates consistent learning similar to Duolingo-style progression.

👤 Personalized Learning

Users complete an onboarding flow where they choose:

Learning track (DSA, Python, Java, Web, DBMS)

Skill level

Learning goal

Daily learning time

The platform adapts the experience based on this data.

🏗️ System Architecture
Frontend (React + TypeScript)
        │
        ▼
AWS API Gateway
        │
        ▼
AWS Lambda (Node.js)
        │
        ├── Amazon Bedrock (AI models)
        │
        └── DynamoDB (User data & stats)
🛠 Tech Stack
Frontend

React

TypeScript

TailwindCSS

Shadcn UI

Backend

AWS Lambda

API Gateway

Amazon Bedrock (Nova Lite AI model)

Database

DynamoDB

Authentication

AWS Cognito

Deployment

AWS

📦 Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/codelingo.git

Go to project folder:

cd codelingo

Install dependencies:

npm install

Run the development server:

npm run dev
⚙️ Environment Variables

Create a .env file:

VITE_API_URL=YOUR_API_GATEWAY_URL
🧪 Example AI Workflow

Example for AI Interview:

User requests interview question

Lambda calls Bedrock Nova Lite

AI generates a DSA question

User submits reasoning

AI evaluates and returns:

Verdict
Score
Feedback
Follow-up question
🎯 Goals of the Project

Codelingo aims to:

Teach problem solving before coding

Provide AI guided learning

Simulate real technical interviews

Encourage consistent practice through gamification

🚀 Future Improvements

Planned enhancements:

Real-time multi-user coding rooms

Leaderboards

AI-generated coding roadmaps

Code execution sandbox

Personalized learning analytics

Multi-language support

👨‍💻 Authors

Developed as part of a hackathon project.

Team: AlgoAlliance
