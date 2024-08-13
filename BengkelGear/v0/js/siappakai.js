"use strict"

let siappakai = {}

;{
	let sp = siappakai
	
	sp.log = ru.lihat
	sp.cleararr = ru.habisarr
	sp.canvas3d = ()=>pl.canv
	sp.canvas2d = ()=>pl.canv2d
	sp.context3d = ()=>pl.cx
	sp.context2d = ()=>pl.cx2d
	sp.dv = ()=>pl.dv
	sp.settimeout = a=>{ if(a === undefined){ return pl.settimeout }; pl.settimeout = a }
	
	//armuserlist, dipakai untuk get atau set pl.drawarr[].objarr
	sp.armuserlist = (armname,userlist,)=>{//armature user list, 
		let draw = null
		for(let drawini of pl.drawarr){
			if(drawini.name === armname){
				draw = drawini
				break
			}
		}
		if(!draw){return 'armature tidak ditemukan'}
		if(userlist === undefined){
			return draw.objarr
		}
		draw.objarr = userlist
		return 'user list replacedddd'
	}
	//sampe sini, 
	
	sp.mulai = f=>pl.thenarr.push(f)
	
	let render = null
	pl.render.push(async dt=>render?.(dt))
	sp.render = f=>render = f
}
	
	
	
	
	
	
	
	
//==-=-=-=-=-=-=-=-=-=-=
pl.thenarr.push(async aa=>{
	let sp = siappakai
	let lih = ru.lihat
	
	sp.setlangit = pl.setlangit
	sp.updsinar = pl.updsinar
	sp.updbayangan = pl.updbayangan
	sp.newobj = str=>{
		let o = ld.newobj(str)
		let m3d = {}
		
		let out = {
			draw	:o.draw	,
			node	:o.node	,
			skinjoints	:o.skinjoints	,
			m3d		,
		}
		
		let arr = [out.node]
		let i = 0
		let batas = 9999
		while(i < arr.length){ if(batas-- < 0){ lih('keBABLASen'); break }
			let node = arr[i]
			m3d[node.name] = node.matlok
			
			arr.push(...node.chi)
			++i
		}
		
		return out
	}
	sp.deleteobj = ld.deleteobj
})
