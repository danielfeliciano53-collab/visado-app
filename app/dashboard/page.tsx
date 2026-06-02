'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import { apiFetch, deleteCookie, getCookie } from '../../lib/api'

const GREEN = '#1D9E75'
const GREEN_DARK = '#0F6E56'
const GREEN_LIGHT = '#E1F5EE'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const WARN = '#F59E0B'
const DANGER = '#EF4444'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: number
  due_date: string | null
  order_index: number
  completed_at: string | null
}

interface Project {
  id: string
  name: string
  type: string
  status: string
  progress: number
  total_tasks: number
  completed_tasks: number
  next_tasks: Task[]
  overdue_tasks: Task[]
  target_date: string | null
}

interface DashboardData {
  profile: {
    full_name?: string
    email?: string
    plan?: string
    visa_type?: string
    journey_stage?: string
    guide_choice?: string
  }
  projects: Project[]
  summary: {
    total_tasks: number
    completed_tasks: number
    overall_progress: number
    active_projects: number
  }
}

const VISA_LABEL: Record<string, string> = {
  d7_visa: 'D7 Passive Income Visa',
  d7: 'D7 Passive Income Visa',
  digital_nomad: 'Digital Nomad Visa (D8)',
  golden_visa: 'Golden Visa',
  nhr: 'NHR Tax Status',
}

const PRIORITY_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Critical', color: DANGER },
  2: { label: 'High', color: WARN },
  3: { label: 'Normal', color: MUTED },
  4: { label: 'Low', color: BORDER },
}

