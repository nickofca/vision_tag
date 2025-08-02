## Vision Tag

Vision Tag transforms any smartphone or web browser into a live-action laser-tag arena. Players use their camera feed to “tag” opponents; a GPU-powered server running deep-learning models detects hits in real time, tracks scores, and manages game state across mobile and web clients.

---

## Features

- Real-time hit detection via deep-learning segmentation models  
- Cross-platform clients  
  - Mobile (iOS via React Native / Expo; Android support planned)  
  - Web camera-game-app (React)  
- Scalable server built on FastAPI with GPU acceleration (CUDA drivers required)  
- WebSocket-based session management and live score updates  
- Optional Docker support for containerized deployment  

---

## Architecture

$$$
[Mobile App] ─┐
              ├─► [FastAPI Server] ──► [Inference Engine (Mask R-CNN on GPU)]
[Web App]  ─┘             │
                         └─► [Game State & Scoring]
$$$

1. Clients capture camera frames and send them over WebSocket or HTTP  
2. The server preprocesses images, runs the deep-learning model, and determines hit events  
3. Game state and scores are updated and broadcast back to all connected clients  

---

## Prerequisites

- **Node.js** ≥ 14.x  
- **Python** ≥ 3.8  
- **Expo CLI** (for mobile builds)  
- **CUDA Toolkit** ≥ 11.x and compatible drivers  
- **Docker** (optional, if using containerized deployment)  

---

## Installation

1. **Clone the repo**  
   $$$bash
   git clone https://github.com/nickofca/vision_tag.git
   cd vision_tag
   $$$

2. **Server**  
   $$$bash
   cd server
   cp .env.example .env
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   $$$

3. **Mobile (iOS)**  
   $$$bash
   cd mobile
   yarn install
   expo login
   expo start
   # When ready:
   expo build:ios
   $$$

4. **Web**  
   $$$bash
   cd web/camera-game-app
   yarn install
   yarn start
   $$$

5. **(Optional) Docker**  
   $$$bash
   # Build and run the server in Docker
   cd server
   docker build -t vision_tag_server .
   docker run --gpus all -p 8000:8000 --env-file .env vision_tag_server
   $$$

---

## Configuration

Copy `server/.env.example` → `server/.env` and fill in any required values:

$$$env
# Example .env
DATABASE_URL=…
MODEL_ENDPOINT=…
CUDA_VISIBLE_DEVICES=0
# Add any other required variables
$$$

---

## Running & Testing

- **Server**  
  $$$bash
  cd server
  uvicorn app.main:app --reload
  $$$
- **Mobile**  
  $$$bash
  cd mobile
  expo start
  $$$
- **Web**  
  $$$bash
  cd web/camera-game-app
  yarn start
  $$$

---

## Contributing

1. Fork the repository  
2. Create a branch:  
   $$$bash
   git checkout -b feature/YourFeature
   $$$  
3. Commit your changes  
4. Push and open a pull request  

Please follow any existing style guidelines and include tests or examples where appropriate.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Contact

For questions or feedback, please open an issue or reach out to nick@yourdomain.com.
