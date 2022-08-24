import defaultTheme from './default';
import customTheme from './custom';

const themes = {
  defaultTheme,
  customTheme,
};

export const themeConfig = {
  topbar: {
    buttonColor: '#ffffff',
    textColor: '#333333',
  },
  sidebar: {
    buttonColor: '#323332',
    backgroundColor: '#ffffff',
    textColor: '#333333',
  },
  layout: {
    buttonColor: '#ffffff',
    backgroundColor: '#F1F3F6',
    textColor: undefined,
  },
  theme: {
    buttonColor: '#ffffff',
    textColor: '#333333',
  },
};
export default themes;
