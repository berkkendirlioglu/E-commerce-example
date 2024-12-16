import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Homepage, Root, Contact, SSS, About, Login,Register, ForgotPassword, FetchProductDetail, ProductDetail, fetchAllProducts, Products, MyAccount, Payment,} from '../pages/index.ts';
import { getAccessToken } from '../services/storage.ts';

const access_token = getAccessToken();

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
            element:access_token ? <MyAccount/> : <Homepage/>
          },
          {
            path:"/account/login",
            element:!access_token ? <Login/> : <MyAccount/>,
          },
          {
            path:"/account/register",
            element:!access_token ? <Register/> : <Homepage/>,
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
