import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import PageLoader from "../page_loader/PageLoader";

export const AuthenticationGuard = (props: any) => {
    const Component = withAuthenticationRequired(props.component, {
        onRedirecting: () => (
            <div className="page-layout">
                <PageLoader />
            </div>
        ),
    });

    return <Component />;
};