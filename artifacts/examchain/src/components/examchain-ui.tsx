import { type ComponentType, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  AlertTriangle,
  Blocks,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  FileKey2,
  FileText,
  Fingerprint,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  UsersRound,
  X,
} from 'lucide-react';
import { useState } from 'react';

export const navItems = [
  { href: '/dashboard', label: 'Command center', icon: LayoutDashboard },
  { href: '/examinations', label: 'Examinations', icon: ClipboardCheck },
  { href: '/papers', label: 'Secured papers', icon: FileKey2 },
  { href: '/centres', label: 'Authorized centres', icon: UsersRound },
  { href: '/incidents', label: 'Security incidents', icon: Siren },
  { href: '/blockchain', label: 'Blockchain ledger', icon: Blocks },
  { href: '/audit', label: 'Audit verification', icon: FileCheck2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const active = (href: string) => location === href || (href !== '/dashboard' && location.startsWith(href));
  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[255px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[76px] items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-3" data-testid="link-brand">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><Fingerprint size={20} strokeWidth={2.4} /></div>
            <div><div className="font-semibold tracking-tight text-sidebar-accent-foreground">ExamChain</div><div className="eyebrow mt-0.5 text-sidebar-foreground/60">trust infrastructure</div></div>
          </Link>
          <button className="ml-auto text-sidebar-foreground/60 lg:hidden" onClick={() => setOpen(false)} data-testid="button-close-menu"><X size={18} /></button>
        </div>
        <div className="px-4 py-6">
          <div className="eyebrow mb-3 px-3 text-sidebar-foreground/45">Operations</div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${active(href) ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'}`}>
                <Icon size={16} strokeWidth={active(href) ? 2.2 : 1.8} />
                <span>{label}</span>
                {label === 'Security incidents' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            ))}
          </nav>
          <div className="eyebrow mb-3 mt-9 px-3 text-sidebar-foreground/45">System</div>
          <Link href="/settings" data-testid="link-nav-settings" className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${active('/settings') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'}`}><Settings size={16} /><span>Settings</span></Link>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/45 p-3.5">
            <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Secure environment</div>
            <div className="mono mt-2 text-[11px] text-sidebar-foreground/85">EU-WEST · ENCRYPTED</div>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-sidebar-border pt-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">AR</div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-sidebar-accent-foreground">Amina Rahman</div><div className="truncate text-[10px] text-sidebar-foreground/55">Security administrator</div></div>
            <button className="text-sidebar-foreground/50 hover:text-sidebar-accent-foreground" data-testid="button-sign-out"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-[rgba(20,35,49,.5)] lg:hidden" onClick={() => setOpen(false)} data-testid="button-close-overlay" />}
      <div className="lg:pl-[255px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur-md sm:px-8">
          <button className="mr-3 text-muted-foreground lg:hidden" onClick={() => setOpen(true)} data-testid="button-open-menu"><Menu size={21} /></button>
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className="hidden sm:inline">ExamChain</span><span className="hidden text-border sm:inline">/</span><span className="truncate font-medium capitalize text-foreground">{location === '/dashboard' ? 'Command center' : location.split('/')[1]?.replaceAll('-', ' ') || 'Access gateway'}</span></div>
          <div className="flex items-center gap-4"><div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />All systems operational</div><button className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-xs font-bold text-foreground" data-testid="button-profile">AR</button></div>
        </header>
        <main className="animate-page">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action, actionLabel = 'Create new' }: { eyebrow: string; title: string; description?: string; action?: () => void; actionLabel?: string }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="eyebrow mb-2 text-accent">{eyebrow}</div><h1 className="font-[Space_Grotesk] text-2xl font-semibold tracking-tight text-foreground sm:text-[29px]">{title}</h1>{description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}</div>{action && <button onClick={action} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid={`button-${actionLabel.toLowerCase().replaceAll(' ', '-')}`}><Plus size={15} />{actionLabel}</button>}</div>;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'good' | 'warn' | 'bad' | 'info' | 'neutral' }) {
  const colors = { good: 'bg-emerald-50 text-emerald-700 border-emerald-200', warn: 'bg-amber-50 text-amber-700 border-amber-200', bad: 'bg-red-50 text-red-700 border-red-200', info: 'bg-cyan-50 text-cyan-700 border-cyan-200', neutral: 'bg-muted text-muted-foreground border-border' };
  return <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${colors[tone]}`}>{tone === 'good' && <Check size={10} />}{children}</span>;
}

export function toneFor(value?: string): 'good' | 'warn' | 'bad' | 'info' | 'neutral' {
  const v = (value || '').toLowerCase();
  if (v.includes('secure') || v.includes('active') || v.includes('verified') || v.includes('operational') || v.includes('normal') || v.includes('resolved') || v.includes('released') || v.includes('encrypted')) return 'good';
  if (v.includes('pending') || v.includes('review') || v.includes('monitor') || v.includes('warning') || v.includes('scheduled') || v.includes('medium')) return 'warn';
  if (v.includes('blocked') || v.includes('critical') || v.includes('high') || v.includes('violation') || v.includes('open') || v.includes('failed')) return 'bad';
  if (v.includes('chain') || v.includes('confirm') || v.includes('author')) return 'info';
  return 'neutral';
}

export function Panel({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return <section className={`rounded-lg border border-card-border bg-card shadow-[var(--shadow-card)] ${className}`}>{title && <div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">{title}</h2>{action}</div>}{children}</section>;
}

export function Skeleton({ className = '' }: { className?: string }) { return <div className={`animate-pulse rounded bg-muted ${className}`} />; }
export function LoadingState({ rows = 4 }: { rows?: number }) { return <div className="space-y-3 p-5">{Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>; }
export function ErrorState({ message = 'Unable to load this surface.' }: { message?: string }) { return <div className="flex flex-col items-center justify-center gap-2 p-12 text-center"><div className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle size={18} /></div><p className="text-sm font-semibold">Signal unavailable</p><p className="max-w-sm text-xs text-muted-foreground">{message} Check the connection and try again.</p></div>; }
export function EmptyState({ icon: Icon = FileText, title, detail, action }: { icon?: typeof FileText; title: string; detail: string; action?: ReactNode }) { return <div className="flex flex-col items-center justify-center p-14 text-center"><div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-accent"><Icon size={22} /></div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{detail}</p>{action && <div className="mt-5">{action}</div>}</div>; }

export function SearchBox({ value, onChange, placeholder = 'Search records' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="relative min-w-[210px] flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-xs outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/25" data-testid="input-search" /></div>;
}

export function StatusDot({ value }: { value: string }) { return <span className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${toneFor(value) === 'good' ? 'bg-emerald-500' : toneFor(value) === 'bad' ? 'bg-red-500' : toneFor(value) === 'warn' ? 'bg-amber-500' : 'bg-cyan-500'}`} />{value}</span>; }
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(22,35,47,.52)] p-4 backdrop-blur-sm"><div className="w-full max-w-lg animate-rise rounded-xl border border-card-border bg-card shadow-2xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">{title}</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground" data-testid="button-close-modal"><X size={17} /></button></div>{children}</div></div>; }
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) { return <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">{label}</span>{children}{hint && <span className="mt-1 block text-[10px] text-muted-foreground">{hint}</span>}</label>; }
export function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) { return <div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-8 text-xs outline-none focus:ring-2 focus:ring-ring/25" data-testid="select-field">{children}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" /></div>; }
export function FormActions({ onCancel, submitLabel, pending = false }: { onCancel: () => void; submitLabel: string; pending?: boolean }) { return <div className="flex justify-end gap-2 border-t border-border px-5 py-4"><button type="button" onClick={onCancel} className="rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted" data-testid="button-cancel-form">Cancel</button><button type="submit" disabled={pending} className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60" data-testid="button-submit-form">{pending ? 'Processing…' : submitLabel}</button></div>; }

export function MetricCard({ label, value, note, icon: Icon, tone = 'navy', delay = 0 }: { label: string; value: string | number; note: string; icon: ComponentType<{ size?: number }>; tone?: 'navy' | 'teal' | 'amber' | 'red'; delay?: number }) {
  const colors = { navy: 'bg-primary text-primary-foreground', teal: 'bg-accent text-accent-foreground', amber: 'bg-[#b86e32] text-white', red: 'bg-[#a94b45] text-white' };
  return <div className="animate-rise rounded-lg border border-card-border bg-card p-4 shadow-[var(--shadow-card)]" style={{ animationDelay: `${delay}ms` }}><div className="flex items-start justify-between"><span className="text-[11px] font-semibold text-muted-foreground">{label}</span><div className={`grid h-7 w-7 place-items-center rounded-md ${colors[tone]}`}><Icon size={14} /></div></div><div className="mt-4 font-[Space_Grotesk] text-2xl font-semibold tracking-tight">{value}</div><div className="mt-1 text-[10px] text-muted-foreground">{note}</div></div>;
}

export function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return <div className="flex h-14 items-end gap-1.5">{values.map((v, i) => <div key={i} className="group relative flex-1" style={{ height: `${Math.max(12, (v / max) * 100)}%` }}><div className="h-full w-full rounded-sm bg-accent/75 transition-all group-hover:bg-accent" /><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[9px] text-muted-foreground group-hover:block">{v}</span></div>)}</div>;
}

export function SecureMark() { return <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><LockKeyhole size={13} className="text-accent" />End-to-end encrypted workspace</div>; }