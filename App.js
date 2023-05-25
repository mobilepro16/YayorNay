import React from 'react';
import {createAppContainer} from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import mainNavigator from './src/utilities/navigation';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);


const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#212121',
      accent: '#411C47',
    }
};
const AppNavigation = createAppContainer(mainNavigator);


class App extends React.Component {
    render() {
        return <PaperProvider theme={theme}>
                  <AppNavigation />
              </PaperProvider>
    }
  }
  
export default App;
  


// export default App;
