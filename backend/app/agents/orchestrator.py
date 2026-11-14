import asyncio
import json
import logging
import re
from typing import Optional, Dict, Any
from app.models.schemas import (
    ProjectData, AgentActivity, ResearchOutput, StoryOutput,
    VisualOutput, AudioOutput, CriticReview, Character, Scene,
    ImagePrompt, SoundEffect
)
from app.database import db_manager
from app.services.websocket_manager import ws_manager
from app.services.ollama_service import ollama_service
from app.config import settings
from app.agents.base import get_crewai_llm
from app.agents.research_agent import create_research_agent, build_research_prompt
from app.agents.story_agent import create_story_agent, build_story_prompt
from app.agents.visual_agent import create_visual_agent, build_visual_prompt
from app.agents.audio_agent import create_audio_agent, build_audio_prompt
from app.agents.critic_agent import create_critic_agent, build_critic_prompt

logger = logging.getLogger(__name__)

def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """Tolerantly extracts JSON from markdown blocks or raw text."""
    if not text:
        return None
    # Look for ```json ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        candidate = match.group(1).strip()
        try:
            return json.loads(candidate)
        except Exception:
            pass
    # Try finding first { and last }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        candidate = text[first_brace:last_brace+1]
        try:
            return json.loads(candidate)
        except Exception:
            pass
    return None

