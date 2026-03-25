import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { setConnections } from '../store/connectionSlice'
import { useNavigate } from 'react-router-dom'
import no_data from '../assets/images/nodata.jpg'
function Connections() {

    const userData = useSelector((state) => state.user.userData)
    const connetcion = useSelector((state) => state.connection.connections)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getConnections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
            console.log(response.data.data, 'status check ');
            dispatch(setConnections(response.data.data))
        }
        catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getConnections()
    }, [])

    if (!connetcion) return
    if (connetcion === 0) {
        return <div className='text-center justify-center items-center py-10'>
            <div className='flex justify-center items-center'>
                <img src={no_data} className='w-50 h-50' alt="" />
            </div>
            <p className='text-2xl font-bold py-5'>No Connections found</p>
        </div>
    }
    return (
        <div className='text-center'>
            {/* <h2 className='text-3xl font-bold text-center mt-4'>Connections</h2> */}

            {connetcion?.map((e) => {
                const { firstName, lastName, photoUrl, about, age, gender } = e
                return (

                    <div key={e?._id} className='flex w-[500px] m-4 p-6 border rounded-lg border-base-300 justify-between max-w-md mx-auto' >
                        <div className='w-20 h-20 justify-center items-center rounded-full'>
                            <img src={photoUrl} className='w-20 h-20 object-cover rounded-full' alt="photo" />
                        </div>
                        <div className='flex flex-col text-left ml-4 justify-center   w-[300px] '>
                            <p className='font-bold text-xl'>{firstName + " " + lastName}</p>
                            {/* <p>{age + " " + gender}</p> */}
                            <div className='h-[1px]  bg-gray-200 my-2'></div>
                            <p>{about}</p>
                        </div>
                        <div className='flex justify-center items-center mx-2'>
                            <button onClick={() => navigate(`/chat/${e?._id}`)} className="btn btn-primary bg-[#faa307] text-white p-4">Chat </button>
                        </div>
                    </div>)
            })}
        </div>
    )
}

export default Connections