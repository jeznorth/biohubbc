import { Box, CssBaseline, makeStyles, Theme } from '@material-ui/core';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  appHeader: {
    position: 'sticky',
    top: 0
  },
  appBody:{
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    '& main': {
      flex: '1 1 auto'
    }
  }
}));

const PublicLayout: React.FC = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.appContainer}>
      <CssBaseline />

      <Box className={classes.appHeader} zIndex={1000}>
        <Header />
      </Box>

      <div className={classes.appBody}>
        <main>
          {React.Children.map(props.children, (child: any) => {
            return React.cloneElement(child, { classes: classes });
          })}
        </main>

        <Footer />
      </div>
    </Box>
  );
};

export default PublicLayout;
