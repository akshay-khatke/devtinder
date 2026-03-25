import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios';
import { setFeedData } from '../store/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from '../components/UserCard';
import ProfileCard from '../components/ProfileCard';
import SideBar from '../components/SideBar';
import no_data from '../assets/images/nodata.jpg'
function Feed() {
    const dispatch = useDispatch()
    const feedData = useSelector((state) => state.feed.feedData)

    useEffect(() => {
        getFeedData()
    }, [])


    const getFeedData = async () => {

        console.log("feed data 1")

        try {
            const response = await axios.get(BASE_URL + "/user/feed", { withCredentials: true })
            console.log("feed data 2")
            dispatch(setFeedData(response.data.data))
            console.log("feed data 3")
        } catch (error) {
            console.log(error);
        }




    }

    if (feedData.length <= 0) {
        return <div className='text-center justify-center items-center py-10'>
            <div className='flex justify-center items-center'>
                <img src={no_data} className='w-40 h-40' alt="" />
            </div>
            <p className='text-2xl font-bold py-5'>No Users found</p>
        </div>
    }
    return (
        <div className='flex justify-center'>
            {feedData && <UserCard user={feedData[0]} />}
            {/* <SideBar /> */}
            {/* <ProfileCard /> */}
        </div>
    )
}

export default Feed