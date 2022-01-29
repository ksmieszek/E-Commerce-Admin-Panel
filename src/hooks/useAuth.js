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
      if (user !== null) setUid(user.uid);
      else setUid(undefined);
      setLoading(false);
    });
    return observer;
  }, []);

  const SignIn = () => {
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const uid = result.user.uid;
        const findUser = await getDoc(doc(db, `users`, uid));
        if (findUser.exists()) {
          if (findUser.data().roles.admin) {
            setUid(uid);
            return;
          }
        }
      })
      .catch((error) => {});
  };

  const SignOut = async () => {
    auth.signOut().catch((error) => {
      console.log("An error happened.");
    });
  };

  return <AuthContext.Provider value={{ uid, SignIn, SignOut }}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
