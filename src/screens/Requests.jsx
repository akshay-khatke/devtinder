import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeRequests, setRequests } from '../store/requestSlice';
import no_data from '../assets/images/nodata.jpg'

function Requests() {
    const dispatch = useDispatch()
    const requests = useSelector((state) => state.request.requests)
    const [hideButton, setHideButton] = useState(false)
    const requestRecieved = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/requestReceived`, { withCredentials: true })
            console.log(response.data.data, 'pending requets');
            dispatch(setRequests(response.data.data))
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        requestRecieved()
    }, [])

    const reviewRequest = async (status, id) => {
        // here we have to pass { } as second param because of post
        try {
            const response = await axios.post(`${BASE_URL}/request/review/${status}/${id}`, {}, { withCredentials: true })
            console.log(response.data.data, 'accepted request');
            dispatch(removeRequests(id))
        }
        catch (error) {
            console.log(error);
        }
    }

    if (!requests) return

    if (requests.length === 0) {
        return <div className='text-center justify-center items-center py-10'>
            <div className='flex justify-center items-center'>
                <img src={no_data} className='w-40 h-40' alt="" />
            </div>
            <p className='text-2xl font-bold py-5'>No requests found</p>
        </div>
    }
    return (
        <div className='text-center '>
            {/* <h2 className='text-3xl font-bold text-center mt-4'>Requests</h2> */}

            {requests.map((e) => {
                const { firstName, lastName, photoUrl, about, age, gender } = e.fromUserId
                return <div key={e._id} className='flex justify-between items-center m-4 p-2 border rounded-lg border-base-300 max-w-md mx-auto'>
                    <div className=''>
                        <img src={photoUrl} className='w-20 h-20 rounded-full' alt="photo" />

                    </div>
                    <div className='text-left ml-4 '>
                        <p className='font-bold text-xl'>{firstName + " " + lastName}</p>
                        <p>{age + " " + gender}</p>
                        <p>{about}</p>


                    </div>
                    <div className='flex'>

                        <button onClick={() => reviewRequest("accepted", e._id)} className="btn btn-primary text-white bg-primary mx-2 p-2">Accept</button>
                        <button onClick={() => reviewRequest("rejected", e._id)} className="btn btn-secondary text-white bg-secondary mx-2 p-2">Reject</button>
                    </div>
                </div>
            })}
        </div>
    )
}

export default Requests
