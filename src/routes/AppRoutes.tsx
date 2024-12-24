import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Homepage, Root, Contact, SSS, About, Login,Register, ForgotPassword, FetchProductDetail, ProductDetail, fetchAllProducts, Products, MyAccount, Payment,} from '../pages/index.ts';
import ErrorPage from '../pages/ErrorPage/ErrorPage.tsx';

const router = createBrowserRouter([
    {
        path:"/",
        errorElement:<ErrorPage/>,
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
            element:<MyAccount/>
          },
          {
            path:"/account/login",
            element:<Login/>,
          },
          {
            path:"/account/register",
            element:<Register/>
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
