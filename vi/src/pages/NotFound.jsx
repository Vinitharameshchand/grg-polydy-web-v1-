import { Link } from 'react-router-dom';
import { Arrow, Section } from '../components/ui';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found — GRG Polydynamics');

  return (
    <Section>
      <div className="cols">
        <span className="label">404</span>
        <div className="stack">
          <h1 className="h1">That page does not exist.</h1>
          <p className="lead">The link may be out of date, or the page may have moved.</p>
          <Link className="link" to="/">
            Back to the home page
            <Arrow />
          </Link>
        </div>
      </div>
    </Section>
  );
}
