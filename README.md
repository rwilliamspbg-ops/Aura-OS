<div align="center">
  <img src="https://github.com/rwilliamspbg-ops/Aura-OS/blob/main/aura-os/public/logo.png?raw=true" alt="AURA OS Logo" width="600">

  ### 🌌 AURA OS
  **The Future of Autonomous Restaurant Operations & Intelligence**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7-blue.svg)](https://www.prisma.io/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

  *Eliminating "Inventory Friction" through autonomous monitoring and predictive logistics.*
</div>

---

## 🚀 Overview
**AURA OS** is a next-generation enterprise platform designed for high-scale restaurant logistics. It moves beyond traditional POS systems by utilizing an **Autonomous Agent** that proactively identifies supply chain friction before it impacts operations.

## 🛠 Core Capabilities
* **Autonomous Inventory Agent:** A background service that monitors stock levels in real-time and identifies critical friction points.
* **Intelligent Throttling:** Smart alerting logic that prevents notification fatigue by grouping friction events into hourly windows.
* **Unified Infrastructure:** Fully containerized stack using **Docker Compose** for rapid, consistent deployment across multiple locations.
* **Automated Logistics Logging:** A dedicated `restock.log` ecosystem that captures every friction event and resolution for audit-ready reporting.

## 🏗 Tech Stack
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma 7 (with Driver Adapters)](https://github.com/rwilliamspbg-ops/Aura-OS/tree/main)
* **Runtime:** [Node.js 22 (ESM)](https://nodejs.org/)
* **Containerization:** [Docker & Docker Compose](https://www.docker.com/)

## 🚦 Quick Start

### 1. Launch with Docker
The entire ecosystem (DB + Agent) can be started with a single command:
```bash
docker-compose up -d --build
