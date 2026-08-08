from fastapi import FastAPI
from app.routes.product import router as product_router
from app.routes.purchase import router as purchase_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# app = FastAPI(redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(purchase_router)
app.include_router(product_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
