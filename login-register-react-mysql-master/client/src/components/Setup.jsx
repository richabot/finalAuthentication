// import React from 'react';

// export default class Setup extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state={
//       twofactor:{}
//     }
//   }
//   componentDidMount() {
//     fetch('http://localhost:5000/api/auth/twofactor/authenticated')
//       .then(response => response.json())
//       .then(data => {
//         this.setState(prevState => ({
//           twofactor: {
//             ...prevState.twofactor,
//             authenticated: data.authenticated
//           }
//         }));
//       })
//       .catch(err => {
//         if (err.status === 401) {
//           this.props.history.push('/');
//         }
//       });
//   }
//   setup() {
//     fetch('http://localhost:5000/api/auth/twofactor/setup', {method: "post"}).then( async response => {
//       const result = await  response.json();
//       if (response.status === 200) {
//         console.log(result,"result in setup()");
//         this.setState({twofactor:result})
//       }
//     });
//   }
//   /** Verify the otp once to enable 2fa*/
//   confirm(otp) {
//     const body = {
//       token: otp
//     }
//     fetch('http://localhost:5000/api/auth/twofactor/verify', {
//         method: "post",
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body:JSON.stringify(body)
//       })
//       .then(response => {
//       const result = response.body;
//       console.log(result,"result god")
//       if (response.status === 200) {
//         this.state.twofactor.secret = this.state.twofactor.tempSecret;
//         this.state.twofactor.tempSecret = "";


//       }
//       console.log(response,"response in setup")
//     })
//       .catch(err => alert('invalid otp'));
//   }
//   /** disable 2fa */
//   disable() {
//     fetch('http://localhost:5000/api/auth/twofactor/setup', {method: "delete"}).then(response => {
//       const result = response.body;
//       console.log(result,"god disble")
//       console.log(response);
//       if (response.status === 200) {
//         this
//           .props
//           .history
//           .push('/');
//       }
//     }).catch(err => alert('error occured'));
//   }
//   created() {
//     fetch('http://localhost:5000/api/auth/twofactor/setup', {method: "post"})
//       .then(response => {
//       const result = response.body;
//       console.log(result,"god 1")
//       if (response.status === 200 && !!result.secret) {
//         this.state.twofactor = result
//       }
//     })
//       .catch((err) => {
//         if (err.status === 401) {
//           this
//             .props
//             .history
//             .push('/');
//         }
//       });
//   }
//   render() {
//     return (
//       <div>

//         {console.log("hello",this.state.twofactor)}
//         {this.state.twofactor.secret &&

        
//         <div className="col-md-4 col-md-offset-4">
//           <h3>Current Settings</h3>
//           <img src={this.state.twofactor.dataURL} alt="..." className="img-thumbnail"/>
//           <p>Secret - {this.state.twofactor.tempSecret}</p>
//           <p>Type - TOTP</p>
//         </div>
//         }
//         <div className="col-md-4 col-md-offset-4" v-if="!twofactor.secret">
//           <h3>Setup Otp</h3>
//           <div>
//             <button onClick={() => this.setup()} className="btn btn-default">Enable</button>
//           </div>
//           { this.state.twofactor.tempSecret &&
//           <span>
//             <p>Scan the QR code or enter the secret in Google Authenticator</p>
//             <img src={this.state.twofactor.dataURL} alt="..." className="img-thumbnail"/>
//             <p>Secret - {this.state.twofactor.tempSecret}</p>
//             <p>Type - TOTP</p>
          
//               <div className="form-group">
//                 <label htmlFor="otp">Enter Otp:</label>
//                 <input onChange={(e) => this.setState({otp:e.target.value})} type="otp" className="form-control" id="otp"/>
//               </div>
//               <button onClick={() => this.confirm(this.state.otp)} className="btn btn-default">confirm</button>
          
//           </span>
//           }
//         </div>
       
//        {this.state.twofactor.authenticated === 1 && <div className="col-md-1">
//           <h3>Disable</h3>
//             <button onClick={() => this.disable()} className="btn btn-danger">Disable</button>
          
