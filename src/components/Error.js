import { useNavigate } from "react-router-dom"

export const Error=()=>
{
    const navigate=useNavigate();
    return(
        <div>
            <h1>Oops 🤭Page not Found </h1> 
            <button  onClick={()=>navigate(-1)}   className="btn btn-danger"> Back</button>
        </div>
    )
}