import document from "document";
import { display } from "display";
import logger from './logger';

// Main DOM search method.
export function $( query, el ){
  const selectors = query.match( /\.|#|\S+/g );
  // copy from https://github.com/gaperton/ionic-views
  
  let root = el || document;
  
  for( let i = 0; root && i < selectors.length; i++ ){
    const s = selectors[ i ];
    root = s === '#' ? $id( selectors[ ++i ], root ) :
           s === '.' ? $classAndType( 'getElementsByClassName', selectors[ ++i ], root ) :
                       $classAndType( 'getElementsByTypeName', s, root );
  }

  return root;
}

// Search subtrees by id...
function $id( id, arr ){
  if( Array.isArray( arr ) ){
    const res = [];

    for( let i = arr.length; i--; ){
      const x = arr[ i ].getElementById( id );
      if( x ) res.push( x );
    }
  
    return res;
  }

  return arr.getElementById( id );
}

// Search subtrees by class or type...
function $classAndType( method, arg, arr ){
  if( Array.isArray( arr ) ){
    const res = [];
    
    for( let i = arr.length; i--; ){
      const el = arr[ i ][ method ]( arg );
      for( let j = el.length; j--; ){
        res.push( el[ j ] );
      }
    }
  
    return res;
  }

  return arr[ method ]( arg );
}

export function $wrap( element ){
  return selector => selector ? $( selector, element ) : element;
}

export function $at( selector ){
  return $wrap( $( selector ) );
}

function show( view, yes ){
  const { el } = view ;
  if( el ) el.style.display = yes ? 'inline' : 'none';  
}

function mount( view ){
  show( view, true );
  view.onMount( view.options );
}

function unmount( view ){
  const { _subviews } = view;
  if( _subviews ){
    let i = _subviews.length;
    while( i-- ) unmount( subview );
    
    delete view._subviews;    
  }
    
  view.onUnmount();
  show( view, false );
}

export class View {
  constructor( options ){
    if( options ) this.options = options;
  }
  
  insert( subview ){
    const subviews = this._subviews || ( this._subviews = [] );
    subviews.push( subview );
    mount( subview );
    return this;
  }

  remove( subview ){
    const { _subviews } = this;
    _subviews.splice( _subviews.indexOf( subview ), 1 );
    unmount( subview );
  }

  render(){
    if( display.on ){
      const { _subviews } = this;
      if( _subviews )
        for( let i = _subviews.length; i--; )
          _subviews[i].render();

      this.onRender();
    }
  }
}

const ViewProto = View.prototype;
ViewProto.onKeyDown = ViewProto.onKeyUp = ViewProto.onKeyBack = ViewProto.onMount = ViewProto.onUnmount = ViewProto.onRender = function(){};

export class Application extends View {
  setScreen( s ){
    if( this.screen ) this.remove( this.screen );

    // Poke the display so it will be on after the screen switch...
    display.poke();

    this.insert( this.screen = s ).render();    
  }
  
  // Switch the screen
  static switchTo( screenName ){
    const { instance } = Application;
    logger.log('Switching to ' + screenName);
    instance.setScreen( new instance.screens[ screenName ]() );
  }

  static start( screen ){
    // Instantiate and mount an application.
    const app = Application.instance = new this();
    Application.switchTo( screen );
    mount( app );
    
    // Refresh UI when the screen in on.
    display.onchange = () => {
      app.render();
    }
    
    document.onkeypress = (e) => {
      logger.log('Keypressed ' + e.key);
      if( e.key === 'down' ) app.onKeyDown(e);
      else if( e.key === 'up' ) app.onKeyUp(e);
      else if( e.key === 'back' ) app.onKeyBack(e);
    }
  }

  onKeyDown(e){
    this.screen.onKeyDown(e); 
  }

  onKeyUp(e){
    this.screen.onKeyUp(e); 
  }

  onKeyBack(e){
    this.screen.onKeyBack(e); 
  }
}