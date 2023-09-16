import { Outlet } from 'react-router-dom';
import {Admin} from './AdminPage';


export const AdminHeader=()=>{
    return(
        <div>
            <Admin/>
            <Outlet/>
        </div>
    )
}