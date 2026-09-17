from pathlib import Path
p=Path('/home/ubuntu/projects/veriq-a43e73b8/Paradox-Hack-2-Ignite-main/frontend/src/App.tsx')
s=p.read_text()
needle='</div></div></section>\n      <section className="section security-section"'
replacement='</div></motion.div></div></section>\n      <section className="section security-section"'
if needle not in s:
    raise SystemExit('needle not found')
p.write_text(s.replace(needle,replacement,1))
