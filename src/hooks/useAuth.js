import { useState, useEffect, createContext, useContext } from "react";
import { db } from "firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [uid, setUid] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const findUser = await getDoc(doc(db, `users`, user.uid));
        if (findUser.exists()) {
          if (findUser.data().roles.admin === true) setUid(user.uid);
          else setUid(undefined);
        }
      } else {
        setUid(undefined);
      }
      setLoading(false);
    });
    return observer;
  }, []);

  const SignIn = () => {
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, provider);
  };

  const SignOut = () => {
    auth.signOut();
  };

  return <AuthContext.Provider value={{ uid, SignIn, SignOut }}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
