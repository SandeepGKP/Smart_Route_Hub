# AI Usage Disclosure

As part of modern software engineering practices, this project was developed using **Agentic AI Assistance**. 

Specifically, **Google DeepMind's Gemini Models (via the Antigravity IDE)** acted as an autonomous pair programmer during the development process. 

## Areas of AI Contribution

1. **Architecture & Design Patterns:**
   - The AI assisted in architecting the core `RoutingEngine` utilizing the **Strategy Design Pattern** for cleanly separating `Lowest Cost`, `Lowest Latency`, and `Failover` logic.
   - Designed the MongoDB Mongoose Schemas (Vendor, RoutingLogs) for optimal metrics tracking.

2. **Full-Stack Implementation:**
   - **Backend:** Bootstrapped the Express.js server, configured the routing controllers, and implemented the circuit breaker logic (`isDown`) and metrics moving average calculations.
   - **Frontend:** Built the entire React (Vite) frontend application, implementing responsive designs, glassmorphism UI components, and dynamic state management using Tailwind CSS v4.

3. **Debugging & DevOps:**
   - Successfully debugged local Windows DNS SRV lookup failures (`querySrv ECONNREFUSED`) by injecting IPv4 forcing and Google Public DNS overrides into the `db.js` Mongoose connection logic.

4. **Bonus Task Integration (Agentic AI Configurator):**
   - The AI integrated the `@google/generative-ai` SDK into the `aiController.js` to fulfill the bonus task, designing the strict system prompts required to force Gemini to act as a structured JSON Routing Expert.

5. **Documentation:**
   - Generated the Mermaid architecture diagrams and structured the `README.md` to reflect the complete capabilities of the system.

## Human Oversight
While AI rapidly accelerated the development process, all routing logic, API integration points, testing, and final architectural validations were strictly overseen and verified to perfectly align with the specific constraints and requirements of the assignment brief.
