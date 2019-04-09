import request from '../utils/request'

export async function getSysConfig() {
  return request('/api/sysConfig/json');
}

export async function authLogin(params) {
  return request('/api/auth/login', {
    method: 'POST',
    body: {
      ...params
    },
  });
}