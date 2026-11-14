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
from app.models.schemas import ProjectData
from app.agents.orchestrator import orchestrator
from app.services.export_service import ExportService

async def main():
    print("--- 1. Testing Project Creation & Swarm Database ---", flush=True)
    project = ProjectData(
        title="The Resonance of Wire and Pulse",
        idea="Create a science-fiction short film about a robot that discovers human emotions after meeting a lonely child.",
        project_type="film",
        tone="Poetic & Emotional",
        genre="Science Fiction",
        target_audience="Young Adults & Cinephiles",
        instructions="Focus on the contrast between industrial coldness and human warmth.",
        status="draft",
        progress=0
    )
    db_manager.save_project(project)
    print(f"Project initialized: {project.id} - '{project.title}'", flush=True)

    print("\n--- 2. Running Multi-Agent Creative Pipeline ---", flush=True)
    await orchestrator.run_full_pipeline(project.id)

    updated = db_manager.get_project(project.id)
    assert updated is not None, "Project should exist in database"
    print(f"Pipeline Completed! Final Status: {updated.status}, Progress: {updated.progress}%", flush=True)
    print(f"Current Agent: {updated.current_agent}", flush=True)
    print(f"Total Activities Logged: {len(updated.activities)}", flush=True)

    # Verify Research Output
    assert updated.research is not None, "Research output must be populated"
    print(f"\n[Research Agent Output]", flush=True)
    print(f"World Lore snippet: {updated.research.world_building[:100]}...", flush=True)
    print(f"Characters: {[c.name for c in updated.research.characters]}", flush=True)

    # Verify Story Output
    assert updated.story is not None, "Story output must be populated"
    print(f"\n[Story Agent Output]", flush=True)
    print(f"Logline: {updated.story.logline}", flush=True)
    print(f"Scenes Count: {len(updated.story.scenes)}", flush=True)

    # Verify Visuals Output
    assert updated.visuals is not None, "Visuals output must be populated"
    print(f"\n[Visual Agent Output]", flush=True)
    print(f"Palette: {updated.visuals.color_palette}", flush=True)
    print(f"Image Prompts Count: {len(updated.visuals.prompts)}", flush=True)

    # Verify Audio Output
    assert updated.audio is not None, "Audio output must be populated"
    print(f"\n[Audio Agent Output]", flush=True)
    print(f"Score Direction: {updated.audio.music_score_direction[:100]}...", flush=True)
    print(f"Sound Effects Count: {len(updated.audio.sound_effects)}", flush=True)

    # Verify Critic Review Output
    assert updated.critic is not None, "Critic output must be populated"
    print(f"\n[Critic Agent Review]", flush=True)
    print(f"Score: {updated.critic.score}/100", flush=True)
    print(f"Verdict: {updated.critic.verdict}", flush=True)
    print(f"Continuity: {updated.critic.continuity_status}", flush=True)

    # Verify Exports
    print("\n--- 3. Testing Export Services ---", flush=True)
    md = ExportService.to_markdown(updated)
    assert len(md) > 500, "Markdown export should contain full creative package"
    print(f"Markdown export generated: {len(md)} chars", flush=True)

    pdf_bytes = ExportService.to_pdf(updated)
    assert len(pdf_bytes) > 1000, "PDF export should produce valid PDF bytes"
    print(f"PDF export generated: {len(pdf_bytes)} bytes", flush=True)

    # Verify Section Regeneration (Human in the Loop)
    print("\n--- 4. Testing Human-in-the-Loop Section Regeneration ---", flush=True)
    regen_res = await orchestrator.regenerate_section(
        project.id,
        "story",
        "Make the third scene confrontation focus more on the robot shielding the child."
    )
    assert regen_res is not None, "Regenerated project should exist"
    print(f"Story section regenerated successfully! Updated scenes count: {len(regen_res.story.scenes)}", flush=True)

    print("\n>>> ALL MULTI-AGENT SWARM TESTS PASSED WITH DISTINCTION! <<<", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
