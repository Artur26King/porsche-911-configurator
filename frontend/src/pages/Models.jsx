import { Link } from 'react-router-dom';
import { porscheModels } from '../data/models';
import './Models.css';

export default function Models() {
  return (
    <div className="models-page">
      <section className="section">
        <div className="container">
          <h1 className="page-title">911 models</h1>
          <p className="page-intro">Choose your dream. Then work for it.</p>
          <div className="models-grid">
            {porscheModels.map((model) => (
              <article key={model.id} className="model-card">
                <div className="model-card-image">
                  {model.image && (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="model-card-img"
                    />
                  )}
                </div>
                <div className="model-card-body">
                  <h2 className="model-name">{model.name}</h2>
                  <p className="model-tagline">{model.tagline}</p>
                  <p className="model-price">From ${model.basePrice.toLocaleString()}</p>
                  <Link to="/configurator" state={{ modelId: model.id }} className="model-link">
                    Configure
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
