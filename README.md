### 创建项目

> 项目以 umi4 模板 外加 easyya 部分配置

```bash
ezt init
```

部分配置

```ts
import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'pnpm',
  title: '易芽',
  proxy: {
    '/api': {
      target: 'https://devapi.easyya.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  dva: {},
  plugins: ['@umijs/plugins/dist/dva'],
  fastRefresh: true,
});
```

### 创建代码页面

> 创建 pages/about/index.tsx 文件:默认 hooks

```bash
ezt p about
```

### api 默认读取 easyya swagger 所有微服务项目
