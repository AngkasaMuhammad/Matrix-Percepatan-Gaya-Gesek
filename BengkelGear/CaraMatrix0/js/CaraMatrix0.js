"use strict"
//calculator persamaan matrix https://www.emathhelp.net/en/calculators/algebra-2/system-of-linear-equations-calculator/
//di fungsi katsetr, ok udah dibikin

let cm = {}
siappakai.mulai(async aa=>{
	
	let que = ru.que
	let sp = siappakai
	let log = sp.log
	let v2 = wgpuMatrix.vec2
	let v3 = wgpuMatrix.vec3
	let m3 = wgpuMatrix.mat3
	let m4 = wgpuMatrix.mat4
	let m3dide = m4.identity()
	let cx2d = sp.context2d()
	let w = sp.canvas2d().width
	let h = sp.canvas2d().height
	
	log('Cara Matrix 0 js')
let acx = cm.acx = new AudioContext()
let bufarr = []
acx.suspend()
let bikinaud = async que=>{
	let nama = que
	let aud = document.querySelector(que).href
	aud = await fetch(aud)
	aud = await aud.arrayBuffer()
	aud = await acx.decodeAudioData(aud)
	log(nama+' '+aud.duration.toFixed(3)+' s')
	return aud
}
let bikinbuf = (aud,posbar,mulai,offset,durasi,vol,)=>{
	//posbar -->> posisi slider
	//mulai -->> detik mulai
	
	let buf = acx.createBufferSource()
	buf.buffer = aud
	let gain = acx.createGain()
	gain.gain.value = vol
	buf.connect(gain).connect(acx.destination)
	buf.start(
		Math.max(acx.currentTime+mulai-posbar,0,),
		Math.max(-mulai+posbar,0,)+offset,
		isFinite(durasi)?durasi:Number.MAX_SAFE_INTEGER,
	)
	bufarr.push(buf)
	return buf
}
let audbwggg = await bikinaud('#suarabwggg')
let audtak = await bikinaud('#suaratak')
let audwus = await bikinaud('#suarawus')
let audduar = await bikinaud('#suaraduar')
let audmulai = await bikinaud('#suaramulai')

let timeoffset = 0//posisi time dari currentTime
let isplaying = false
let setbuftime = cm.setbuftime = ()=>{
	for(let buf of bufarr){
		buf.stop()
	}
	ru.habisarr(bufarr)
	let p = +(cmui.time?.value??0)
	daftarsuara(p)
	timeoffset = acx.currentTime-p
	isplaying && acx.resume()
}
cm.pausetime = ()=>{
	acx.suspend()
}
cm.play = ()=>{
	acx.resume()
	isplaying = true
}
cm.pause = ()=>{
	acx.suspend()
	isplaying = false
}
let bikinimg = async que=> new Promise(res=>{
	let img = new Image()
	img.src = document.querySelector(que).href
	img.addEventListener('load',e=>res(img),)
})
let bikinkatrol = ()=>{
	let kat = sp.newobj('rangkakatrol').m3d
	let rsab = sp.newobj('rangkasabuk')
	let sab = rsab.m3d
	
	return {
		kat,
		sab,
		r:4,
		st:rsab.node.mat2d[0],//sabuk texture
	}
}
let katsetr = (ks0,ks1,)=>{//katrol set jarijari
	let m3d0 = ks0.kat
	let r = ks0.r
	let s = r/4
	let m = null
	m4.scaling([s,1,s,],m3d0.tengah,)
	r = Math.abs(r)/4-1
	m3d0.atas[13] = -r
	m3d0.bawah[13] = r
	
	//sambung sabuk
	let msab = ks0.sab.rangkasabuk
	let m0 = m3d0.rangkakatrol
	let m1 = ks1.kat.rangkakatrol
	let j = v3.dist(//jarak 2 poros
		[m0[12],m0[13],m0[14],],
		[m1[12],m1[13],m1[14],],
	)
	let rsel = ks0.r-ks1.r//selisih r0 r1
	let sudut = Math.asin(rsel/j)
	m4.aim(
		m4.getTranslation(m0),
		m4.getTranslation(m1),
		[0,1,0,],
		msab,
	)
	m4.rotateY(msab,sudut,msab,)
	m4.translate(msab,[-ks0.r,0,0],msab,)
	let len = Math.sqrt(-rsel*rsel+j*j)
	m4.scale(msab,[1,1,len,],msab,)
	m4.translate(msab,[0,0,.5],msab,)
	
	let m2dsab = ks0.st
	m2dsab[0] = len
}
let movekat = (kat,y,)=>{
	kat.kat.rangkakatrol[13] = y
}
let movepor = (por,x,z,)=>{
	let m = por.m3d.rangkaporos
	m[12] = x
	m[14] = z
}
let katkepor = (por,katarr,)=>{
	let mp = por.m3d.rangkaporos
	let ymin = Number.MAX_SAFE_INTEGER
	let ymax = -ymin
	for(let kat of katarr){
		let mk = kat.kat.rangkakatrol
		mk[12] = mp[12]
		mk[14] = mp[14]
		
		ymin = Math.min(mk[13],ymin,)
		ymax = Math.max(mk[13],ymax,)
	}
	mp[5] = (ymax-ymin)/2+3
	mp[13] = (ymax+ymin)/2
	
}
sp.settimeout(0)
sp.updsinar(0xffffff33)
sp.updbayangan(0x00000044)

let introobj = []
for(let draw of pl.drawarr){
	introobj.push(sp.newobj(draw.name))
}

sp.newobj('rangkagrid')
sp.newobj('rangkaxyz')
let por0 = sp.newobj('rangkaporos')		;movepor(por0,-6,0,)
let por1 = sp.newobj('rangkaporos')		;movepor(por1,11,19,)
let por2 = sp.newobj('rangkaporos')		;movepor(por2,3,-14,)
let por3 = sp.newobj('rangkaporos')		;movepor(por3,22,0,)

let m //-=-=-=-=-=-=
let ks0 = bikinkatrol()		;ks0.r = .8		;movekat(ks0,2.2,)
let ks1 = bikinkatrol()		;ks1.r = 4.4		;movekat(ks1,-5,)
let ks2 = bikinkatrol()		;ks2.r = 3		;movekat(ks2,1.3,)
let ks3 = bikinkatrol()		;ks3.r = -4.5		;movekat(ks3,9,)
let ks4 = bikinkatrol()		;ks4.r = 2.1		;movekat(ks4,8,)
katkepor(por0,[ks0],)
katkepor(por1,[ks1],)
katkepor(por2,[ks2,ks3,],)
katkepor(por3,[ks4],)

	katsetr(ks0,ks1,)
	katsetr(ks1,ks2,)
	katsetr(ks2,ks0,)

	katsetr(ks3,ks4,)
	katsetr(ks4,ks3,)

let imgtak = await bikinimg('#imgtak')
let imgaugmat = await bikinimg('#imgaugmat')
let imgyoyo = await bikinimg('#imgyoyo')
let imgchatgpt = await bikinimg('#imgchatgpt')
let imgsalam = await bikinimg('#imgsalam')

let porarr = {
	'0'	:por0.m3d.rangkaporos	,
	'1'	:por1.m3d.rangkaporos	,
	'2'	:por2.m3d.rangkaporos	,
	'3'	:por3.m3d.rangkaporos	,
}
let katarr = {
	'A'	:ks0.kat.rangkakatrol	,
	'B'	:ks1.kat.rangkakatrol	,
	'C'	:ks2.kat.rangkakatrol	,
	'D'	:ks3.kat.rangkakatrol	,
	'E'	:ks4.kat.rangkakatrol	,
}
let sabarr = {
	'4':[
		katarr['A'],
		katarr['B'],
		katarr['C'],
	],
	'5':[
		katarr['D'],
		katarr['E'],
	],
}

let kosongjadi0 = [//9 = lewat, 5 = tempel
	[9,5,5,5,5,5,9,5,5,5,5,9,],
	[5,9,5,5,5,5,5,9,5,5,5,9,],
	[5,5,9,5,5,5,5,5,9,9,5,9,],
	[5,5,5,9,5,5,5,5,5,5,9,9,],
	[5,5,5,5,9,5,9,9,9,5,5,9,],
	[5,5,5,5,5,9,5,5,5,9,9,9,],
	[9,5,5,5,9,5,5,5,5,5,5,5,],
	[5,9,5,5,9,5,5,5,5,5,5,5,],
	[5,5,9,5,9,5,5,5,5,5,5,5,],
	[5,5,9,5,5,9,5,5,5,5,5,5,],
	[5,5,5,9,5,9,5,5,5,5,5,5,],
]
let mkexy = m=>{ //posisi dari 3d ke 2d
	
	let mini = m4.mul(camera.matview,m,)
	
	//cek jika posisi di depan kamera
	if(mini[15] < 0){return null}
	
	return {
		x:( mini[12]/mini[15]  +1 )*w/2,
		y:( -mini[13]/mini[15]  +1 )*h/2,
	}
}
let tablex0 = 77
let tablex1 = 566
let tabley = 55
let tablerow = 11
let tablecol = tablerow+1
let tables = 26

let f_ta = (x,)=>{ //table aug matrix
	let y = tabley
	let row = tablerow
	let col = tablecol
	let s = tables
	cx2d.fillRect(x,y,s*col,s*row,)
	cx2d.strokeRect(x,y,s*col,s*row,)
	cx2d.beginPath()
	for(let a = 1;a < row;a++){
		cx2d.moveTo(	x	,y+s*a	,)
		cx2d.lineTo(	x+s*col	,y+s*a	,)
		cx2d.moveTo(	x+s*a	,y	,)
		cx2d.lineTo(	x+s*a	,y+s*row	,)
	}
	cx2d.moveTo(	x+s*row-2	,y	,)
	cx2d.lineTo(	x+s*row-2	,y+s*row	,)
	cx2d.moveTo(	x+s*row+2	,y	,)
	cx2d.lineTo(	x+s*row+2	,y+s*row	,)
	cx2d.stroke()
}

let f_rc = (rc,x,pos,)=>{
//baris:true atau kolom:false, posisi
cx2d.save()
	let y = tabley
	let row = tablerow
	let col = tablecol
	let s = tables
	rc?
	cx2d.rect(
		x,
		y+pos*s,
		s*row,
		s,
	):
	cx2d.rect(
		x+pos*s,
		y,
		s,
		s*row,
	)
cx2d.restore()
}

let f_dia = x=>{
	let y = tabley
	let row = tablerow
	let s = tables
	for(let a = 0;a < row;a++){
		let b = a*s
		cx2d.strokeRect(x+b,y+b,s,s,)
	}
}

let f_cell = (x,r,c,)=>{
	let y = tabley
	let s = tables
	cx2d.strokeRect(x+c*s,y+r*s,s,s,)
}

let f_pos = (x,r,c,)=>{
	let y = tabley
	let s = tables
	return { x:x+(c+.5)*s, y:y+(r+.5)*s, }
}
let daftarsuara = p=>{
bikinbuf(audbwggg,p,0,0,NaN,4,);/*-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-*/bikinbuf(audmulai,p,6,1,NaN,1,);/*-	-	-	-	-	-	-	-	-	-	-	-	-	-*/
															bikinbuf(audwus,p,2.5,3,NaN,.5,);		bikinbuf(audtak,p,3.3,0,NaN,.5,);				bikinbuf(audduar,p,4,0,NaN,1,);		
																											bikinbuf(audtak,p,3.55,0,NaN,.5,);
};		setbuftime();		sp.render(dt=>{

if(acx.state === 'running'){
	cmui.time.value = acx.currentTime-timeoffset
}
let t = +cmui.time.value
let tini = 0
cx2d.clearRect(-11,-11,w+11,h+11,)
//		---

let t0 = 2.5
if(
	t0 < t &&
	t < t0+1
){
	let x = (t-t0)/.5
	let rgb = ru.acak(255)
	cx2d.fillStyle = ru.rgba(
		rgb,rgb,rgb,1,
	)
cx2d.save()
	cx2d.font = '88px Impact'
	cx2d.setTransform(1,0,.5,1,-222,0,)
	cx2d.fillText('WOW',x*w,111,)
	cx2d.fillText('WOW',(1-x)*w,222,)
	cx2d.fillText('WOW',x*w,333,)
	cx2d.fillText('WOW',(1-x)*w,444,)
	cx2d.fillText('WOW',x*w,555,)
	cx2d.fillText('WOW',(1-x)*w,666,)
cx2d.restore()
}
//wow								---
//-	-	-	-	-	-	-	-	-	-	-	-	
let t1 = t0+1
if(
	t1 < t &&
	t < t1+.2
){
cx2d.save()
	cx2d.drawImage(imgtak,111,222,222,188,)
	cx2d.font = '222px Impact'
	cx2d.fillStyle = '#000077ff'
	cx2d.fillText('G',w/2-144,h/2,)
cx2d.restore()
}else

if(
	t1+.2 < t &&
	t < t1+.4
){
cx2d.save()
	cx2d.drawImage(imgtak,555,266,444,377,)
	cx2d.font = '277px Impact'
	cx2d.fillStyle = '#000077ff'
	cx2d.fillText('G',w/2+144,h/2,)
cx2d.restore()
}

//GG										---
let t2 = t1+.4
if(
	t2 < t &&
	t < t2+2
){
cx2d.save()
	cx2d.scale(
		1+Math.random()*.1,
		1+Math.random()*.1,
	)
	cx2d.textAlign = 'center'
	cx2d.font = '222px Impact'
	cx2d.fillStyle = '#770077ff'
	cx2d.fillText('Gearing',w/2,h/2,)
cx2d.restore()
}

//Gearing						---
let t3 = t2+11
if(
	t3 < t &&
	t < t3+2
){
cx2d.save()
	cx2d.setTransform(3,0,0,3,0,0,)
	cx2d.drawImage(imgaugmat,33,22,)
cx2d.restore()
}

//imgaugmat		--
let t4 = t3+2
if(
	t4 < t &&
	t < t4+4
){
cx2d.save()
	cx2d.textAlign = 'center'
	cx2d.font = '55px Impact'
	cx2d.fillStyle = '#770077ff'
	cx2d.fillText('percepatan & gaya gesek',w/2,h/2+22*11,)
cx2d.restore()
}

//percepatan & gaya gesek	--
let t5 = t4+8
if(
	t5 < t &&
	t < 78
){
let tini = t-t5
cx2d.save()
	let y = tabley
	cx2d.fillStyle = '#002200dd'
	cx2d.strokeStyle = '#00aa00ff'
	f_ta(tablex0)
	f_ta(tablex1)
	// =
	cx2d.fillStyle = ru.rgba(
		Math.random()*111,
		Math.random()*111,
		Math.random()*111,
		1,
	)
	cx2d.setTransform(1,0,0,1,Math.random()*6,Math.random()*6,)
	cx2d.fillRect(444,y+111,66,17,)
	cx2d.fillRect(444,y+155,66,17,)
cx2d.restore()
}

//augmat	--
let t6 = t5+2
if(
	t6 < t &&
	t < t6+13
){
let r = Math.random
cx2d.save()
	cx2d.textAlign = 'center'
	cx2d.font = '33px Impact'
	cx2d.fillStyle = '#440000ff'
	cx2d.fillText('jumlah poros',w/2,h/2+33*3,)
	cx2d.fillText('+jumlah sabuk',w/2,h/2+33*4,)
	cx2d.fillText('+jumlah katrol',w/2,h/2+33*5,)
	
	cx2d.fillText('4',w/2+144+r()*3 ,h/2+33*3+r()*3,)
	cx2d.fillText('+2',w/2+144+r()*3 ,h/2+33*4+r()*3,)
	cx2d.fillText('+5',w/2+144+r()*3 ,h/2+33*5+r()*3,)
	
	cx2d.font = '44px Impact'
	cx2d.fillText(tablerow+' x '+tablecol,w/2,h/2+222,)
	
cx2d.restore()
}

//jumlah	--
let t7 = t6+8
if(
	t7 < t &&
	t < t7+2
){
let tini = t-t7
cx2d.save()
	let x0 = tablex0
	let x1 = tablex1
	cx2d.fillStyle = ru.rgba(
		255,255,255,Math.random(),
	)
	cx2d.lineWidth = 4
	cx2d.beginPath()
	f_rc(false,x0,11,)
	f_rc(false,x1,11,)
	cx2d.fill()
cx2d.restore()
}

//kolom kanan	--
let t8 = t7+10.5
if(
	t8 < t &&
	t < t8+2
){
cx2d.save()
	let x0 = tablex0
	let x1 = tablex1
	cx2d.strokeStyle = ru.rgba(
		Math.random()*255,255,255,Math.random(),
	)
	cx2d.lineWidth = 4
	f_dia(x0)
cx2d.restore()
}


if(
	t8-2 < t &&
	t < t8+5
){
let str = (t < t8+2)?['m','I',]:['F','T',]

cx2d.save()
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = ((Date.now()%1000) < 666)?'#ff0000ff':'#00ff00ff'
	cx2d.fillStyle = ((Date.now()%1000) < 333)?'#0000ffff':cx2d.fillStyle
	for(let nama in sabarr){
		let tot = [0,0,]
		let len = 0
		cx2d.beginPath()
		for(let m of sabarr[nama]){
			let xy = mkexy(m)
			if(!xy){continue}
			let {x,y,} = xy
			tot[0] += x
			tot[1] += y
			len++
			cx2d.lineTo(x,y,)
		}
		cx2d.closePath()
		let x = tot[0]/len
		let y = tot[1]/len
		cx2d.fillText(str[0]+nama,x,y,)
		cx2d.save()
			cx2d.lineWidth = 11
			cx2d.fillStyle = 
			cx2d.strokeStyle = ((Date.now()%1000) < 500)?'#00ff0066':'#00ff0033'
			cx2d.fill()
			cx2d.stroke()
		cx2d.restore()
	}
	for(let nama in porarr){
		let xy = mkexy(porarr[nama])
		if(!xy){continue}
		let {x,y,} = xy
		cx2d.fillText(str[1]+nama,x,y,)
	}
	
cx2d.restore()
}


if(
	t8 < t &&
	t < 78
){
cx2d.save()
	let x0 = tablex0
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = 'white'
	;({x,y,} = f_pos(x0,0,0,)); cx2d.fillText('I0',x,y+7,)
	;({x,y,} = f_pos(x0,1,1,)); cx2d.fillText('I1',x,y+7,)
	;({x,y,} = f_pos(x0,2,2,)); cx2d.fillText('I2',x,y+7,)
	;({x,y,} = f_pos(x0,3,3,)); cx2d.fillText('I3',x,y+7,)
	;({x,y,} = f_pos(x0,4,4,)); cx2d.fillText('m4',x,y+7,)
	;({x,y,} = f_pos(x0,5,5,)); cx2d.fillText('m5',x,y+7,)
cx2d.restore()
}
//diagonal inertia & massa	--
let t9 = t8+3.5
if(
	t9 < t &&
	t < t9+1.5
){
cx2d.save()
	let x0 = tablex0
	let x1 = tablex1
	cx2d.strokeStyle = ru.rgba(
		Math.random()*255,255,255,Math.random(),
	)
	cx2d.lineWidth = 4
	cx2d.beginPath()
	f_rc(false,x0,11,)
	cx2d.stroke()
cx2d.restore()
}


if(
	t9 < t &&
	t < 78
){
cx2d.save()
	let x0 = tablex0
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = 'white'
	;({x,y,} = f_pos(x0,0,11,)); cx2d.fillText('T0',x,y+7,)
	;({x,y,} = f_pos(x0,1,11,)); cx2d.fillText('T1',x,y+7,)
	;({x,y,} = f_pos(x0,2,11,)); cx2d.fillText('T2',x,y+7,)
	;({x,y,} = f_pos(x0,3,11,)); cx2d.fillText('T3',x,y+7,)
	;({x,y,} = f_pos(x0,4,11,)); cx2d.fillText('F4',x,y+7,)
	;({x,y,} = f_pos(x0,5,11,)); cx2d.fillText('F5',x,y+7,)
cx2d.restore()
}
//kolom kanan	--
let t10 = t9+3.5
if(
	t10 < t &&
	t < t10+5
){
cx2d.save()
	let x0 = tablex0
	let row = tablerow
	cx2d.strokeStyle = ru.rgba(
		Math.random()*255,255,255,Math.random(),
	)
	cx2d.lineWidth = 4
	cx2d.beginPath()
	if(t < t10+2){	f_rc(false,x0,0,)	}else
	if(t10+3 < t){	f_rc(false,x0,4,)	}
	cx2d.stroke()
cx2d.restore()
}


if(
	t10 < t &&
	t < 78
){
cx2d.save()
	let x0 = tablex0
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = '#ffffaaff'
	;({x,y,} = f_pos(x0,6,0,)); cx2d.fillText('rA',x,y+7,)
	;({x,y,} = f_pos(x0,6,4,)); cx2d.fillText('1',x,y+7,)
	if(t10+6 < t){
	;({x,y,} = f_pos(x0,7,1,)); cx2d.fillText('rB',x,y+7,)
	;({x,y,} = f_pos(x0,7,4,)); cx2d.fillText('1',x,y+7,)
	;({x,y,} = f_pos(x0,8,2,)); cx2d.fillText('rC',x,y+7,)
	;({x,y,} = f_pos(x0,8,4,)); cx2d.fillText('1',x,y+7,)
	;({x,y,} = f_pos(x0,9,2,)); cx2d.fillText('rD',x,y+7,)
	;({x,y,} = f_pos(x0,9,5,)); cx2d.fillText('1',x,y+7,)
	;({x,y,} = f_pos(x0,10,3,)); cx2d.fillText('rE',x,y+7,)
	;({x,y,} = f_pos(x0,10,5,)); cx2d.fillText('1',x,y+7,)
	
	}
cx2d.restore()
}


if(
	t10-2 < t &&
	t < t10+5
){
cx2d.save()
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = ((Date.now()%1000) < 666)?'#ff0000ff':'#00ff00ff'
	cx2d.fillStyle = ((Date.now()%1000) < 333)?'#0000ffff':cx2d.fillStyle
	for(let nama in katarr){
		let xy = mkexy(katarr[nama])
		if(!xy){continue}
		let {x,y,} = xy
		cx2d.fillText('r'+nama,x,y,)
	}
	
cx2d.restore()
}
//kolom jarijari	--
let t11 = t10+9
if(
	t11 < t &&
	t < 78
){
cx2d.save()
	let x1 = tablex1
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = '#77ffff99'
	for(let a = 0;a < 11;a++){
	for(let b = 0;b < 11;b++){
		({x,y,} = f_pos(x1,a,b,)); cx2d.fillText(+(a == b),x,y+7,)
	}
	}
	
cx2d.restore()
}
//identitas	--
let t12 = t11+4
if(
	t12 < t &&
	t < 78
){
cx2d.save()
	let x1 = tablex1
	let x,y
	cx2d.font = '17px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = 'white'
	;({x,y,} = f_pos(x1,0,11,)); cx2d.fillText('a0',x,y+7,)
	;({x,y,} = f_pos(x1,1,11,)); cx2d.fillText('a1',x,y+7,)
	;({x,y,} = f_pos(x1,2,11,)); cx2d.fillText('a2',x,y+7,)
	;({x,y,} = f_pos(x1,3,11,)); cx2d.fillText('a3',x,y+7,)
	;({x,y,} = f_pos(x1,4,11,)); cx2d.fillText('a4',x,y+7,)
	;({x,y,} = f_pos(x1,5,11,)); cx2d.fillText('a5',x,y+7,)
	
	;({x,y,} = f_pos(x1,6,11,)); cx2d.fillText('FgA',x,y+7,)
	;({x,y,} = f_pos(x1,7,11,)); cx2d.fillText('FgB',x,y+7,)
	;({x,y,} = f_pos(x1,8,11,)); cx2d.fillText('FgC',x,y+7,)
	;({x,y,} = f_pos(x1,9,11,)); cx2d.fillText('FgD',x,y+7,)
	;({x,y,} = f_pos(x1,10,11,)); cx2d.fillText('FgE',x,y+7,)
	
cx2d.restore()
}
//kolom kanan	--
let t13 = t12+3
if(
	t13 < t &&
	t < 78
){
cx2d.save()
	let x0 = tablex0
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = '#ffffaaff'
;({x,y,} = f_pos(x0,0,6,)); cx2d.fillText('rA',x,y+7,)
;({x,y,} = f_pos(x0,4,6,)); cx2d.fillText('1',x,y+7,)
;({x,y,} = f_pos(x0,1,7,)); cx2d.fillText('rB',x,y+7,)
;({x,y,} = f_pos(x0,4,7,)); cx2d.fillText('1',x,y+7,)
;({x,y,} = f_pos(x0,2,8,)); cx2d.fillText('rC',x,y+7,)
;({x,y,} = f_pos(x0,4,8,)); cx2d.fillText('1',x,y+7,)
;({x,y,} = f_pos(x0,2,9,)); cx2d.fillText('rD',x,y+7,)
;({x,y,} = f_pos(x0,5,9,)); cx2d.fillText('1',x,y+7,)
;({x,y,} = f_pos(x0,3,10,)); cx2d.fillText('rE',x,y+7,)
;({x,y,} = f_pos(x0,5,10,)); cx2d.fillText('1',x,y+7,)
	
cx2d.restore()
}
//simetri	--
let t14 = t13+2
if(
	t14 < t &&
	t < 78
){
cx2d.save()
	let x0 = tablex0
	let x,y
	cx2d.font = '20px Consolas'
	cx2d.textAlign = 'center'
	cx2d.fillStyle = '#ffffaa77'
	for(let a in kosongjadi0){
		let arr = kosongjadi0[a = +a]
		for(let b in arr){
			if(arr[b = +b] === 9){continue}
			;({x,y,} = f_pos(x0,a,b,)); cx2d.fillText('0',x,y+7,)
		}
	}
	
cx2d.restore()
}
//kosong dengan 0	--
if(
	72 < t &&
	t < 79
){
cx2d.save()
	//cx2d.textAlign = 'center'
	cx2d.font = '33px Impact'
	cx2d.fillStyle = '#ff4400ff'
	cx2d.fillText('Augmented matrix calculator:',111,444,)
	cx2d.font = '22px Impact'
	cx2d.fillText('ChatGPT:',111,500,)
	cx2d.drawImage(imgchatgpt,333,555,222,222,)
cx2d.restore()
}
//calculator	--
if(
	81 < t &&
	t < 83
){
cx2d.save()
	cx2d.drawImage(imgsalam,222,222,222,221,)
cx2d.restore()
}
//	--//-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	
//-	-	-	-	-	-	-	-	-	-	
//-	-	-	-	-	-	-	-	-	-	-	

if(
	t2 < t &&
	t < t2+2
){
	for(let obj of introobj){
		let m = obj.node.matlok
		
		m4.translation([
			(Math.random()-.5)*22,
			(Math.random()-.5)*22,
			(Math.random()-.5)*22,
		],m,)
		m4.rotate(m,[
			Math.random()-.5,
			Math.random()-.5,
			Math.random()-.5,
		],Math.random()*5,m,)
		m4.scale(m,[2,2,2,],m,)
		m[15] = .6+Math.random()*.1
	}
}else{
	for(let obj of introobj){
		let m = obj.node.matlok
		m.fill(0)
		m[15] = 1
	}
}

//Gearing							---//	-	-	-	
//m3d putaran katrol
let mp0 = por0.m3d.b0
let mp1 = por1.m3d.b0
let mp2 = por2.m3d.b0
let mp3 = por3.m3d.b0
let v4 = 7
let v5 = v4/ks2.r*ks3.r
let putar0 = v4/ks0.r*dt*.0001
let putar1 = v4/ks1.r*dt*.0001
let putar2 = v4/ks2.r*dt*.0001
let putar3 = v5/ks3.r*dt*.0001
m4.rotateY(mp0,putar0,mp0,)
m4.rotateY(mp1,putar1,mp1,)
m4.rotateY(mp2,putar2,mp2,)
m4.rotateY(mp3,putar3,mp3,)

let mk0 = ks0.kat.b0
let mk1 = ks1.kat.b0
let mk2 = ks2.kat.b0
let mk3 = ks3.kat.b0
let mk4 = ks4.kat.b0
m4.copy(mp0,mk0,)
m4.copy(mp1,mk1,)
m4.copy(mp2,mk2,)
m4.copy(mp2,mk3,)
m4.copy(mp3,mk4,)
ks0.st[8] += v4*dt*.0001
ks1.st[8] += v4*dt*.0001
ks2.st[8] += v4*dt*.0001
ks3.st[8] += v5*dt*.0001
ks4.st[8] += v5*dt*.0001
//sampe sini, cepat sabuk
})

})
