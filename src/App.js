import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import {Error} from './components/Error';
import AdminLogin from './components/AdminLogin';
import Test from './components/Test'; 
import Test2 from './components/Test2';

import LoginForm from './components/LoginForm';
import { Register } from './components/Register';
import { Admin } from './components/AdminPage';
import { AdminHeader } from './components/AdminHeader';

//import {GetPatient} from './components/Patient';
import {Apple} from './components/Apple';
import {GetPatient}  from './components/GetPatient';
import { PatientPage } from './components/PatientPage';
import { EditPatient } from './components/EditPatient';
import { ChangePassword } from './components/ChangePassword';
import { NursePage } from './components/NursePage';
import { GetNurse } from './components/GetNurse';
import { ChangeNursePassword } from './components/ChangeNursePassword';
import { EditNurse } from './components/EditNurse';
import { NurseEdit } from './components/NurseEdit';
import { TestPatient } from './components/TestPatient';
import { GetAdmin } from './components/GetAdmin';
import { EditAdmin } from './components/EditAdmin';
import { ChangeAdminPassword } from './components/ChangeAdminPassword';
import { ActivePatients } from './components/ActivePatients';
import { ActiveNurses } from './components/ActiveNurses';
import { Device } from './components/Device';
import { AddDevice } from './components/AddDevice';
import { Assignment } from './components/Assignment';
import { AdminRegister } from './components/AdminRegister';
import NurseRegister from './components/NurseRegister';
import { Sampmail } from './Sampmail';
import SampNurse from './components/SampNurse';


function App() {
  return (
    <div >
      <Routes>
        <Route path="apple" element={<Apple/>}/>
        <Route path='samp' element={<Sampmail/>}/> 
        <Route path="sampnurse" element={<SampNurse/>}/>

       <Route path="testing" element={<Test/>} />
      <Route path="tes" element={<Test2/>}></Route>

      {/* done */}
      <Route path="/" element={<Home />}></Route> 
      <Route path='register' element={<Register/>} />


        <Route path='Login' element={<AdminLogin />} >
               <Route path="adminregister" element={<AdminRegister/>}/>

              <Route path='adminheader' element={<AdminHeader/>}/>
        </Route>
        <Route path="/adminregister" element={<AdminRegister/>}/>



         <Route path='/adminpage' element={<Admin/>}>
           
          
                <Route path="getpatient"  element={<Apple/>}/> {/* !  */}
                <Route path="getAdmin" element={<GetAdmin/>}/>
                <Route path="editadmin" element={<EditAdmin/>}/>
                <Route path="passchangeadmin" element={<ChangeAdminPassword/>}/>
                <Route path="actpatient" element={<ActivePatients/>}/>
                <Route path="actnurse" element={<ActiveNurses/>}/>
                <Route path="device" element={<Device/>}/>
                <Route path="addDevice" element={<AddDevice/>}/>
               <Route path="assign" element={<Assignment/>}/>
               <Route path="nurseRegister" element={<NurseRegister/>} />
          
        </Route> 

        
       
      


     
       <Route path='log' element={<LoginForm/>}>
                        <Route path="patientpage"  element={<PatientPage/>}>  
                                      <Route index element={<GetPatient/>}/> 
                                      <Route path='patient' element={<GetPatient/>}/> 
                                      
                                      <Route path='editpatient' element={<EditPatient/>}/>
                                      <Route path="passchpat" element={<ChangePassword/>}/>
                         </Route>
                         <Route path="nursepage" element={<NursePage/>}>
                                      <Route index  element={<GetNurse/>}/>
                                      <Route path="nurse" element={<GetNurse/>}/>
                                      <Route path="editpatient" element={<NurseEdit/>}/>
                                      
                                      <Route path="test" element={<TestPatient/>}></Route>

                                     
                                      <Route path="editnurse" element={<EditNurse/>}/>
                                      <Route path="passchangenurse" element={<ChangeNursePassword/>}/>

                         </Route>
        </Route> 
        
       <Route path="*" element={<Error />}></Route>
      </Routes> 
     
    </div>
  );
}

export default App;
