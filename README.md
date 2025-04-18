# AI Mock Interview Platform

A modern web application for conducting AI-powered mock interviews with real-time feedback, built with Next.js and integrated with VAPI's voice AI capabilities.


## Features

- 🔒 Authentication flow (Sign-up/Sign-in) with Firebase
- 🎙️ AI-powered interview simulation
- 📊 Real-time interview feedback 
- 🧩 Modular component architecture
- 🌐 Responsive UI with Tailwind CSS
- 🚀 Next.js App Router implementation
- 🤖 VAPI integration for voice interactions



## Technologies

- **Framework**: Next.js 
- **Styling**: Tailwind CSS
- **Authentication**: Firebase
- **Database**: Firebase
- **Voice AI**: VAPI 
- **Response AI**: Gemini 
- **UI Components**: Shadcn/ui
- **State Management**: React Context
- **Form Handling**: React Hook Form with zod
- **Notifications**: Sonner
- **Build Tool**: TypeScript


## Installation

1. Clone the repository:
```bash
git clone https://github.com/bhupesh227/ai-mock-interview.git
cd ai_mock_interview
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
GOOGLE_GENERATIVE_AI_API_KEY
NEXT_PUBLIC_VAPI_WEB_TOKEN
NEXT_PUBLIC_VAPI_WORKFLOW_ID
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
```bash

 bhupesh227-ai_mock_interview/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── sign-in/
    │   │   │   └── page.tsx
    │   │   └── sign-up/
    │   │       └── page.tsx
    │   ├── (root)/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── interview/
    │   │       ├── page.tsx
    │   │       └── [id]/
    │   │           ├── page.tsx
    │   │           └── feedback/
    │   │               └── page.tsx
    │   └── api/
    │       └── vapi/
    │           └── generate/
    │               └── route.ts
    ├── components/
    │   ├── Agent.tsx
    │   ├── AnimatedButton.tsx
    │   ├── Animation.tsx
    │   ├── AuthForms.tsx
    │   ├── ClientInterviewCard.tsx
    │   ├── Footer.tsx
    │   ├── FormField.tsx
    │   ├── InterviewCard.tsx
    │   ├── LatestInterviews.tsx
    │   ├── LogOut.tsx
    │   ├── Navbar.tsx
    │   ├── TechIcons.tsx
    │   ├── Avatar/
    │   │   ├── AvatarImage.tsx
    │   │   └── AvatarSelect.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       └── sonner.tsx
    ├── constants/
    │   ├── avatar.ts
    │   └── index.ts
    ├── firebase/
    │   ├── admin.ts
    │   └── client.ts
    ├── lib/
    │   ├── utils.ts
    │   ├── vapi.sdk.ts
    │   └── actions/
    │       ├── auth.action.ts
    │       └── general.action.ts
    ├── public/
    │   ├── pattern.webp
    │   ├── avatar/
    │   └── covers/
    └── types/
        ├── index.d.ts
        └── vapi.d.ts

```

## Future Improvements

- Customizable interview templates for different industries
- Multi-language support
- Video interview capabilities
- Google authentication security section
- Email Verification


##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b ...`)
3. Commit your changes (`git commit -m '...'`)
4. Push to the branch (`git push origin ...`)
5. Open a Pull Request

## Acknowledgments

- VAPI team for their voice AI SDK
- Next.js community for awesome documentation
- Shadcn/ui for beautiful component templates
- Freepik for images
- [JSMastery](https://www.youtube.com/@javascriptmastery)

© 2025 HumanAi by Bhupesh Bora. All rights reserved.