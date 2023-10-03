'use client';
import { Avatar, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import Link from 'next/link';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import {
  DocumentReference,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth';
import CircularColor from '@/app/CircularColor';
import { CommentType } from '@/app/types/CommentType';
import { LikedUser } from '@/app/types/LikedUser';

export default function BookShow() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likedUser, setLikedUser] = useState<LikedUser[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState<CommentType>({
    docId: '',
    text: '',
    userId: '',
    userName: '',
    userPhotoURL: '',
    bookId: '',
    createdAt: Timestamp.now(),
  });
  const [comments, setComments] = useState<CommentType[]>([]);

  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id;

  const bookToShow = books.find((book) => book.docId === bookId);
  // console.log('bookToShow', bookToShow);

  //idが同じならbooks編集・削除できる
  const canEdit = user && bookToShow && user.id === bookToShow?.userId;
  // console.log('canEdit', canEdit);

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log(e.target.value);
    setComment((prevComment) => ({
      ...prevComment,
      text: e.target.value,
    }));
  };

  // commentを削除する
  const handleDeleteComment = async (commentId: string) => {
    try {
      const commentDocRef = doc(db, 'comments', commentId);
      await deleteDoc(commentDocRef);
      console.log('コメントが削除されました');
    } catch (error) {
      console.log(error);
    }
  };

  //bookを削除する
  let deleteDocRef: DocumentReference | undefined;
  if (bookToShow) {
    deleteDocRef = doc(db, 'books', bookToShow.docId);
  }

  const handleDeleteClick = async () => {
    try {
      if (deleteDocRef) {
        await deleteDoc(deleteDocRef);
        console.log('削除されました');
        router.push('/list');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetInput = () => {
    setComment({
      docId: '',
      text: '',
      userId: '',
      userName: '',
      userPhotoURL: '',
      bookId: '',
      createdAt: Timestamp.now(),
    });
  };

  // //コメント投稿の作成
  const handleClick = async () => {
    if (!comment.text) {
      alert('コメントが空です');
      return;
    }
    const newCommentRef = doc(collection(db, 'comments'));
    if (bookToShow) {
      const newComment: CommentType = {
        docId: comment.docId,
        text: comment.text,
        userId: user.id,
        userName: user.name,
        userPhotoURL: user.photoURL,
        bookId: bookToShow.docId,
        createdAt: Timestamp.now(),
      };
      // 新しいコメントを保存する処理を追加
      await setDoc(newCommentRef, newComment)
        .then(() => {
          resetInput();
          console.log('Document written with ID:', newComment.userId);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('投稿先の本が見つかりません');
    }
  };

  useEffect(() => {
    //firebaseからいいねを取得
    const likedUserRef = collection(db, 'books', bookId, 'LikedUsers');
    getDocs(likedUserRef).then((snapShot) => {
      const fetchLikedUsers = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          createdAt: data.createdAt,
        };
      });
      setLikedUser(fetchLikedUsers);
      // console.log('fetchLikedUsers', fetchLikedUsers);
    });

    const unsubscribe = onSnapshot(likedUserRef, (likedUser) => {
      const updateLikedUsers = likedUser.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          createdAt: data.createdAt,
        };
      });
      // console.log('リアルタイムいいね', updateLikedUsers);
      setLikedUser(updateLikedUsers);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    //firebaseからデータを取得(comments)
    const commentData = collection(db, 'comments');
    getDocs(commentData).then((snapShot) => {
      const fetchComments = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          text: data.text,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          bookId: data.bookId,
          createdAt: data.createdAt,
        };
      });
      setComments(fetchComments);
    });

    // リアルタイムで取得(comments)
    const unsubscribe = onSnapshot(commentData, (comment) => {
      const updateComments = comment.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          text: data.text,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          bookId: data.bookId,
          createdAt: data.createdAt,
        };
      });
      // console.log('リアルタイムコメント', updateComments);
      setComments(updateComments);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // firebaseからデータを取得(books)
    const bookData = collection(db, 'books');
    getDocs(bookData).then((snapShot) => {
      const fetchedBooks = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          title: data.title,
          author: data.author,
          category: data.category,
          point: data.point,
          picture: data.picture,
          createdAt: data.createdAt,
          likeCount: data.likeCount,
        };
      });
      setBooks(fetchedBooks);
    });

    // リアルタイムで取得(books)
    const unsubscribe = onSnapshot(bookData, (book) => {
      const updatedBooks = book.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          title: data.title,
          author: data.author,
          category: data.category,
          point: data.point,
          picture: data.picture,
          createdAt: data.createdAt,
          likeCount: data.likeCount,
        };
      });
      setBooks(updatedBooks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // データが取得されたら、setDataLoaded(true) を呼ぶ
    setDataLoaded(true);
  }, []);

  //サブコレクションの合計数取得
  useEffect(() => {
    if (bookToShow) {
      const likedUserRef = collection(db, 'books', bookToShow.docId, 'LikedUsers');
      const likedUserQuery = query(likedUserRef);

      getDocs(likedUserQuery).then((querySnapshot) => {
        setLikeCount(querySnapshot.size);
        // console.log('サブコレクション数', querySnapshot.size);
      });
    }
  }, [bookToShow]);

  const handleToggleLike = async () => {
    if (bookToShow) {
      const likedUserRef = doc(db, 'books', bookToShow.docId, 'LikedUsers', user.id);

      try {
        const likedUserSnapshot = await getDoc(likedUserRef);

        if (likedUserSnapshot.exists()) {
          // すでにいいねしている場合、取り消す
          await deleteDoc(likedUserRef);

          // いいねの状態をlocalStorageから削除
          localStorage.removeItem(`liked_${bookToShow.docId}`);
        } else {
          // いいねしていない場合、いいねする
          const newLikedUser = {
            createdAt: Timestamp.now(),
            userId: user.id,
          };
          await setDoc(likedUserRef, newLikedUser);

          // いいねの状態をlocalStorageに保存
          localStorage.setItem(`liked_${bookToShow.docId}`, 'true');
        }

        // いいねの状態を更新
        setLiked(!liked);

        //更新時のサブコレクション内の合計数を取得し、likeCount を更新
        const likedUserQuery = query(collection(db, 'books', bookToShow.docId, 'LikedUsers'));
        const querySnapshot = await getDocs(likedUserQuery);
        setLikeCount(querySnapshot.size);
        console.log('サブコレクション数', querySnapshot.size);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };

  //いいねの状態がlocalStorageに保存されていればセットする
  useEffect(() => {
    if (bookToShow) {
      const likeStatus = localStorage.getItem(`liked_${bookToShow.docId}`);
      // いいねの状態がlocalStorageに保存されていれば、それをセットする
      if (likeStatus === 'true') {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [bookToShow]);

  // 初期いいねの状態はローカルストレージから取得する
  useEffect(() => {
    if (bookToShow && user) {
      const likedUserRef = doc(db, 'books', bookToShow.docId, 'LikedUsers', user.id);

      // likedUserRef をもとにいいねの存在を確認
      getDoc(likedUserRef)
        .then((likedUserSnapshot) => {
          if (likedUserSnapshot.exists()) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        })
        .catch((error) => {
          console.error('Error checking like status:', error);
        });
    }
  }, [bookToShow, user]);

  //ローディング中表示
  if (!dataLoaded) {
    return (
      <>
        <Container
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Box>ローディング中...</Box>
          <CircularColor />
        </Container>
      </>
    );
  }

  return (
    <>
      <Box mt={3}>
        <Container>
          <Box border="1px solid #ccc" borderRadius="5px" padding="10px" marginBottom="10px">
            <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
              <Avatar alt="" src={bookToShow?.userPhotoURL} />
              <Typography fontSize={25}>{bookToShow?.userName}</Typography>
            </Box>
            <Stack spacing={2}>
              <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', mb: 3 }}>
                <img
                  src={bookToShow?.picture}
                  alt="本の写真"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography>タイトル：「{bookToShow?.title}」</Typography>
              <Typography>著者：「{bookToShow?.author}」</Typography>
              <Typography>ジャンル：「{bookToShow?.category}」</Typography>
              <Typography>⭐️おすすめポイント⭐️：「{bookToShow?.point}」</Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: liked ? 'red' : 'inherit',
                  cursor: 'pointer',
                  fontSize: 'small',
                }}
                onClick={handleToggleLike}
              >
                <MenuBookTwoToneIcon fontSize="large" />
                いいね
                <Typography ml={1}>{likeCount}</Typography>
              </Box>

              <Typography>
                {bookToShow?.createdAt && bookToShow.createdAt.toDate().toLocaleString()}
              </Typography>
            </Stack>
          </Box>

          <Grid
            container
            justifyContent="space-between"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Grid item>
              <Link href="./list">
                <Button variant="contained" size="large">
                  戻る
                </Button>
              </Link>
            </Grid>

            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              {canEdit && (
                <>
                  <Link href={`/bookedit?id=${bookId}`}>
                    <Button variant="contained" size="large">
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    sx={{ ml: 3 }}
                    onClick={() => handleDeleteClick()}
                  >
                    削除
                  </Button>
                </>
              )}
            </Grid>
          </Grid>

          <Box>
            <h2>コメント一覧</h2>
            {comments
              .filter((comment) => comment.bookId === bookToShow?.docId) // 特定の本に関連するコメントのみをフィルタリング
              .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()) // 作成日時の降順でソート
              .map((comment) => (
                <Box
                  border="1px solid #ccc"
                  borderRadius="5px"
                  padding="10px"
                  marginBottom="10px"
                  key={comment.docId}
                >
                  {/* コメントの表示内容  */}
                  <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
                    <Avatar alt="" src={comment.userPhotoURL} />
                    <Typography fontSize={25}>{comment.userName}</Typography>
                  </Box>
                  <br />
                  <Typography fontSize={25}>{comment.text}</Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 3,
                    }}
                  >
                    <Typography>
                      {comment.createdAt && comment.createdAt.toDate().toLocaleString()}
                    </Typography>

                    {/* コメントを削除できる場合に削除ボタン表示 */}
                    {user && user.id === comment.userId && (
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={() => handleDeleteComment(comment.docId)}
                      >
                        削除
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
          </Box>

          {user && (
            <Box sx={{ mt: 3 }}>
              <Typography>コメント投稿</Typography>
              <TextField
                autoComplete="off"
                value={comment.text}
                onChange={(e) => handleCommentChange(e)}
              />

              <Button
                variant="contained"
                color="info"
                size="large"
                onClick={handleClick}
                sx={{ ml: 3, mt: 1 }}
              >
                投稿
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
