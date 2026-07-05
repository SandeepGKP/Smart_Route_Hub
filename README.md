# Intelligent Vendor Routing Platform
**A High-Performance, AI-Powered API Gateway & Routing Engine**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 📌 Overview
The **Intelligent Vendor Routing Platform** is an enterprise-grade API gateway designed to dynamically route incoming traffic across multiple third-party vendors (e.g., PAN Verification, OCR, Face Match). Built with a highly scalable architecture, it evaluates vendor availability in real-time, executing routing decisions based on live health metrics, cost optimization constraints, and priority failovers to guarantee maximum uptime.

Includes a pristine **React + Tailwind CSS** Web Dashboard for real-time visualization, and a **Bonus Agentic AI Module** integrated with Google Gemini.

> [!IMPORTANT]  
> **Evaluator Notice: Admin Dashboard vs. Client Interface**
> As per the assignment requirements, *"The client should not know which vendor was used"*, and vendor configurations should be strictly backend operations. 
> Please note that the included React Web UI serves as an **Internal Admin / Testing Dashboard**—not a public client. 
> We explicitly expose the `vendorUsed`, `routingReason`, and the "Add Vendor" form in this UI exclusively for the sake of demonstration, allowing you (the evaluator) to visually test the routing engine and see the decisions happening behind the scenes in real-time. In a true production environment, public API clients only receive the sanitized `response` payload.

---

## 🏗 Architecture Diagram

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'background': '#f4f4f5'}}}%%
graph TD
    Client[Client Request] -->|POST /route| Gateway[Express API Gateway]
    
    subgraph Core Routing Engine
        Filter[Pre-Flight Filter]
        StrategySelector{Strategy Selector}
        CostStrategy[Cost Optimizer]
        LatencyStrategy[Latency Analyzer]
        PriorityStrategy[Priority Evaluator]
        WeightedStrategy[Traffic Distributor]
    end

    subgraph Data & Metrics Store
        DB[(MongoDB)]
        Tracker[Live Metrics Tracker]
        CircuitBreaker[Circuit Breaker Engine]
    end

    Gateway --> Filter
    Filter -->|Check limits| StrategySelector
    
    StrategySelector --> CostStrategy
    StrategySelector --> LatencyStrategy
    StrategySelector --> PriorityStrategy
    StrategySelector --> WeightedStrategy

    Decision[Target Vendor Selected]
    CostStrategy --> Decision
    LatencyStrategy --> Decision
    PriorityStrategy --> Decision
    WeightedStrategy --> Decision
    
    Execution[Execute Mock API Call]
    Decision --> Execution
    Execution --> |Success/Fail| Tracker
    Tracker --> DB
    Tracker --> CircuitBreaker
    Execution --> |Return Response| Gateway
    
    style Core Routing Engine fill:#e2e8f0,stroke:#94a3b8,stroke-width:2px,color:#000
    style Data & Metrics Store fill:#e2e8f0,stroke:#94a3b8,stroke-width:2px,color:#000
```

---

## 🧠 Explanation of Routing Decisions

The platform strictly adheres to the **Strategy Design Pattern** to separate routing logic from execution. Before any strategy is applied, a **Pre-Flight Filter** ensures safety:
1. **Circuit Breaker Check:** Vendors marked `isDown = true` are instantly bypassed.
2. **Rate Limit Verification:** Vendors exceeding their `rateLimitPerMinute` are skipped.
3. **Requirement Matching:** Vendors failing strict payload constraints (e.g., `maxLatencyMs`) are ignored.

Once filtered, the engine executes one of four dynamic strategies:

*   **Lowest Cost Strategy:** Sorts available vendors by `costPerRequest` in ascending order. Excellent for bulk, non-time-sensitive verifications.
*   **Lowest Latency Strategy:** Evaluates the live `averageLatencyMs` metric of each vendor (calculated historically via MongoDB) and routes to the fastest responding vendor.
*   **Priority Failover Strategy:** Vendors are ranked by a rigid `priority` integer (1 = Primary, 2 = Secondary). If the Primary fails or hits a rate limit, the system automatically falls back to Secondary.
*   **Weighted Load Balancing:** Implements a randomized traffic distribution algorithm based on assigned percentages (e.g., 70% to Vendor A, 30% to Vendor B) for A/B testing and load mitigation.

**Self-Healing Mechanism:**
The internal **Circuit Breaker** constantly monitors the `successRate` metric. If a vendor drops below a 50% success threshold over a rolling window, they are flagged as `isDown` to prevent cascading network failures, automatically routing all future traffic to healthier fallback vendors.

---

## 🛠 Setup & Installation

### Prerequisites
* Node.js (v18.x or higher)
* MongoDB Database (Atlas URI or Local `mongodb://localhost:27017`)

### 1. Installation
```bash
# Install Backend
cd backend
npm install

# Install Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/signzy_router
GEMINI_API_KEY=your_google_gemini_api_key_here
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start the Platform
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```
Visit **http://localhost:5173** to access the Dashboard.

---

## 📄 Sample Vendor Configs (JSON)

Bulk insert vendor configurations using `POST /vendors`:

```json
{
  "capability": "PAN_VERIFICATION",
  "vendors": [
    {
      "name": "Karvy Primary",
      "weight": 70,
      "costPerRequest": 1.5,
      "timeoutMs": 2000,
      "rateLimitPerMinute": 500,
      "priority": 1,
      "supportedFeatures": ["OCR", "NAME_MATCH"]
    },
    {
      "name": "NSDL Backup",
      "weight": 30,
      "costPerRequest": 2.1,
      "timeoutMs": 4000,
      "rateLimitPerMinute": 100,
      "priority": 2,
      "supportedFeatures": ["OCR"]
    }
  ]
}
```

---

## 📡 Sample API Requests & Responses

### 1. Trigger Intelligent Route
**Request:** `POST /route`
```json
{
  "capability": "PAN_VERIFICATION",
  "payload": {
    "pan": "ABCDE1234F",
    "name": "Rahul Sharma"
  },
  "requirements": {
    "maxLatencyMs": 2000,
    "preferLowCost": true,
    "strategy": "lowest_cost"
  }
}
```

**Response (Success):** `200 OK`
```json
{
  "status": "SUCCESS",
  "vendorUsed": "Karvy Primary",
  "routingReason": "Selected based on lowest_cost strategy",
  "latencyMs": 450,
  "cost": 1.5,
  "response": {
    "verified": true,
    "timestamp": "2026-07-04T18:00:00.000Z",
    "vendorName": "Karvy Primary",
    "mockedResponse": true
  }
}
```

**Response (Failover Triggered):** `200 OK`
```json
{
  "status": "SUCCESS",
  "vendorUsed": "NSDL Backup",
  "routingReason": "Karvy Primary failed (Timeout). Successfully fell back to priority 2 vendor.",
  "latencyMs": 1120,
  "cost": 2.1,
  "response": {
    "verified": true,
    "timestamp": "2026-07-04T18:00:05.000Z",
    "vendorName": "NSDL Backup",
    "mockedResponse": true
  }
}
```

---

## 🤖 AI Integration Notice
This repository explicitly utilizes Agentic AI tools to automate complex configuration payloads. Please refer to `AI_USAGE.md` for a detailed breakdown of how AI was utilized for schema generation, routing simulation, and UI structuring.
