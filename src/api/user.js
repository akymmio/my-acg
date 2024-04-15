import require from '@/utils/require'

//注册请求
export const userRegisterService = ({ username, password, repassword }) => {
  return require.post('/api/reg', { username, password, repassword })
}
