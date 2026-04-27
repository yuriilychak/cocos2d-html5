/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var presentationSceneIdx = -1;
var centerPos = new cc.Point(0,0); // will be updated later
var images_path = 'Presentation/';

//------------------------------------------------------------------
//
// PresentationBaseLayer
//
//------------------------------------------------------------------
var PresentationBaseLayer = class PresentationBaseLayer extends BaseTestLayer {
	constructor() {

	//
	// VERY IMPORTANT
	//
	// Only subclasses of a native classes MUST call __associateObjectWithNative
	// Failure to do so, it will crash.
	//
		super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255));

	this._title =  "No title";
	this._subtitle = "No Subtitle";
	this.isMainTitle = false;

	}

	onEnter() {

	super.onEnter();

	var fontSize = 36;
	var tl = this._title.length;
	fontSize = (winSize.width / tl) * 1.60;
	if( fontSize/winSize.width > 0.09 ) {
		fontSize = winSize.width * 0.09;
	}

	this.label = new cc.LabelTTF(this._title, "Gill Sans", fontSize);
	this.addChild(this.label, 100);

	var isMain = this.isMainTitle;

	if( isMain === true ) {
		this.label.x = centerPos.x;
		this.label.y = centerPos.y;
	}
	else {
		this.label.x = winSize.width / 2;
		this.label.y = winSize.height*11/12 ;
	}

	var subStr = this._subtitle;
	if (subStr !== "") {
		tl = this._subtitle.length;
		var subfontSize = (winSize.width / tl) * 1.3;
		if( subfontSize > fontSize *0.4 ) {
			subfontSize = fontSize *0.4;
		}

		this.sublabel = new cc.LabelTTF(subStr, "Thonburi", subfontSize);
		this.addChild(this.sublabel, 90);
		if( isMain ) {
			this.sublabel.x = winSize.width / 2;
			this.sublabel.y = winSize.height*3/8;
		}
		else {
			this.sublabel.x = winSize.width / 2;
			this.sublabel.y = winSize.height*4/5;
		}
	} else
		this.sublabel = null;

    // Opacity in Menu
    var menu = this.getChildByTag(BASE_TEST_MENU_TAG);
    var item1 = menu.getChildByTag(BASE_TEST_MENUITEM_PREV_TAG);
    var item2 = menu.getChildByTag(BASE_TEST_MENUITEM_RESET_TAG);
    var item3 = menu.getChildByTag(BASE_TEST_MENUITEM_NEXT_TAG);

	[item1, item2, item3 ].forEach( function(item) {
		item.getNormalImage().opacity = 45;
		item.getSelectedImage().opacity = 45;
		} );

	// remove "super" titles
	this.removeChildByTag(BASE_TEST_TITLE_TAG);
	this.removeChildByTag(BASE_TEST_SUBTITLE_TAG);
}
	prevTransition() {
    return cc.TransitionSlideInL;
}
	nextTransition() {
    return cc.TransitionSlideInR;
}
	createBulletList() {
	var str = "";
	for(var i=0; i<arguments.length; i++)
	{
		if(i !== 0)
			str += "\n";
		str += '- ' + arguments[i];
	}

	var fontSize = winSize.height*0.07;
	var bullets = new cc.LabelTTF( str, "Gill Sans", fontSize );
	bullets.x = centerPos.x;
	bullets.y = centerPos.y;
	this.addChild( bullets, 80 );
}
	createImage( file ) {
	var sprite = new cc.Sprite( file );
	sprite.x = centerPos.x;
	sprite.y = centerPos.y;
	this.addChild( sprite, 70 );

	return sprite;
}
	onRestartCallback(sender) {
    var s = new PresentationScene();
    s.addChild(restartPresentationSlide());
    director.runScene(s);
}
	onNextCallback(sender) {
    var s = new PresentationScene();
    s.addChild(nextPresentationSlide());
    director.runScene(s);
}
	onBackCallback(sender) {
    var s = new PresentationScene();
    s.addChild(previousPresentationSlide());
    director.runScene(s);
}
	numberOfPendingTests() {
    return ( (arrayOfPresentation.length-1) - presentationSceneIdx );
}
	getTestNumber() {
    return presentationSceneIdx;
}
};
//
//
// callbacks
// automation
//------------------------------------------------------------------
//
// Intro Page
//
//------------------------------------------------------------------
var IntroPage = class IntroPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'cocos2d JS';
	this._subtitle = 'Game Development Kit';
	this.isMainTitle = true;
	}
};
//------------------------------------------------------------------
//
// Goal Page
//
//------------------------------------------------------------------
var GoalPage = class GoalPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Goals';
	this._subtitle = '';
	this.isMainTitle = false;

	this.createBulletList(
			'Rapid prototyping',
			'Rapid game development',
			'Multiplatform: Mobile & Web',
			'High quality code',
			'Good performance'
			);
	}
};
//------------------------------------------------------------------
//
// Solutions ?
//
//------------------------------------------------------------------
var SolutionsPage = class SolutionsPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Options';
	this._subtitle = '';
	this.isMainTitle = true;
	}
};
//------------------------------------------------------------------
//
// HTML5 engines ?
//
//------------------------------------------------------------------
var HTML5EnginesPage = class HTML5EnginesPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Options';
	this._subtitle = 'HTML5 engines';
	this.isMainTitle = false;

	this.createBulletList(
			'cocos2d HTML5',
			'Impact JS',
			'LimeJS',
			'Construct 2',
			'etc...'
			);
	}
};
//------------------------------------------------------------------
//
// Features
//
//------------------------------------------------------------------
var FeaturesHTML5Page = class FeaturesHTML5Page extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'HTML5 Features';
	this._subtitle = '';
	this.isMainTitle = false;

	this.createBulletList(
			'Rapid prototyping',
			'Rapid game development',
			'Multiplatform: Mobile & Web',
			'High quality code ???',
			'Good Performance ???'
			);
	}
};
//------------------------------------------------------------------
//
// ComparisonPage
//
//------------------------------------------------------------------
var ComparisonPage = class ComparisonPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'HTML5 Mobile performance';
	this._subtitle = 'Bad performance, even with accel frameworks';
	this.isMainTitle = false;

	this.createImage( images_path + 'comparison.png');

	}
};
//------------------------------------------------------------------
//
// WhatWeWantPage
//
//------------------------------------------------------------------
var WhatWeWantPage = class WhatWeWantPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Performance';
	this._subtitle = 'But what we want is...';
	this.isMainTitle = false;

	this.createBulletList(
			'Hundreds of sprites... at 60 FPS',
			'Physics... at 60 FPS',
			'Particles... at 60 FPS'
			);

	}
};
//------------------------------------------------------------------
//
// Chipmunk Page
//
//------------------------------------------------------------------
var ChipmunkPage = class ChipmunkPage extends PresentationBaseLayer {
	constructor() {

		super();

	// batch node
	this.batch = new cc.SpriteBatchNode( s_pathGrossini, 50 );
	this.addChild( this.batch );

	this.addSprite = function( pos ) {
		var sprite =  this.createPhysicsSprite( pos );
		this.batch.addChild( sprite );
	};

	this._title = 'Performance';
	this._subtitle = 'Physics and Sprites';

	this.initPhysics();

	this.initMenu();
	}

	onTogglePhysicsDebug() {
	this.debugNode.visible = ! this.debugNode.visible ;
}
	initMenu() {
	// menu
	cc.MenuItemFont.setFontSize( 16 );
	var menuItem = new cc.MenuItemFont('Toggle Physics Debug', this.onTogglePhysicsDebug, this);
	var menu = new cc.Menu( menuItem );
	this.addChild( menu, 99 );
	menu.x = winSize.width-80;
	menu.y = winSize.height-100;
}
	initPhysics() {
	this.space =  new cp.Space();
	var staticBody = this.space.getStaticBody();

	// Walls
	var walls = [new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),				// bottom
			new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),	// top
			new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),				// left
			new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)	// right
			];
	for( var i=0; i < walls.length; i++ ) {
		var wall = walls[i];
		wall.setElasticity(1);
		wall.setFriction(1);
		this.space.addStaticShape(wall);
	}

	// Gravity
	this.space.gravity = cp.v(0, -100);


	// Physics debug layer
	this.debugNode = new cc.PhysicsDebugNode( this.space.handle );
	this.debugNode.visible = false ;
	this.addChild( this.debugNode, 100 );
}
	createPhysicsSprite( pos ) {
	var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
	body.setPos( pos );
	this.space.addBody( body );
	var shape = cp.BoxShape( body, 48, 108);
	shape.setElasticity( 0.5 );
	shape.setFriction( 0.5 );
	this.space.addShape( shape );

	var sprite = new cc.PhysicsSprite(s_pathGrossini);
	sprite.setBody( body.handle );
	return sprite;
}
	onEnter() {
	super.onEnter();

	for(var i=0; i<20; i++) {
		var x = 40 + Math.random() * (winSize.width-80);
		var y = winSize.height/2 + Math.random() * 80;
		this.addSprite( cp.v(x, y) );
	}

    if( 'touches' in cc.sys.capabilities ){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function (touches, event) {
                var target = event.getCurrentTarget();
                var l = touches.length;
                for (var i = 0; i < l; i++) {
                    target.addSprite(touches[i].getLocation());
                }
            }
        }, this);
    } else if ('mouse' in cc.sys.capabilities )
       cc.eventManager.addListener({
           event: cc.EventListener.MOUSE,
           onMouseUp: function(event){
               event.getCurrentTarget().addSprite(event.getLocation());
           }
       }, this);
}
	onExitTransitionDidStart() {
	director.setDisplayStats( false );
}
	onEnterTransitionDidFinish() {
	director.setDisplayStats( true );

	this.scheduleUpdate();
}
	update( delta ) {
	this.space.step( delta );
}
};
//
//

