const PARAM_REGEXP = /(\/:\w+)/;
const EXT_REGEXP = /\.\w+$/;

export const isObject = (obj: any) => ({}.toString.call(obj) === '[object Object]');

export const isObjectLike = (obj: any) => obj && !Array.isArray(obj) && typeof obj === 'object';

export const isString = (obj: any): boolean => typeof obj === 'string';

/**
 * @function 格式化url
 * @param {string} url 请求url  /api /api/:id
 * @param {object} data 请求参数
 * @returns {string}
 */
export const formatURL = (url: string, data: object): string => {
  let newUrl = '';

  // 匹配动态参数
  if (PARAM_REGEXP.test(url)) {
    url.split(PARAM_REGEXP).forEach((path) => {
      if (path.startsWith('/:')) {
        const key = path.substr(2);
        newUrl += data[key] !== undefined ? `/${data[key]}` : '/';
        // eslint-disable-next-line no-param-reassign
        delete data[key];
      } else {
        newUrl += path;
      }
    });
  } else {
    newUrl = url;
  }

  return newUrl;
};

/**
 * @function 组合url
 * @param {string} url 请求url
 * @param {string} extension 扩展符号, .do do .php php
 * @param {boolean} cache 是否缓存，设置为false将会添加"?_=时间戳"参数
 */
export const combineURL = (url: string, extension?: string, cache?: boolean): string => {
  const paramStart = url.indexOf('?');
  const hasParam = paramStart !== -1;
  let path = hasParam ? url.substr(0, paramStart) : url;
  let search = hasParam ? url.substr(paramStart) : '';

  if (extension && isString(extension) && !EXT_REGEXP.test(path)) {
    path += extension.startsWith('.') ? extension : `.${extension}`;
  }

  if (cache === false) {
    search += `${search ? '&' : '?'}_=${new Date().getTime()}`;
  }

  return path + search;
};
