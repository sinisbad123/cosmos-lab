/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/contact',
      load: () => import(/* webpackChunkName: 'contact' */ './contact'),
    },
    {
      path: '/login',
      load: params => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/feed',
      load: () => import(/* webpackChunkName: 'login' */ './feed'),
    },
    {
      path: '/issues',
      load: () => import(/* webpackChunkName: 'login' */ './issues'),
    },
    {
      path: '/issues/:id',
      load: params => import(/* webpackChunkName: 'login' */ './issues/issue'),
    },
    {
      path: '/about',
      load: () => import(/* webpackChunkName: 'about' */ './about'),
    },
    {
      path: '/privacy',
      load: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
    },
    {
      path: '/admin',
      load: () => import(/* webpackChunkName: 'admin' */ './admin'),
    },
    {
      path: '/profile/:id',
      load: params => import(/* webpackChunkName: 'admin' */ './profile'),
    },
    {
      path: '/campaign/create',
      load: () => import(/* webpackChunkName: 'admin' */ './campaign/create'),
    },
    {
      path: '/wallet',
      load: () => import(/* webpackChunkName: 'admin' */ './wallet'),
    },
    {
      path: '/campaign/:id',
      load: params => import(/* webpackChunkName: 'admin' */ './campaign'),
    },

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '*',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
