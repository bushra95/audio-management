import { createRootRoute, createRoute, createRouter,  } from '@tanstack/react-router';
import { Login } from './pages/Login';
import { TranscriptionList } from './components/TranscriptionList';
import { Layout } from './components/Layout';
import { Outlet } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  )
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TranscriptionList
});

export const routeTree = rootRoute.addChildren([loginRoute, indexRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 