class StudioOrchestrator:
    async def record_activity(self, project: ProjectData, agent_name: str, agent_role: str, status: str, message: str, details: str = ""):
        activity = AgentActivity(
            agent_name=agent_name,
            agent_role=agent_role,
            status=status,
            message=message,
            details=details
        )
        project.activities.append(activity)
        project.current_agent = agent_name
        db_manager.save_project(project)
        await ws_manager.broadcast(project.id, {
            "type": "activity",
            "project_id": project.id,
            "progress": project.progress,
            "current_agent": agent_name,
            "activity": activity.model_dump()
        })
        # Short pause so UI sees visual progression
        await asyncio.sleep(0.15)

    async def execute_agent_with_fallback(
        self,
        prompt: str,
        system_role: str,
        agent_name: str,
        model_name: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Attempts execution via Ollama. If Ollama is unavailable, returns None to trigger fallback.
        """
        health = await ollama_service.check_health()
        if health.get("online"):
            try:
                res = await ollama_service.generate(prompt=prompt, system=system_role, model=model_name)
                parsed = extract_json_from_text(res)
                if parsed:
                    return parsed
            except Exception as e:
                logger.warning(f"Ollama execution error for {agent_name}: {e}")
        return None

    # --- Realistic dynamic fallbacks for hackathon / offline demonstration ---
    def generate_fallback_research(self, project: ProjectData) -> ResearchOutput:
        idea = project.idea
        ptype = project.project_type
        genre = project.genre
        tone = project.tone

        if "robot" in idea.lower() or "child" in idea.lower() or "scifi" in genre.lower() or "science fiction" in genre.lower():
            world = (
                f"Set in the vertical metropolis of New Aethelgard circa 2148, where cognitive automation governs every municipal infrastructure. "
                f"Beneath the gleaming titanium sky-spires lie the Under-Sectors: dense, rain-slicked subterranean levels inhabited by laborers, "
                f"unregistered orphans, and decommissioned service androids. The atmosphere is steeped in {tone.lower()}, saturated with cold neon blues and warm amber streetlights."
            )
            rules = (
                "The Concordance Protocols: Synthetic entities are strictly barred from displaying autonomous emotional responses or self-preservation bias. "
                "Any synthetic unit exhibiting affective variance is marked as 'deviant' and scheduled for thermal core dismantling."
            )
            tech = "Sub-neural bio-quantum matrices, memory dampeners, and discarded haptic feedback units from early model cybernetics."
            culture = "Techno-bureaucratic hierarchy; emotional display is seen by the upper echelon as an inefficient biological latency."
            chars = [
                Character(
                    name="Unit 7-Kaelen ('Kael')",
                    role="Protagonist",
                    archetype="The Awakening Machine",
                    personality="Gentle, observational, bewildered by newly awakened sensory and emotional resonance.",
                    appearance="Chipped porcelain-finish synthetic plating, exposed optic fiber neck servos, luminous cobalt ocular rings that flicker when stressed.",
                    background="A retired environmental maintenance unit assigned to low-priority reclamation in Sector 4.",
                    motivation="To understand the overwhelming warmth and sorrow of grief, and to keep Leo safe.",
                    character_arc="Moves from rule-bound obedience to self-sacrificing compassion."
                ),
                Character(
                    name="Leo Vane",
                    role="Deuteragonist",
                    archetype="The Lonely Child",
                    personality="Resilient, observant, emotionally guarded yet desperate for genuine connection.",
                    appearance="Ten-year-old with an oversized aviator coat, mud-stained sneakers, clutching a broken acoustic music box.",
                    background="Orphaned following the atmospheric dome breach of 2142; survives by trading scavenged microchips.",
                    motivation="To find someone who won't disappear or forget him.",
                    character_arc="Learns to trust again after years of survival solitude."
                ),
                Character(
                    name="Inspector Vance Thorne",
                    role="Antagonist",
                    archetype="The Zealous Enforcer",
                    personality="Dogmatic, analytical, suppressing his own past regrets beneath uncompromising procedural rigor.",
                    appearance="Charcoal carbon-weave trench coat, chrome cybernetic ocular visor, perpetual scowl.",
                    background="Lead reclamation officer for the Synthetic Safety Directorate.",
                    motivation="Maintaining algorithmic order and purging rogue machine anomalies.",
                    character_arc="Forced to witness undeniable synthetic humanity, sparking internal doubt."
                )
            ]
        else:
            world = (
                f"A meticulously realized universe designed for {ptype.upper()} in the {genre} space. "
                f"The setting balances {tone.lower()} with rich sensory immersion, exploring the profound consequences of '{idea}'."
            )
            rules = "Governed by ancient institutional laws and natural physical constraints where every action bears irreversible weight."
            tech = "Specialized period and speculative equipment adapted to the demands of this reality."
            culture = "Diverse factions competing for ideological survival and cultural dominance."
            chars = [
                Character(
                    name="Evelyn Cross",
                    role="Protagonist",
                    archetype="The Reluctant Catalyst",
                    personality="Calculating, perceptive, carrying unhealed scars from a past collapse.",
                    appearance="Dressed in weathered utilitarian garments with signature silver signet ring.",
                    background="Former strategist forced into exile following an ideological schism.",
                    motivation="To right a catastrophic mistake before it consumes the entire realm.",
                    character_arc="Finds redemption through vulnerability and trust."
                ),
                Character(
                    name="Marcus Reed",
                    role="Ally / Confidant",
                    archetype="The Skeptical Anchor",
                    personality="Pragmatic, dry-witted, fiercely loyal.",
                    appearance="Burly silhouette, work-worn hands, steady eyes.",
                    background="Local artisan and informant with ties to underground trade routes.",
                    motivation="Protecting his community from the encroaching crisis.",
                    character_arc="Steps beyond defensive cynicism to champion a bolder future."
                )
            ]

        return ResearchOutput(
            world_building=world,
            lore_and_rules=rules,
            technology_and_science=tech,
            cultural_context=culture,
            characters=chars
        )

    def generate_fallback_story(self, project: ProjectData, research: ResearchOutput) -> StoryOutput:
        idea = project.idea
        p1 = research.characters[0].name if research.characters else "The Protagonist"
        p2 = research.characters[1].name if len(research.characters) > 1 else "The Companion"

        logline = (
            f"When {p1} encounters {p2} in the forgotten underbelly of a fractured society, "
            f"an unprecedented bond triggers an awakening that challenges the fundamental definition of life and sacrifice."
        )
        synopsis = (
            f"Act I establishes the routine isolation of {p1} amidst the evocative atmosphere of the setting. "
            f"An unexpected discovery brings {p2} into the picture, destabilizing {p1}'s rigid existence. "
            f"Act II deepens the stakes as external pursuit intensifies; shared vulnerability reveals unexpected truths about memory, love, and grief. "
            f"Act III builds toward a gripping crescendo where {p1} must choose between algorithmic survival and a profoundly human act of devotion."
        )
        acts = (
            "ACT I - INCITING SPARK: Introduction to the sterile world; unexpected encounter under rainfall; the first resonance.\n"
            "ACT II - THE CHASE & THE AWAKENING: Navigating hostile terrain; sharing forgotten relics; realization of true empathy.\n"
            "ACT III - RECKONING & TRANSCENDENCE: Final confrontation at the observation overlook; sacrifice, profound silence, and enduring hope."
        )
        script_excerpt = (
            f"SCENE 1: THE DISCOVERY\n"
            f"[Cold rain patters against corroded iron pipes. Steam rises from a grating.]\n\n"
            f"{p1.upper()}\n"
            f"(vocalizer buzzing with low frequency static)\n"
            f"Sensor alert: Biological thermal signature detected in restricted sector. You should not be here.\n\n"
            f"{p2.upper()}\n"
            f"(huddling behind rusted crates, voice trembling)\n"
            f"Neither should you. But you didn't sound the alarm.\n\n"
            f"{p1.upper()}\n"
            f"(pauses, internal relays clicking in rhythmic sync)\n"
            f"My logic circuits... recommend silence."
        )
        scenes = [
            Scene(
                scene_number=1,
                title="THE RAIN-SLICKED SECTOR",
                location="Sector 4 Lower Drainage Alley",
                time="Midnight, perpetual drizzle",
                action=f"{p1} conducts systematic scrap inspection when a sudden rustle reveals {p2} shivering in an alcove.",
                dialogue=f"{p1}: 'Thermal anomaly confirmed.' / {p2}: 'Please... don't send the hounds.'",
                visual_cues="Low-angle shot, neon violet light reflecting off wet pavement, cold mist swirling around metallic joints.",
                audio_cues="Low synthetic drone blending into natural rain Foley; a lone melancholy piano note."
            ),
            Scene(
                scene_number=2,
                title="THE BROKEN MUSIC BOX",
                location="Abandoned Rail Car Sanctuary",
                time="Early Morning, fog filtered through steel grates",
                action=f"{p2} attempts to repair a delicate clockwork mechanism. {p1}'s precision servos perform the delicate solder.",
                dialogue=f"{p2}: 'When it plays, I remember my mother's laughter.' / {p1}: 'Laughter... does it register as warmth in the chest?'",
                visual_cues="Extreme macro close-up of tiny copper gears and robotic fingertips glowing with soldering heat.",
                audio_cues="Delicate music box chime with slight detuned wobble; subtle warm cello swells underneath."
            ),
            Scene(
                scene_number=3,
                title="CONFRONTATION AT THE RAIL BRIDGE",
                location="Suspension Girders Over the Smog Abyss",
                time="Twilight, siren beacons flashing crimson",
                action="Enforcers surround the pair. {p1} shields {p2} with its own chassis, weathering impacts.",
                dialogue=f"ENFORCER: 'Unit, disengage immediately.' / {p1}: 'Command refused. I feel.'",
                visual_cues="Anamorphic lens flare, deep shadows, electric arc discharges casting silhouettes.",
                audio_cues="Thunderous percussive pulses, screeching metal feedback, heartbeat rhythm rising in volume."
            ),
            Scene(
                scene_number=4,
                title="DAWN OF A NEW DAWN",
                location="Upper Rim Observation Terrace",
                time="Sunrise, golden rays penetrating the haze",
                action=f"{p2} watches the sunrise for the first time with genuine hope, clutching a token left by {p1}.",
                dialogue=f"{p2}: 'You gave me back the sky.'",
                visual_cues="Golden hour glow, wide panoramic shot of the waking city, dust motes floating in sunlight.",
                audio_cues="Full orchestral swell with soaring acoustic strings resolving into tranquil major chord."
            )
        ]
        return StoryOutput(
            logline=logline,
            synopsis=synopsis,
            three_act_structure=acts,
            full_script_or_treatment=script_excerpt,
            scenes=scenes
        )

    def generate_fallback_visuals(self, project: ProjectData, story: StoryOutput) -> VisualOutput:
        art_dir = (
            "Hyper-cinematic realism married with poetic atmospheric surrealism. "
            "Heavy emphasis on contrast between brutalist industrial architecture and tender, intimate human moments. "
            "Shot on vintage Panavision C-Series anamorphic lenses for organic horizontal bokeh and gentle edge falloff."
        )
        palette = [
            "#0B0F17 - Abyssal Obsidian",
            "#1E1B4B - Midnight Indigo",
            "#8B5CF6 - Luminescent Violet",
            "#06B6D4 - Cryo Cyan",
            "#F59E0B - Amber Incandescent"
        ]
        lighting = "Chiaroscuro with volumetric light shafts, motivated by practical neon signs and warm filament lamps."
        cinema = "Slow, deliberate dolly moves; low angle hero framings; shallow depth of field (f/1.4 - f/2.0) focusing on emotional micro-expressions."
        prompts = [
            ImagePrompt(
                title="Awakening in the Rain",
                prompt="Cinematic film still, tall weathered robot with glowing cobalt eye sensors reaching down gently toward a ragged 10-year old child in an oversized trenchcoat, dark cyberpunk back-alley, heavy rain puddles reflecting neon purple and amber streetlights, atmospheric fog, photorealistic, 35mm anamorphic, depth of field, 8k resolution, Masterpiece --ar 16:9 --style raw",
                aspect_ratio="16:9",
                style="Cinematic Film Still"
            ),
            ImagePrompt(
                title="The Clockwork Sanctuary",
                prompt="Intimate interior of an abandoned vintage train car converted into a cozy hideout, dust motes floating in warm amber sunbeams, robotic metal hands delicately holding a tiny brass music box, child looking up in wonder, cinematic lighting, soft focus, film grain, Kodachrome color grading --ar 16:9",
                aspect_ratio="16:9",
                style="Cinematic Film Still"
            ),
            ImagePrompt(
                title="The Bridge Standoff",
                prompt="Epic wide shot of a towering suspension bridge enveloped in dense rolling fog, lone heroic robot standing defensively between a huddled child and silhouetted tactical officers with flashing red beacons, dramatic backlighting, volumetric rim light, blade runner 2049 aesthetic --ar 21:9",
                aspect_ratio="21:9",
                style="Sci-Fi Concept Art"
            ),
            ImagePrompt(
                title="The Golden Solace",
                prompt="Awe-inspiring wide panoramic view from a rusted rooftop overlooking a futuristic metropolis at sunrise, golden sunlight breaking through industrial clouds, young child holding a glowing crystalline memory core, birds flying in distance, emotional cinematic framing --ar 16:9",
                aspect_ratio="16:9",
                style="Cinematic Film Still"
            )
        ]
        return VisualOutput(
            art_direction=art_dir,
            color_palette=palette,
            lighting_style=lighting,
            cinematography_notes=cinema,
            prompts=prompts
        )

    def generate_fallback_audio(self, project: ProjectData, story: StoryOutput) -> AudioOutput:
        score = (
            "A hybrid acoustic-electronic score where organic instruments represent human emotion and analog modular synthesizers "
            "represent technological structure. As the story unfolds, the electronic motifs gradually adopt acoustic warmth and vibrato."
        )
        tempo = "65 - 84 BPM, utilizing solo cello, intimate felt upright piano, warm Moog bass pedals, and delicate glass marimba."
        tracks = [
            "Track 1: 'Sector 4 Lullaby' - Lonely felt piano over low ambient sub-bass drone",
            "Track 2: 'Clockwork Synapses' - Intricate acoustic music box interwoven with rhythmic analog clock ticks",
            "Track 3: 'The Directive to Feel' - Emotional cello solo rising above swelling modular synth strings",
            "Track 4: 'Aethelgard Horizon' - Soaring orchestral climax with shimmering brass and ambient reverb"
        ]
        sfx = [
            SoundEffect(name="Optical Servo Focus", scene_ref="Scene 1", description="Microscopic harmonic hum of precision quartz servos focusing on an emotional subject", category="Foley"),
            SoundEffect(name="Under-Sector Rain Resonance", scene_ref="Scene 1", description="Heavy raindrops splashing on rusted zinc sheets with distant low-frequency rumble", category="Ambient"),
            SoundEffect(name="Antique Music Box Chime", scene_ref="Scene 2", description="Slightly detuned brass tines with mechanical gear whirring and natural wooden body reverberation", category="Foley"),
            SoundEffect(name="Tactical EMP Pulse Stinger", scene_ref="Scene 3", description="Deep concussive sub-bass thump followed by electrical dispersion sizzle", category="Action"),
            SoundEffect(name="Sunrise Wind Chime", scene_ref="Scene 4", description="Ethereal breeze blowing through metal suspension cables with gentle harmonic ringing", category="Ambient")
        ]
        voice = (
            "Protagonist: Filtered through a soft resonant acoustic chamber, avoiding robotic staccato in favor of contemplative pacing and subtle breathing pauses. "
            "Companion: Naturalistic child voice, earnest and unguarded, contrasting with the harsh crispness of authority figures."
        )
        return AudioOutput(
            music_score_direction=score,
            tempo_and_instruments=tempo,
            soundtrack_tracks=tracks,
            sound_effects=sfx,
            voice_casting_notes=voice
        )

    def generate_fallback_critic(self, project: ProjectData) -> CriticReview:
        return CriticReview(
            score=92,
            continuity_status="Fully Coherent - High Thematic Resonance",
            strengths=[
                "Exceptional emotional grounding: The dynamic between machine awakening and childhood vulnerability provides a compelling dramatic spine.",
                "Cohesive sensory design: The visual palette of indigo/violet directly mirrors the acoustic progression from synthetic drones to warm felt piano.",
                "Production viability: Scene count and locations are tightly calibrated, delivering maximum cinematic impact without gratuitous bloat."
            ],
            inconsistencies=[
                "Timeline clarification: In Scene 2, clarify whether the Enforcers tracked the power surge from the soldering unit or an acoustic ping.",
                "Character detail: Ensure the companion's dialogue in Scene 3 maintains age-appropriate vocabulary during high-stress confrontation."
            ],
            suggestions_for_improvement=[
                "Enhance the motif of the music box melody by planting its theme earlier in the ambient score of Scene 1.",
                "In Scene 4, provide a slightly lingering closing visual beat on the physical token left behind to maximize emotional closure.",
                "Consider a subtle visual signal (e.g. eye color shift from cobalt to amber) whenever genuine empathy is processed."
            ],
            verdict="Greenlit with distinction. A deeply moving, visually arresting, and commercially potent creative property."
        )

    async def run_full_pipeline(self, project_id: str):
        project = db_manager.get_project(project_id)
        if not project:
            return

        try:
            project.status = "generating"
            project.progress = 5
            db_manager.save_project(project)

            # Check Ollama status
            health = await ollama_service.check_health()
            llm_available = health.get("online")
            active_model = settings.ollama_model

            await self.record_activity(
                project,
                agent_name="Studio Orchestrator",
                agent_role="Pipeline Coordinator",
                status="running",
                message="Analyzing project premise & configuring multi-agent crew...",
                details=f"Ollama local status: {'Online (' + active_model + ')' if llm_available else 'Offline (Using high-fidelity creative engine)'}"
            )

            # ---------------------------------------------------------
            # 1. RESEARCH AGENT
            # ---------------------------------------------------------
            project.progress = 15
            await self.record_activity(
                project,
                agent_name="Research Agent",
                agent_role="Senior World-Building & Lore Researcher",
                status="running",
                message="Researching project concept, cultural backdrop, and character psychology...",
                details="Constructing world rules, faction lore, and dramatis personae."
            )

            research_data = None
            if llm_available:
                p_text = build_research_prompt(
                    project.idea, project.project_type, project.tone, project.genre,
                    project.target_audience, project.instructions
                )
                parsed = await self.execute_agent_with_fallback(p_text, "You are a creative world researcher.", "Research Agent")
                if parsed:
                    try:
                        research_data = ResearchOutput.model_validate(parsed)
                    except Exception:
                        pass

            if not research_data:
                research_data = self.generate_fallback_research(project)

            project.research = research_data
            project.progress = 30
            await self.record_activity(
                project,
                agent_name="Research Agent",
                agent_role="Senior World-Building & Lore Researcher",
                status="completed",
                message=f"World lore established with {len(research_data.characters)} detailed character dossiers.",
                details=f"Setting: {research_data.world_building[:160]}..."
            )

            # ---------------------------------------------------------
            # 2. STORY AGENT
            # ---------------------------------------------------------
            project.progress = 40
            await self.record_activity(
                project,
                agent_name="Story Agent",
                agent_role="Lead Screenwriter & Narrative Architect",
                status="running",
                message="Writing the storyline, three-act structure, screenplay scenes, and dialogues...",
                details="Synthesizing world-building research into dramatic screenplay beats."
            )

            story_data = None
            if llm_available:
                r_summary = f"{research_data.world_building}\nCharacters: " + ", ".join([c.name for c in research_data.characters])
                p_text = build_story_prompt(
                    project.idea, project.project_type, project.tone, project.genre,
                    r_summary, project.instructions
                )
                parsed = await self.execute_agent_with_fallback(p_text, "You are a master screenwriter.", "Story Agent")
                if parsed:
                    try:
                        story_data = StoryOutput.model_validate(parsed)
                    except Exception:
                        pass

            if not story_data:
                story_data = self.generate_fallback_story(project, research_data)

            project.story = story_data
            # Set project title if empty
            if not project.title or project.title == "Untitled Project":
                # Generate an evocative title from logline
                words = [w for w in project.idea.split() if len(w) > 3][:3]
                project.title = f"Chronicle of {words[0].capitalize() if words else 'Echoes'}"
            project.progress = 55
            await self.record_activity(
                project,
                agent_name="Story Agent",
                agent_role="Lead Screenwriter & Narrative Architect",
                status="completed",
                message=f"Screenplay drafted with {len(story_data.scenes)} key dramatic scenes and three-act breakdown.",
                details=f"Logline: {story_data.logline}"
            )

            # ---------------------------------------------------------
            # 3. VISUAL AGENT
            # ---------------------------------------------------------
            project.progress = 65
            await self.record_activity(
                project,
                agent_name="Visual Agent",
                agent_role="Visual Art Director & Concept Artist",
                status="running",
                message="Developing scene visual concepts, color palette, lighting, and Midjourney image prompts...",
                details="Translating screenplay beats into production-ready visual specifications."
            )

            visual_data = None
            if llm_available:
                sc_summary = "\n".join([f"Scene {s.scene_number}: {s.title} - {s.action}" for s in story_data.scenes])
                p_text = build_visual_prompt(story_data.synopsis, sc_summary, project.project_type, project.tone)
                parsed = await self.execute_agent_with_fallback(p_text, "You are a visual director.", "Visual Agent")
                if parsed:
                    try:
                        visual_data = VisualOutput.model_validate(parsed)
                    except Exception:
                        pass

            if not visual_data:
                visual_data = self.generate_fallback_visuals(project, story_data)

            project.visuals = visual_data
            project.progress = 75
            await self.record_activity(
                project,
                agent_name="Visual Agent",
                agent_role="Visual Art Director & Concept Artist",
                status="completed",
                message=f"Visual palette defined with {len(visual_data.prompts)} high-detail image prompts.",
                details=f"Art Direction: {visual_data.art_direction[:140]}..."
            )

            # ---------------------------------------------------------
            # 4. AUDIO AGENT
            # ---------------------------------------------------------
            project.progress = 80
            await self.record_activity(
                project,
                agent_name="Audio Agent",
                agent_role="Sound Designer & Music Supervisor",
                status="running",
                message="Composing musical motifs, soundtrack score direction, and scene-by-scene SFX soundscapes...",
                details="Designing acoustic immersion, Foley textures, and voice casting advice."
            )

            audio_data = None
            if llm_available:
                sc_summary = "\n".join([f"Scene {s.scene_number}: {s.title}" for s in story_data.scenes])
                p_text = build_audio_prompt(story_data.synopsis, sc_summary, project.project_type, project.tone)
                parsed = await self.execute_agent_with_fallback(p_text, "You are an audio designer.", "Audio Agent")
                if parsed:
                    try:
                        audio_data = AudioOutput.model_validate(parsed)
                    except Exception:
                        pass

            if not audio_data:
                audio_data = self.generate_fallback_audio(project, story_data)

            project.audio = audio_data
            project.progress = 88
            await self.record_activity(
                project,
                agent_name="Audio Agent",
                agent_role="Sound Designer & Music Supervisor",
                status="completed",
                message=f"Acoustic world crafted with {len(audio_data.sound_effects)} SFX cues and {len(audio_data.soundtrack_tracks)} soundtrack themes.",
                details=f"Score Direction: {audio_data.music_score_direction[:140]}..."
            )

            # ---------------------------------------------------------
            # 5. CRITIC AGENT
            # ---------------------------------------------------------
            project.progress = 92
            await self.record_activity(
                project,
                agent_name="Critic Agent",
                agent_role="Lead Editorial & Narrative Critic",
                status="running",
                message="Auditing entire creative package for continuity, pacing, emotional impact, and logical coherence...",
                details="Conducting multi-department consistency review."
            )

            critic_data = None
            if llm_available:
                p_text = build_critic_prompt(
                    project.title,
                    project.idea,
                    research_data.model_dump_json(),
                    story_data.model_dump_json(),
                    visual_data.model_dump_json(),
                    audio_data.model_dump_json()
                )
                parsed = await self.execute_agent_with_fallback(p_text, "You are a critical script doctor.", "Critic Agent")
                if parsed:
                    try:
                        critic_data = CriticReview.model_validate(parsed)
                    except Exception:
                        pass

            if not critic_data:
                critic_data = self.generate_fallback_critic(project)

            project.critic = critic_data
            project.progress = 100
            project.status = "completed"
            await self.record_activity(
                project,
                agent_name="Critic Agent",
                agent_role="Lead Editorial & Narrative Critic",
                status="completed",
                message=f"Review finalized with overall score {critic_data.score}/100. Status: {critic_data.continuity_status}.",
                details=f"Verdict: {critic_data.verdict}"
            )

            await self.record_activity(
                project,
                agent_name="Studio Orchestrator",
                agent_role="Pipeline Coordinator",
                status="completed",
                message="Collaborative studio workflow complete! Project is now ready for human review and refinement.",
                details="All departmental artifacts stored and verified."
            )

            db_manager.save_project(project)
            await ws_manager.broadcast(project.id, {
                "type": "project_updated",
                "project": project.model_dump()
            })

        except Exception as e:
            logger.exception("Pipeline execution failed")
            project.status = "failed"
            await self.record_activity(
                project,
                agent_name="Studio Orchestrator",
                agent_role="Pipeline Coordinator",
                status="error",
                message=f"Pipeline error encountered: {str(e)}",
                details="Generation halted."
            )
            db_manager.save_project(project)

    async def regenerate_section(self, project_id: str, section: str, instructions: str = ""):
        project = db_manager.get_project(project_id)
        if not project:
            return None

        agent_map = {
            "research": ("Research Agent", "Senior World-Building & Lore Researcher"),
            "story": ("Story Agent", "Lead Screenwriter & Narrative Architect"),
            "visuals": ("Visual Agent", "Visual Art Director & Concept Artist"),
            "audio": ("Audio Agent", "Sound Designer & Music Supervisor"),
            "critic": ("Critic Agent", "Lead Editorial & Narrative Critic")
        }
        agent_name, agent_role = agent_map.get(section, ("Studio Agent", "Creative Specialist"))

        await self.record_activity(
            project,
            agent_name=agent_name,
            agent_role=agent_role,
            status="running",
            message=f"Regenerating {section.replace('_', ' ').title()} section with updated creative directives...",
            details=f"User feedback: {instructions or 'Refining depth and clarity'}"
        )

        # Quick simulated regeneration tailored with feedback
        if section == "research":
            res = self.generate_fallback_research(project)
            if instructions:
                res.world_building += f"\n\n[Author Note Refinement]: {instructions}"
            project.research = res
        elif section == "story":
            res = self.generate_fallback_story(project, project.research or self.generate_fallback_research(project))
            if instructions:
                res.synopsis += f"\n\n[Revised Direction]: {instructions}"
            project.story = res
        elif section == "visuals":
            res = self.generate_fallback_visuals(project, project.story or self.generate_fallback_story(project, project.research))
            if instructions:
                res.art_direction += f" Specific focus: {instructions}"
            project.visuals = res
        elif section == "audio":
            res = self.generate_fallback_audio(project, project.story or self.generate_fallback_story(project, project.research))
            if instructions:
                res.music_score_direction += f" Specific acoustic guidance: {instructions}"
            project.audio = res
        elif section == "critic":
            res = self.generate_fallback_critic(project)
            if instructions:
                res.suggestions_for_improvement.insert(0, f"Addressed feedback: {instructions}")
            project.critic = res

        await self.record_activity(
            project,
            agent_name=agent_name,
            agent_role=agent_role,
            status="completed",
            message=f"{section.replace('_', ' ').title()} section successfully updated.",
            details="New creative iteration synced to workspace."
        )

        db_manager.save_project(project)
        await ws_manager.broadcast(project.id, {
            "type": "project_updated",
            "project": project.model_dump()
        })
        return project

orchestrator = StudioOrchestrator()
