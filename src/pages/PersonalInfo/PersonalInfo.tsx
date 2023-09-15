import { useAuth0 } from '@auth0/auth0-react'
import { userSessionSelector } from '../../state/selectors'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const PersonalInfo = () => {
    const { user } = useAuth0()
    const userSession = useSelector(userSessionSelector);

    return (
        <>
            <h1 className="m-5 mb-10 text-xl tracking-widest text-center">PERSONAL INFO</h1>
            <div className="flex items-center justify-center ">

                <div className="flex flex-row flex-wrap items-center justify-center gap-x-5">
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Full name</span>
                        </label>
                        <input type="text" placeholder={user?.name} className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="text" placeholder={user?.email} className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Number cell phone</span>
                        </label>
                        <input type="text" placeholder={user?.phone_number} className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Birthdate</span>
                        </label>
                        <input type="text" placeholder={user?.birthdate} className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <input type="text" placeholder={user?.address} className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button className="w-[30rem] my-5 btn btn-primary">Save Info</button>
            </div>
        </>
    )

}

export default PersonalInfo