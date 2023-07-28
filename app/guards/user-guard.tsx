import { ReactNode } from 'react';
import { useAuth } from '../context/auth';
import { useRouter } from 'next/navigation';
import CircularColor from '../CircularColor';
import { usePathname } from 'next/navigation';
import { UserType } from '../types/UserType';

type Props = {
  children: ((user: UserType) => ReactNode) | ReactNode;
};

const UserGuard = ({ children }: Props) => {
  const user = useAuth();
  const router = useRouter();
  // console.log(router)
  const pathname = usePathname();

  // 未ログインであればリダイレクト
  if (
    user === null &&
    user !== undefined &&
    pathname !== '/signin' &&
    pathname !== '/signup' &&
    pathname !== '/'
  ) {
    router.push('/');
    return null;
  }

  // 認証確認中であれば空表示
  if (user === null) {
    return null;
  }

  if (user === undefined) {
    return (
      <>
        <p>ローディング中...</p>
        <CircularColor />
      </>
    );
  }

  if (typeof children === 'function') {
    // 関数であればユーザー情報を渡して実行
    return <>{children(user)}</>;
  } else {
    // Nodeであればそのまま表示
    return <>{children}</>;
  }
};

export default UserGuard;