// Menu

// init physics
//------------------------------------------------------------------
//
// Particles Page
//
//------------------------------------------------------------------
var ParticlesPage = class ParticlesPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Performance';
	this._subtitle = 'Particles';

	// var tex = cc.textureCache.addImage(s_fire);

	var firework = new cc.ParticleFireworks();
	// firework.texture = tex;
	this.addChild( firework );
	firework.x = centerPos.x;
	firework.y = centerPos.y;

	var sun = new cc.ParticleSun();
	// sun.texture = tex;
	this.addChild( sun );
	sun.x = winSize.width/4;
	sun.y = winSize.height/2;

	var meteor = new cc.ParticleMeteor();
	// meteor.texture = tex;
	this.addChild( meteor );
	meteor.x = winSize.width*3/4;
	meteor.y = winSize.height/2;

	var flower = new cc.ParticleSystem("Particles/Flower.plist");
	this.addChild( flower );
	flower.x = centerPos.x;
	flower.y = centerPos.y;

	this.particle = firework;

    if( 'touches' in cc.sys.capabilities ){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved: function(touches, event){
                var particle = event.getCurrentTarget().particle;
                var pos = touches[0].getLocation();
                particle.x = pos.x;
                particle.y = pos.y;
            },
            onTouchesEnded: function(touches, event){
                var particle = event.getCurrentTarget().particle;
                var pos = touches[0].getLocation();
                particle.x = pos.x;
                particle.y = pos.y;
            }
        }, this);
    } else if ('mouse' in cc.sys.capabilities )
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var particle = event.getCurrentTarget().particle;
                particle.x = event.getLocationX();
                particle.y = event.getLocationY();
            },
            onMouseUp: function(event){
                var particle = event.getCurrentTarget().particle;
                particle.x = event.getLocationX();
                particle.y = event.getLocationY();
            }
        }, this);

	this.onExitTransitionDidStart = function () {
		director.setDisplayStats( false );
	};

	this.onEnterTransitionDidFinish = function () {
		director.setDisplayStats( true );
	};
	}
};
//------------------------------------------------------------------
//
// HowToImprovePage
//
//------------------------------------------------------------------
var HowToImprovePage = class HowToImprovePage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Improving the performance';
	this._subtitle = 'Redefining "fast" for mobile';
	this.isMainTitle = true;
	}
};
//------------------------------------------------------------------
//
// HTML5AcceleratorPage
//
//------------------------------------------------------------------
var HTML5AcceleratorPage = class HTML5AcceleratorPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'HTML5 Mobile Accelerators';
	this._subtitle = '';
	this.isMainTitle = false;

	this.createImage( images_path + 'html5accelerator.png');
	}
};
//------------------------------------------------------------------
//
// GDKAcceleratorPage
//
//------------------------------------------------------------------
var GDKAcceleratorPage = class GDKAcceleratorPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'cocos2d Acceleration';
	this._subtitle = '';
	this.isMainTitle = false;

		this.createImage( images_path + 'gdkaccelerator.png');
	}
};
//------------------------------------------------------------------
//
// GDKComponentsPage
//
//------------------------------------------------------------------
var GDKComponentsPage = class GDKComponentsPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Components';
	this._subtitle = '';
	this.isMainTitle = false;

	this.createBulletList(
			'Game engine: cocos2d',
			'Physics engine: Chipmunk',
			'World Editor: CocosBuilder'
			);
	}
};
//------------------------------------------------------------------
//
// CocosStatusPage
//
//------------------------------------------------------------------
var CocosStatusPage = class CocosStatusPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Game Engine';
	this._subtitle = '';
	this.isMainTitle = false;

    this.createImage( images_path + 'cocos2d_status.png' );
	}
};
//------------------------------------------------------------------
//
// ChipmunkStatusPage
//
//------------------------------------------------------------------
var ChipmunkStatusPage = class ChipmunkStatusPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Physics Engine';
	this._subtitle = '';
	this.isMainTitle = false;

    this.createImage( images_path + 'chipmunk_status.png' );
	}
};
//------------------------------------------------------------------
//
// CCBStatusPage
//
//------------------------------------------------------------------
var CCBStatusPage = class CCBStatusPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'World Editor';
	this._subtitle = '';
	this.isMainTitle = false;

    this.createImage( images_path + 'cocosbuilder_status.png' );
	}
};
//------------------------------------------------------------------
//
// WhoIsUsingItPage
//
//------------------------------------------------------------------
var WhoIsUsingItPage = class WhoIsUsingItPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = "Who is using it";
	this._subtitle = '';
	this.isMainTitle = false;

	// Add companies that are using it
	this.createBulletList(
                'Zynga',
				'...and you ?'
                );
	}
};
//------------------------------------------------------------------
//
// DemoPage
//
//------------------------------------------------------------------
var DemoPage = class DemoPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Demo';
	this._subtitle = '';
	this.isMainTitle = true;
	}
};
//------------------------------------------------------------------
//
// Thanks
//
//------------------------------------------------------------------
var ThanksPage = class ThanksPage extends PresentationBaseLayer {
	constructor() {

		super();

	this._title = 'Thanks';
	this._subtitle = '';
	this.isMainTitle = true;
	}
};
//
// Entry point
//

