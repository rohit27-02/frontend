import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'


const randomImage = "https://source.unsplash.com/1600x900/?anime"

const UserProfile = () => {
  const [user, setuser] = useState(null);
  const [pins, setpins] = useState(null);
  const [text, settext] = useState('created');
  const [activeBtn, setactiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const activeBtnStyles = "bg-red-500 text-white font-bold p-2 font-bold rounded-full outline-none"
  const notActiveBtnStyles = "bg-primary mr-4  text-black font-bold p-2 font-bold rounded-full outline-none"

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setuser(data[0]);
      })
  }, [userId]);

  useEffect(() => {
    if (text === 'created') {
      const createdPinsQuery = userCreatedPinsQuery(userId)
      console.log(createdPinsQuery)
      client.fetch(createdPinsQuery)
        .then((data) => {setpins(data); console.log(data);})
        

    }
    else {
      const savedPinsQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinsQuery)
        .then((data) => setpins(data))
    }
  }, [text, userId]);

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login')
  }

  if (!user) {
    return <Spinner message="Loading profile..." />
  }
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              alt="banner-pic"
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img
              className='rounded-full w-20 h-20 object-cover shadow-xl -mt-10'
              src={user.image}
              alt="user-pic"
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-0 z-10 right-0 p-2'>
              {userId === user._id && (
                <button onClick={logout} className='bg-white rounded-full p-2 cursor-pointer outline-none shadow-md'>
                  <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}

            </div>
          </div>

          <div className='text-center mb-7'>
            <button
              type="button"
              onClick={(e) => {
                settext(e.target.textContent);
                setactiveBtn('created');
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`} >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                settext(e.target.textContent);
                setactiveBtn('saved');
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`} >
              Saved
            </button>

          </div>

          {pins?.length ? (<div className='px-2 '>
            <MasonryLayout pins={pins} />
          </div>) : (
            <div className='flex justify-center font-bold items-center w-full text-xl'>No pins found !!</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile