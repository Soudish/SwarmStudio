import asyncio
import os
import sys
from pathlib import Path

# Set up environment
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir))

data_dir = current_dir / "data"
data_dir.mkdir(exist_ok=True, parents=True)
os.environ["LOCALAPPDATA"] = str(data_dir)
os.environ["APPDATA"] = str(data_dir)
os.environ["CREWAI_DISABLE_TELEMETRY"] = "true"
os.environ["OTEL_SDK_DISABLED"] = "true"

from app.database import db_manager
from app.services.auth_service import auth_service
from app.models.schemas import ProjectData

def main():
    print("--- 1. Testing Default Seeded User Account ---")
    seeded = db_manager.get_user_by_email("creator@swarmstudio.ai")
    assert seeded is not None, "Seeded user must exist"
    assert auth_service.verify_password("creative2026", seeded["password_hash"]), "Seeded password must match"
    print(f"Verified Seeded User: {seeded['name']} ({seeded['email']})")

    print("\n--- 2. Testing User Registration & Password Hashing ---")
    test_email = "director_test@studio.com"
    # Clean up if existed from previous run
    conn = db_manager.get_user_by_email(test_email)
    if not conn:
        hashed = auth_service.hash_password("SuperSecret123!")
        new_user = db_manager.create_user(
            email=test_email,
            name="Nora Nolan",
            password_hash=hashed
        )
    else:
        new_user = conn

    assert new_user["email"] == test_email
    print(f"Registered User: {new_user['name']} with ID: {new_user['id']}")

    print("\n--- 3. Testing JWT Token Issuance & Verification ---")
    token = auth_service.create_access_token({"sub": new_user["id"], "email": new_user["email"]})
    decoded = auth_service.decode_access_token(token)
    assert decoded["sub"] == new_user["id"]
    print("JWT Token created and decoded successfully!")

    print("\n--- 4. Testing User-Scoped Projects Persistence ---")
    user_project = ProjectData(
        user_id=new_user["id"],
        title="Nora's Independent Sci-Fi Feature",
        idea="A time-loop thriller set inside a deep-space radio telescope station.",
        project_type="film",
        tone="Psychological Noir",
        genre="Sci-Fi Thriller",
        target_audience="Mature Cinephiles",
        status="completed",
        progress=100
    )
    db_manager.save_project(user_project)
    print(f"Saved project '{user_project.title}' scoped to user {new_user['id']}")

    # Fetch projects for Nora
    nora_projects = db_manager.list_projects(user_id=new_user["id"])
    assert any(p.id == user_project.id for p in nora_projects), "Nora must see her project"
    print(f"Nora projects count: {len(nora_projects)}")

    # Verify project count via helper
    count = db_manager.get_user_project_count(new_user["id"])
    assert count >= 1, "Project count must be at least 1"
    print(f"User project count: {count}")

    print("\n>>> ALL AUTHENTICATION AND PERSISTENCE TESTS PASSED! <<<")

if __name__ == "__main__":
    main()
