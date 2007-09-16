/*
//test oncreate event
var cr = new LzDelegate(this, 'say');
cr.register(LzFactory, 'oncreate');

say = function(s) {
    alert(s);
}
*/

var canvas = LzFactory.create(LzView, document.body);

for ( var i = 0; i < 20; i++ ){
    var chil = LzFactory.create(LzView, canvas, {x : i*5 , y : i * 10, width: 50, height: 50});
    var gSign = LzFactory.create(LzView, chil, {x : 23, y: 12, id: 'gSign',  bgcolor: '#9900ff', resource : 'resc/h_c_open_sign.gif'});

    var gBan = LzFactory.create(LzView, chil , {x : 63 , y: 92 , width: 200,  bgcolor: '#009900', id: 'gBan' , resource : 'resc/h_c_web2con.gif'});

    //if ( i %20 == 0 ){
        chil.animate( 'x' , 100 + 10 * i , 3000 , true );
        gSign.animate( 'y' , 100 + 10 * i , 3000 , true );
        gBan.animate( 'width' , -100 - 1 * i , 3000 , true );
        //gSign.animate( 'rotation' , 360, 3000 , true );
    //}
}


//chil.onfoo = LzDeclaredEvent;
//tester = {};
//tester.say = function () { alert ( 'said' ) };

//var d = new LzDelegate( tester, 'say' );
//d.register( chil, 'onfoo' );

