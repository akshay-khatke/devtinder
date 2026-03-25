import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants';
import { removeUserFromFeed } from '../store/feedSlice';
import { useDispatch } from 'react-redux';

function UserCard({ user }) {
    const { _id, firstName, lastName, photoUrl, about, age, gender } = user

    const dispatch = useDispatch()
    const sendRequest = async (id, status) => {
        try {
            const response = await axios.post(`${BASE_URL}/request/send/${status}/${id}`, {}, { withCredentials: true })
            console.log(response.data.data, 'request sent');
            dispatch(removeUserFromFeed(id))
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div><div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src={photoUrl}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{firstName} {lastName}</h2>
                <div className='flex'> <p>{age} , {gender}</p></div>
                <p>{about}</p>

                <div className="card-actions justify-center my-4">
                    <button onClick={() => sendRequest(_id, "interested")} className="btn btn-primary text-white bg-primary p-4">Interested</button>
                    <button onClick={() => sendRequest(_id, "ignored")} className="btn btn-secondary text-white bg-secondary p-4">Ignored</button>
                </div>
            </div>
        </div></div>
    )
}

export default UserCard
