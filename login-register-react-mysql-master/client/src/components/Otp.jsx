// import React from 'react';
// import { connect } from 'react-redux'
//  class Otp extends React.Component {
//   constructor(props) {
   
//     super(props);
//     this.state = {
//       otp: ''
//     };
//   }
//   login(otp) {
  
//     if (otp) {
//       const { email, password } = this.props; 
//       console.log(otp,email,password,"otp")
      
    
//       const payload = {
//         email: "richagshah11@gmail.com",
//         password: "Sarita@70"
//       }
//       console.log(payload,"payload")
//       const options = {
//         headers: {
//           ['x-otp']: otp,
//           'Accept': 'application/json',
//         'Content-Type': 'application/json'
//         },
//         method:"post",
//         body:JSON.stringify(payload)
//       }
//       fetch('http://localhost:5000/api/auth/', options)
//         .then(async (response) => {
//           // let result = await response.json();
//           // console.log(result);
//           console.log(response,"response  after otp")
//           if (response.status === 200) {
//             // window.localStorage.clear();
//             alert(`coorect`);
//             localStorage.setItem("loggedin",true)
//             window.localStorage.loggedin = true;
//             window.location = "/";
//           }
//           else{
//             alert(`Invalid otp`);
//           }
//         })
//         .catch(err => {
//           console.log("Invalid creds",err);
//         });
//     }
//   }
//   render() {
//     return (
//       <div className="col-md-4 col-md-offset-4">
      
//           <div className="form-group">
//             <label htmlFor="otp">Enter Otp:</label>
//             <input
//               onChange={(e) => this.setState({otp: e.target.value})}
//               type="otp"
//               className="form-control"
//               id="otp"/>
//           </div>
//           <button onClick={() => this.login(this.state.otp)} className="btn btn-default">Submit</button>
        
//       </div>
//     )
//   }
// }

// const mapStateToProps = state => ({
//   email: state.auth.email, // Retrieve email from Redux store
//   password: state.auth.password // Retrieve password from Redux store
// });

// export default connect(mapStateToProps)(Otp);

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const state = useSelector(state => state.auth);
  console.log(state,"state")

  const login = (otp) => {
    let email=localStorage.getItem("email")
    let password=localStorage.getItem("password")
    if (otp ) {
      const payload = {
        email: email,
        password: password
      };

      const options = {
        headers: {
          ['x-otp']: otp,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(payload)
      };

      fetch('http://localhost:5000/api/auth/', options)
        .then(async (response) => {
          console.log(response, "response after otp");
          if (response.status === 200) {
            alert(`Correct`);
            localStorage.setItem("loggedin", true);
            window.localStorage.loggedin = true;
            window.location = "/";
          } else {
            alert(`Invalid otp`);
          }
        })
        .catch(err => {
          console.log("Invalid creds", err);
        });
    }
  };

  return (
    <div className="col-md-4 col-md-offset-4">
      <div className="form-group">
        <label htmlFor="otp">Enter Otp:</label>
        <input
          onChange={(e) => setOtp(e.target.value)}
          type="otp"
          className="form-control"
          id="otp"
        />
      </div>
      <button onClick={() => login(otp)} className="btn btn-default">
        Submit
      </button>
    </div>
  );
};

export default Otp;
