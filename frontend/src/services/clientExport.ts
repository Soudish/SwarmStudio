import { ProjectData } from '../types';

export function generateClientMarkdown(project: ProjectData): string {
  const lines: string[] = [];
  lines.push(`# ${project.title || 'Untitled Creative Project'}`);
  lines.push(`**Format:** ${project.project_type?.toUpperCase()} | **Genre:** ${project.genre} | **Tone:** ${project.tone}`);
  lines.push(`**Target Audience:** ${project.target_audience || 'General'}`);
  lines.push(`**Created:** ${project.created_at || new Date().toISOString()}`);
  lines.push('\n---\n');

  lines.push('## 1. Project Concept & Logline');
  lines.push(`**Original Prompt:** ${project.idea}\n`);
  if (project.story) {
    if (project.story.logline) lines.push(`**Logline:** ${project.story.logline}\n`);
    if (project.story.synopsis) lines.push(`**Synopsis:**\n${project.story.synopsis}\n`);
    if (project.story.three_act_structure) lines.push(`**Three-Act Structure:**\n${project.story.three_act_structure}\n`);
  }

  if (project.research) {
    lines.push('## 2. Research & World Building');
    if (project.research.world_building) lines.push(`### World Building\n${project.research.world_building}\n`);
    if (project.research.lore_and_rules) lines.push(`### Lore & Core Rules\n${project.research.lore_and_rules}\n`);
    if (project.research.technology_and_science) lines.push(`### Technology & Science\n${project.research.technology_and_science}\n`);
    if (project.research.characters && project.research.characters.length > 0) {
      lines.push('### Dramatis Personae (Characters)');
      for (const char of project.research.characters) {
        lines.push(`#### ${char.name} (${char.role})`);
        if (char.archetype) lines.push(`- **Archetype:** ${char.archetype}`);
        if (char.personality) lines.push(`- **Personality:** ${char.personality}`);
        if (char.appearance) lines.push(`- **Appearance:** ${char.appearance}`);
        if (char.background) lines.push(`- **Background:** ${char.background}`);
        if (char.motivation) lines.push(`- **Core Motivation:** ${char.motivation}`);
        if (char.character_arc) lines.push(`- **Character Arc:** ${char.character_arc}`);
        lines.push('');
      }
    }
  }

  if (project.story && project.story.scenes && project.story.scenes.length > 0) {
    lines.push('## 3. Scene Breakdown & Script Treatment');
    for (const sc of project.story.scenes) {
      lines.push(`### Scene ${sc.scene_number}: ${sc.title}`);
      lines.push(`**Location:** ${sc.location} | **Time:** ${sc.time}`);
      lines.push(`**Action:**\n${sc.action}\n`);
      if (sc.dialogue) lines.push(`**Dialogue:**\n\`\`\`\n${sc.dialogue}\n\`\`\`\n`);
      if (sc.visual_cues) lines.push(`**Visual Direction:** ${sc.visual_cues}`);
      if (sc.audio_cues) lines.push(`**Audio Direction:** ${sc.audio_cues}`);
      lines.push('');
    }
  }

  if (project.visuals) {
    lines.push('## 4. Visual Concepts & Art Direction');
    if (project.visuals.art_direction) lines.push(`**Art Direction:** ${project.visuals.art_direction}\n`);
    if (project.visuals.lighting_style) lines.push(`**Lighting & Cinematography:** ${project.visuals.lighting_style} - ${project.visuals.cinematography_notes}\n`);
    if (project.visuals.color_palette) lines.push(`**Color Palette:** ${project.visuals.color_palette.join(', ')}\n`);
    if (project.visuals.prompts && project.visuals.prompts.length > 0) {
      lines.push('### Concept Art Prompts');
      for (const p of project.visuals.prompts) {
        lines.push(`**[${p.title}]** (${p.aspect_ratio || '16:9'} - ${p.style || 'cinematic'})`);
        lines.push(`> \`${p.prompt}\`\n`);
      }
    }
  }

  if (project.audio) {
    lines.push('## 5. Audio, Soundtrack & Sound Design');
    if (project.audio.music_score_direction) lines.push(`**Musical Direction:** ${project.audio.music_score_direction}\n`);
    if (project.audio.tempo_and_instruments) lines.push(`**Instrumentation & Tempo:** ${project.audio.tempo_and_instruments}\n`);
    if (project.audio.voice_casting_notes) lines.push(`**Voice Casting Notes:** ${project.audio.voice_casting_notes}\n`);
    if (project.audio.sound_effects && project.audio.sound_effects.length > 0) {
      lines.push('### Sound Effects (SFX) Breakdown');
      for (const sfx of project.audio.sound_effects) {
        lines.push(`- **${sfx.name}** [${sfx.category}] (${sfx.scene_ref}): ${sfx.description}`);
      }
      lines.push('');
    }
  }

  if (project.critic) {
    lines.push('## 6. Critic Agent Quality Review');
    lines.push(`**Overall Creative Score:** ${project.critic.score}/100`);
    lines.push(`**Continuity Verdict:** ${project.critic.continuity_status}`);
    lines.push(`**Editorial Summary:** ${project.critic.verdict}\n`);
    if (project.critic.strengths && project.critic.strengths.length > 0) {
      lines.push('**Key Strengths:**');
      for (const s of project.critic.strengths) {
        lines.push(`- ${s}`);
      }
      lines.push('');
    }
    if (project.critic.suggestions_for_improvement && project.critic.suggestions_for_improvement.length > 0) {
      lines.push('**Suggestions for Revision:**');
      for (const s of project.critic.suggestions_for_improvement) {
        lines.push(`- ${s}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function downloadClientMarkdown(project: ProjectData): void {
  const content = generateClientMarkdown(project);
  const safeTitle = (project.title || 'project').replace(/[^a-zA-Z0-9_-]/g, '_');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle || 'project'}_dossier.md`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 250);
}

export async function copyProjectToClipboard(project: ProjectData): Promise<boolean> {
  try {
    const text = generateClientMarkdown(project);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

export function generatePrintableHtml(project: ProjectData): string {
  const esc = (str?: string) =>
    (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

  let scenesHtml = '';
  if (project.story?.scenes && project.story.scenes.length > 0) {
    scenesHtml = project.story.scenes
      .map(
        (sc) => `
      <div style="margin-bottom: 20px; padding: 14px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <h3 style="margin: 0; color: #4338ca; font-size: 15px;">Scene ${sc.scene_number}: ${esc(sc.title)}</h3>
          <span style="font-size: 11px; color: #64748b; font-weight: 600;">${esc(sc.location)} &bull; ${esc(sc.time)}</span>
        </div>
        <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.6; color: #1e293b;">${esc(sc.action)}</p>
        ${
          sc.dialogue
            ? `<div style="background: #f8fafc; border-left: 3px solid #6366f1; padding: 10px 14px; margin: 8px 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #334155; white-space: pre-wrap;">${esc(sc.dialogue)}</div>`
            : ''
        }
        ${sc.visual_cues ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #7c3aed;"><strong>Visual Direction:</strong> ${esc(sc.visual_cues)}</p>` : ''}
        ${sc.audio_cues ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #0284c7;"><strong>Audio Direction:</strong> ${esc(sc.audio_cues)}</p>` : ''}
      </div>
    `
      )
      .join('');
  }

  let charactersHtml = '';
  if (project.research?.characters && project.research.characters.length > 0) {
    charactersHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 20px;">
        ${project.research.characters
          .map(
            (c) => `
          <div style="padding: 12px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px;">
            <div style="font-size: 14px; font-weight: bold; color: #6b21a8;">
              ${esc(c.name)} <span style="font-size: 11px; color: #7e22ce; font-weight: normal;">(${esc(c.role)})</span>
            </div>
            ${c.archetype ? `<div style="font-size: 11px; color: #9333ea; font-style: italic; margin-bottom: 4px;">${esc(c.archetype)}</div>` : ''}
            <div style="font-size: 12px; color: #334155; margin-top: 4px;"><strong>Traits:</strong> ${esc(c.personality)}</div>
            <div style="font-size: 12px; color: #334155; margin-top: 2px;"><strong>Motivation:</strong> ${esc(c.motivation)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(project.title)} - SwarmStudio Dossier</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header-bar {
      border-bottom: 3px solid #7c3aed;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      background: #f3e8ff;
      color: #6b21a8;
      font-size: 11px;
      font-weight: 700;
      border-radius: 9999px;
      margin-right: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      color: #4c1d95;
      font-size: 26px;
      margin: 10px 0 4px 0;
      font-weight: 800;
    }
    .meta-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
    .section-title {
      color: #581c87;
      font-size: 17px;
      margin: 24px 0 10px 0;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 700;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #334155;
    }
    @media print {
      body { padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <span class="badge">${esc(project.project_type)}</span>
      <span class="badge">${esc(project.genre)}</span>
      <span class="badge">Tone: ${esc(project.tone)}</span>
    </div>
    <h1>${esc(project.title || 'Creative Project')}</h1>
    <p class="meta-text">SwarmStudio Multi-Agent Production Dossier &bull; Generated ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="box">
    <strong style="color: #6b21a8; display: block; margin-bottom: 4px;">Original Premise & Directive:</strong>
    <p style="margin: 0; font-size: 13px;">${esc(project.idea)}</p>
  </div>

  ${
    project.story?.logline
      ? `
    <div>
      <h2 class="section-title">1. Logline & Synopsis</h2>
      <div style="font-size: 14px; font-weight: 600; color: #4338ca; margin-bottom: 8px; font-style: italic;">
        "${esc(project.story.logline)}"
      </div>
      <p style="font-size: 13px; color: #334155; line-height: 1.6;">${esc(project.story.synopsis)}</p>
      ${
        project.story.three_act_structure
          ? `
        <div style="margin-top: 10px; padding: 10px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569;">
          <strong>Three-Act Narrative Structure:</strong><br/>
          ${esc(project.story.three_act_structure)}
        </div>
      `
          : ''
      }
    </div>
  `
      : ''
  }

  ${
    charactersHtml
      ? `
    <div>
      <h2 class="section-title">2. Characters & World Building</h2>
      ${project.research?.world_building ? `<div class="box" style="margin-bottom: 12px;"><strong>World Lore:</strong><br/>${esc(project.research.world_building)}</div>` : ''}
      ${charactersHtml}
    </div>
  `
      : ''
  }

  ${
    scenesHtml
      ? `
    <div>
      <h2 class="section-title">3. Screenplay Breakdown</h2>
      ${scenesHtml}
    </div>
  `
      : ''
  }

  ${
    project.visuals || project.audio
      ? `
    <div>
      <h2 class="section-title">4. Production Direction</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        ${
          project.visuals
            ? `
          <div class="box" style="margin-bottom: 0;">
            <strong style="color: #6b21a8;">Visual Direction:</strong>
            <p style="margin: 4px 0 0 0;">${esc(project.visuals.art_direction)}</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;"><strong>Lighting:</strong> ${esc(project.visuals.lighting_style)}</p>
            ${project.visuals.color_palette ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;"><strong>Palette:</strong> ${esc(project.visuals.color_palette.join(', '))}</p>` : ''}
          </div>
        `
            : ''
        }
        ${
          project.audio
            ? `
          <div class="box" style="margin-bottom: 0;">
            <strong style="color: #6b21a8;">Audio Atmosphere:</strong>
            <p style="margin: 4px 0 0 0;">${esc(project.audio.music_score_direction)}</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;"><strong>Instruments:</strong> ${esc(project.audio.tempo_and_instruments)}</p>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `
      : ''
  }

  ${
    project.critic
      ? `
    <div>
      <h2 class="section-title">5. Critic Quality Review (Score: ${project.critic.score}/100)</h2>
      <div class="box">
        <strong>Verdict:</strong> ${esc(project.critic.verdict)}<br/>
        <span style="font-size: 11px; color: #64748b;">Continuity: ${esc(project.critic.continuity_status)}</span>
      </div>
    </div>
  `
      : ''
  }

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;
}

export function printProjectDossier(project: ProjectData): void {
  const html = generatePrintableHtml(project);
  try {
    const printWindow = window.open('', '_blank');
    if (printWindow && !printWindow.closed) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      return;
    }
  } catch (err) {
    console.warn('Window popup blocked, falling back to hidden iframe print:', err);
  }

  // Hidden iframe fallback if popup blocked
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {
          // ignore
        }
      }, 5000);
    }, 400);
  }
}
