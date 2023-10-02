'use client';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import CircularColor from '@/app/CircularColor';
import SearchIcon from '@mui/icons-material/Search';

export default function List() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [sortDateDirection, setSortDateDirection] = useState<'asc' | 'desc'>('asc');
  const [sortLikedDirection, setSortLikedeDirection] = useState<'asc' | 'desc'>('asc');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);

  const handleSortDateClick = () => {
    console.log('並び替え成功');
    setSortDateDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortLikedClick = () => {
    console.log('並び替え成功！');
    setSortLikedeDirection((prevlikedDirection) => (prevlikedDirection === 'asc' ? 'desc' : 'asc'));
  };

  // 絞り込み機能を実行
  useEffect(() => {
    if (books) {
      const filtered = books.filter((book) => {
        const matchesTitle = book.title.toLowerCase().includes(filterTitle.toLowerCase());
        const matchesAuthor = book.author.toLowerCase().includes(filterAuthor.toLowerCase());
        const matchesUserId = book.userName.toLowerCase().includes(filterUserId.toLowerCase());

        return matchesAuthor && matchesUserId && matchesTitle;
      });

      setFilteredBooks(filtered);
    }
  }, [books, filterTitle, filterAuthor, filterUserId]);

  //日付の並び替え
  useEffect(() => {
    const sortedBooks = [...books].sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();

      if (sortDateDirection === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    setBooks(sortedBooks);
  }, [sortDateDirection]);

  //いい本順に並び替え
  useEffect(() => {
    const sortedLikedBooks = [...books].sort((a, b) => {
      const likedA = a.likeCount;
      const likedB = b.likeCount;

      if (sortLikedDirection === 'asc') {
        return likedA - likedB;
      } else {
        return likedB - likedA;
      }
    });
    setBooks(sortedLikedBooks);
  }, [sortLikedDirection]);

  useEffect(() => {
    // firebaseからデータを取得
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
    // リアルタイムで取得
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
    if (books) {
      Promise.all(
        books.map(async (book) => {
          const likedUserRef = collection(db, 'books', book.docId, 'LikedUsers');
          const querySnapshot = await getDocs(likedUserRef);
          // console.log('サブコレクション数', querySnapshot.size);
          book.likeCount = querySnapshot.size;
          return book;
        })
      ).then((updatedBooks) => {
        setFilteredBooks(updatedBooks);
      });
    }
  }, [books]);

  useEffect(() => {
    // console.log(books);
  }, [books]);

  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    // データが取得されたら、setDataLoaded(true) を呼ぶ
    setDataLoaded(true);
  }, []);

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
      <Container sx={{ mt: 3 }}>
        <Grid container>
          <Grid item>
            <Box sx={{ display: 'flex', alignContent: 'center' }}>
              <Typography mr={3} sx={{ display: 'inline-block', ml: 1 }}>
                <SearchIcon />
                タイトルで検索
              </Typography>
              <TextField
                autoComplete="off"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignContent: 'center' }}>
              <Typography mr={3} sx={{ display: 'inline-block', ml: 1 }}>
                <SearchIcon />
                著者名　で検索
              </Typography>
              <TextField
                autoComplete="off"
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignContent: 'center' }}>
              <Typography mr={3} sx={{ display: 'inline-block', ml: 1 }}>
                <SearchIcon />
                投稿者名で検索
              </Typography>
              <TextField
                autoComplete="off"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" spacing={2} mt={2}>
          <Grid item>
            <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-evenly' }}>
              <Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSortDateClick()}
                  sx={{ mr: 2 }}
                >
                  {sortDateDirection === 'asc' ? '最新順' : '古い順'}
                </Button>
              </Box>
              <Box>
                <Button variant="contained" size="large" onClick={handleSortLikedClick}>
                  📕 {sortLikedDirection === 'asc' ? 'いい本多い順' : 'いい本少ない順'}
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Link href="./create/">
              <Button variant="contained" size="large" color="info" sx={{ my: 2 }}>
                投稿する
              </Button>
            </Link>
          </Grid>
        </Grid>

        <ul>
          <Grid container spacing={2} justifyContent="flex-start">
            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.docId}>
                <Link href={`/${book.docId}/`} style={{ textDecoration: 'none', color: 'black' }}>
                  <Box
                    border="1px solid #ccc"
                    borderRadius="5px"
                    padding="10px"
                    marginBottom="10px"
                  >
                    <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
                      <Avatar alt="" src={book.userPhotoURL} />
                      <Typography fontSize={25}>{book.userName}</Typography>
                    </Box>
                    <Box
                      sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', mb: 3 }}
                    >
                      {book.picture && (
                        <img
                          src={book.picture}
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
                      )}
                    </Box>
                    <Typography>タイトル：「{book.title}」</Typography>
                    <Typography>著者 ：「{book.author}」</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 'small',
                        }}
                      >
                        <MenuBookTwoToneIcon fontSize="large" />
                        いいね
                        <Typography ml={1}>{book.likeCount}</Typography>
                      </Box>

                      <Typography>
                        {book.createdAt && book.createdAt.toDate().toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </ul>
      </Container>
    </>
  );
}
