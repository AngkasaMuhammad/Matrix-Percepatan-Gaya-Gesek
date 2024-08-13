"use strict"

let ui = {}

;{
	
}
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//mousetext
;{
	let lih = ru.lihat
	let que = ru.que
	let attr = ru.attr
	
	let datang = e=>moutex.textContent = attr(e.target,'mousedescr',)
	let pergi = e=>moutex.textContent = ''
	
	let moutex = que('#moutex')[0]
	
	for(let ele of que('[mousedescr]')){
		ele.addEventListener('mouseenter',datang,)
		ele.addEventListener('mouseleave',pergi,)
	}
	addEventListener('mousemove',e=>{
		let x = Math.min(e.clientX+11,innerWidth-moutex.clientWidth,)
		let y = Math.min(e.clientY+11,innerHeight-moutex.clientHeight,)
		moutex.style.left = x+'px'
		moutex.style.top = y+'px'
	})
}