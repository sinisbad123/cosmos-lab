/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Campaign from './Campaign';

async function action(params) {
  return {
    chunks: ['login'],
    title: 'Campaign - Cosmos',
    component: <Campaign data={params} />,
  };
}

export default action;
