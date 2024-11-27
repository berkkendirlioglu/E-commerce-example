import ReactDOM from 'react-dom/client'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import { AppRoutes } from './pages'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppRoutes/>
)
