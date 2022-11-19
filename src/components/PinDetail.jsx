import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }) => {
  const [pins, setpins] = useState(null);
  const [pinDetail, setpinDetail] = useState(null);
  const [comment, setcomment] = useState('');
  const [addingComment, setaddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(`${query}`)
        .then((data) => {
          setpinDetail(data[0]);

          if (data[0]) {
           const query1 = pinDetailMorePinQuery(data[0]);

            client.fetch(query1)
              .then((res) => { setpins(res);});
          }
        })
    }
  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setaddingComment(true)
      client.patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setcomment('');
          setaddingComment(false)
        })
    }
  }




  if (!pinDetail) return <Spinner message="Loading pin." />
  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start '>
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt="pin-pic"
            className='rounded-3xl'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-center'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none flex items-center justify-center">
                <MdDownloadForOffline />
              </a>

            </div>
            <a href={pinDetail.destination} target="_black" rel='noreferrer'>
              {pinDetail.destination}
            </a>

          </div>
          <div>
            <h1 className='text-4xl font-bold mt-3 break-words'>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>
              {pinDetail.about}
            </p>
          </div>
          <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 bg-white rounded-lg items-center">
            <img className='w-8 h-8 rounded-full object-cover'
              src={pinDetail.postedBy?.image}
              alt="user"
            />
            <p className='font-semibold capitalize'>{pinDetail.postedBy?.userName}</p>
          </Link>
          <h2 className='mt-5 text-2xl'>
            Comments
          </h2>
          <div className='max-h-2xl overflow-y-auto'>
            {pinDetail?.comments?.map((comment, i) => (
              <div className='flex mt-5 items-center rounded-lg gap-2' key={i}>
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className='felx flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="">
              <img className=' w-8 h-8 rounded-full cursor-pointer'
                src={user?.image}
                alt="user"
              />

            </Link>
            <input
              className='flex-1 px-2 border-gray-100 outline-none rounded-2xl border-2 focus:border-gray-300'
              type="text"
              value={comment}
              placeholder="Add a comment"
              onChange={(e) => setcomment(e.target.value)}
            />
            <button className='bg-red-500 text-white px-6 py-2 font-semibold rounded-full text-base outline-none'
              type='button'
              onClick={addComment}>
              {addingComment ? 'Posting ...' : 'Post'}
            </button>
          </div>

        </div>

      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )
        : (
          <Spinner message="Loading more pins..." />
        )
      }
    </>
  )
}

export default PinDetail