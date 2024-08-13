"use strict"

let bg = {}
siappakai.mulai(aa=>{
	
	let sp = siappakai
	let log = sp.log
	let v3 = wgpuMatrix.vec3
	let m3 = wgpuMatrix.mat3
	let m4 = wgpuMatrix.mat4
	let m3dide = m4.identity()
	
	log('Bengkel Gear js')
let obj = bg.obj = {}
let id = 0
bg.newporos = ()=>{
	let rangka = sp.newobj('rangkaporos')
	let node = rangka.node
	let b0 = node.chi[1]
	
	return obj['obj'+id++] = {
		rangka,
		m:node.matlok,
		mb0:b0.matlok,
		connarr:[],//connector
		move:bg.moveporos,
		resize:resizeporos,
	}
}
bg.newsabuk = ()=>{
	let rangka = sp.newobj('rangkagrid')
	let node = rangka.node
	
	return obj['obj'+id++] = {
		rangka,
		m:node.matlok,
		connarr:[],//connector
		move:bg.movesabuk,
	}
	
	//rumus posisi sabuk di 2 katrol
	// https://www.tec-science.com/mechanical-power-transmission/belt-drive/calculation-of-the-belt-length/
}
bg.pasangkatrol = (poros,sabuk,)=>{
	let rangka = sp.newobj('rangkakatrol')
	let node = rangka.node
	
	let mk = node.matlok
	let mp = poros.m
	let ms = sabuk.m
	m4.translate(mk,[
		mp[12],
		ms[13],
		mp[14],
	],mk,)
	
	//=-=-=-=-=-=-=-
	//sampe sini, connarr push
	let o = obj['obj'+id++] = {
		rangka,
		m:node.matlok,
		poros,
		sabuk,
		move:movekatrol,
	}
	poros.connarr.push(o)
	sabuk.connarr.push(o)
	
	return o
}
bg.pasangdiff = (sabuk0,poros,sabuk1,)=>{
	
}
bg.moveporos = (poros,v,)=>{
	let m = poros.m
	m[12] = v[0]
	m[14] = v[2]
	
	//=-=-=-=-=-=-=-
	for(let conn of poros.connarr){
		conn.move(conn)
	}
}
bg.movesabuk = (sabuk,v,)=>{
	let m = sabuk.m
	m[13] = v[1]
	
	//=-=-=-=-=-=-=-
	for(let conn of sabuk.connarr){
		conn.move(conn)
	}
}
let movekatrol = katrol=>{
	let poros = katrol.poros
	let pm = poros.m
	let sm = katrol.sabuk.m
	let km = katrol.m
	km[12] = pm[12]
	km[13] = sm[13]
	km[14] = pm[14]
	
	poros.resize = resizeporos
}
let movediff = diff=>{
	
}
let resizeporos = poros=>{
	let ymax = -99999
	let ymin = 99999
	for(let {m:{13:y}} of poros.connarr){
		ymax = Math.max(ymax,y,)
		ymin = Math.min(ymin,y,)
	}
	poros.m[13] = (ymax+ymin)/2
	poros.m[5] = (ymax-ymin)/2+3
	
	poros.resize = null
}
sp.settimeout(33)
sp.updsinar(0xffffff33)
sp.updbayangan(0x00000044)
//coba
let s = bg.newsabuk()
let p = bg.newporos()
let s1 = bg.newsabuk()
bg.pasangkatrol(p,s,)
bg.pasangkatrol(p,s1,)
let v = v3.create()

s1.move(s1,[0,11,7,],)
sp.render(dt=>{
v3.addScaled(v,[dt*1,dt*2,dt*3,],.001,v,)
p.move(p,v,)
s.move(s,v,)

for(let str in obj){
	let objini = obj[str]
	objini.resize?.(objini)
}
})

})
