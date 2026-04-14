import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSpotify } from 'react-icons/fa'
import API from '../api'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Welcome to Spotify Clone! 🎵')
      navigate('/library')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.card}>
          <div style={s.header}>
            <FaSpotify style={s.icon} />
            <h1 style={s.title}>Join Spotify Clone</h1>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.group}>
              <label style={s.label}>Full Name</label>
              <input 
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                style={s.input}
                required
              />
            </div>

            <div style={s.group}>
              <label style={s.label}>Email</label>
              <input 
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                style={s.input}
                required
              />
            </div>

            <div style={s.group}>
              <label style={s.label}>Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={s.input}
                required
              />
            </div>

            <div style={s.group}>
              <label style={s.label}>Account Type</label>
              <select 
                value={form.role} 
                onChange={e => setForm({...form, role: e.target.value})} 
                style={s.select}
              >
                <option value="user">👤 Listener</option>
                <option value="artist">🎤 Artist</option>
              </select>
            </div>

            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={s.divider} />

          <Link to="/login" style={{textDecoration:'none'}}>
            <button style={s.btnSecondary}>Already have an account?</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1DB954 0%, #0f0f0f 100%)',
  },
  container: {
    width: '100%',
    maxWidth: '450px',
    padding: '20px',
  },
  card: {
    background: '#191414',
    borderRadius: '14px',
    padding: '40px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  icon: {
    fontSize: '48px',
    color: '#1DB954',
    marginBottom: '10px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '10px 0 0 0',
    color: '#fff',
  },
  form: {
    marginBottom: '20px',
  },
  group: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#b3b3b3',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #404040',
    background: '#282828',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #404040',
    background: '#282828',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '12px',
    borderRadius: '24px',
    border: 'none',
    background: '#1DB954',
    color: '#000',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
  },
  divider: {
    height: '1px',
    background: '#404040',
    margin: '16px 0',
  },
  btnSecondary: {
    width: '100%',
    padding: '12px',
    borderRadius: '24px',
    border: '1px solid #404040',
    background: 'transparent',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}
