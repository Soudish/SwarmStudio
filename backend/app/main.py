from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import projects, settings as settings_router, activity
from app.services.websocket_manager import ws_manager
from app.database import db_manager

app = FastAPI(
    title="SwarmStudio Backend API",
    description="Multi-Agent Creative Collaboration Platform with CrewAI and Ollama",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router)
app.include_router(settings_router.router)
app.include_router(activity.router)

@app.websocket("/ws/projects/{project_id}")
async def websocket_project_endpoint(websocket: WebSocket, project_id: str):
    await ws_manager.connect(project_id, websocket)
    try:
        # Send current project state immediately on connection
        project = db_manager.get_project(project_id)
        if project:
            await websocket.send_json({
                "type": "initial_state",
                "project": project.model_dump()
            })
        while True:
            # Keep connection open; can receive client ping or message
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(project_id, websocket)
    except Exception:
        ws_manager.disconnect(project_id, websocket)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SwarmStudio API",
        "version": settings.app_version,
        "ollama_base_url": settings.ollama_base_url,
        "model": settings.ollama_model
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to SwarmStudio Multi-Agent Creative Collaboration API",
        "docs": "/docs",
        "health": "/health"
    }
