import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Clients } from '@src/pages';
import Products from '@src/pages/Products';
import Orders from '@src/pages/Orders';
import Stock from '@src/pages/Stock';
import Puissances from '@src/pages/Puissance';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Products />,
    },
    {
      path: '/clients',
      element: <Clients />,
    },
    {
      path: '/général',
      element: <Products />,
    },
    {
      path: '/commandes',
      element: <Orders />,
    },
    {
      path: '/stock',
      element: <Stock />,
    },
    {
      path: '/puissances',
      element: <Puissances />,
    },
    {
      path: '*',
      element: <Products />
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
