import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../service/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// コンテクスト用の型を定義
type UserContextType = User | null | undefined;

// コンテクストを作成
const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // 配布したいデータの定義
  const [user, setUser] = useState<UserContextType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ログインしていた場合、ユーザーコレクションからユーザーデータを参照
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          // ユーザーデータを取得して格納
          const appUser = (await getDoc(ref)).data() as User;
          setUser(appUser);
          console.log('存在しているよ');
        }
      } else {
        // ログインしていない場合、ユーザー情報を空にする
        setUser(null);
      }
      // このコンポーネントが不要になったら監視を終了する
      return unsubscribe;
    });
  }, []);

  // プロバイダーを作成し、配布物を格納する
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
