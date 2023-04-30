declare namespace NodeJS {
    interface ImportMetaEnv {
        VITE_REACT_APP_AUTH0_DOMAIN: string
        VITE_REACT_APP_AUTH0_CLIENT_ID: string
        VITE_REACT_APP_AUTH0_CALLBACK_URL: string
        // Agrega aquí otras variables de entorno que estés utilizando
    }
}