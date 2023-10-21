// Register User with Auth0
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

 // Generate Token
 function generateToken(){
    return fetch(`${import.meta.env.VITE_REACT_APP_AUTH0_MANAGMENT_API_URL}/oauth/token`,{
        method: 'POST',
        body:JSON.stringify({
            "client_id": `${import.meta.env.VITE_REACT_APP_MANAGEMENT_ID}`,
            "client_secret": `${import.meta.env.VITE_REACT_APP_MANAGEMENT_SECRET}`,
            "audience": `${import.meta.env.VITE_REACT_APP_AUTH0_MANAGMENT_API_URL}/api/v2/`,
            "grant_type": "client_credentials"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( data => {
        return data.json()})
    .then(data => data.access_token)
    .catch(err => {
        console.log("error al generar token", err)
    })
}

// Update User Password
export async function updatePassword(userId: string, newPassword: string): Promise<boolean>{
    const token = await generateToken();
    const url = `${import.meta.env.VITE_REACT_APP_AUTH0_MANAGMENT_API_URL}/api/v2/users/${userId}`

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);
      
    return fetch(url, {
        headers: myHeaders,
        body: JSON.stringify({
            password: newPassword,
            connection: "Username-Password-Authentication"
          }),
        method: 'PATCH',
        redirect: 'follow'
      })
    .then(response => response.status == 200)
    .catch(error => {
        console.log('error', error)
        return false
    });
}