## 介绍
基于 [axios](https://github.com/axios/axios) 封装的请求库，可以对接口进行集中式管理，方便接口的使用和维护，配合 `mock` 功能在开发阶段便于程序的测试。

## 快速上手

### 安装
#### yarn
```
yarn add simple-axios
```
#### npm
```
npm i --save simple-axios
```
### 使用
```js
import { createServices } from 'simple-axios';

const services = createServices({
  getList: 'GET /path/getList',
  save: 'POST /path/save',
}, {
  getList: {
    data: [{ id: '1' }, { id: '2' }],
    message: 'ok',
  },
  save: ({ content }) => {
    if (content) {
      return {
        data: {},
        message: 'ok',
      }
    }
    return {
      data: {},
      message: 'error',
    }
  },
});

services.getList().then(({ data }) => {
  console.log(data.data); // [{ id: '1' }, { id: '2' }]
});

services.save({ content: '' }).then(({ data }) => {
  console.log(data.message); // error
});
```

## API速查

### createServices
```js
createServices(api: object, mockData?: object);
```
api参数是请求url以及别名的键值对，url以“大写方法名”开头，和请求地址之间空格隔开，默认包含“GET、POST、PUT、DELETE、HEAD、OPTIONS、PATCH”方法，请求地址可以包含动态参数，用“/:x”表示。
```js
const services = createServices({
  getList: 'GET /path',
  save: 'POST /path',
  delete: 'DELETE /path',
  submit: 'POST /path/:id',
});
```
返回值是一个对象，“对象.别名(data?: object, options?: object)”方法可以调用对应的请求，data参数就是需要传递给接口的参数，options参数是axios的配置项，方法返回promise。
```js
services.getList().then(...);
services.save({ name: 'xxx' }).then(...);
```
mockData参数为可选的，是别名和mock对象的键值对，可以在开发环境本地模拟接口数据，生产环境该功能会被禁用，为了防止模拟数据被打包到代码里，最好用process.env.NODE_ENV判断，推荐 [mockjs](http://mockjs.com/) 来进行数据模拟。
```js
createServices({
  getList: '/path',
  save: 'POST /path',
}, process.env.NODE_ENV !== 'production' ? {
  getList: Mock.mock({...})
  // 支持函数，data就是传递的参数，options是axios配置项，2个参数主要用于判断
  save: (data, options) => {
    return Mock.mock({...});
  },
} : null);
```

### createMethod
```js
createMethod(name: string, callback: Funtion);
```
当默认7个方法不满足需求时，用于自定义方法配置，name参数是方法名，callback是一个回调，返回axios调用结果。
```js
createMethod('METHOD', (url, data, options) => {
  return axios({
    url,
    method: 'post',
    data,
    ...options,
  });
});

const services = createServices({
  save: 'METHOD /path',
});

services.save().then(...);
```
通过该方式也可以创建jsonp的请求，这里需要适用第三方包 [axios-jsonp](https://github.com/AdonisLau/axios-jsonp)。
```js
import jsonpAdapter from 'axios-jsonp';

createMethod('JSONP', (url, data, options) => {
  return axios({
    url,
    data,
    ...options,
    adapter: jsonpAdapter,
  });
});
```

### createMock
```js
createMock(mockData: object);
```
全局配置mock，优先级低于通过createServices方法配置的。
```js
if (process.env.NODE_ENV !== 'production') {
  createMock({
    getList: {
      data: [{ id: '1' }, { id: '2' }],
      message: 'ok',
    },
    save: ({ content }) => {
      if (content) {
        return {
          data: {},
          message: 'ok',
        }
      }
      return {
        data: {},
        message: 'error',
      }
    },
  });
}
```

### axiosConfig
```js
axiosConfig(options: object);
```
用于配置axios.defaults属性。
```js
axiosConfig({
  baseURL: '/api',
  headers: {'X-Requested-With': 'XMLHttpRequest'},
});
// 等同
axios.defaults.baseURL = '/api';
axios.defaults.headers = {'X-Requested-With': 'XMLHttpRequest'};
```
除此之外新增了extension、cache、delay三个属性
```js
axiosConfig({
  // 统一给请求地址添加后缀
  extension: '.do',   /api => /api.do
  // 设置为false时，给请求动态添加参数用于清除请求缓存  /api => /api?_=45678898765
  cache: false,
  // mock请求时用于控制请求时间，1000表示1秒响应数据，默认300ms
  delay: 1000,
});
```

### axios
具体参考 [axios](https://github.com/axios/axios) API
