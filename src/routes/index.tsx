import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Clients } from '@pages/layouts'
import Products from '@src/pages/layouts/Products'
import Orders from '@src/pages/layouts/Orders'
import Stock from '@src/pages/layouts/Stock'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Orders />
    },
    {
        path: '/clients',
        element: <Clients />
    },
    {
        path: '/products',
        element: <Products />
    },
    {
        path: '/orders',
        element: <Orders />
    },
    {
        path: '/stock',
        element: <Stock />
    },
])

export default function Router () {
    return <RouterProvider router={router} />
}