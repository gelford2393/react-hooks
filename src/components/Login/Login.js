import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import AuthContext from "../../store/auth-context";

const addUserReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: { email: action?.val?.email, password: action?.val?.password },
      isValid: {
        emailIsValid: action.val?.email.includes("@"),
        passwordIsValid: action.val?.password.trim().length > 6,
      },
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: { email: state?.value?.email, password: state?.value?.password },
      isValid: {
        emailIsValid: state.value?.email.includes("@"),
        passwordIsValid: state.value?.password.trim().length > 6,
      },
    };
  }
  return {
    value: {
      email: "",
      password: "",
    },
    isValid: {
      emailIsValid: false,
      passwordIsValid: false,
    },
  };
};
const initialState = {
  value: {
    email: "",
    password: "",
  },
  isValid: {
    emailIsValid: undefined,
    passwordIsValid: undefined,
  },
};
const Login = (props) => {
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [formIsValid, setFormIsValid] = useState(false);
  const [userState, dispatchEmail] = useReducer(addUserReducer, initialState);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      val: {
        ...userState.value,
        email: event.target.value,
      },
    });
  };
  const { emailIsValid, passwordIsValid } = userState.isValid;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("check");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    return () => {
      console.log("clean");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);
  const passwordChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      val: {
        ...userState.value,
        password: event.target.value,
      },
    });
  };
  // console.log(userState);
  // console.log(formIsValid);
  const validateUserHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(userState.value.email, userState.value.password);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          label="E-mail"
          type="email"
          id="email"
          value={userState.value.email}
          onChange={emailChangeHandler}
          onBlur={validateUserHandler}
          isValid={emailIsValid}
        />

        <Input
          ref={passwordInputRef}
          label="Password"
          type="password"
          id="password"
          value={userState.value.password}
          onChange={passwordChangeHandler}
          onBlur={validateUserHandler}
          isValid={passwordIsValid}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
