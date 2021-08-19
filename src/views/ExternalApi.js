import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  const { apiOrigin = "https://vast-wave-47133.herokuapp.com" } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const {
    getAccessTokenSilently,
    logout
  } = useAuth0();

  useEffect(() => {
    callApi()
  }, [])

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setState({
        ...state,
        showResult: true,
        user: responseData
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

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
            state.user && state.user.logins.map((date) => {
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
