import React from 'react'
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import {client} from '../client'
import jwt_decode from "jwt-decode";


const Login = () => {
  const navigate=useNavigate();
  const responseGoogle=(response)=>{
    localStorage.setItem("user",JSON.stringify(response))
    const {name, email, picture,sub} = response
    const doc = {
      _id:sub,
      _type: 'user',
      userName: name,
      email: email,
      image: picture,
    }
    client.createIfNotExists(doc)
    .then(()=>{
navigate('/',{replace:true})
    })
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative h-full w-full'>
        <video 
        src={shareVideo}
        autoPlay
        muted
        loop
        controls={false}
        className="w-full h-full object-cover"
        type="video/mp4"
        />

      </div>
      <div className='flex absolute justify-center top-0 right-0 items-center flex-col left-0 bottom-0 bg-blackOverlay'>
<div className='p-5'>
  <img src={logo} width="130px" alt='logo'/>
</div>
<div className='shadow-2xl'>
<GoogleOAuthProvider
clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
  <GoogleLogin
  onSuccess={credentialResponse => {
    const decoded=jwt_decode(credentialResponse.credential)
    responseGoogle(decoded)
  }}
  onError={() => {
  }}
  useOneTap
/>;
</GoogleOAuthProvider>
  

</div>
      </div>
    </div>
  )
}

export default Login