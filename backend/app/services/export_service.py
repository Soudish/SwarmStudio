import io
import html
from typing import Optional
from app.models.schemas import ProjectData
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def esc(text: Optional[str]) -> str:
    """Escapes user text so ReportLab XML paragraph parser doesn't crash on &, <, >."""
    if not text:
        return ""
    return html.escape(str(text).strip())

class ExportService:
    @staticmethod
    def to_markdown(project: ProjectData) -> str:
        lines = []
        lines.append(f"# {project.title or 'Untitled Creative Project'}")
        lines.append(f"**Format:** {project.project_type.upper()} | **Genre:** {project.genre} | **Tone:** {project.tone}")
        lines.append(f"**Target Audience:** {project.target_audience}")
        lines.append(f"**Created:** {project.created_at}")
        lines.append("\n---\n")

        lines.append("## 1. Project Concept & Logline")
        lines.append(f"**Original Prompt:** {project.idea}\n")
        if project.story:
            lines.append(f"**Logline:** {project.story.logline}\n")
            lines.append(f"**Synopsis:**\n{project.story.synopsis}\n")
            lines.append(f"**Three-Act Structure:**\n{project.story.three_act_structure}\n")

        if project.research:
            lines.append("## 2. Research & World Building")
            lines.append(f"### World Building\n{project.research.world_building}\n")
            lines.append(f"### Lore & Core Rules\n{project.research.lore_and_rules}\n")
            if project.research.technology_and_science:
                lines.append(f"### Technology & Science\n{project.research.technology_and_science}\n")

            if project.research.characters:
                lines.append("### Dramatis Personae (Characters)")
                for char in project.research.characters:
                    lines.append(f"#### {char.name} ({char.role})")
                    if char.archetype:
                        lines.append(f"- **Archetype:** {char.archetype}")
                    lines.append(f"- **Personality:** {char.personality}")
                    lines.append(f"- **Appearance:** {char.appearance}")
                    lines.append(f"- **Background:** {char.background}")
                    lines.append(f"- **Core Motivation:** {char.motivation}")
                    if char.character_arc:
                        lines.append(f"- **Character Arc:** {char.character_arc}")
                    lines.append("")

        if project.story and project.story.scenes:
            lines.append("## 3. Scene Breakdown & Script Treatment")
            for sc in project.story.scenes:
                lines.append(f"### Scene {sc.scene_number}: {sc.title}")
                lines.append(f"**Location:** {sc.location} | **Time:** {sc.time}")
                lines.append(f"**Action:**\n{sc.action}\n")
                if sc.dialogue:
                    lines.append(f"**Dialogue:**\n```\n{sc.dialogue}\n```\n")
                if sc.visual_cues:
                    lines.append(f"**Visual Direction:** {sc.visual_cues}")
                if sc.audio_cues:
                    lines.append(f"**Audio Direction:** {sc.audio_cues}")
                lines.append("")

        if project.visuals:
            lines.append("## 4. Visual Concepts & Art Direction")
            lines.append(f"**Art Direction:** {project.visuals.art_direction}\n")
            lines.append(f"**Lighting & Cinematography:** {project.visuals.lighting_style} - {project.visuals.cinematography_notes}\n")
            lines.append(f"**Color Palette:** {', '.join(project.visuals.color_palette)}\n")
            if project.visuals.prompts:
                lines.append("### AI Image Generation Prompts")
                for p in project.visuals.prompts:
                    lines.append(f"**[{p.title}]** ({p.aspect_ratio} - {p.style})")
                    lines.append(f"> `{p.prompt}`\n")

        if project.audio:
            lines.append("## 5. Audio, Soundtrack & Sound Design")
            lines.append(f"**Musical Direction:** {project.audio.music_score_direction}\n")
            lines.append(f"**Instrumentation & Tempo:** {project.audio.tempo_and_instruments}\n")
            lines.append(f"**Voice Casting Notes:** {project.audio.voice_casting_notes}\n")
            if project.audio.sound_effects:
                lines.append("### Sound Effects (SFX) Breakdown")
                for sfx in project.audio.sound_effects:
                    lines.append(f"- **{sfx.name}** [{sfx.category}] ({sfx.scene_ref}): {sfx.description}")
                lines.append("")

        if project.critic:
            lines.append("## 6. Critic Agent Quality Review")
            lines.append(f"**Overall Creative Score:** {project.critic.score}/100")
            lines.append(f"**Continuity Verdict:** {project.critic.continuity_status}")
            lines.append(f"**Editorial Summary:** {project.critic.verdict}\n")
            lines.append("**Key Strengths:**")
            for s in project.critic.strengths:
                lines.append(f"- {s}")
            lines.append("\n**Identified Inconsistencies & Continuity Notes:**")
            for inc in project.critic.inconsistencies:
                lines.append(f"- {inc}")
            lines.append("\n**Recommended Revisions:**")
            for rec in project.critic.suggestions_for_improvement:
                lines.append(f"- {rec}")
            lines.append("")

        return "\n".join(lines)

    @staticmethod
    def to_pdf(project: ProjectData) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#6B21A8'),
            spaceAfter=6
        )
        subtitle_style = ParagraphStyle(
            'SubTitleStyle',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#4B5563'),
            spaceAfter=14
        )
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#7E22CE'),
            spaceBefore=12,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#1F2937'),
            spaceAfter=6
        )
        quote_style = ParagraphStyle(
            'QuoteCustom',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#374151'),
            leftIndent=15,
            rightIndent=15,
            spaceAfter=6
        )

        elements = []

        elements.append(Paragraph(f"SwarmStudio: {esc(project.title or 'Creative Project')}", title_style))
        elements.append(Paragraph(f"<b>Format:</b> {esc(project.project_type.upper())} &nbsp;|&nbsp; <b>Genre:</b> {esc(project.genre)} &nbsp;|&nbsp; <b>Tone:</b> {esc(project.tone)}", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E9D5FF'), spaceAfter=12))

        # 1. Concept
        elements.append(Paragraph("1. Concept & Storyline", heading_style))
        elements.append(Paragraph(f"<b>Prompt:</b> {esc(project.idea)}", body_style))
        if project.story:
            elements.append(Paragraph(f"<b>Logline:</b> {esc(project.story.logline)}", quote_style))
            elements.append(Paragraph(f"<b>Synopsis:</b> {esc(project.story.synopsis)}", body_style))
            elements.append(Spacer(1, 8))

        # 2. Characters
        if project.research and project.research.characters:
            elements.append(Paragraph("2. Characters & World Lore", heading_style))
            elements.append(Paragraph(f"<b>World Building:</b> {esc(project.research.world_building)}", body_style))
            for char in project.research.characters[:6]:
                char_arch = f" - <i>{esc(char.archetype)}</i>" if char.archetype else ""
                elements.append(Paragraph(f"<b>{esc(char.name)}</b> ({esc(char.role)}){char_arch}: {esc(char.personality)}. Motivation: {esc(char.motivation)}", body_style))
            elements.append(Spacer(1, 8))

        # 3. Scenes
        if project.story and project.story.scenes:
            elements.append(Paragraph("3. Scene Breakdown", heading_style))
            for sc in project.story.scenes[:8]:
                elements.append(Paragraph(f"<b>Scene {sc.scene_number}: {esc(sc.title)}</b> ({esc(sc.location)} - {esc(sc.time)})", body_style))
                elements.append(Paragraph(f"<i>Action:</i> {esc(sc.action)}", quote_style))
                if sc.dialogue:
                    elements.append(Paragraph(f"<i>Dialogue:</i> {esc(sc.dialogue)}", quote_style))
            elements.append(Spacer(1, 8))

        # 4. Visuals & Audio
        if project.visuals or project.audio:
            elements.append(Paragraph("4. Visuals & Sound Atmosphere", heading_style))
            if project.visuals:
                elements.append(Paragraph(f"<b>Art Direction:</b> {esc(project.visuals.art_direction)}", body_style))
                elements.append(Paragraph(f"<b>Lighting:</b> {esc(project.visuals.lighting_style)}", body_style))
            if project.audio:
                elements.append(Paragraph(f"<b>Musical Score:</b> {esc(project.audio.music_score_direction)}", body_style))
                elements.append(Paragraph(f"<b>Tempo & Instruments:</b> {esc(project.audio.tempo_and_instruments)}", body_style))
            elements.append(Spacer(1, 8))

        # 5. Critic Review
        if project.critic:
            elements.append(Paragraph(f"5. Critic Quality Review (Score: {project.critic.score}/100)", heading_style))
            elements.append(Paragraph(f"<b>Editorial Verdict:</b> {esc(project.critic.verdict)}", body_style))
            elements.append(Paragraph(f"<b>Continuity Status:</b> {esc(project.critic.continuity_status)}", body_style))
            if project.critic.strengths:
                elements.append(Paragraph(f"<b>Key Strengths:</b> {esc('; '.join(project.critic.strengths))}", body_style))
            if project.critic.suggestions_for_improvement:
                elements.append(Paragraph(f"<b>Recommendations:</b> {esc('; '.join(project.critic.suggestions_for_improvement))}", body_style))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
