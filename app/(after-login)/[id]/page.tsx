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
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth';
import CircularColor from '@/app/CircularColor';
import { CommentType } from '@/app/types/CommentType';

export default function BookShow() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);

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
  // console.log('ブック', bookId);

  const bookToShow = books.find((book) => book.docId === bookId);
  console.log('bookToShow', bookToShow);

  //idが同じならbooks編集・削除できる
  const canEdit = user && bookToShow && user.id === bookToShow?.userId;

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setComment((prevComment) => ({
      ...prevComment,
      text: e.target.value,
    }));
  };

  // commentを削除する
  const handleDeleteComment = async (commentId: string) => {
    try {
      const commentDocRef = doc(db, 'comments', commentId);
      // if (commentDocRef) {
      await deleteDoc(commentDocRef);
      console.log('コメントが削除されました');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  let deleteDocRef: DocumentReference | undefined; // doc()関数のための変数を宣言

  if (bookToShow) {
    deleteDocRef = doc(db, 'books', bookToShow.docId);
  }

  //bookを削除する
  const handleDeleteClick = async () => {
    try {
      if (deleteDocRef) {
        await deleteDoc(deleteDocRef);
        console.log('削除されました');
        // 削除後のリダイレクト処理を追加
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
    //ユーザーidの読み込みに成功したら処理が進む
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
    console.log(books);
  }, [books]);

  useEffect(() => {
    // データが取得されたら、setDataLoaded(true) を呼ぶ
    setDataLoaded(true);
  }, []);

  //ローディング中表示
  if (!dataLoaded) {
    return (
      <>
        Loading...
        <CircularColor />
      </>
    );
  }

  const bookToShowLike = bookToShow?.likeCount || 0;
  console.log('LikeCount', bookToShowLike);

  const handleLikedClick = async () => {
    if (bookToShow) {
      const newLiked = !liked;
      const newLikeCount = newLiked ? bookToShowLike + 1 : bookToShowLike - 1;
      // const newLikeCount = bookToShowLike + (newLiked ? 1 : -1);

      const bookDocRef = doc(db, 'books', bookToShow.docId);

      try {
        await updateDoc(bookDocRef, { likeCount: newLikeCount });

        const updatedBooks = books.map((book) => {
          if (book.docId === bookId) {
            return {
              ...book,
              likeCount: book.docId === bookToShow.docId ? newLikeCount : book.likeCount,
            };
          }
          return book;
        });

        setBooks(updatedBooks);
        setLiked(newLiked);
      } catch (error) {
        console.error('Error updating like count:', error);
      }
    }
  };

  return (
    <>
      <Box mt={3}>
        <Container>
          <Box border="1px solid #ccc" borderRadius="5px" padding="10px" marginBottom="10px">
            <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
              <Avatar alt="" src={bookToShow?.userPhotoURL} />
              <Typography fontSize={25}>{bookToShow?.userName}</Typography>
            </Box>
            <Box>ID:{bookToShow?.userId}</Box>
            <br />
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
                }}
                onClick={handleLikedClick}
              >
                <MenuBookTwoToneIcon fontSize="large" />
                <Typography ml={1}>{bookToShow?.likeCount}</Typography>
              </Box>

              <Typography>
                {bookToShow?.createdAt && bookToShow.createdAt.toDate().toLocaleString()}
              </Typography>
            </Stack>
          </Box>
          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={3}>
              <Link href="./list">
                <Button variant="contained" size="large">
                  一覧へ
                </Button>
              </Link>
            </Grid>

            <Grid item xs={2}>
              {canEdit && ( // ログインユーザーが編集可能な場合のみ表示
                <>
                  <Link href={`/bookedit?id=${bookId}`}>
                    <Button variant="contained">編集ページへ</Button>
                  </Link>
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    sx={{ my: 3 }}
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
                  <Box sx={{ fontSize: 3 }}>ID:{comment.userId}</Box>
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
              <Typography>コメントを投稿する</Typography>
              <TextField
                autoComplete="off"
                value={comment.text}
                onChange={(e) => handleCommentChange(e)}
              />

              <Button variant="contained" size="large" onClick={handleClick} sx={{ ml: 4 }}>
                投稿
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
