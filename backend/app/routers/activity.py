from fastapi import APIRouter, HTTPException
from typing import List
from app.database import db_manager
from app.models.schemas import AgentActivity

router = APIRouter(prefix="/api/activity", tags=["activity"])

@router.get("/{project_id}", response_model=List[AgentActivity])
async def get_project_activity(project_id: str):
    project = db_manager.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.activities
