import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  const [logins, setLogins] = useState([])

  const {
    getAccessTokenSilently,
    logout
  } = useAuth0();

  useEffect(() => {
     const fetchData = async () => {
      try {
        if (!getAccessTokenSilently) return;

        const { apiOrigin = "https://vast-wave-47133.herokuapp.com" } = getConfig();
        const token = await getAccessTokenSilently();

        const response = await fetch(`${apiOrigin}/api/external`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        setLogins(responseData.logins)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <>
      <div className="mb-5">
        <h1>Your login history:</h1>
        <ul>
          {
            logins.map((date) => {
              const _date = new Date(date)
              return <li key={date}>{ `${_date.toLocaleString('en-us', {  weekday: 'long' })},  ${_date.toLocaleString('en-GB')}` }</li>
            })
          }
        </ul>
      </div>
      <Button
        id="qsLoginBtn"
        color="primary"
        className="btn-margin"
        onClick={logoutWithRedirect}
      >
        Logout
      </Button>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
