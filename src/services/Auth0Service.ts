export async function registerUserAuth0(mail: string, pass: string) {
    const data = {
        client_id: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
        email: mail,
        password: pass,
        connection: "Username-Password-Authentication"
    }
    const header = {
        "Content-Type":"application/json"
    }

    let response = await fetch(`${import.meta.env.VITE_REACT_APP_AUTH0_MANAGMENT_API_URL}/dbconnections/signup`,
        {
            headers: header,
            method: 'POST',
            body: JSON.stringify(data)
        }
    )
     if (response.status == 200){
        return true
     }
     return false
 }