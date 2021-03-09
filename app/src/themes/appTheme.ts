import { createMuiTheme } from '@material-ui/core';
import 'styles.scss';

const appTheme = createMuiTheme({
  palette: {
    // https://material-ui.com/customization/palette/
    primary: {
      light: '#5469a4',
      main: '#003366', // BC ID: corporate blue
      dark: '#001949',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ffd95e',
      main: '#e3a82b', // BC ID: corporate gold
      dark: '#ad7900',
      contrastText: '#000000'
    },
    text: {
      primary: 'rgba(0, 0, 0, 100)',
      secondary: 'rgba(0, 0, 0, 0.67)',
      disabled: 'rgba(0, 0, 0, 0.67)',
    }
  },
  typography: {
    fontFamily: ['BCSans', 'Verdana', 'Arial', 'sans-serif'].join(','),
    fontSize: 16
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    },
    MuiTypography: {
      // https://material-ui.com/api/typography/
      h1: {
        letterSpacing: '-0.01rem',
        fontSize: '2rem',
        fontWeight: 700
      },
      h2: {
        letterSpacing: '-0.01rem',
        fontSize: '1.5rem',
        fontWeight: 700
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 700
      }
    },
    MuiCircularProgress: {
      // https://material-ui.com/api/circular-progress/
      root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '60px !important',
        width: '60px !important',
        marginLeft: '-30px',
        marginTop: '-30px'
      }
    },
    MuiContainer: {
      // https://material-ui.com/api/container/
      root: {
        maxWidth: 'xl',
        margin: 'auto'
      }
    },
    MuiFormLabel: {
      root: {
        color: '#000000'
      },
      asterisk: {
        color: '#db3131',
        '&$error': {
          color: '#db3131'
        }
      }
    },
    MuiStepLabel: {
      label: {
        color: '#000000'
      },
      labelContainer: {
        paddingLeft: '3rem'
      },
      iconContainer: {
        width: '2rem',
        height: '2rem',
        paddingRight: 0,
        border: '3px solid #003366',
        borderRadius: '1rem'
      }
    },
    MuiStepIcon: {
      root: {
        margin: '-1px',
        color: '#003366'
      },
      text: {
        color: '#003366',
        fontWeight: 700
      },
      active: {
        color: 'transparent'
      }
    },
    MuiStepContent: {
      root: {
        marginTop: 0,
        marginLeft: '1rem',
        paddingTop: '1rem',
        paddingBottom: 0,
        paddingLeft: '4rem'
      }
    },
    MuiStepConnector: {
      vertical: {
        marginLeft: '1rem',
        padding: '0'
      }
    }
  }
});

export default appTheme;
