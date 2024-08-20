import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import ResponseValidationError
from fastapi.middleware.cors import CORSMiddleware
from routes import router as api_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://192.168.1.159:3000",
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def verify_mobile_app(request: Request, call_next):
    try:
        # Example: Check for a specific header that only your mobile app sends
        if "X-Mobile-App" in request.headers:
            # Perform additional checks if needed (e.g., verify tokens, etc.)
            pass
        response = await call_next(request)
        return response
    except Exception as e:
        if isinstance(e, ResponseValidationError):
            # Access the body of the error
            error_body = f"Error occurred: {e.body}"
            logger.error(error_body)
            raise HTTPException(status_code=400, detail=error_body)
        else:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

# Registering the API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the game API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)