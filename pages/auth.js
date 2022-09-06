import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthForm from "../components/auth/auth-form";

const AuthPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (session) router.replace("/");
      else setIsLoading(false);
    });
  }, [router]);

  if (isLoading) return <p>Loading...</p>;

  return <AuthForm />;
};

export default AuthPage;
