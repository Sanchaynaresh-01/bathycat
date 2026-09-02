from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bathycat Configurable Boat API"}

from fastapi import APIRouter
from app.api.v1 import auth, products, components, configurations, quotes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(components.router, prefix="/components", tags=["components"])
api_router.include_router(configurations.router, prefix="/configurations", tags=["configurations"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])

app.include_router(api_router, prefix=settings.API_V1_STR)
