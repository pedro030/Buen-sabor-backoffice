// React
import { FC, ComponentType  } from 'react'

// Auth0
import { withAuthenticationRequired } from "@auth0/auth0-react";

// Components
import PageLoader from "../page_loader/PageLoader";

export const AuthenticationGuard: FC<{component: ComponentType}> = (props) => {
    // Utiliza withAuthenticationRequired para proteger el componente y mostrar el cargador
    const Component = withAuthenticationRequired(props.component, {
        onRedirecting: () => (
            <div className="page-layout">
                <PageLoader />
            </div>
        ),
    });

    return <Component />;
};