import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const location = useLocation()
    const { userData, isLoaded } = useSelector((state) => state.user)

    // Wait until login status is checked
    if (!isLoaded) {
        return null // Or <LoadingSpinner />
    }

    if (userData === null) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return children
}
export default ProtectedRoute