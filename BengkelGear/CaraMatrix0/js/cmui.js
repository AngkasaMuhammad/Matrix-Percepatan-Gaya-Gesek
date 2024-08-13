"use strict"

let cmui = {}
siappakai.mulai(async aa=>{
	let sp = siappakai
	let log = sp.log
	let que = ru.que
	
	let time = cmui.time = que('#time')[0]
	
	que('#play')[0].addEventListener('click',cm.play,)
	que('#pause')[0].addEventListener('click',cm.pause,)
	time.addEventListener('mousedown',cm.pausetime,)
	time.addEventListener('change',cm.setbuftime,)
	time.addEventListener('mouseup',cm.setbuftime,)
})