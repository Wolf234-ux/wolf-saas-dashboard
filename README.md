# 🐺 AI SaaS Core v2.5

A stylized, full-screen, ultra-low-latency AI streaming chat dashboard interface built using a **React frontend** and a high-performance **Python FastAPI backend**. This platform features real-time word-by-word token streaming, quick-switch persona profiles, conversation memory retention, and instant request termination controls.

---

## 🏗️ System Architecture Flowchart

```text
[ Mobile Phone / PC Web Browser ] ---> [ React Frontend Layer (:3000) ]

                                                    |
                                                    v (Dynamic Network Routing)
                                        [ FastAPI Backend Core (:8000) ]
                                                    |
                                                    v (Streaming Data Stream Connection)
                                        [ Local Engine / Serverless Cloud LLM ]
```

---

## ⚡ Key Core Features

* **Feature A (Streaming)**: Word-by-word token delivery streaming over asynchronous network streams.
* **Feature B (System Personas)**: Instant persona switching configuration panels (Expert Programmer, SaaS Growth Copywriter).
* **Feature C (History Memory)**: Tracks full conversational state thread sequences for complete context continuity.
* **Wolf-SaaS Upgrades**: Interactive responsive screen scaling, instant cancellation (`AbortController` mechanism via the **TERMINATE** action), and premium custom dark theme styling.

---

## 🚀 Local Installation & Execution Steps

### 🐍 1. Backend Service Launch (FastAPI)
1. Drop down into your backend folder:
   ```bash
   cd backend
   ```
2. Activate your pre-configured local virtual environment layer:
   ```bash
   # Windows PowerShell execution string
   ..\.venv\Scripts\Activate.ps1
   ```
3. Boot up the network host worker listening globally:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### ⚛️ 2. Frontend View Workspace (React)
1. Open a separate terminal split window and move into your frontend directory:
   ```bash
   cd frontend
   ```
2. Fire up the local development interface:
   ```bash
   npm start
   ```

---

## 📱 Interactive Cross-Device Smartphone Control

To run your custom dashboard directly from your touchscreen smartphone device over internal Wi-Fi:
1. Ensure both your hosting PC and mobile phone are bound to the **same local Wi-Fi router**.
2. Switch your Windows Network Connection Profile from **Public** to **Private** inside your settings pane.
3. Replace the active backend endpoint string inside your `App.js` with your computer's local network tracking address (e.g., `10.12.98.231`).
4. Type your address followed by your React runtime port directly into your smartphone browser app:
   ```text
   http://YOUR_PC_IP_ADDRESS:3000
   ```

## 📜 Project Licensing

Distributed open-source under the **MIT License**. Build, modify, and hunt!
