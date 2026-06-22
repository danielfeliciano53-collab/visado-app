'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import MobileHeader from '../../components/MobileHeader'
import VaultUnlock from '../../components/VaultUnlock'
import { apiFetch, deleteCookie } from '../../lib/api'
import { useVault } from '../../lib/vaultContext'
import { encryptFile, decryptFile } from '../../lib/vaultCrypto'

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
  expiry_date: string | null
  issue_date: string | null
  encrypted: boolean | null
}

interface Profile {
  id?: string
  full_name?: string
  email?: string
  plan?: string
}

interface MetadataForm {
  expiry_date: string
  issue_date: string
  notes: string
}

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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false
  const expiry = new Date(dateStr)
  const now = new Date()
  const sixtyDays = 60 * 24 * 60 * 60 * 1000
  return expiry.getTime() - now.getTime() < sixtyDays && expiry > now
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function VaultPage() {
  const router = useRouter()
  const { isUnlocked, getKey, lock } = useVault()
  const [profile, setProfile] = useState<Profile>({})
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'missing'>('all')
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [metadataTarget, setMetadataTarget] = useState<string | null>(null)
  const [metadataForm, setMetadataForm] = useState<MetadataForm>({ expiry_date: '', issue_date: '', notes: '' })
  const [pendingFile, setPendingFile] = useState<File | null>(null)
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
      const p = profileData.profile || {}
      setProfile(p)

      // Check if user has set up vault before
      if (p.id) {
        const initialized = localStorage.getItem(`vault_initialized_${p.id}`)
        setIsFirstTime(!initialized)
      }

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

  function handleVaultUnlocked() {
    if (profile.id) {
      localStorage.setItem(`vault_initialized_${profile.id}`, 'true')
      setIsFirstTime(false)
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
    // Store file and show metadata form before uploading
    setPendingFile(file)
    setMetadataTarget(uploadTarget)
    setMetadataForm({ expiry_date: '', issue_date: '', notes: '' })
  }

  async function handleConfirmUpload() {
    if (!pendingFile || !metadataTarget) return
    const key = getKey()
    if (!key) return

    setUploading(metadataTarget)
    setMetadataTarget(null)

    try {
      // Read file as ArrayBuffer
      const fileBuffer = await pendingFile.arrayBuffer()

      // Encrypt the file client-side
      const encryptedBuffer = await encryptFile(key, fileBuffer)

      // Create a Blob from the encrypted buffer
      const encryptedBlob = new Blob([encryptedBuffer], { type: 'application/octet-stream' })
      const encryptedFile = new File([encryptedBlob], pendingFile.name + '.enc', { type: 'application/octet-stream' })

      const formData = new FormData()
      formData.append('file', encryptedFile)
      formData.append('document_type', metadataTarget)
      formData.append('encrypted', 'true')
      formData.append('original_mime_type', pendingFile.type)
      if (metadataForm.expiry_date) formData.append('expiry_date', metadataForm.expiry_date)
      if (metadataForm.issue_date) formData.append('issue_date', metadataForm.issue_date)
      if (metadataForm.notes) formData.append('notes', metadataForm.notes)

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
      setPendingFile(null)
    }
  }

  async function handleDownload(docId: string, fileName: string, encrypted: boolean | null, mimeType: string | null) {
    const key = getKey()
    if (!key) return
    try {
      const res = await apiFetch(`/api/vault/download?id=${docId}`)
      if (!res.ok) { alert('Download failed. Please try again.'); return }
      const data = await res.json()

      // Fetch the actual file bytes from the signed URL
      const fileRes = await fetch(data.url)
      const encryptedBuffer = await fileRes.arrayBuffer()

      let finalBuffer: ArrayBuffer
      let finalMime: string

      if (encrypted) {
        // Decrypt client-side
        finalBuffer = await decryptFile(key, encryptedBuffer)
        finalMime = mimeType || 'application/octet-stream'
      } else {
        // Legacy unencrypted document
        finalBuffer = encryptedBuffer
        finalMime = mimeType || 'application/octet-stream'
      }

      // Trigger download
      const blob = new Blob([finalBuffer], { type: finalMime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName?.replace('.enc', '') || 'document'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download error', e)
      alert('Download failed. Please try again.')
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

  function handleLogout() {
    lock()
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

      {/* Vault unlock modal — shown when vault is locked */}
      {!isUnlocked && profile.id && (
        <VaultUnlock
          userId={profile.id}
          isFirstTime={isFirstTime}
          onUnlocked={handleVaultUnlocked}
        />
      )}

      {/* Metadata + confirm upload modal */}
      {metadataTarget && pendingFile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,21,16,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: DARK, fontFamily: 'Georgia, serif' }}>
              Add Document Details
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {pendingFile.name} · These details help Joao remind you of upcoming deadlines. The document itself will be encrypted before upload.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Issue Date (optional)</label>
                <input type="date" value={metadataForm.issue_date} onChange={e => setMetadataForm({ ...metadataForm, issue_date: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Expiry Date (optional)</label>
                <input type="date" value={metadataForm.expiry_date} onChange={e => setMetadataForm({ ...metadataForm, expiry_date: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none' }} />
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 6, fontFamily: "'Helvetica Neue', sans-serif" }}>Notes (optional)</label>
            <textarea value={metadataForm.notes} onChange={e => setMetadataForm({ ...metadataForm, notes: e.target.value })}
              placeholder="e.g. Renewed March 2024, expires March 2034"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, marginBottom: 20, boxSizing: 'border-box', fontFamily: "'Helvetica Neue', sans-serif", outline: 'none', resize: 'none' }} />

            <div style={{ background: GREEN_LIGHT, borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: GREEN_DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>
              🔒 This document will be encrypted in your browser before upload. Only you can decrypt it.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setMetadataTarget(null); setPendingFile(null) }}
                style={{ flex: 1, padding: '11px', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, cursor: 'pointer', color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleConfirmUpload}
                style={{ flex: 2, padding: '11px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                🔒 Encrypt & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0, overflowX: 'hidden' }}>

        {/* Page header */}
        <div style={{ padding: isMobile ? '24px 16px 0' : '32px 32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DARK }}>Document Vault</h1>
            <span style={{ fontSize: 12, background: GREEN_LIGHT, color: GREEN_DARK, padding: '3px 10px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
              🔒 Encrypted
            </span>
          </div>
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
                    const expiring = isExpiringSoon(existing?.expiry_date || null)
                    const expired = isExpired(existing?.expiry_date || null)

                    return (
                      <div key={doc.type} style={{ background: '#fff', border: `1px solid ${expired ? '#FCA5A5' : expiring ? '#FCD34D' : isUploaded ? GREEN_LIGHT : BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                          onClick={() => setSelectedDoc(isExpanded ? null : doc.type)}>

                          <div style={{ width: 36, height: 36, borderRadius: 8, background: isUploaded ? GREEN_LIGHT : OFF_WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                            {isUploaded ? getFileIcon(existing?.mime_type || null) : '📂'}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', sans-serif" }}>{doc.label}</div>
                              {doc.required && !isUploaded && (
                                <span style={{ fontSize: 10, background: '#FEE2E2', color: DANGER, padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>Required</span>
                              )}
                              {isUploaded && (
                                <span style={{ fontSize: 10, background: GREEN_LIGHT, color: GREEN_DARK, padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>✓ Uploaded</span>
                              )}
                              {isUploaded && existing?.encrypted && (
                                <span style={{ fontSize: 10, background: '#F0FDF4', color: '#166534', padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>🔒 Encrypted</span>
                              )}
                              {expired && (
                                <span style={{ fontSize: 10, background: '#FEF2F2', color: DANGER, padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>⚠️ Expired</span>
                              )}
                              {expiring && !expired && (
                                <span style={{ fontSize: 10, background: '#FFFBEB', color: '#92400E', padding: '2px 6px', borderRadius: 99, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>⏳ Expiring soon</span>
                              )}
                            </div>
                            {isUploaded && existing?.file_name ? (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                                {existing.file_name.replace('.enc', '')}
                                {existing.file_size ? ` · ${formatFileSize(existing.file_size)}` : ''}
                                {existing.expiry_date ? ` · Expires ${formatDate(existing.expiry_date)}` : ''}
                              </div>
                            ) : (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginTop: 2 }}>
                                Not uploaded yet
                              </div>
                            )}
                          </div>

                          <div style={{ flexShrink: 0 }}>
                            {isUploadingThis ? (
                              <div style={{ fontSize: 12, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif" }}>Encrypting...</div>
                            ) : isUploaded ? (
                              <span style={{ color: MUTED, fontSize: 12 }}>{isExpanded ? '▲' : '▼'}</span>
                            ) : (
                              <button
                                onClick={e => { e.stopPropagation(); handleUploadClick(doc.type) }}
                                style={{ fontSize: 12, padding: '7px 14px', background: GREEN_DARK, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                                Upload
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && isUploaded && (
                          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {existing?.notes && (
                              <div style={{ width: '100%', fontSize: 13, color: MUTED, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: 8 }}>
                                {existing.notes}
                              </div>
                            )}
                            <button
                              onClick={() => handleDownload(existing!.id, existing?.file_name || 'document', existing?.encrypted || false, existing?.mime_type || null)}
                              style={{ fontSize: 12, padding: '7px 14px', background: GREEN_LIGHT, color: GREEN_DARK, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 600 }}>
                              ↓ Download
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleUploadClick(doc.type) }}
                              style={{ fontSize: 12, padding: '7px 14px', background: 'none', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                              Replace
                            </button>
                            <button
                              onClick={() => handleDelete(existing!.id)}
                              style={{ fontSize: 12, padding: '7px 14px', background: 'none', color: DANGER, border: '1px solid #FCA5A5', borderRadius: 8, cursor: 'pointer', fontFamily: "'Helvetica Neue', sans-serif" }}>
                              Delete
                            </button>
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
      </div>
    </div>
  )
}
