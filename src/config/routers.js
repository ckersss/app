//该文件专门用于统一管理路由
import Login from '../pages/Login'
import User from '../pages/User'

//routes数组中存储着所有的路由配置，每个路由配置都是一个对象
const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/user',
    element: <User />
  }
]

export default routes
