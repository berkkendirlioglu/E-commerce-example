import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Homepage, Root, Contact, SSS, About, Login,Register, ForgotPassword, FetchProductDetail, ProductDetail, fetchAllProducts, Products, MyAccount, Payment,} from '../pages/index.ts';

const session_id = localStorage.getItem("session_id");

const router = createBrowserRouter([
    {
        path:"/",
        element:<Root/>,
        children:[
          {
            index:true,
            element:<Homepage/>,
          },
          {
            path:"/contact",
            element:<Contact/>
          },
          {
            path:"/SSS",
            element:<SSS/>
          },
          {
            path:"/about",
            element:<About/>
          },
          {
            path:"/payment",
            element:<Payment/>
          },
          {
            path:":mainCategory",
            children:[
              {
                index:true,
                element:<Products/>,
                loader:fetchAllProducts,
              },
              {
                path:":products",
                element:<ProductDetail/>,
                loader:FetchProductDetail,
              }
            ]
          },
          {
            path:"my-account",
            element:session_id ? <MyAccount/> : <Homepage/>
          },
          {
            path:"/account/login",
            element:!session_id ? <Login/> : <MyAccount/>,
          },
          {
            path:"/account/register",
            element:!session_id ? <Register/> : <Homepage/>,
          },
          {
            path:"/account/forgot-password",
            element:<ForgotPassword/>,
          },
          
        ]
    }
  ])

const AppRoutes = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default AppRoutes
