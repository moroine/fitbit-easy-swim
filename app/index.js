    
import { Application } from './view'
import Home from './home/View'
import Settings from './settings/View'
import Swim from './swim/View'

class App extends Application {
    screens = { Home, Settings, Swim }
}

App.start( 'Home' );