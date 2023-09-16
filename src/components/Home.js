import { useNavigate } from "react-router-dom";
import { IoMdLogIn } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import image from './Test.png';
import { useEffect, useRef } from "react";


function Home() {
  const navigate = useNavigate();
  const textRef = useRef(null); 
  useEffect(() => {
   
    const colors = [
      '#FF0000', 
      '#FF9900',  
      '#00FF00',  
      '#0000FF',  
      '#9900FF',  
      '#FF0080', 
      '#8000FF',  
      '#BF00FF', 
      '#FF00BF', 
      '#FF00FF', 
      '#FF8000',  
      '#FF4000',  
      '#800000',  
      '#008000',  
      '#000080', 
      '#800080',  
    ];
    
    
    let currentIndex = 0;

    const interval = setInterval(() => {
      textRef.current.style.color = colors[currentIndex];
      currentIndex = (currentIndex + 1) % colors.length;
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexGrow: 1,
        }}
      >
        <marquee behavior='alternate' direction="left"scrollamount="15" >
      <h1 ref={textRef}
        style={{ display: 'inline-block',  border: '3px double black',  fontSize: '2rem',  borderRadius: '20px',  backgroundColor: 'yellow',paddingLeft:'20px',paddingRight:'20px'}}>
         Covid Diagnostics 
      </h1>
     </marquee> 


        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                <h2 className="text-center mb-4">
                  Welcome to our COVID Test and Result Management System!
                </h2>
                <p style={{ color: "beige" }}>
                  Harnessing the power of skillful nurses and cutting-edge technology, we bring you a revolutionary solution for COVID testing.
                  Our advanced devices and qualified nurses ensure faster, 100% accurate, and correct results.
                  Experience the future of COVID testing with us and stay one step ahead in the fight against the pandemic.
                </p>
                <br />
                
                <button
                  type="submit"
                  onClick={() => navigate('log')}
                  className="btn btn-primary d-block mx-auto"
                >
                  Login <IoMdLogIn />
                </button>
              </div>

              <center>
                <br /> <br /><br />
                <h5>For Admin only</h5>
                <button type="submit" style={{ textAlign: "right" }} className="btn btn-info" onClick={() => navigate('Login')}>
                  Admin <RiAdminFill />
                </button>
              </center>
            </div>
          </div>
        </div>
        <br />  <br />
        <br />  <br />
      </div>
      <footer
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px 0',
          marginBottom: '2px'
        }}
      >
        <div className="container">
          <p>
            Address: Covid Diagnostics , Doctors Colony, Kukatpally, Hyderabad, India - 500072 ||
            For any queries, please contact us at <a href="mailto:addadasurya@gmail.com">suryaaddada@gmail.com</a> ||
            &copy; 2023 Surya Diagnostics. All rights reserved. | Trademarks &#8482;
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
