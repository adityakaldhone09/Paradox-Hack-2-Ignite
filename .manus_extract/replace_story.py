from pathlib import Path
import re
p=Path('/home/ubuntu/projects/veriq-a43e73b8/Paradox-Hack-2-Ignite-main/frontend/src/App.tsx')
s=p.read_text()
start=s.index('      <section className="story section" id="product">')
end=s.index('      <section className="section security-section"', start)
block='''      <section className="story section" id="product">
        <div className="section-heading"><div><span className="eyebrow">THE SECURE PAPER LIFECYCLE</span><h2>Make every handoff accountable.</h2></div><p>One connected workflow for the people, papers, and places that make an examination possible.</p></div>
        <div className="story-layout">
          <div className="story-steps">{['Create', 'Protect', 'Authorize', 'Release', 'Verify', 'Audit'].map((x, i) => <button className={`story-step ${story === i ? 'active' : ''}`} onClick={() => setStory(i)} key={x}><span>0{i + 1}</span><b>{x}</b><ArrowRight size={15} /></button>)}</div>
          <motion.div className="story-card" layout>
            <div className="story-card-head"><span className="status-pill"><span className="status-dot green" /> {['Draft created', 'Encryption complete', 'Centre approved', 'Window active', 'Integrity verified', 'Audit sealed'][story]}</span><code>QPR-2026-0917</code></div>
            <div className="story-art"><div className="paper-sheet"><div className="paper-lock"><LockKeyhole size={22} /></div><span>QUESTION PAPER</span><strong>Computer Science</strong><small>Semester examination · 2026</small><div className="paper-lines"><i /><i /><i /></div></div><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="story-callout"><Hash size={14} /><span>Hash registered</span><code>A89D21...F8A1</code></div></div>
            <div className="story-card-foot"><span>{['A paper begins with a controlled creation event.', 'Content is encrypted before it leaves the authoring workspace.', 'Only authorised centres can receive the release.', 'Access opens only inside the defined time window.', 'A live comparison confirms the document is unchanged.', 'The complete trail is sealed for independent audit.'][story]}</span><span className="step-count">0{story + 1} / 06</span></div>
          </motion.div>
        </div>
      </section>
'''
p.write_text(s[:start]+block+s[end:])
