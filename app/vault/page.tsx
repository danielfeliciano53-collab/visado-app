'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import { apiFetch, deleteCookie } from '../../lib/api'

const GREEN = '#1B2F6E'
const GREEN_DARK = '#111E47'
const GREEN_LIGHT = '#E8ECF7'
const OFF_WHITE = '#F9F7F4'
const DARK = '#111510'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'
const DANGER = '#EF4444'
const GOLD = '#C9942A'

interface VaultDoc {
  id: string
  doc_type: string
  file_name: string | null
  storage_path: string | null
  file_size: number | null
  mime_type: string | null
  status: 'empty' | 'uploaded' | 'sample'
  notes: string | null
}

interface Profile {
  full_name?: string
  email?: string
  plan?: string
}

// Document categories with metadata
const DOC_CATEGORIES = [
  {
    group: 'Identity',
    docs: [
      { type: 'passport', label: 'Passport', description: 'Valid US passport — must be valid for 6+ months beyond your intended stay', required: true },
      { type: 'passport_photos', label: 'Passport Photos', description: 'Recent passport-style photos (35x45mm) — you\'ll need several copies', required: true },
    ]
  },
  {
    group: 'Background & Legal',
    docs: [
      { type: 'fbi_background_check', label: 'FBI Background Check', description: 'Identity History Summary from the FBI — takes 8-12 weeks, start immediately', required: true },
      { type: 'fbi_apostille', label: 'FBI Check Apostille', description: 'Apostille certification of your FBI background check from Secretary of State', required: true },
    ]
  },
  {
    group: 'Financial',
    docs: [
      { type: 'bank_statements', label: 'Bank Statements', description: '6-12 months of statements showing consistent passive income (min €920/month)', required: true },
      { type: 'proof_of_income', label: 'Proof of Income', description: 'Pension letters, dividend statements, rental agreements, or other income documentation', required: true },
    ]
  },
  {
    group: 'Portugal Documents',
    docs: [
      { type: 'nif', label: 'NIF Certificate', description: 'Portuguese tax number — get this first week in Portugal at any Financas office', required: true },
      { type: 'proof_of_accommodation', label: 'Proof of Accommodation', description: 'Signed rental agreement or property deed for your Portuguese address', required: true },
      { type: 'health_insurance', label: 'Portuguese Health Insurance', description: 'Health insurance valid in Portugal covering the full Schengen area', required: true },
      { type: 'nhr_certificate', label: 'NHR Tax Status', description: 'Non-Habitual Resident certificate — apply within 6 months of registering as resident', required: false },
    ]
  },
  {
    group: 'Residency',
    docs: [
      { type: 'visa_application', label: 'D7 Visa Application Form', description: 'Completed visa application form from the Portuguese consulate', required: true },
      { type: 'd7_visa', label: 'D7 Visa', description: 'Your D7 visa affixed to your passport after consulate approval', required: true },
      { type: 'residency_permit', label: 'Residency Permit Card', description: 'Autorização de Residência card mailed from AIMA after your appointment', required: true },
    ]
  },
  {
    group: 'Family',
    docs: [
      { type: 'birth_certificates', label: 'Birth Certificates', description: 'Birth certificates for all family members — apostilled if required', required: false },
      { type: 'marriage_certificate', label: 'Marriage Certificate', description: 'If applicable — apostilled copy', required: false },
      { type: 'school_records', label: 'School Records', description: 'Children\'s school records and vaccination certificates for enrollment', required: false },
    ]
  },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string | null): string {
  if (!mimeType) return '📄'
  if (mimeType.includes('pdf')) return '📑'
  if (mimeType.includes('image')) return '🖼️'
  return '📄'
}

