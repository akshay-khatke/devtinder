import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

function Profile() {
    const userData = useSelector((state) => state.user.userData)
    return userData && (
        <div>
            <EditProfile user={userData} />
        </div>
    )
}

export default Profile