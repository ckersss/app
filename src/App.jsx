import React from 'react'
import { Routes, Route,Navigate } from 'react-router-dom'
import routes from './config/routers'
import Yltest from './pages/Yltest'


export default function App() {
  return (
    <div> 
      <Yltest name="yl" />
      <Routes>
        {routes.map((routeObj) => {
          return <Route key={routeObj.path} {...routeObj}/>
      })}
      {/* 路由重定向 */}
        <Route path='/' element={<Navigate to='/login'/>} />
      </Routes>      
    </div>
  )
}



//  <Routes>
//       <Route path='/login' element={<Login/>}/>
      // <Route path='/user' element={<User/>}/>    
//         </Routes> 