var PresentationScene = class PresentationScene extends TestScene {
    runThisTest() {
        presentationSceneIdx = -1;
        centerPos = new cc.Point(winSize.width/2, winSize.height/2);
        var layer = nextPresentationSlide();
        this.addChild(layer);
        director.runScene(this);
    }
};

//
// Flow control
//
var arrayOfPresentation = [
	IntroPage,
	GoalPage,
	HTML5EnginesPage,
	FeaturesHTML5Page,
	ComparisonPage,
	WhatWeWantPage,
	ChipmunkPage,
	ParticlesPage,
	HowToImprovePage,
	HTML5AcceleratorPage,
	GDKAcceleratorPage,
	GDKComponentsPage,
	// CocosStatusPage,
	// ChipmunkStatusPage,
	// CCBStatusPage,
	DemoPage,
	WhoIsUsingItPage,
	ThanksPage
];

var nextPresentationSlide = class nextPresentationSlide {
	constructor() {
    presentationSceneIdx++;
    presentationSceneIdx = presentationSceneIdx % arrayOfPresentation.length;

    return new arrayOfPresentation[presentationSceneIdx]();
	}
};
var previousPresentationSlide = class previousPresentationSlide {
	constructor() {
    presentationSceneIdx--;
    if (presentationSceneIdx < 0)
        presentationSceneIdx += arrayOfPresentation.length;

    return new arrayOfPresentation[presentationSceneIdx]();
	}
};
var restartPresentationSlide = class restartPresentationSlide {
	constructor() {
    return new arrayOfPresentation[presentationSceneIdx]();
	}
};