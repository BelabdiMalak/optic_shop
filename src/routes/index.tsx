import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Clients } from '@src/pages'
import Products from '@src/pages/Products'
import Orders from '@src/pages/Orders'
import Stock from '@src/pages/Stock'

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
        path: '/général',
        element: <Products />
    },
    {
        path: '/commandes',
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