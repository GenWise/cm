import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Videos } from './pages/Videos';
import { AddVideo } from './pages/AddVideo';
import { VideoDetail } from './pages/VideoDetail';
import { Clips } from './pages/Clips';
import { Posts } from './pages/Posts';
import { Ideas } from './pages/Ideas';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'videos', element: <Videos /> },
      { path: 'videos/new', element: <AddVideo /> },
      { path: 'videos/:id', element: <VideoDetail /> },
      { path: 'clips', element: <Clips /> },
      { path: 'posts', element: <Posts /> },
      { path: 'ideas', element: <Ideas /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
