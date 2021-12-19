import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../../components/home/home';
import Redirect from '../../components/redirect/redirect';

/* eslint-disable-next-line */
export interface AppRouterProps {}

export function AppRouter(props: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