function ProgressRing({ progress, size = 80 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GREEN_LIGHT} strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={GREEN} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: `rotate(90deg) translate(0, -${size}px)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill={GREEN_DARK} fontSize={16} fontWeight={700} fontFamily="'Helvetica Neue', sans-serif"
      >
        {progress}%
      </text>
    </svg>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [data, setData] = useState<DashboardData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [taskLoading, setTaskLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile((window.screen?.width || 1440) <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { loadDashboard() }, [])

  useEffect(() => {
    if (activeProject) loadTasks(activeProject.id)
  }, [activeProject])

  async function loadDashboard() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/dashboard')
      if (res.status === 401) { router.push('/login'); return }
      const json = await res.json()

      // Auto-create project if user has none
      if (json.projects?.length === 0) {
        await autoCreateProject(json.profile?.visa_type)
        const res2 = await apiFetch('/api/dashboard')
        const json2 = await res2.json()
        setData(json2)
        if (json2.projects?.length > 0) setActiveProject(json2.projects[0])
      } else {
        setData(json)
        if (json.projects?.length > 0) setActiveProject(json.projects[0])
      }
    } catch (e) {
      console.error('Dashboard load error', e)
    } finally {
      setLoading(false)
    }
  }

  async function autoCreateProject(visaType?: string) {
    setCreatingProject(true)
    // Map visa_type to project template type
    const typeMap: Record<string, string> = {
      d7: 'd7_visa',
      d7_visa: 'd7_visa',
      digital_nomad: 'd7_visa', // fallback until D8 template exists
      golden_visa: 'd7_visa',   // fallback
    }
    const type = typeMap[visaType || 'd7'] || 'd7_visa'
    const nameMap: Record<string, string> = {
      d7_visa: 'D7 Passive Income Visa',
      digital_nomad: 'Digital Nomad Visa (D8)',
      golden_visa: 'Golden Visa',
    }
    const name = nameMap[visaType || 'd7'] || 'Portugal Visa'

    try {
      await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ type, name }),
      })
    } catch (e) {
      console.error('Auto-create project error', e)
    } finally {
      setCreatingProject(false)
    }
  }

  async function loadTasks(projectId: string) {
    setTaskLoading(true)
    try {
      const res = await apiFetch(`/api/tasks?project_id=${projectId}`)
      const json = await res.json()
      setTasks(json.tasks || [])
    } catch (e) {
      console.error('Tasks load error', e)
    } finally {
      setTaskLoading(false)
    }
  }

  async function toggleTask(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null } : t))
    // Update active project progress optimistically
    if (activeProject) {
      const completedCount = tasks.filter(t => t.id === task.id ? newStatus === 'completed' : t.status === 'completed').length
      const progress = Math.round((completedCount / tasks.length) * 100)
      setActiveProject(prev => prev ? { ...prev, progress, completed_tasks: completedCount } : prev)
    }
    try {
      await apiFetch('/api/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id: task.id, status: newStatus }),
      })
    } catch (e) {
      // Revert on error
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t))
    }
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  const profile = data?.profile || {}
  const summary = data?.summary || { total_tasks: 0, completed_tasks: 0, overall_progress: 0, active_projects: 0 }

  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const criticalTasks = pendingTasks.filter(t => t.priority === 1)

  if (loading || creatingProject) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13 }}>{creatingProject ? 'Setting up your project...' : 'Loading your dashboard...'}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      {!isMobile && <Sidebar activePage="dashboard" profile={profile} onLogout={handleLogout} />}
      {isMobile && <MobileHeader activePage="dashboard" profile={profile} onLogout={handleLogout} />}

      <div style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0, overflowX: 'hidden' }}>

        {/* Page header */}
        <div style={{ padding: isMobile ? '24px 16px 0' : '32px 32px 0' }}>
          <div style={{ marginBottom: 4, fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DARK }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {profile.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {VISA_LABEL[profile.visa_type || 'd7'] || 'Portugal Relocation'} · {summary.completed_tasks} of {summary.total_tasks} tasks complete
          </p>
        </div>

        {/* Tabs */}
        <div style={{ padding: isMobile ? '20px 16px 0' : '24px 32px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${BORDER}`, marginTop: 8 }}>
          {['overview', 'checklist'].map(tab => (
            <Link key={tab} href={`/dashboard${tab === 'checklist' ? '?tab=checklist' : ''}`}
              style={{ padding: '8px 16px', fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? GREEN_DARK : MUTED, textDecoration: 'none', fontFamily: "'Helvetica Neue', sans-serif", borderBottom: activeTab === tab ? `2px solid ${GREEN_DARK}` : '2px solid transparent', marginBottom: -1 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
        </div>

        <div style={{ padding: isMobile ? '24px 16px' : '32px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Overall Progress', value: `${summary.overall_progress}%`, sub: 'across all projects', color: GREEN_DARK },
                  { label: 'Tasks Complete', value: `${summary.completed_tasks}/${summary.total_tasks}`, sub: 'total tasks', color: GREEN_DARK },
                  { label: 'Critical Items', value: criticalTasks.length, sub: 'need attention now', color: criticalTasks.length > 0 ? DANGER : GREEN_DARK },
                  { label: 'Active Projects', value: summary.active_projects, sub: 'in progress', color: GREEN_DARK },
                ].map((card, i) => (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px' }}>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: card.color, fontFamily: "'Helvetica Neue', sans-serif" }}>{card.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Active project card */}
              {activeProject && (
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Current Project</div>
                      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: DARK }}>{activeProject.name}</h2>
                    </div>
                    <ProgressRing progress={activeProject.progress} size={72} />
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: GREEN_LIGHT, borderRadius: 99, height: 6, marginBottom: 20 }}>
                    <div style={{ background: GREEN, borderRadius: 99, height: 6, width: `${activeProject.progress}%`, transition: 'width 0.6s ease' }} />
                  </div>

                  <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 4 }}>
                    {activeProject.completed_tasks} of {activeProject.total_tasks} tasks complete
                    {activeProject.progress === 0 && ' — let\'s get started!'}
                    {activeProject.progress > 0 && activeProject.progress < 50 && ' — good progress, keep going!'}
                    {activeProject.progress >= 50 && activeProject.progress < 100 && ' — more than halfway there!'}
                    {activeProject.progress === 100 && ' — project complete! 🎉'}
                  </div>

                  {/* Next up tasks */}
                  {activeProject.next_tasks?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Next Up</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeProject.next_tasks.slice(0, 3).map(task => (
                          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: OFF_WHITE, borderRadius: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_LABEL[task.priority]?.color || MUTED, flexShrink: 0 }} />
                            <div style={{ flex: 1, fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{task.title}</div>
                          </div>
                        ))}
                      </div>
                      <Link href="/dashboard?tab=checklist" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, textDecoration: 'none' }}>
                        View full checklist →
                      </Link>
                    </div>
                  )}

                  {/* Overdue warning */}
                  {activeProject.overdue_tasks?.length > 0 && (
                    <div style={{ marginTop: 16, padding: '12px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, color: '#92400E', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                        ⚠️ {activeProject.overdue_tasks.length} overdue {activeProject.overdue_tasks.length === 1 ? 'task' : 'tasks'}
                      </div>
                      <div style={{ fontSize: 12, color: '#92400E', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                        {activeProject.overdue_tasks[0].title}{activeProject.overdue_tasks.length > 1 ? ` and ${activeProject.overdue_tasks.length - 1} more` : ''}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: GREEN_DARK, borderRadius: 12, textDecoration: 'none' }}>
                  <span style={{ fontSize: 22 }}>◎</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: "'Helvetica Neue', sans-serif" }}>Chat with {profile.guide_choice === 'andreia' ? 'Andreia' : 'Joao'}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>Get guidance on your next step</div>
                  </div>
                </Link>
                <Link href="/vault" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, textDecoration: 'none' }}>
                  <span style={{ fontSize: 22 }}>⊠</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Document Vault</div>
                    <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>Store and organize your documents</div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* ── CHECKLIST TAB ── */}
          {activeTab === 'checklist' && (
            <div>
              {/* Project selector if multiple projects */}
              {data?.projects && data.projects.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {data.projects.map(p => (
                    <button key={p.id} onClick={() => setActiveProject(p)}
                      style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeProject?.id === p.id ? GREEN_DARK : BORDER}`, background: activeProject?.id === p.id ? GREEN_LIGHT : '#fff', color: activeProject?.id === p.id ? GREEN_DARK : MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: activeProject?.id === p.id ? 600 : 400, cursor: 'pointer' }}>
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {taskLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>Loading tasks...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Critical tasks first */}
                  {criticalTasks.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: DANGER }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: DANGER, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical — Do These First</span>
                      </div>
                      <TaskList tasks={criticalTasks} onToggle={toggleTask} isMobile={isMobile} />
                    </div>
                  )}

                  {/* Remaining pending tasks */}
                  {pendingTasks.filter(t => t.priority !== 1).length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                        Pending — {pendingTasks.filter(t => t.priority !== 1).length} tasks
                      </div>
                      <TaskList tasks={pendingTasks.filter(t => t.priority !== 1)} onToggle={toggleTask} isMobile={isMobile} />
                    </div>
                  )}

                  {/* Completed tasks */}
                  {completedTasks.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                        Completed — {completedTasks.length} tasks ✓
                      </div>
                      <TaskList tasks={completedTasks} onToggle={toggleTask} isMobile={isMobile} completed />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskList({ tasks, onToggle, isMobile, completed = false }: { tasks: Task[], onToggle: (t: Task) => void, isMobile: boolean, completed?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {tasks.map(task => (
        <div key={task.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', opacity: completed ? 0.6 : 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
            {/* Checkbox */}
            <div onClick={e => { e.stopPropagation(); onToggle(task) }}
              style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${task.status === 'completed' ? GREEN : BORDER}`, background: task.status === 'completed' ? GREEN : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all 0.15s' }}>
              {task.status === 'completed' && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: task.status === 'completed' ? MUTED : DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 500, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                {task.title}
              </div>
              {task.due_date && task.status !== 'completed' && (
                <div style={{ fontSize: 11, color: new Date(task.due_date) < new Date() ? DANGER : MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                  Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {task.priority === 1 && <span style={{ fontSize: 10, background: '#FEE2E2', color: DANGER, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Critical</span>}
              {task.priority === 2 && <span style={{ fontSize: 10, background: '#FEF3C7', color: WARN, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>High</span>}
              <span style={{ color: MUTED, fontSize: 12 }}>{expanded === task.id ? '▲' : '▼'}</span>
            </div>
          </div>
          {expanded === task.id && task.description && (
            <div style={{ padding: '0 14px 14px 46px', fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
              {task.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
