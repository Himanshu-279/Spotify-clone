import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSpotify, FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa'
import API from '../api'
import toast from 'react-hot-toast'

export default function Upload() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: 'Rock',
    duration: 0,
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (user.role !== 'artist') {
    toast.error('Only artists can upload songs')
    navigate('/library')
    return null
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      // Try to estimate duration (this is a rough estimate)
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        setForm({...form, duration: Math.round(audio.duration)})
      }
      audio.src = URL.createObjectURL(f)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select an audio file')
      return
    }
    if (!form.title.trim()) {
      toast.error('Please enter song title')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('genre', form.genre)
      formData.append('duration', form.duration)
      formData.append('file', file)

      await API.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Song uploaded successfully! 🎵')
      navigate('/library')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerContent}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaSpotify style={s.icon} />
            <span>Spotify Clone</span>
          </div>
          <Link to="/library">
            <button style={s.backBtn}>
              <FaArrowLeft /> Back
            </button>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.container}>
          <div style={s.card}>
            <h1 style={s.title}>Upload Your Song</h1>

            <form onSubmit={handleSubmit} style={s.form}>
              {/* File Upload */}
              <div style={s.uploadArea}>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  style={{display: 'none'}}
                  id="fileInput"
                />
                <label htmlFor="fileInput" style={s.uploadLabel}>
                  <FaCloudUploadAlt style={{fontSize: '48px', marginBottom: '10px'}} />
                  <p style={s.uploadText}>
                    {file ? file.name : 'Click to upload or drag audio file'}
                  </p>
                  <p style={s.uploadHint}>MP3, WAV, or other audio formats</p>
                </label>
              </div>

              {/* Title */}
              <div style={s.group}>
                <label style={s.label}>Song Title *</label>
                <input
                  type="text"
                  placeholder="Enter song title"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  style={s.input}
                  required
                />
              </div>

              {/* Description */}
              <div style={s.group}>
                <label style={s.label}>Description</label>
                <textarea
                  placeholder="Tell us about your song..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  style={{...s.textarea}}
                />
              </div>

              {/* Genre */}
              <div style={s.group}>
                <label style={s.label}>Genre</label>
                <select
                  value={form.genre}
                  onChange={e => setForm({...form, genre: e.target.value})}
                  style={s.input}
                >
                  <option>Rock</option>
                  <option>Pop</option>
                  <option>Hip-Hop</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                  <option>Classical</option>
                  <option>Indie</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Duration */}
              {form.duration > 0 && (
                <div style={s.info}>
                  ⏱️ Duration: {Math.floor(form.duration / 60)}:{String(form.duration % 60).padStart(2, '0')}
                </div>
              )}

              {/* Submit */}
              <button type="submit" style={s.btn} disabled={loading || !file}>
                {loading ? '⏳ Uploading...' : '🎵 Upload Song'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#121212',
    borderBottom: '1px solid #282828',
    padding: '16px 0',
  },
  headerContent: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1DB954',
  },
  icon: {
    fontSize: '24px',
  },
  backBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #404040',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
  },
  card: {
    background: '#191414',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 30px 0',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  uploadArea: {
    border: '2px dashed #404040',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#b3b3b3',
  },
  uploadText: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
  },
  uploadHint: {
    margin: '8px 0 0 0',
    fontSize: '12px',
    color: '#878787',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#b3b3b3',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #404040',
    background: '#282828',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #404040',
    background: '#282828',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  info: {
    padding: '12px',
    background: '#282828',
    borderRadius: '8px',
    color: '#b3b3b3',
    fontSize: '13px',
  },
  btn: {
    padding: '14px',
    borderRadius: '24px',
    border: 'none',
    background: '#1DB954',
    color: '#000',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
}
