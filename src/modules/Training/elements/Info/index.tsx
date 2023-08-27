import React from 'react';
import styles from './Info.module.css';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
// import { ReactComponent as Like } from "assets/like.svg";
import { useRouter, usePathname } from 'next/navigation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#D3D3D3',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#D3D3D3',
      contrastText: '#000000',
    },
  },
});

interface InfoProps {
  title: string | undefined;
  description: string | undefined;
  tag: string | undefined;
}

// TODO: here you named it Info, if its only for training name it TrainingInfo, its good to identify right away the
// component domain (training) , you did this for ./Card, you named it TrainingCard. also rename the file Card>TrainingCard
export default function Info({ title, description, tag }: InfoProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    router.push(`${pathname}/start`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__upper}>
        <h3 className={styles.container__title}>{title}</h3>
        {/* <Like /> */}
      </div>
      <p className={styles.container__description}>{description}</p>
      <p className={styles.container__tags}>{tag}</p>
      <ThemeProvider theme={theme}>
        <Button
          sx={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
          }}
          variant="contained"
          onClick={() => handleClick()}
        >
          Start Training
        </Button>
      </ThemeProvider>
    </div>
  );
}
