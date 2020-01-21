// ref: https://umijs.org/config/

export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/logger',
          component: '../pages/logger',
        },
        {
          path: '/device',
          component: '../pages/device'
        },
        {
          path: '/env',
          component: '../pages/env'
        },
        {
          path: '/',
          component: '../pages/index',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: '水月洞天',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  // cssLoaderOptions: {
  //   localIdentName: '[local]'
  // }
};