//         </div>}
//       </div>
//     )
//   }
// }


import React, { useEffect, useState } from 'react';

 function Setup(props) {
  const [twofactor, setTwofactor] = useState({});


  const email = localStorage.getItem("email");
  console.log(email,"richa shah")
  // const setup = () => {
  //   fetch('http://localhost:5000/api/auth/twofactor/setup', { method: "post" })
  //     .then(async response => {
  //       const result = await response.json();
  //       if (response.status === 200) {
  //         console.log(result, "result in setup()");
  //         setTwofactor(result);
  //       }
  //     });
  // }
  const setup = () => {
    const email = localStorage.getItem("email");
    console.log(email,"setup email")
    fetch('http://localhost:5000/api/auth/twofactor/setup', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
      .then(async response => {
        const result = await response.json();
        if (response.status === 200) {
          console.log(result, "result in setup()");
          setTwofactor(result);
        }
      });
  };
  const confirm = (otp) => {
    // const body = {
    //   token: otp
    // }
    const email = localStorage.getItem("email");
    const body = {
      token: otp,
      email: email
    };
    fetch('http://localhost:5000/api/auth/twofactor/verify', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        const result = response.body;
        console.log(result, "result god")
        if (response.status === 200) {
          setTwofactor(prevState => ({
            ...prevState,
            secret: prevState.tempSecret,
            tempSecret: ""
          }));
        }
        console.log(response, "response in setup")
        fetchauthentication()
      })
      .catch(err => alert('invalid otp'));
  }

  const disable = () => {
    const email = localStorage.getItem("email");
    fetch('http://localhost:5000/api/auth/twofactor/setup', { method: "delete",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email }) })
      .then(response => {
        const result = response.body;
        console.log(result, "god disble")
        console.log(response);
        if (response.status === 200) {
          props.history.push('/setup');
        }
        fetchauthentication()
      }).catch(err => alert('error occurred'));
  }

  useEffect(() => {
   fetchauthentication()
  }, []);

  function fetchauthentication(){
    const email = localStorage.getItem("email");
    fetch(`http://localhost:5000/api/auth/twofactor/authenticated?email=${email}`)
    .then(response => response.json())
    .then(data => {
      setTwofactor(prevState => ({
        ...prevState,
        authenticated: data.authenticated
      }));
    })
    .catch(err => {
      if (err.status === 401) {
        props.history.push('/');
      }
    });
  }

  return (
    <div>
      {console.log("hello", twofactor)}
   
     {twofactor.authenticated!==1 &&
      <div className="col-md-4 col-md-offset-4" v-if="!twofactor.secret">
      <h3>Setup Otp</h3>
      <div>
        <button onClick={setup} className="btn btn-default">Enable</button>
      </div>
      {twofactor.tempSecret  &&
        <span>
          <p>Scan the QR code or enter the secret in Google Authenticator</p>
          <img src={twofactor.dataURL} alt="..." className="img-thumbnail" />
          <p>Secret - {twofactor.tempSecret}</p>
          <p>Type - TOTP</p>

          <div className="form-group">
            <label htmlFor="otp">Enter Otp:</label>
            {/* <input onChange={(e) => setTwofactor(prevState => ({ ...prevState, otp: e.target.value }))} type="text" value={twofactor.otp || ''} /> */}

            {/* <input onChange={(e) => setTwofactor(prevState => ({ ...prevState, otp: e.target.value }))} type="text"  /> */}
            <input onChange={(e) => {
const updatedValue = e.target.value;
setTwofactor(prevState => ({ ...prevState, otp: updatedValue }));
}} type="text" value={twofactor.otp || ''} />
          </div>
          <button onClick={() => confirm(twofactor.otp)} className="btn btn-default">confirm</button>

        </span>
      }
    </div>}

      {twofactor.authenticated === 1 && <div className="col-md-1">
        <h3>Disable</h3>
        <button onClick={disable} className="btn btn-danger">Disable</button>

      </div>}
    </div>
  )
}


export default Setup