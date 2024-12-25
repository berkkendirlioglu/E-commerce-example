import ReactDOM from 'react-dom/client'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Homepage, Contact, SSS, About, Login,Register, ErrorPage, ForgetPassword, FetchProductDetail, ProductDetail, fetchAllProducts, Products, MyAccount, Payment,} from './routes/index.ts';
import Root from './components/Root.tsx'

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
            element:<ForgetPassword/>,
          },
          
        ]
    }
  ])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
