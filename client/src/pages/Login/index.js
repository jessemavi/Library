import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { Login as LoginMutation, SignUp } from "../../graphql/mutations";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

function Login() {
  const [isExistingUser, setIsExistingUser] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();

  const onCompleted = () => history.push('/home');

  const [login, { error, loading }] = useMutation(LoginMutation, { onCompleted });
  const [signup] = useMutation(SignUp, { onCompleted });

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow p-8 max-w-sm w-10/12">
        <h1 className="mb-4 text-2xl">Welcome to Library</h1>
        <form
          onSubmit={async event => {
            event.preventDefault();
            if (isExistingUser) {
              await login({ variables: { username, password } }).catch(err => console.error(err))
            } else {
              await signup({ 
                variables: { input: { email, name, password, username } }
              }).catch(err => console.error(err))
            }
          }}
        >
          <TextInput
            className="mb-4"
            hiddenLabel
            id="username"
            inputWidthClass="w-full"
            label="Username"
            placeholder="Your username"
            type="text"
            onChange={event => setUsername(event.target.value)}
            value={username}
          />
          {!isExistingUser && (
            <>
              <TextInput
                className="mb-4"
                hiddenLabel
                id="email"
                inputWidthClass="w-full"
                label="Email"
                placeholder="Your email"
                type="email"
                onChange={event => setEmail(event.target.value)}
                value={email}
              />
              <TextInput
                className="mb-4"
                hiddenLabel
                id="name"
                inputWidthClass="w-full"
                label="Full Name"
                placeholder="Your full name"
                type="text"
                onChange={event => setName(event.target.value)}
                value={name}
              />
            </>
          )}
          <TextInput
            className="mb-8"
            hiddenLabel
            id="password"
            inputWidthClass="w-full"
            label="Password"
            placeholder="Your password"
            type="password"
            onChange={event => setPassword(event.target.value)}
            value={password}
          />
          <div className="flex items-center">
            <Button
              className="mr-2"
              text={isExistingUser ? "Log in" : "Sign Up"}
              type="submit"
              disabled={loading}
            />
            <p className="text-gray-400">
              {isExistingUser ? "New here?" : "Already joined?"}
            </p>
            <button
              className="text-red-500 hover:text-red-700 ml-1 focus:outline-none hover:underline"
              onClick={event => {
                event.preventDefault();
                setIsExistingUser(state => !state);
              }}
            >
              {isExistingUser ? "Sign up." : "Log in."}
            </button>
          </div>
          {error && (
            <p className="mt-4 text-red-500 text-sm">{error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
