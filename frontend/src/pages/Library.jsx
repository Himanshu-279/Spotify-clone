import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSpotify, FaPlay, FaDownload, FaTrash, FaMusic, FaPause, FaVolumeMute } from 'react-icons/fa'
import API from '../api'
import toast from 'react-hot-toast'

export default function Library() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchSongs = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/songs')
      setSongs(data.songs)
    } catch {
      toast.error('Failed to load songs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSongs() }, [])

  // Audio playback effect
  useEffect(() => {
    if (!audioRef.current) return
    
    if (currentSong && isPlaying) {
      audioRef.current.src = `http://localhost:5001${currentSong.fileUrl}`
      audioRef.current.play().catch(() => {
        toast.error('Could not play audio')
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
    
    return () => audioRef.current?.pause()
  }, [currentSong, isPlaying])

  // Audio metadata and time update handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handlePlay = async (song) => {
    try {
      if (currentSong?._id === song._id) {
        // Toggle play/pause if same song
        if (isPlaying) {
          audioRef.current?.pause()
          setIsPlaying(false)
        } else {
          audioRef.current?.play()
          setIsPlaying(true)
        }
      } else {
        // Play new song
        setCurrentSong(song)
        setIsPlaying(true)
        // Increment play count
        await API.post(`/songs/${song._id}/play`)
      }
    } catch {
      toast.error('Failed to play')
    }
  }

  const handleDownload = async (id) => {
    try {
      await API.post(`/songs/${id}/download`)
      toast.success('Downloaded! 📥')
    } catch {
      toast.error('Failed to download')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this song?')) return
    try {
      await API.delete(`/songs/${id}`)
      toast.success('Song deleted!')
      fetchSongs()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const filteredSongs = filter === 'all' 
    ? songs 
    : songs.filter(s => s.artist._id === user.id)

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          <FaSpotify style={{fontSize: '32px', marginRight: '10px'}} />
          <span>Spotify Clone</span>
        </div>

        <nav style={s.nav}>
          <Link to="/library" style={{textDecoration: 'none'}}>
            <div style={s.navItem}>🏠 Library</div>
          </Link>
          {user.role === 'artist' && (
            <Link to="/upload" style={{textDecoration: 'none'}}>
              <div style={s.navItem}>➕ Upload</div>
            </Link>
          )}
        </nav>

        <div style={s.userWidget}>
          <div style={s.userAvatar}>{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p style={s.userName}>{user.name}</p>
            <p style={s.userRole}>{user.role === 'artist' ? '🎤 Artist' : '👤 Listener'}</p>
          </div>
          <button onClick={logout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.title}>Your Music Library</h1>
          <div style={s.filters}>
            <button 
              onClick={() => setFilter('all')}
              style={{...s.filterBtn, opacity: filter === 'all' ? 1 : 0.6}}
            >
              All Songs
            </button>
            {user.role === 'artist' && (
              <button 
                onClick={() => setFilter('my')}
                style={{...s.filterBtn, opacity: filter === 'my' ? 1 : 0.6}}
              >
                My Uploads
              </button>
            )}
          </div>
        </div>

        {/* Songs List */}
        {loading ? (
          <div style={s.loading}>Loading songs...</div>
        ) : filteredSongs.length === 0 ? (
          <div style={s.empty}>
            <FaMusic style={{fontSize: '64px', marginBottom: '20px', opacity: 0.5}} />
            <p>No songs found</p>
          </div>
        ) : (
          <div style={s.songsList}>
            {filteredSongs.map((song, idx) => (
              <div key={song._id} style={s.songCard}>
                <div style={s.songInfo}>
                  <span style={s.num}>{idx + 1}</span>
                  <div>
                    <h3 style={s.songTitle}>{song.title}</h3>
                    <p style={s.songArtist}>{song.artist.name}</p>
                    {song.description && <p style={s.songDesc}>{song.description}</p>}
                  </div>
                </div>

                <div style={s.stats}>
                  <span>▶️ {song.plays}</span>
                  <span>📥 {song.downloads}</span>
                </div>

                <div style={s.actions}>
                  <button 
                    onClick={() => handlePlay(song)}
                    style={s.btnPlay}
                    title="Play"
                  >
                    <FaPlay />
                  </button>
                  <button 
                    onClick={() => handleDownload(song._id)}
                    style={s.btnDownload}
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  {song.artist._id === user.id && (
                    <button 
                      onClick={() => handleDelete(song._id)}
                      style={s.btnDelete}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio Player */}
        {currentSong && (
          <div style={s.playerBar}>
            <div style={s.playerInfo}>
              <span style={s.playerTitle}>{currentSong.title}</span>
              <span style={s.playerArtist}>{currentSong.artist.name}</span>
            </div>

            <div style={s.playerControls}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                style={s.playPauseBtn}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <input 
                type="range" 
                min="0" 
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  audioRef.current.currentTime = e.target.value
                  setCurrentTime(e.target.value)
                }}
                style={s.progressBar}
              />
              <span style={s.timeDisplay}>
                {Math.floor(currentTime)}s / {Math.floor(duration)}s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  )
}

const s = {
  page: {
    display: 'flex',
    height: '100vh',
    background: '#0f0f0f',
  },
  sidebar: {
    width: '250px',
    background: '#121212',
    padding: '20px',
    borderRight: '1px solid #282828',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1DB954',
    marginBottom: '30px',
    padding: '10px',
  },
  nav: {
    flex: 1,
  },
  navItem: {
    padding: '12px 10px',
    marginBottom: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#b3b3b3',
    fontSize: '14px',
    fontWeight: '500',
  },
  userWidget: {
    background: '#282828',
    padding: '15px',
    borderRadius: '12px',
    marginTop: 'auto',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#1DB954',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    flexShrink: 0,
  },
  userName: {
    margin: '0',
    fontSize: '12px',
    fontWeight: '600',
  },
  userRole: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#b3b3b3',
  },
  logoutBtn: {
    padding: '4px 8px',
    fontSize: '11px',
    borderRadius: '4px',
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '30px',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    color: '#fff',
  },
  filters: {
    display: 'flex',
    gap: '10px',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #404040',
    background: '#282828',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    color: '#b3b3b3',
    padding: '40px',
  },
  empty: {
    textAlign: 'center',
    color: '#b3b3b3',
    padding: '60px 20px',
  },
  songsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  songCard: {
    background: '#282828',
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  songInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  num: {
    color: '#b3b3b3',
    fontSize: '13px',
    minWidth: '25px',
  },
  songTitle: {
    margin: '0',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  songArtist: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#b3b3b3',
  },
  songDesc: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#878787',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '12px',
    color: '#b3b3b3',
    minWidth: '80px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  btnPlay: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    background: '#1DB954',
    color: '#000',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease',
    fontWeight: '600',
  },
  btnDownload: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #404040',
    background: 'transparent',
    color: '#1DB954',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  btnDelete: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #dc2626',
    background: 'transparent',
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  playerBar: {
    background: '#282828',
    borderTop: '1px solid #404040',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: 'auto',
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '150px',
  },
  playerTitle: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
  },
  playerArtist: {
    color: '#b3b3b3',
    fontSize: '11px',
  },
  playerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  playPauseBtn: {
    background: '#1DB954',
    border: 'none',
    color: '#000',
    padding: '8px 12px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  progressBar: {
    flex: 1,
    height: '6px',
    cursor: 'pointer',
  },
  timeDisplay: {
    color: '#b3b3b3',
    fontSize: '11px',
    minWidth: '80px',
    textAlign: 'right',
  },
}

