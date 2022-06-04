import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
const Details = lazy(() => import('./details/Details'));
const Update = lazy(() => import('./Update/Update'));
const SearchByTag = lazy(() => import('./searchByTag/SearchByTag'));

const ECommerceAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/mortgage/products',
      element: <Products />,
    },
    {
      path: 'apps/mortgage/details/:detailsName/*',
      element: <Details />,
    },
    {
      path: 'apps/mortgage/products/:productId/*',
      element: <Product />,
    },
    {
      path: 'apps/mortgage/orders',
      element: <Orders />,
    },
    {
      path: 'apps/mortgage/orders/:orderId',
      element: <Order />,
    },
    {
      path: 'apps/mortgage/update',
      element: <Update />,
    },
    {
      path: 'apps/mortgage/searchByTag',
      element: <SearchByTag />,
    },
    {
      path: 'apps/mortgage',
      element: <Navigate to="products" />,
    },
  ],
};

export default ECommerceAppConfig;
