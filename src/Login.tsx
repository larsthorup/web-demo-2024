import { FormEvent, useEffect, useState } from "react";
import descopeSdk from "@descope/web-js-sdk";

const projectId = "P2fMgFNgpqdQJ9LQ6wQDhAN57syy";
const descope = descopeSdk({ projectId });

export default function Login() {
  // (4) Extract magic link token from URL
  const token = new URLSearchParams(window.location.search).get("t");
  const [user, setUser] = useState("");
  const [requesting, setRequesting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // (2) Instruct user to check their email
    setRequesting(true);

    // (3) Ask Descope to send email to user with the magic link
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      email: HTMLInputElement;
    };
    const email = formElements.email.value;
    const { protocol, host, pathname, search } = window.location;
    const redirectUrl = `${protocol}//${host}${pathname}${search}`;
    const resp = await descope.magicLink.signIn.email(email, redirectUrl, {
      customClaims: { email },
    });
    if (!resp.ok) {
      console.error("Failed to start signIn flow", { redirectUrl, resp });
    } else {
      console.log("Successfully initialized signIn flow");
    }
  };

  useEffect(() => {
    // (6) Ask Descope to verify the magic link token and return the user's email
    async function login(token: string) {
      const resp = await descope.magicLink.verify(token);
      if (!resp.ok) {
        console.error("Failed to verify token", resp);
      } else {
        console.log("Successfully verified login", resp);
        console.log(resp.data?.sessionJwt);
        const email = resp.data?.user?.email;
        if (email) setUser(email);
      }
    }
    if (token) {
      login(token);
    }
  }, [token]);

  return (
    <>
      {/* (1) Ask user to enter email */}
      {!token && !requesting && (
        <form onSubmit={handleSubmit} name="login" aria-label="login">
          <label>
            Your email:
            <input type="email" name="email" autoFocus={true} />
          </label>
          <button type="submit">Login</button>
        </form>
      )}
      {/* (3) Instruct user to check their email */}
      {!token && requesting && (
        <p>Click the link in the email we just sent you!</p>
      )}
      {/* (5) Show user that we will log them in */}
      {token && !user && <p>Logging in...</p>}
      {/* (7) Show user that they are logged in */}
      {token && user && <p>Logged in as {user}</p>}
    </>
  );
}
