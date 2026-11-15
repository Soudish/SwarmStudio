from fastapi import APIRouter, HTTPException, BackgroundTasks, Response, Depends
from typing import List, Optional
from app.models.schemas import (
    ProjectData, CreateProjectRequest, UpdateProjectRequest,
    RegenerateSectionRequest
)
from app.database import db_manager
from app.agents.orchestrator import orchestrator
from app.services.export_service import ExportService
from app.auth_deps import get_optional_user

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectData)
async def create_project(
    req: CreateProjectRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    title = req.title or "Untitled Creative Project"
    user_id = current_user["id"] if current_user else None
    project = ProjectData(
        title=title,
        user_id=user_id,
        idea=req.idea,
        project_type=req.project_type,
        tone=req.tone or "Cinematic",
        genre=req.genre or "General",
        target_audience=req.target_audience or "Broad",
        instructions=req.instructions or "",
        status="draft",
        progress=0
    )
    db_manager.save_project(project)
    
    # Launch multi-agent pipeline in background
    background_tasks.add_task(orchestrator.run_full_pipeline, project.id)
    return project

@router.get("", response_model=List[ProjectData])
async def list_projects(current_user: Optional[dict] = Depends(get_optional_user)):
    user_id = current_user["id"] if current_user else None
    return db_manager.list_projects(user_id=user_id)

@router.get("/{project_id}", response_model=ProjectData)
async def get_project(project_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    user_id = current_user["id"] if current_user else None
    p = db_manager.get_project(project_id, user_id=user_id)
    if not p:
        # Fallback to general lookup for shared / demo projects
        p = db_manager.get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@router.put("/{project_id}", response_model=ProjectData)
async def update_project(
    project_id: str,
    req: UpdateProjectRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    project = db_manager.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if req.title is not None:
        project.title = req.title
    if req.research is not None and project.research:
        project.research = project.research.model_copy(update=req.research)
    if req.story is not None and project.story:
        project.story = project.story.model_copy(update=req.story)
    if req.visuals is not None and project.visuals:
        project.visuals = project.visuals.model_copy(update=req.visuals)
    if req.audio is not None and project.audio:
        project.audio = project.audio.model_copy(update=req.audio)
    if req.critic is not None and project.critic:
        project.critic = project.critic.model_copy(update=req.critic)

    db_manager.save_project(project)
    return project

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    user_id = current_user["id"] if current_user else None
    success = db_manager.delete_project(project_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found or not authorized to delete")
    return {"status": "success", "message": "Project deleted"}

@router.post("/{project_id}/regenerate-section", response_model=ProjectData)
async def regenerate_section(
    project_id: str,
    req: RegenerateSectionRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    p = db_manager.get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Run section regeneration
    background_tasks.add_task(orchestrator.regenerate_section, project_id, req.section, req.instructions)
    return p

@router.get("/{project_id}/export")
async def export_project(project_id: str, format: str = "markdown"):
    project = db_manager.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    safe_title = "".join(c for c in project.title if c.isalnum() or c in (' ', '-', '_')).strip().replace(" ", "_")
    filename = f"{safe_title or 'project'}_{project.id[:8]}"

    try:
        if format.lower() == "pdf":
            pdf_bytes = ExportService.to_pdf(project)
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}.pdf",
                    "Access-Control-Expose-Headers": "Content-Disposition"
                }
            )
        else:
            md_text = ExportService.to_markdown(project)
            return Response(
                content=md_text,
                media_type="text/markdown; charset=utf-8",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}.md",
                    "Access-Control-Expose-Headers": "Content-Disposition"
                }
            )
    except Exception as e:
        logger.exception(f"Export failed for project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Export generation failed: {str(e)}")
