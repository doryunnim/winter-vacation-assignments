import React from "react";
import {HashRouter as Router, Route, Switch, Link} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "component/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({isLoggedIn, setIsLoggedIn, userObj}) => {
    console.log(userObj)
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Switch>
            {isLoggedIn ? (
                    <>
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} />
                        </Route>
                    </>
                )
                    : (
                    <Route exact path="/" component={Auth}> 
                        
                    </Route>
                )
                }
            </Switch>
        </Router>
    )
}

export default AppRouter;