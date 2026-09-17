from pathlib import Path
p=Path('/home/ubuntu/projects/veriq-a43e73b8/Paradox-Hack-2-Ignite-main/frontend/src/App.tsx')
s=p.read_text()
old='return <div className={`logo ${light ? \'logo-light\' : \'\'}`}><span className="logo-mark"><span /></span><span>VeriQ</span></div>;'
new='return <div className={`logo ${light ? \'logo-light\' : \'\'}`}><span className="logo-mark"><img src="/assets/veriq-logo-mark.svg" alt="" /></span><span>VeriQ</span></div>;'
if old not in s: raise SystemExit('logo string not found')
p.write_text(s.replace(old,new,1))
