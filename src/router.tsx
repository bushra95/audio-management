import { createRoute, createRootRoute, createRouter } from '@tanstack/react-router';
import { Login } from './pages/Login';
import { TranscriptionList } from './components/TranscriptionList';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedLayout } from './layouts/ProtectedLayout';

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <AuthLayout>
      <Login />
    </AuthLayout>
  )
});

const transcriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedLayout>
      <TranscriptionList />
    </ProtectedLayout>
  )
});

const routeTree = rootRoute.addChildren([loginRoute, transcriptionsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 