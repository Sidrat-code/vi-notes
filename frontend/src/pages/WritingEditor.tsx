import React, { useState, useRef } from 'react'

interface PasteEvent {
  pastedText: string
  position: number
  timestamp: Date
}

const WritingEditor: React.FC = () => {
  const [title, setTitle] = useState('Untitled Document')
  const [content, setContent] = useState('')
  const [pasteEvents, setPasteEvents] = useState<PasteEvent[]>([])
  const [showReport, setShowReport] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = content.trim() === ''
    ? 0
    : content.trim().split(/\s+/).length

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')
    const position = textareaRef.current?.selectionStart || 0
    setPasteEvents(prev => [...prev, {
      pastedText,
      position,
      timestamp: new Date()
    }])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a'
      }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          📝 Vi-Notes
        </span>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>
          Paste Detection Active 
        </span>
      </nav>

      {/* Editor */}
      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #2a2a2a',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 700,
            padding: '0.5rem 0',
            marginBottom: '1rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {/* Paste Warning */}
        {pasteEvents.length > 0 && (
          <div style={{
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            color: '#f87171',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
             {pasteEvents.length} paste event
            {pasteEvents.length > 1 ? 's' : ''} detected
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="Start writing here... paste detection is active"
          style={{
            width: '100%',
            minHeight: '400px',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: '#e0e0e0',
            fontSize: '1rem',
            lineHeight: '1.8',
            padding: '1.5rem',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'Georgia, serif',
            boxSizing: 'border-box'
          }}
        />

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>
              📄 {wordCount} words
            </span>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>
{pasteEvents.length} paste{pasteEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setShowReport(!showReport)}
            style={{
              background: 'transparent',
              border: '1px solid #3a3a3a',
              color: '#aaa',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {showReport ? 'Hide Report' : ' View Report'}
          </button>
        </div>

        {/* Report Panel */}
        {showReport && (
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '1.5rem',
            marginTop: '1rem'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
               Writing Session Report
            </h3>

            {/* Stats Row */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={statBox}>
                <span style={statNum}>{wordCount}</span>
                <span style={statLabel}>Total Words</span>
              </div>
              <div style={statBox}>
                <span style={statNum}>{pasteEvents.length}</span>
                <span style={statLabel}>Paste Events</span>
              </div>
              <div style={statBox}>
                <span style={statNum}>
                  {pasteEvents.length === 0 ? '100' : Math.max(0,
                    Math.round((1 - pasteEvents.reduce((acc, p) =>
                      acc + p.pastedText.split(/\s+/).length, 0
                    ) / Math.max(wordCount, 1)) * 100)
                  )}%
                </span>
                <span style={statLabel}>Original</span>
              </div>
            </div>

            {/* Paste List */}
            {pasteEvents.length === 0 ? (
              <p style={{ color: '#4ade80', textAlign: 'center' }}>
                 No pasted text — fully original writing!
              </p>
            ) : (
              pasteEvents.map((event, index) => (
                <div key={index} style={{
                  background: '#2a2a2a',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem'
                  }}>
                    <span style={{ color: '#f87171' }}>
                      Paste #{index + 1}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{
                    color: '#aaa',
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    "{event.pastedText.slice(0, 100)}
                    {event.pastedText.length > 100 ? '...' : ''}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const statBox: React.CSSProperties = {
  flex: 1,
  background: '#2a2a2a',
  borderRadius: '8px',
  padding: '1rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem'
}

const statNum: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#6366f1'
}

const statLabel: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#888'
}

export default WritingEditor