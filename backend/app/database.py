import json
import sqlite3
import uuid
from typing import List, Optional, Dict, Any
from pathlib import Path
from datetime import datetime
from app.config import DATA_DIR, settings
from app.models.schemas import ProjectData, AgentActivity
import httpx
import bcrypt

DB_PATH = DATA_DIR / "swarmstudio.db"

class DatabaseManager:
    def __init__(self):
        self._init_sqlite()
        self._seed_default_user()

    def _init_sqlite(self):
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        
        # 1. Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                avatar_url TEXT,
                created_at TEXT
            )
        """)

        # 2. Projects Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT,
                project_type TEXT,
                status TEXT,
                progress INTEGER,
                created_at TEXT,
                updated_at TEXT,
                data_json TEXT
            )
        """)

        # Ensure user_id column exists if table was created previously without it
        try:
            cursor.execute("ALTER TABLE projects ADD COLUMN user_id TEXT")
        except sqlite3.OperationalError:
            pass  # Column already exists

        conn.commit()
        conn.close()

    def _seed_default_user(self):
        """Seeds a demo creative account if not present."""
        user = self.get_user_by_email("creator@swarmstudio.ai")
        if not user:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(b"creative2026", salt).decode('utf-8')
            self.create_user(
                email="creator@swarmstudio.ai",
                name="Alex Vance",
                password_hash=hashed,
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            )

    # --- User Management ---
    def create_user(self, email: str, name: str, password_hash: str, avatar_url: Optional[str] = None) -> Dict[str, Any]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        cursor.execute("""
            INSERT INTO users (id, email, name, password_hash, avatar_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, email.lower().strip(), name.strip(), password_hash, avatar_url, created_at))
        conn.commit()
        conn.close()
        return {
            "id": user_id,
            "email": email.lower().strip(),
            "name": name.strip(),
            "avatar_url": avatar_url,
            "created_at": created_at
        }

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, password_hash, avatar_url, created_at FROM users WHERE email = ?", (email.lower().strip(),))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return {
            "id": row[0],
            "email": row[1],
            "name": row[2],
            "password_hash": row[3],
            "avatar_url": row[4],
            "created_at": row[5]
        }

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, password_hash, avatar_url, created_at FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return {
            "id": row[0],
            "email": row[1],
            "name": row[2],
            "password_hash": row[3],
            "avatar_url": row[4],
            "created_at": row[5]
        }

    def get_user_project_count(self, user_id: str) -> int:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM projects WHERE user_id = ?", (user_id,))
        count = cursor.fetchone()[0]
        conn.close()
        return count

    # --- Project Management ---
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
                "user_id": project.user_id,
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
        except Exception:
            pass

    def save_project(self, project: ProjectData):
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        data_json = project.model_dump_json()
        cursor.execute("""
            INSERT INTO projects (id, user_id, title, project_type, status, progress, created_at, updated_at, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                user_id = COALESCE(excluded.user_id, projects.user_id),
                title = excluded.title,
                project_type = excluded.project_type,
                status = excluded.status,
                progress = excluded.progress,
                updated_at = excluded.updated_at,
                data_json = excluded.data_json
        """, (
            project.id,
            project.user_id,
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

    def get_project(self, project_id: str, user_id: Optional[str] = None) -> Optional[ProjectData]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT data_json FROM projects WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (project_id, user_id))
        else:
            cursor.execute("SELECT data_json FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return ProjectData.model_validate_json(row[0])

    def list_projects(self, user_id: Optional[str] = None) -> List[ProjectData]:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT data_json FROM projects WHERE user_id = ? OR user_id IS NULL ORDER BY updated_at DESC", (user_id,))
        else:
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

    def delete_project(self, project_id: str, user_id: Optional[str] = None) -> bool:
        conn = sqlite3.connect(DB_PATH, timeout=15.0)
        cursor = conn.cursor()
        if user_id:
            cursor.execute("DELETE FROM projects WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (project_id, user_id))
        else:
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
