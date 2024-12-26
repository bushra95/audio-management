import { createRoute, createRootRoute, createRouter } from '@tanstack/react-router';
import { Login } from './pages/Login';
import { TranscriptionList } from './components/TranscriptionList';
import { Layout } from './components/Layout';

const rootRoute = createRootRoute({
  component: () => {
    console.log('Root component rendering');
    return <Layout />;
  }
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    console.log('Login route rendering');
    return <Login />;
  }
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    console.log('Index route rendering');
    return <TranscriptionList />;
  }
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