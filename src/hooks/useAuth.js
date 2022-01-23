import { useState, useEffect, createContext, useContext } from "react";
import { db } from "firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
// import { useSelector, useDispatch } from "react-redux";
// import { saveUser } from "store/authUserSlice";
// import { saveUnauthPersOrderData } from "store/unauthUserSlice";

const auth = getAuth();
const provider = new GoogleAuthProvider();
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  //   const userId = useSelector((state) => state.authUser.userId);
  //   const unauthUser = useSelector((state) => state.unauthUser);
  //   const dispatch = useDispatch();
  const [uid, setUid] = useState(undefined);

  //   useEffect(() => {
  //     (async () => {
  //       try {
  //         const findUser = await getDoc(doc(db, `users`, userId));
  //         if (findUser.exists()) {
  //           setUid(userId);
  //           setOrderPersData(findUser.data().orderPersData);
  //           setTimeout(() => {
  //             setLoading(false);
  //           }, 1000);
  //         }
  //       } catch (err) {
  //         setUid(undefined);
  //         setOrderPersData(unauthUser.orderPersData);
  //         dispatch(saveUser(""));
  //         setTimeout(() => {
  //           setLoading(false);
  //         }, 1000);
  //       }
  //     })();
  //   }, [userId]);

  const SignIn = () => {
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // console.log("result", result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // console.log("token", token);
        // The signed-in user info.

        const user = result.user;
        const { uid, displayName, email } = user;

        const findUser = await getDoc(doc(db, `users`, uid));
        if (findUser.exists()) {
          //   dispatch(saveUser({ uid, displayName, email }));

          console.log(findUser.data().roles.admin);
          if (findUser.data().roles.admin) {
            console.log("zalogowano");
            // window.location = "/products";
            return;
          }
        }
        // //if user logs in first time
        // if (!findUser.exists()) {
        //   try {
        //     await setDoc(doc(db, "users", uid), {
        //       displayName,
        //       email,
        //       cart: [],
        //       orderPersData: {},
        //       viewedProducts: [],
        //       orders: [],
        //     });
        //     dispatch(saveUser({ uid, displayName, email }));
        //     window.location = "/";
        //   } catch (err) {
        //     console.log(err);
        //   }
        // }
      })
      .catch((error) => {
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // // ...
      });
  };

  const SignOut = async () => {
    auth
      .signOut()
      .then(() => {
        // dispatch(saveUser(""));
        window.location = "/";
      })
      .catch((error) => {
        console.log("An error happened.");
      });
  };

  return <AuthContext.Provider value={{ uid, SignIn, SignOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
