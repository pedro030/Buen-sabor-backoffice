const ChangePassword = () => {

    return (
        <>
            <h1 className="m-5 mb-10 text-xl tracking-widest text-center">CHANGE PASSWORD</h1>
            <div className="flex items-center justify-center ">

                <div className="flex flex-col items-center justify-center gap-x-5">
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
                    <button className="w-full mt-5 btn btn-primary btn-md">Save!</button>
                </div>
            </div>
        </>
    )

}

export default ChangePassword