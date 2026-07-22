'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import { apiFetch, deleteCookie } from '../../lib/api'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const GREEN = '#1B2F6E'
const GREEN_DARK = '#111E47'
const GREEN_LIGHT = '#E8ECF7'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const WARN = '#F59E0B'
const DANGER = '#EF4444'
const GOLD = '#C9942A'

const PHASE_ORDER = [
  "Laying the Groundwork; Let's explore the journey",
  'Document Collection & Appointment Prep',
  'Moving to Portugal; What to expect and plan',
  'Becoming a Resident; AIMA appointment & residency card',
  "Building Your Life; Cars, medical, insurance & daily life",
]
const PHASE_EMOJI: Record<string, string> = {
  "Laying the Groundwork; Let's explore the journey": '🌱',
  'Document Collection & Appointment Prep': '📋',
  'Moving to Portugal; What to expect and plan': '✈️',
  'Becoming a Resident; AIMA appointment & residency card': '🏛️',
  "Building Your Life; Cars, medical, insurance & daily life": '🏡',
}

function getPhaseNumber(phase: string): number {
  return PHASE_ORDER.indexOf(phase) + 1
}

function getCurrentPhase(tasks: Task[]): string {
  for (const phase of PHASE_ORDER) {
    const phaseTasks = tasks.filter(t => t.phase === phase)
    if (phaseTasks.length > 0 && phaseTasks.some(t => t.status !== 'completed')) return phase
  }
  return PHASE_ORDER[PHASE_ORDER.length - 1]
}

function getChatUrl(phase: string, guideName: string): string {
  const messages: Record<string, string> = {
    "Laying the Groundwork; Let's explore the journey": `Hi, I'm just starting to think about moving to Portugal. Get to know me and help me figure out where to begin.`,
    'Document Collection & Appointment Prep': `I'm in the Document Collection phase getting ready for my visa appointment. What documents do I need to gather?`,
    'Moving to Portugal; What to expect and plan': `I've got my visa and I'm moving to Portugal. What should I expect and plan for in my first weeks?`,
    'Becoming a Resident; AIMA appointment & residency card': `I'm working on becoming a resident and need to tackle my AIMA appointment. What do I need to know?`,
    "Building Your Life; Cars, medical, insurance & daily life": `I'm in the Building Your Life phase. Help me understand what I need to do for cars, medical registration, and daily life.`,
  }
  const msg = encodeURIComponent(messages[phase] || `Tell me about the ${phase} phase of my Portugal journey.`)
  return `/chat?message=${msg}`
}

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: number
  due_date: string | null
  order_index: number
  completed_at: string | null
  phase?: string | null
}

interface ChecklistItem {
  id: string
  title: string
  category: string
  status: string
  tips?: string
  source: string
  created_at: string
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

function ProgressRing({ progress, size = 72 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GREEN_LIGHT} strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GREEN} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </g>
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        fill={GREEN_DARK} fontSize={13} fontWeight={700} fontFamily="Helvetica Neue, sans-serif">
        {progress}%
      </text>
    </svg>
  )
}

