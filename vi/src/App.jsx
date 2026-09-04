import { Route, Routes } from 'react-router-dom';
import { Layout, NotFound, routes } from './routes';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((r) => (
          <Route key={r.path} index={r.path === '/'} path={r.path === '/' ? undefined : r.path} element={r.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
