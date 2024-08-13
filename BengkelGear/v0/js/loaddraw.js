"use strict"

/*
--	segera
=>	diurus
	sudah

-------------

*/
let ld = {}
pl.thenarr.push(async aa=>{
let lih = ru.lihat
let que = ru.que
let v3 = wgpuMatrix.vec3
let m3 = wgpuMatrix.mat3
let m4 = wgpuMatrix.mat4
let w = pl.canv.width
let h = pl.canv.height

lih('loaddraw loadedddddddd')
let gltf_bin
let loadgltfbin = ld.loadgltfbin = async ()=>{
	let [fsfh] = await showOpenFilePicker()
	let file = await fsfh.getFile()
	gltf_bin = await file.arrayBuffer()
	lih(gltf_bin)
}
let gltf_json
let loadgltfjson = ld.loadgltfjson = async ()=>{
	let [fsfh] = await showOpenFilePicker()
	let file = await fsfh.getFile()
	gltf_json = JSON.parse(await file.text())
	lih(gltf_json)
}
let read = ()=>{
	let h = lih(freadgltf(gltf_json,gltf_bin,))
	mat3dpisah = h.mat3dpisah
	mat2dpisah = h.mat2dpisah
}
let mat3dpisah = null
let mat2dpisah = null
//https://github.com/toji/gl-matrix/blob/master/dist/gl-matrix.js
//aku edit dikit
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {ReadonlyVec3} v Translation vector
   * @param {ReadonlyVec3} s Scaling vector
   * @returns {mat4} out
   */

let matRTS = (q, v, s,out,)=>{//fromRotationTranslationScale
    // Quaternion math
	out = out??new Float32Array(16)
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
/*










*/
ld.newobj = namadraw=>{//draw
	let draw = null
	for(let o of pl.drawarr){ if(o.name === namadraw){draw = o;break} }
	if(!draw){return lih(['draw tidak dtemukan',pl.drawarr,])}
	if(draw.nmax <= draw.objarr.length){return lih('ERROR!: '+namadraw+' penuh, max = '+draw.nmax)}
	
	let json = gltf_json
	//cari armnode
	let list = []
	let out = {draw}
	
	for(let node of json.nodes){
		if(node.name === draw.name){
			out.node = {src:node,mat2d:'belum diisi',obj:out,}
			list.push(out.node)
			break
		}
	}
	
	//cari joint
	let srcskinjoints = null
	for(let {name,joints,} of json.skins){
		if(name === draw.name){
			out.skinjoints = (srcskinjoints = joints).slice()
			break
		}
	}
	
	while(list.length){
		let dst = list.shift()
		let src = dst.src
		dst.name = src.name
		dst.chi = []
		dst.matglo = m4.identity()
		dst.matlok = matRTS(
			src.rotation??[0,0,0,1,],
			src.translation??[0,0,0,],
			src.scale??[1,1,1,],
		)
		for(let isrcchi of src.children??[]){
			let srcchi = json.nodes[isrcchi]
			let dstchi = {src:srcchi,}
			list.push(dstchi)
			dst.chi.push(dstchi)
			//cari mat2d
			let ex = srcchi.extras?.geomat
			if(ex){
				//dst.mat2d = structuredClone(ex)
				dst.mat2d = []
				for(let m of ex){
					dst.mat2d.push(m3.set(...m))
				}
			}
		}
		//cari joint
		for(let i = 0;i < out.skinjoints.length;i++){
			let jointname = json.nodes[srcskinjoints[i]].name
			if(jointname === src.name){
				out.skinjoints[i] = dst
				break
			}
		}
		delete dst.src
	}
	
	draw.objarr.push(out)
	//lih(namadraw+' -->> nmax = '+draw.nmax+', objlen = '+draw.objarr.length)
	return out
}
ld.deleteobj = obj=>{
	let arr = obj.draw.objarr
	let i = arr.indexOf(obj)
	;(i >= 0) && arr.splice(i,1,)
}

/*










*/
//mulai
lih(await Promise.all([
	(async ()=>{
		let href = ru.que('#meshbin')[0].href
		let fileku = await fetch(href)
		return gltf_bin = await fileku.arrayBuffer()
	})(),
	(async ()=>{
		let href = ru.que('#meshgltf')[0].href
		let fileku = await fetch(href)
		return gltf_json = await fileku.json()
	})(),
]))

read()

/*










*/

pl.render.push(dt=>{
	
	//hitung mat
	for(let dr of pl.drawarr){
		for(let {node} of dr.objarr){
			let nl = [node]//nodelist
			m4.identity(node.matglo)
			while(nl.length){
			
let nodeini = nl.shift()
let glo = nodeini.matglo
let lok = nodeini.matlok
m4.mul(glo,lok,glo,)
for(let chiini of nodeini.chi){
	nl.push(chiini)
	m4.copy(glo,chiini.matglo,)
}
			
			}
		}
	}
	
	//kirim
	for(let dr of pl.drawarr){
		let name = dr.name
		let objarr = dr.objarr
		
		let m2dpis = mat2dpisah[name]
		let m3dpis = mat3dpisah[name]
		for(let i = 0;i < objarr.length;i++){

//mat2d
let mp2d = m2dpis[i]
let geomat = objarr[i].node.mat2d
for(let j = 0;j < mp2d.length;j++){
	m3.copy(geomat[j],mp2d[j],)
}

//mat3d
let sj = objarr[i].skinjoints
let mp = m3dpis[i]
for(let j = 0;j < sj.length;j++){
	let m0 = sj[j].matglo
	let m1 = mp[j]
	m4.copy(m0,m1,)
}

		}
		pl.upddrawmat2d(dr)
		pl.upddrawmat3d(dr)
	}
})
})