function SortableTask({ task, onToggle, onDelete, isCustomProject }: {
  task: Task
  onToggle: (t: Task) => void
  onDelete: (t: Task) => void
  isCustomProject: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : task.status === 'completed' ? 0.6 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto' as any,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px' }}>
          <div {...attributes} {...listeners} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
            cursor: 'grab', padding: '4px 5px', flexShrink: 0, marginTop: 1,
            borderRadius: 4, background: '#F3F4F6', border: '1px solid #E5E7EB',
            minWidth: 22, minHeight: 28, alignItems: 'center',
          }}>
            <div style={{ width: 10, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
            <div style={{ width: 10, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
            <div style={{ width: 10, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
          </div>
          <div onClick={e => { e.stopPropagation(); onToggle(task) }} style={{
            width: 20, height: 20, borderRadius: 6,
            border: `2px solid ${task.status === 'completed' ? GREEN : BORDER}`,
            background: task.status === 'completed' ? GREEN : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {task.status === 'completed' && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
            <div style={{ fontSize: 14, color: task.status === 'completed' ? MUTED : DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 500, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
              {task.title}
            </div>
            {task.due_date && task.status !== 'completed' && (
              <div style={{ fontSize: 11, color: new Date(task.due_date) < new Date() ? DANGER : MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {task.priority === 1 && <span style={{ fontSize: 10, background: '#FEE2E2', color: DANGER, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Critical</span>}
            {task.priority === 2 && <span style={{ fontSize: 10, background: '#FEF3C7', color: WARN, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>High</span>}
            <span onClick={() => setExpanded(!expanded)} style={{ color: MUTED, fontSize: 12, cursor: 'pointer' }}>{expanded ? '▲' : '▼'}</span>
            <span onClick={() => onDelete(task)} style={{ color: '#D1D5DB', fontSize: 14, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }} title="Delete task">×</span>
          </div>
        </div>
        {expanded && task.description && (
          <div style={{ padding: '10px 14px 14px 46px', fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, borderTop: `1px solid ${BORDER}` }}>
            {task.description}
          </div>
        )}
      </div>
    </div>
  )
}

function SortableChatTask({ item, onToggle }: { item: ChecklistItem, onToggle: (item: ChecklistItem) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : item.status === 'completed' ? 0.6 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto' as any,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px' }}>
          <div {...attributes} {...listeners} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
            cursor: 'grab', padding: '4px 6px', flexShrink: 0, marginTop: 1,
            borderRadius: 4, background: '#F3F4F6', border: '1px solid #E5E7EB',
            minWidth: 24, minHeight: 32, alignItems: 'center',
          }}>
            <div style={{ width: 12, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
            <div style={{ width: 12, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
            <div style={{ width: 12, height: 2, borderRadius: 1, background: '#9CA3AF' }} />
          </div>
          <div onClick={() => onToggle(item)} style={{
            width: 20, height: 20, borderRadius: 6,
            border: `2px solid ${item.status === 'completed' ? GREEN : BORDER}`,
            background: item.status === 'completed' ? GREEN : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {item.status === 'completed' && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: item.status === 'completed' ? MUTED : DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 500, textDecoration: item.status === 'completed' ? 'line-through' : 'none' }}>
              {item.title}
            </div>
            {item.tips && (
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2, lineHeight: 1.4 }}>{item.tips}</div>
            )}
          </div>
          <span style={{ fontSize: 10, background: '#FBF3E2', color: GOLD, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, flexShrink: 0 }}>Chat</span>
        </div>
      </div>
    </div>
  )
}

function AddTaskModal({ onClose, onAdd, phases }: {
  onClose: () => void
  onAdd: (title: string, description: string, phase: string | null, priority: number) => void
  phases: string[]
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<string>('')
  const [priority, setPriority] = useState(3)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Add a Task</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>Task title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Get FBI background check apostilled"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Any helpful notes about this task..."
              rows={3} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
          </div>
          {phases.length > 0 && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>Phase (optional)</label>
              <select value={phase} onChange={e => setPhase(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", boxSizing: 'border-box', outline: 'none', background: '#fff' }}>
                <option value="">No phase</option>
                {phases.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>Priority</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 1, label: 'Critical', bg: '#FEE2E2', color: DANGER }, { v: 2, label: 'High', bg: '#FEF3C7', color: WARN }, { v: 3, label: 'Normal', bg: GREEN_LIGHT, color: GREEN_DARK }].map(p => (
                <button key={p.v} onClick={() => setPriority(p.v)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `2px solid ${priority === p.v ? p.color : BORDER}`, background: priority === p.v ? p.bg : '#fff', color: priority === p.v ? p.color : MUTED, fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (title.trim()) { onAdd(title.trim(), description.trim(), phase || null, priority); onClose() } }}
            style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: title.trim() ? GREEN_DARK : BORDER, color: title.trim() ? '#fff' : MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: title.trim() ? 'pointer' : 'default' }}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}

function AddProjectModal({ onClose, onCreate, plan, guideName }: {
  onClose: () => void
  onCreate: (name: string, description: string, tasks: any[] | null) => void
  plan: string
  guideName: string
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [joaoTasks, setJoaoTasks] = useState<any[] | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const router = useRouter()

  async function askJoao() {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/joao-project', {
        method: 'POST',
        body: JSON.stringify({ project_name: name.trim(), project_description: description.trim() })
      })
      const json = await res.json()
      setJoaoTasks(json.tasks || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (showPaywall) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
          <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Upgrade to Pro</h3>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6 }}>
            {guideName} built your project list. Upgrade to Pro to save it to your journey and start tracking progress.
          </p>
          <div style={{ background: GREEN_LIGHT, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'left' }}>
            {joaoTasks?.slice(0, 4).map((t, i) => (
              <div key={i} style={{ fontSize: 13, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", padding: '4px 0', display: 'flex', gap: 8 }}>
                <span>•</span><span>{t.title}</span>
              </div>
            ))}
            {joaoTasks && joaoTasks.length > 4 && <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 4 }}>+ {joaoTasks.length - 4} more tasks</div>}
          </div>
          <button onClick={() => router.push('/account')}
            style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: GOLD, color: '#fff', fontSize: 15, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
            Upgrade to Pro — $19/mo
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", cursor: 'pointer' }}>
            Maybe later
          </button>
        </div>
      </div>
    )
  }

  if (joaoTasks) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>◎</span>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{guideName}'s suggested tasks</h3>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>For project: <strong>{name}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {joaoTasks.map((t, i) => (
              <div key={i} style={{ background: OFF_WHITE, borderRadius: 10, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${BORDER}`, background: '#fff', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{t.title}</div>
                    {t.description && <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 3, lineHeight: 1.5 }}>{t.description}</div>}
                  </div>
                  {t.priority === 1 && <span style={{ fontSize: 10, background: '#FEE2E2', color: DANGER, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, flexShrink: 0 }}>Critical</span>}
                  {t.priority === 2 && <span style={{ fontSize: 10, background: '#FEF3C7', color: WARN, padding: '2px 7px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, flexShrink: 0 }}>High</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setJoaoTasks(null)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", cursor: 'pointer' }}>Back</button>
            {plan === 'pro' ? (
              <button onClick={() => { onCreate(name.trim(), description.trim(), joaoTasks); onClose() }}
                style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: GREEN_DARK, color: '#fff', fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                Add to My Journey
              </button>
            ) : (
              <button onClick={() => setShowPaywall(true)}
                style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: GOLD, color: '#fff', fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                Upgrade to Save ✨
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>New Project</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>Project name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Register kids for public school"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", display: 'block', marginBottom: 6 }}>What's this project about? (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Give Joao some context to build a better task list..."
              rows={3} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          <button onClick={askJoao} disabled={!name.trim() || loading}
            style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: name.trim() && !loading ? GREEN_DARK : BORDER, color: name.trim() && !loading ? '#fff' : MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: name.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? 'Asking Joao...' : `◎ Let ${guideName} build my task list`}
          </button>
          <button onClick={() => { if (name.trim()) { onCreate(name.trim(), description.trim(), null); onClose() } }} disabled={!name.trim()}
            style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: name.trim() ? DARK : MUTED, fontSize: 14, fontFamily: "'Helvetica Neue', sans-serif", cursor: name.trim() ? 'pointer' : 'default' }}>
            Build it myself
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: 'none', background: 'none', color: MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function DashboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<'overview' | 'checklist'>('overview')

  useEffect(() => {
    const tab = searchParams.get('tab')
    setActiveTab(tab === 'checklist' ? 'checklist' : 'overview')
  }, [searchParams])

  const [data, setData] = useState<DashboardData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [chatTasks, setChatTasks] = useState<ChecklistItem[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [taskLoading, setTaskLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    const check = () => setIsMobile((window.screen?.width || 1440) <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { loadDashboard() }, [])
  useEffect(() => { if (activeProject?.id) loadTasks(activeProject.id) }, [activeProject?.id])

  async function loadDashboard() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/dashboard')
      if (res.status === 401) { router.push('/login'); return }
      const json = await res.json()

      if (!json.projects || json.projects.length === 0) {
        const visaType = json.profile?.visa_type || 'd7'
        const typeMap: Record<string, string> = { d7: 'd7_visa', d7_visa: 'd7_visa', digital_nomad: 'digital_nomad', golden_visa: 'd7_visa' }
        const nameMap: Record<string, string> = { d7_visa: 'D7 Passive Income Visa', digital_nomad: 'Digital Nomad Visa (D8)', golden_visa: 'Golden Visa' }
        const type = typeMap[visaType] || 'd7_visa'
        const name = nameMap[visaType] || 'Portugal Visa Journey'
        const createRes = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify({ type, name, custom_tasks: null }) })
        if (createRes.ok) {
          const res2 = await apiFetch('/api/dashboard')
          const json2 = await res2.json()
          setData(json2)
          setProjects(json2.projects || [])
          if (json2.projects?.length > 0) setActiveProject(json2.projects[0])
        } else {
          setData(json)
          setProjects([])
        }
      } else {
        setData(json)
        setProjects(json.projects || [])
        setActiveProject(json.projects[0])
      }
    } catch (e) {
      console.error('Dashboard load error', e)
    } finally {
      setLoading(false)
    }
  }

  async function loadTasks(projectId: string) {
    setTaskLoading(true)
    try {
      const [tasksRes, chatRes] = await Promise.all([
        apiFetch(`/api/tasks?project_id=${projectId}`),
        apiFetch('/api/checklist'),
      ])
      const tasksJson = await tasksRes.json()
      setTasks(tasksJson.tasks || [])
      if (chatRes.ok) {
        const chatJson = await chatRes.json()
        setChatTasks((chatJson.items || []).filter((i: ChecklistItem) => i.source === 'chat'))
      }
    } catch (e) {
      console.error('Tasks load error', e)
    } finally {
      setTaskLoading(false)
    }
  }

  async function toggleTask(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    try {
      await apiFetch('/api/tasks', { method: 'PATCH', body: JSON.stringify({ id: task.id, status: newStatus }) })
    } catch (e) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t))
    }
  }

  async function deleteTask(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) return
    setTasks(prev => prev.filter(t => t.id !== task.id))
    try {
      await apiFetch('/api/tasks', { method: 'DELETE', body: JSON.stringify({ id: task.id }) })
    } catch (e) {
      setTasks(prev => [...prev, task])
    }
  }

  async function addTask(title: string, description: string, phase: string | null, priority: number) {
    if (!activeProject) return
    try {
      const res = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ project_id: activeProject.id, title, description, phase, priority })
      })
      const json = await res.json()
      if (json.task) setTasks(prev => [...prev, json.task])
    } catch (e) {
      console.error('Add task error', e)
    }
  }

  async function createProject(name: string, description: string, customTasks: any[] | null) {
    try {
      const res = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name, type: 'custom', custom_tasks: customTasks })
      })
      const json = await res.json()
      if (json.project) {
        await loadDashboard()
        setActiveProject(json.project)
        setActiveTab('checklist')
      }
    } catch (e) {
      console.error('Create project error', e)
    }
  }

  async function handleTaskDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overTask = tasks.find(t => t.id === over.id)
    if (!activeTask || !overTask) return

    const phase = activeTask.phase || null
    const phaseSubset = tasks.filter(t => (t.phase || null) === phase)

    const oldIndex = phaseSubset.findIndex(t => t.id === active.id)
    const newIndex = phaseSubset.findIndex(t => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reorderedSubset = arrayMove(phaseSubset, oldIndex, newIndex)

    setTasks(prev => {
      const result = [...prev]
      const phaseIndices = result.reduce<number[]>((acc, t, i) => {
        if ((t.phase || null) === phase) acc.push(i)
        return acc
      }, [])
      phaseIndices.forEach((globalIdx, subsetIdx) => {
        result[globalIdx] = reorderedSubset[subsetIdx]
      })
      return result
    })

    // Persist new order_index using phase-based offset to avoid cross-phase collisions
    const phaseOffset = PHASE_ORDER.indexOf(phase || '') * 1000
    await Promise.all(
      reorderedSubset.map((t, i) => apiFetch('/api/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id: t.id, order_index: phaseOffset + i })
      }))
    )
  }

  async function toggleChatTask(item: ChecklistItem) {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed'
    setChatTasks(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
    try {
      await apiFetch('/api/checklist', { method: 'PATCH', body: JSON.stringify({ id: item.id, status: newStatus }) })
    } catch (e) {
      setChatTasks(prev => prev.map(i => i.id === item.id ? { ...i, status: item.status } : i))
    }
  }

  function handleChatDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setChatTasks(prev => {
      const oldIndex = prev.findIndex(i => i.id === active.id)
      const newIndex = prev.findIndex(i => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  const profile = data?.profile || {}
  const summary = data?.summary || { total_tasks: 0, completed_tasks: 0, overall_progress: 0, active_projects: 0 }
  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const criticalTasks = pendingTasks.filter(t => t.priority === 1)
  const guideName = profile.guide_choice === 'andreia' ? 'Andreia' : 'Joao'
  const isCustomProject = activeProject?.type === 'custom'

  const currentPhase = tasks.length > 0 ? getCurrentPhase(tasks) : ''
  const currentPhaseNumber = currentPhase ? getPhaseNumber(currentPhase) : 0
  const currentPhaseEmoji = currentPhase ? (PHASE_EMOJI[currentPhase] || '📋') : ''
  const currentPhaseTasks = tasks.filter(t => t.phase === currentPhase)
  const currentPhaseCompleted = currentPhaseTasks.filter(t => t.status === 'completed').length
  const currentPhaseProgress = currentPhaseTasks.length > 0 ? Math.round((currentPhaseCompleted / currentPhaseTasks.length) * 100) : 0

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 13 }}>
        Setting up your dashboard...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      {!isMobile && <Sidebar activePage="dashboard" profile={profile} onLogout={handleLogout} />}
      {isMobile && <MobileHeader activePage="dashboard" profile={profile} onLogout={handleLogout} />}

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={addTask}
          phases={isCustomProject ? [] : PHASE_ORDER}
        />
      )}
      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onCreate={createProject}
          plan={profile.plan || 'free'}
          guideName={guideName}
        />
      )}

      <div style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0, overflowX: 'hidden' }}>
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

        <div style={{ padding: isMobile ? '20px 16px 0' : '24px 32px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${BORDER}`, marginTop: 8 }}>
          {(['overview', 'checklist'] as const).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); router.replace(tab === 'checklist' ? '/dashboard?tab=checklist' : '/dashboard', { scroll: false }) }}
              style={{ padding: '8px 16px', fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? GREEN_DARK : MUTED, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", borderBottom: activeTab === tab ? `2px solid ${GREEN_DARK}` : '2px solid transparent', marginBottom: -1 }}>
              {tab === 'overview' ? 'Dashboard' : 'Checklist'}
            </button>
          ))}
        </div>

        <div style={{ padding: isMobile ? '24px 16px' : '32px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Overall Progress', value: `${summary.overall_progress}%`, sub: 'across all projects', color: GREEN_DARK },
                  { label: 'Tasks Complete', value: `${summary.completed_tasks}/${summary.total_tasks}`, sub: 'total tasks', color: GREEN_DARK },
                  { label: 'Critical Items', value: criticalTasks.length, sub: 'need attention now', color: criticalTasks.length > 0 ? DANGER : GREEN_DARK },
                  { label: 'Active Projects', value: summary.active_projects, sub: 'in progress', color: GREEN_DARK },
                ].map((card, i) => (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: card.color, fontFamily: "'Helvetica Neue', sans-serif" }}>{card.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {activeProject && (
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Current Project</div>
                      <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: DARK }}>{activeProject.name}</h2>
                      {currentPhase && !isCustomProject && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                            {currentPhaseEmoji} {currentPhase} (Phase {currentPhaseNumber})
                          </span>
                          <Link href={getChatUrl(currentPhase, guideName)}
                            style={{ fontSize: 12, padding: '3px 10px', background: GREEN_LIGHT, color: GREEN_DARK, borderRadius: 8, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            ◎ Chat with {guideName} about this phase
                          </Link>
                        </div>
                      )}
                    </div>
                    <ProgressRing progress={isCustomProject ? activeProject.progress : currentPhaseProgress} size={80} />
                  </div>

                  <div style={{ background: GREEN_LIGHT, borderRadius: 99, height: 6, marginBottom: 20 }}>
                    <div style={{ background: GREEN, borderRadius: 99, height: 6, width: `${activeProject.progress}%`, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 4 }}>
                    {activeProject.completed_tasks} of {activeProject.total_tasks} tasks complete
                    {activeProject.progress === 0 && " — let's get started!"}
                    {activeProject.progress > 0 && activeProject.progress < 50 && ' — good progress, keep going!'}
                    {activeProject.progress >= 50 && activeProject.progress < 100 && ' — more than halfway there!'}
                    {activeProject.progress === 100 && ' — project complete! 🎉'}
                  </div>

                  {activeProject.next_tasks?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Next Up</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeProject.next_tasks.slice(0, 3).map(task => (
                          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: OFF_WHITE, borderRadius: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.priority === 1 ? DANGER : task.priority === 2 ? WARN : MUTED, flexShrink: 0 }} />
                            <div style={{ flex: 1, fontSize: 13, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{task.title}</div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab('checklist')}
                        style={{ background: 'none', border: 'none', padding: 0, marginTop: 12, fontSize: 13, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                        View full checklist →
                      </button>
                    </div>
                  )}

                  {activeProject.overdue_tasks?.length > 0 && (
                    <div style={{ marginTop: 16, padding: '12px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, color: '#92400E', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                        ⚠️ {activeProject.overdue_tasks.length} overdue {activeProject.overdue_tasks.length === 1 ? 'task' : 'tasks'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: GREEN_DARK, borderRadius: 12, textDecoration: 'none' }}>
                  <span style={{ fontSize: 22 }}>◎</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: "'Helvetica Neue', sans-serif" }}>Chat with {guideName}</div>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {projects.map(p => (
                    <button key={p.id} onClick={() => setActiveProject(p)}
                      style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeProject?.id === p.id ? GREEN_DARK : BORDER}`, background: activeProject?.id === p.id ? GREEN_LIGHT : '#fff', color: activeProject?.id === p.id ? GREEN_DARK : MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: activeProject?.id === p.id ? 600 : 400, cursor: 'pointer' }}>
                      {p.name}
                    </button>
                  ))}
                  <button onClick={() => setShowAddProject(true)}
                    style={{ padding: '7px 14px', borderRadius: 20, border: `1px dashed ${BORDER}`, background: '#fff', color: MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    + Add Project
                  </button>
                </div>
                <button onClick={() => setShowAddTask(true)}
                  style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: GREEN_DARK, color: '#fff', fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  + Add Task
                </button>
              </div>

              {taskLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>Loading tasks...</div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTaskDragEnd}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Custom project — flat sortable list */}
                    {isCustomProject && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {tasks.map(task => (
                          <SortableTask key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} isCustomProject={true} />
                        ))}
                      </div>
                    )}

                    {/* D7/template project — grouped by phase */}
                    {!isCustomProject && PHASE_ORDER.map(phase => {
                      const phaseTasks = tasks.filter(t => t.phase === phase).sort((a, b) => a.order_index - b.order_index)
                      if (phaseTasks.length === 0) return null
                      const completedCount = phaseTasks.filter(t => t.status === 'completed').length
                      const isPhaseComplete = completedCount === phaseTasks.length
                      const phaseEmoji = PHASE_EMOJI[phase] || '📋'
                      const phaseNum = getPhaseNumber(phase)
                      return (
                        <div key={phase}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 18 }}>{phaseEmoji}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: isPhaseComplete ? GREEN_DARK : DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
                              {phase} (Phase {phaseNum})
                            </span>
                            {isPhaseComplete && <span style={{ fontSize: 11, background: GREEN_LIGHT, color: GREEN_DARK, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Complete ✓</span>}
                            <Link href={getChatUrl(phase, guideName)}
                              style={{ fontSize: 12, padding: '3px 10px', background: GREEN_LIGHT, color: GREEN_DARK, borderRadius: 8, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                              ◎ Chat with {guideName}
                            </Link>
                            <span style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginLeft: 'auto' }}>{completedCount}/{phaseTasks.length}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {phaseTasks.map(task => (
                              <SortableTask key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} isCustomProject={false} />
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {!isCustomProject && tasks.filter(t => !t.phase).length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Tasks</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {tasks.filter(t => !t.phase).map(task => (
                            <SortableTask key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} isCustomProject={false} />
                          ))}
                        </div>
                      </div>
                    )}

                    {chatTasks.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>◎</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>Added by {guideName}</span>
                          <span style={{ fontSize: 11, background: GREEN_LIGHT, color: GREEN_DARK, padding: '2px 8px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                            {chatTasks.filter(i => i.status === 'completed').length}/{chatTasks.length}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 12 }}>Drag to reorder</div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleChatDragEnd}>
                          <SortableContext items={chatTasks.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {chatTasks.map(item => (
                                <SortableChatTask key={item.id} item={item} onToggle={toggleChatTask} />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    )}

                    {tasks.length === 0 && chatTasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: 40, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13 }}>
                        No tasks yet. Hit "+ Add Task" to get started.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F4', fontFamily: "'Helvetica Neue', sans-serif", color: '#6B7280', fontSize: 13 }}>Loading...</div>}>
      <DashboardInner />
    </Suspense>
  )
}
