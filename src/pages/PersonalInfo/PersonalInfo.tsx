const PersonalInfo = () => {

    return (
        <>
            <h1 className="m-5 mb-10 text-xl tracking-widest text-center">PERSONAL INFO</h1>
            <div className="flex items-center justify-center ">

                <div className="flex flex-row flex-wrap items-center justify-center gap-x-5">
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Full name</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Age</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Number cell phone</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Birthdate</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
                        <label className="label">
                        </label>
                    </div>
                    <div className="w-full max-w-xs form-control">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <input type="text" placeholder="Type here" className="w-full max-w-xs input input-bordered" />
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