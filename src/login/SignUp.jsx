import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSignUp = async () => {

        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                emailId,
                password, firstName, lastName
            }, { withCredentials: true })

            if (response.status === 200) {
                dispatch(setUserData(response.data))
                navigate("/feed")
            }

        }
        catch (error) {
            setErrorMsg(error?.response?.data || "Something went wrong")
            console.log(error);
        }

    }
    return (
        <div className='flex justify-center my-10'><div className="card bg-base-200 w-96 shadow-sm">

            <div className="card-body">
                <h2 className="card-title justify-center">Sign Up</h2>
                <div className='p-2'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend my-2">First Name</legend>
                        <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" className="input" placeholder="" />
                    </fieldset>
                </div>
                <div className='p-2'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend my-2">Last Name</legend>
                        <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" className="input" placeholder="" />
                    </fieldset>
                </div>
                <div className='p-2'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend my-2">Email id</legend>
                        <input onChange={(e) => setEmailId(e.target.value)} value={emailId} type="email" className="input" placeholder="" />
                    </fieldset>
                </div>
                <div className='p-4'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend my-2">Password</legend>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="input" placeholder="" />
                    </fieldset>
                </div>

                <p className='text-red-500'>{errorMsg}</p>
                <div className="card-actions justify-center">
                    <button onClick={onSignUp} className="btn btn-primary bg-primary p-2 text-white">Login</button>
                </div>
            </div>
        </div></div>
    )
}

export default SignUp