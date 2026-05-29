# 🐺 AI SaaS Core v2.5

A stylized, full-screen, ultra-low-latency AI streaming chat dashboard interface built using a **React frontend** and a high-performance **Python FastAPI backend** [1]. This platform features real-time word-by-word token streaming, quick-switch persona profiles, conversation memory retention, and instant request termination controls [1].

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

* **Feature A (Streaming)**: Word-by-word token delivery streaming over asynchronous network streams [1].
* **Feature B (System Personas)**: Instant persona switching configuration panels (Expert Programmer, SaaS Growth Copywriter) [1].
* **Feature C (History Memory)**: Tracks full conversational state thread sequences for complete context continuity [1].
* **Wolf-SaaS Upgrades**: Interactive responsive mobile screen scaling, instant cancellation (`AbortController` mechanism via the **TERMINATE** action), and premium custom cyberpunk dark theme styling [1].

---

## 🚀 Installation & Execution Steps

### 🐳 1. Automated Docker-Compose Deployment (Recommended)

If you have Docker installed on your machine, you can skip manual Python and Node configurations entirely [1]. Run this single command in your project root directory to compile images, map environment routing variables, and build your networks instantly [1]:

```bash
docker-compose up --build
```

* Once compilation wraps up, open your web browser to access the interface panel at `http://localhost:3000` [1].
* Ensure your local background engine instance is running (`ollama run qwen2.5:1.5b`) before executing chat instructions [1].

### 🐍 2. Manual Backend Service Launch (FastAPI)

1. Drop down into your backend folder [1]:
   ```bash
   cd backend
   ```
2. Activate your pre-configured local virtual environment layer [1]:
   ```bash
   # Windows PowerShell execution string
   ..\.venv\Scripts\Activate.ps1
   ```
3. Boot up the network host worker listening globally [1]:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### ⚛️ 3. Manual Frontend View Workspace (React)

1. Open a separate terminal split window and move into your frontend directory [1]:
   ```bash
   cd frontend
   ```
2. Fire up the local development interface [1]:
   ```bash
   npm start
   ```

---

## 📱 Interactive Cross-Device Smartphone Control

To run your custom dashboard directly from your touchscreen smartphone device over internal Wi-Fi [1]:
1. Ensure both your hosting PC and mobile phone are bound to the **same local Wi-Fi router** [1].
2. Switch your Windows Network Connection Profile from **Public** to **Private** inside your settings pane [1].
3. The dynamic network block automatically tracks your desktop IPv4 address space across network nodes [1].
4. Type your address followed by your React runtime port directly into your smartphone browser app [1]:
   ```text
   http://YOUR_PC_IP_ADDRESS:3000
   ```

## 🛡️ Security Protocol

This architecture includes an API token verification rule (`X-SaaS-Token`) intercepting inbound requests to block unauthenticated external clients from draining inference computation cycles on your hosting infrastructure [1]. 

```python
SECRET_SECURITY_TOKEN = "WolfMasterHunt2026_Secure"
```

## 📜 Project Licensing

Distributed open-source under the **MIT License**. Build, modify, and hunt!
