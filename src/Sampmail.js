import { useRef, useState } from "react";
import emailjs from '@emailjs/browser';


export const  Sampmail=()=>{

    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const form=useRef();

    const handleSubmit=(e)=>{
        	
        console.log("handleSubmit called");
        console.log(email);
        console.log(password);
        const data={email,password}
        emailjs.send('service_kgdkm5l', 'template_pzl1dc6',data, '_oI62Ocw8yoznLvJR')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };
    return(
        <>
       
            <input type="email" value={email}  onChange={(e)=>setEmail(e.target.value)}  placeholder="Enter an Email"></input>
            <input type="password"  value={password} name="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password"></input>
            <button type="button" onClick={handleSubmit}>Submit</button>
       
        </>
    )
}