export default function VaultPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({})
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'missing'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<string | null>(null)

  useEffect(() => {
    const check = () => setIsMobile((window.screen?.width || 1440) <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { loadVault() }, [])

  async function loadVault() {
    setLoading(true)
    try {
      const [profileRes, vaultRes] = await Promise.all([
        apiFetch('/api/profile'),
        apiFetch('/api/vault'),
      ])
      if (profileRes.status === 401) { router.push('/login'); return }
      const profileData = await profileRes.json()
      setProfile(profileData.profile || {})

      if (vaultRes.ok) {
        const vaultData = await vaultRes.json()
        setVaultDocs(vaultData.documents || [])
      }
    } catch (e) {
      console.error('Vault load error', e)
    } finally {
      setLoading(false)
    }
  }

  function getDocStatus(docType: string): VaultDoc | null {
    return vaultDocs.find(d => d.doc_type === docType) || null
  }

  function handleUploadClick(docType: string) {
    setUploadTarget(docType)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !uploadTarget) return
    e.target.value = ''

    setUploading(uploadTarget)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', uploadTarget)

      const token = document.cookie.match(/(?:^|; )visado_token=([^;]*)/)?.[1]
      const res = await fetch('https://visado-backend.vercel.app/api/vault/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${decodeURIComponent(token || '')}` },
        body: formData,
      })

      if (res.ok) {
        await loadVault()
      } else {
        const err = await res.json()
        alert(`Upload failed: ${err.error || 'Unknown error'}`)
      }
    } catch (e) {
      console.error('Upload error', e)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(null)
      setUploadTarget(null)
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm('Delete this document?')) return
    try {
      const res = await apiFetch(`/api/vault/${docId}`, { method: 'DELETE' })
      if (res.ok) await loadVault()
    } catch (e) {
      console.error('Delete error', e)
    }
  }

  async function handleDownload(docId: string, fileName: string) {
    try {
      const res = await apiFetch(`/api/vault/download?id=${docId}`)
      if (res.ok) {
        const data = await res.json()
        window.open(data.url, '_blank')
      } else {
        alert('Download failed. Please try again.')
      }
    } catch (e) {
      console.error('Download error', e)
      alert('Download failed. Please try again.')
    }
  }

  function handleLogout() {
    deleteCookie('visado_token')
    deleteCookie('visado_user')
    router.push('/login')
  }

  const allDocs = DOC_CATEGORIES.flatMap(c => c.docs)
  const uploadedCount = allDocs.filter(d => getDocStatus(d.type)?.status === 'uploaded').length
  const totalCount = allDocs.length
  const missingRequired = allDocs.filter(d => d.required && !getDocStatus(d.type)).length

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: OFF_WHITE, fontFamily: "'Helvetica Neue', sans-serif", color: MUTED, fontSize: 13 }}>
        Loading your vault...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: OFF_WHITE, fontFamily: 'Georgia, serif' }}>
      {!isMobile && <Sidebar activePage="vault" profile={profile} onLogout={handleLogout} />}
      {isMobile && <MobileHeader activePage="vault" profile={profile} onLogout={handleLogout} />}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleFileChange} />

      <div style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0, overflowX: 'hidden' }}>

        {/* Page header */}
        <div style={{ padding: isMobile ? '24px 16px 0' : '32px 32px 0' }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DARK }}>Document Vault</h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {uploadedCount} of {totalCount} documents uploaded
            {missingRequired > 0 && ` · ${missingRequired} required documents missing`}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ padding: isMobile ? '16px 16px 0' : '20px 32px 0' }}>
          <div style={{ background: BORDER, borderRadius: 99, height: 6 }}>
            <div style={{ background: GREEN, borderRadius: 99, height: 6, width: `${Math.round((uploadedCount / totalCount) * 100)}%`, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ padding: isMobile ? '16px 16px 0' : '20px 32px 0', display: 'flex', gap: 4 }}>
          {(['all', 'uploaded', 'missing'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${filter === f ? GREEN_DARK : BORDER}`, background: filter === f ? GREEN_LIGHT : '#fff', color: filter === f ? GREEN_DARK : MUTED, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: filter === f ? 600 : 400, cursor: 'pointer' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Document groups */}
        <div style={{ padding: isMobile ? '20px 16px' : '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {DOC_CATEGORIES.map(category => {
            const filteredDocs = category.docs.filter(doc => {
              const status = getDocStatus(doc.type)
              if (filter === 'uploaded') return status?.status === 'uploaded'
              if (filter === 'missing') return !status || status.status === 'empty'
              return true
            })
            if (filteredDocs.length === 0) return null

            return (
              <div key={category.group}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  {category.group}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredDocs.map(doc => {
                    const existing = getDocStatus(doc.type)
                    const isUploaded = existing?.status === 'uploaded'
                    const isUploadingThis = uploading === doc.type
                    const isExpanded = selectedDoc === doc.type

                    return (
                      <div key={doc.type} style={{ background: '#fff', border: `1px solid ${isUploaded ? GREEN_LIGHT : BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                        {/* Main row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                          onClick={() => setSelectedDoc(isExpanded ? null : doc.type)}>

                          {/* Status indicator */}
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: isUploaded ? GREEN_LIGHT : OFF_WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                            {isUploaded ? getFileIcon(existing?.mime_type || null) : '📂'}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{doc.label}</div>
                              {doc.required && !isUploaded && (
                                <span style={{ fontSize: 10, background: '#FEE2E2', color: DANGER, padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Required</span>
                              )}
                              {isUploaded && (
                                <span style={{ fontSize: 10, background: GREEN_LIGHT, color: GREEN_DARK, padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>✓ Uploaded</span>
                              )}
                            </div>
                            {isUploaded && existing?.file_name ? (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                                {existing.file_name} {existing.file_size ? `· ${formatFileSize(existing.file_size)}` : ''}
                              </div>
                            ) : (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                                Not uploaded yet
                              </div>
                            )}
                          </div>

                          {/* Action button */}
                          <div style={{ flexShrink: 0 }}>
                            {isUploadingThis ? (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>Uploading...</div>
                            ) : (
                              <button
                                onClick={e => { e.stopPropagation(); handleUploadClick(doc.type) }}
                                style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${isUploaded ? BORDER : GREEN_DARK}`, background: isUploaded ? '#fff' : GREEN_DARK, color: isUploaded ? MUTED : '#fff', fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                                {isUploaded ? 'Replace' : 'Upload'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${BORDER}` }}>
                            <p style={{ fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: 1.6, margin: '12px 0' }}>
                              {doc.description}
                            </p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {isUploaded && (
                                <button
                                  onClick={() => handleDownload(existing!.id, existing!.file_name || 'document')}
                                  style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${GREEN_DARK}`, background: GREEN_LIGHT, color: GREEN_DARK, fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                                  ⬇ Download / View
                                </button>
                              )}
                              {isUploaded && (
                                <button
                                  onClick={() => handleDelete(existing!.id)}
                                  style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid #FCA5A5`, background: '#FEF2F2', color: DANGER, fontSize: 12, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Upload note */}
        <div style={{ padding: isMobile ? '0 16px 32px' : '0 32px 40px', fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", textAlign: 'center' }}>
          Files are encrypted and stored securely. Max 10MB per file. Accepted: PDF, JPG, PNG.
        </div>
      </div>
    </div>
  )
}
