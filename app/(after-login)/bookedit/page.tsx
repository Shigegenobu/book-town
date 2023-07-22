'use client';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import Link from 'next/link';

export default function BookEdit() {
  return (
    <>
      <Box>
        <Box>編集ページ</Box>
        <Container>
          <Stack spacing={2}>
            <TextField label="タイトルを入力して下さい" variant="standard" autoComplete="off" />
            <TextField label="作者を入力して下さい" variant="standard" autoComplete="off" />
            <TextField label="出版社を入力して下さい" variant="standard" autoComplete="off" />
            <FormControl>
              <InputLabel>ジャンルを選択してください</InputLabel>
              <Select label="Category" variant="standard">
                <MenuItem value="ミステリー（推理小説）">ミステリー（推理小説）</MenuItem>
                <MenuItem value="ファンタジー">ファンタジー</MenuItem>
                <MenuItem value="歴史小説">歴史小説</MenuItem>
                <MenuItem value="短編小説">短編小説</MenuItem>
                <MenuItem value="ノンフィクション">ノンフィクション</MenuItem>
                <MenuItem value="図鑑">図鑑</MenuItem>
                <MenuItem value="エッセイ（随筆）">エッセイ（随筆）</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ mt: 5 }}>
            <Stack spacing={1}>
              <Box>⭐️おすすめポイント⭐️</Box>
              <TextField multiline rows={4} autoComplete="off" />
            </Stack>
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={2}>
              <Link href="./bookshow">
                <Button variant="contained">詳細ページへ戻る</Button>
              </Link>
            </Grid>

            <Grid item xs={1}>
              <Link href="./list">
                <Button variant="contained">保存</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
