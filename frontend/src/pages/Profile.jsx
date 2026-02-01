import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserConfigs, deleteConfig } from '../services/api';
import './Profile.css';

const QUOTES = [
  'Prove them wrong…',
  '99% of men survive. Become the 1% who truly live.',
  'Porsche 911 is not advertised on TV or video games — those who can afford it don\'t watch them.',
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadConfigs = () => {
    if (user) {
      getUserConfigs()
        .then(setConfigs)
        .catch((err) => setError(err.message || 'Failed to load'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      loadConfigs();
    }
  }, [user]);

  const handleDoubleClick = (config) => {
    navigate('/configurator', {
      state: {
        editConfig: {
          id: config.id,
          modelId: config.modelId,
          colorId: config.configurationData?.colorId,
          wheelId: config.configurationData?.wheelId,
          interiorId: config.configurationData?.interiorId,
        },
      },
    });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id) return;
    setDeletingId(id);
    try {
      await deleteConfig(id);
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="profile-page">
      <section className="section">
        <div className="container">
          <h1 className="page-title">Profile</h1>
          <p className="profile-email">Signed in as {user.nickname} &lt;{user.email}&gt;</p>
          <Link to="/configurator" className="btn-primary profile-cta">New configuration</Link>

          <h2 className="saved-title">Saved configurations</h2>
          {loading && <p className="profile-muted">Loading…</p>}
          {error && <p className="profile-error">{error}</p>}
          {!loading && !error && configs.length === 0 && (
            <p className="profile-muted">No saved configurations yet.</p>
          )}
          {!loading && !error && configs.length > 0 && (
            <ul className="config-list">
              {configs.map((c, index) => (
                <li key={c.id} className="config-card">
                  {QUOTES[index] && <p className="config-quote">{QUOTES[index]}</p>}
                  <div
                    className="config-card-inner"
                    onDoubleClick={() => handleDoubleClick(c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDoubleClick(c)}
                    aria-label={`Edit ${c.modelName} configuration`}
                  >
                    <div className="config-card-image">
                      <img src={c.previewImage} alt={c.modelName} />
                    </div>
                    <div className="config-card-body">
                      <span className="config-card-name">{c.modelName}</span>
                      <span className="config-card-price">${c.totalPrice?.toLocaleString() ?? 0}</span>
                    </div>
                    <button
                      type="button"
                      className="config-card-delete"
                      onClick={(e) => handleDelete(e, c.id)}
                      disabled={deletingId === c.id}
                      aria-label="Delete configuration"
                    >
                      {deletingId === c.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
