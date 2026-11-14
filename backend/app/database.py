import json
import sqlite3
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.config import DATA_DIR, settings
from app.models.schemas import ProjectData, AgentActivity
import httpx

DB_PATH = DATA_DIR / "swarmstudio.db"

class DatabaseManager:
    def __init__(self):
        self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                title TEXT,
                project_type TEXT,
                status TEXT,
                progress INTEGER,
                created_at TEXT,
                updated_at TEXT,
                data_json TEXT
            )
        """)
        conn.commit()
        conn.close()

    def _sync_to_supabase(self, project: ProjectData):
        if not settings.supabase_url or not settings.supabase_key:
            return
        try:
            url = f"{settings.supabase_url.rstrip('/')}/rest/v1/projects"
            headers = {
                "apikey": settings.supabase_key,
                "Authorization": f"Bearer {settings.supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            }
            payload = {
                "id": project.id,
                "title": project.title,
                "project_type": project.project_type,
                "status": project.status,
                "progress": project.progress,
                "created_at": project.created_at,
                "updated_at": project.updated_at,
                "data": project.model_dump()
            }
            with httpx.Client(timeout=2.0) as client:
                client.post(url, headers=headers, json=payload)
        except Exception as e:
            pass

    def save_project(self, project: ProjectData):
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        data_json = project.model_dump_json()
        cursor.execute("""
            INSERT INTO projects (id, title, project_type, status, progress, created_at, updated_at, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                project_type = excluded.project_type,
                status = excluded.status,
                progress = excluded.progress,
                updated_at = excluded.updated_at,
                data_json = excluded.data_json
        """, (
            project.id,
            project.title,
            project.project_type,
            project.status,
            project.progress,
            project.created_at,
            project.updated_at,
            data_json
        ))
        conn.commit()
        conn.close()
        self._sync_to_supabase(project)

    def get_project(self, project_id: str) -> Optional[ProjectData]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return ProjectData.model_validate_json(row[0])

    def list_projects(self) -> List[ProjectData]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM projects ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        conn.close()
        projects = []
        for row in rows:
            try:
                projects.append(ProjectData.model_validate_json(row[0]))
            except Exception:
                pass
        return projects

    def delete_project(self, project_id: str) -> bool:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def append_activity(self, project_id: str, activity: AgentActivity):
        project = self.get_project(project_id)
        if project:
            project.activities.append(activity)
            self.save_project(project)

db_manager = DatabaseManager()
