import { useAuth0 } from '@auth0/auth0-react'
import { Field, Form, Formik } from 'formik'
import './UserDetails.scss'
import React from 'react'

const UserDetails = () => {

    const {user} = useAuth0()
  return (
      <div className="user-detail-container">
        <h2>Account Info</h2>
          <Formik
              initialValues={{
                  firstName: user?.given_name,
                  email: user?.email,
                  lastName: user?.family_name,
                  rememberMe: false
              }}
              onSubmit={(state) => { console.log(state.email) }}
          >
              <Form>
                  <label htmlFor="firstName">First Name</label>
                  <Field name="firstName" type="text" className="input-text" />
                  <label htmlFor="lastName">Last Name</label>
                  <Field type="text" name="lastName" className="input-text" />
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="input-text" />
              </Form>
        </Formik>
    </div>
  )
}

export default UserDetails