import { Link, useNavigate } from 'react-router-dom';
import { porscheModels } from '../data/models';
import './Home.css';
import './Models.css';

export default function Home() {
  const navigate = useNavigate();

  const handleModelDoubleClick = (modelId) => {
    navigate('/configurator', { state: { modelId } });
  };

  return (
    <div className="home">
      <section className="hero section" aria-label="Hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <h1 className="hero-title">911</h1>
          <p className="hero-tagline">Dream it. Build it. Drive it.</p>
        </div>
      </section>

      <section className="section motivation">
        <div className="container">
          <h2 className="section-title">Why 911?</h2>
          <p className="motivation-text">
            The Porsche 911 isn&apos;t just a car. It&apos;s the reward for every early morning,
            every late night, every sacrifice. Work for it.
          </p>
        </div>
      </section>

      <section className="section models-section" id="models" aria-label="911 models">
        <div className="container">
          <h1 className="page-title">911 models</h1>
          <p className="page-intro">Choose your dream. Then work for it.</p>
          <div className="models-grid">
            {porscheModels.map((model) => (
              <article
                key={model.id}
                className="model-card"
                onDoubleClick={() => handleModelDoubleClick(model.id)}
                style={{ cursor: 'pointer' }}
              >
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
                  {model.description && (
                    <p className="model-description">{model.description}</p>
                  )}
                  <p className="model-tagline">{model.tagline}</p>
                  {(model.engine || model.acceleration != null || model.horsepower != null) && (
                    <div className="model-specs">
                      {model.engine && (
                        <div className="model-spec-row">
                          <span className="model-spec-label">Engine displacement</span>
                          <span className="model-spec-value">{model.engine}</span>
                        </div>
                      )}
                      {model.acceleration != null && (
                        <div className="model-spec-row">
                          <span className="model-spec-label">0–100 km/h</span>
                          <span className="model-spec-value">{model.acceleration} s</span>
                        </div>
                      )}
                      {model.horsepower != null && (
                        <div className="model-spec-row">
                          <span className="model-spec-label">Horsepower</span>
                          <span className="model-spec-value">{model.horsepower} hp</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="model-price">From ${model.basePrice.toLocaleString()}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container flex flex-col items-center gap-md">
          <h2 className="section-title">Start your journey</h2>
          <div className="flex flex-wrap gap-md justify-center">
            <Link to="/configurator" className="btn-primary">Configurator</Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <p className="home-footer-text">
            This site is not a store; it is purely motivational. Only the Porsche 911 models deemed worthy by the author are showcased here, to inspire bold decisions and the pursuit of success at a young age. For inquiries, please contact: <a href="mailto:porsche911motivation@gmail.com" className="home-footer-link">porsche911motivation@gmail.com</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
