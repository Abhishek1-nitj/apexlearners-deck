# Aspire Learners Interactive Talent Deck Website

A modern, high-fidelity horizontal-scrolling slide-deck presentation website for **Aspire Learners** built using HTML5, CSS3, JavaScript, and GSAP.

## Features & Visual Storytelling Elements
1. **Smooth Horizontal Scrolling**: Vertically scrolling or using arrow keys translates to smooth, horizontal movement across 21 slide decks using GSAP and `ScrollTrigger`.
2. **Dynamic Background**: Lightweight HTML5 Canvas particle system representing "talent floating into a pipeline".
3. **Interactive Sourcing Funnel (Slide 2)**: Visual funnel tier heights showing recruiting attrition rates.
4. **90-Day Calendar & Metrics (Slide 4)**: Interactive calendar showcasing onboarding milestones alongside animated statistics counters.
5. **Supply Engine Conveyor (Slide 6)**: Click "Simulate Supply Flow" to see candidate credentials processed along the pipeline with an end-stage confetti blast.
6. **Candidate Configurator (Slide 7)**: Live candidate card updates qualifications, salary range sliders, and titles instantly.
7. **Talent Sourcing Capacity Graph (Slide 8)**: Custom animations that fill the SVG column heights representing monthly numbers.
8. **Pan-India Interactive Sourcing Map (Slide 9)**: Fully responsive SVG map of India with glowing cities (Bangalore, NCR, Hyderabad, Pune, Mumbai, Chennai, Kolkata). Hovering over cities aligns selection pills dynamically.
9. **AI Co-Pilot Skills Stack (Slide 11)**: Highlighted card illustrating core operational skills augmented with AI automation tooling.
10. **Assessment Radar (Slide 12)**: Embedded SVG radar/spider charts showcasing candidate quality metrics.
11. **Candidate Scorecard (Slide 13)**: Dynamic scorecard credentials tracking metrics like Excel, SQL, and business communication.
12. **Simulation Hiring Triggers (Slide 14)**: Simulate hiring Candidate A/B to trigger immediate confetti explosions and toast notifications.
13. **Outcomes Metrics Gauges (Slide 15)**: Glowing circular progress meters that fill when scrolled into view.
14. **Hiring SLA Horizontal Roadmap (Slide 18)**: Timeline roadmaps highlighting Day 0 through Day 14 milestones.
15. **Sourcing Inquiry Transmitters (Slide 21)**: Form submission that triggers loading state animations, success text alterations, and full-screen confetti events.

## Local Development Setup

To run this project locally, ensure you have [Node.js](https://nodejs.org/) installed:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Dev Server**:
   ```bash
   npm run dev
   ```

   This launches the development server on `http://localhost:3000` with hot-reloading.

3. **Build Static Bundle**:
   ```bash
   npm run build
   ```
   Compiles and bundles assets into the `dist` directory.
