//mesh shader

//texture -->> Y down

struct masuk{
	@location(0) pos:vec3f,
	@location(1) tex:vec2f,
	@location(2) pilih:vec2f,
	@location(3) nor:vec3f,
	@location(4) joi:vec4u,
	@location(5) wei:vec4f,
	@builtin(instance_index) ins:u32,
}
struct hasil{
	@builtin(position) posout:vec4f,
	@location(0) tex:vec2f,
	@location(1) pilihx:f32,
	@location(2) matvert0:vec3f,
	@location(3) matvert1:vec3f,
	@location(4) matvert2:vec3f,
	@location(5) nor:vec3f,
	@location(6) w:f32,
}
struct stmatlen{
	invmat3dlen:u32,
	mat2dlen:u32,
}
struct stcam{
	cam:mat4x4f,
}
struct stvaluelain{
	w:u32,
	h:u32,
	mclen:u32,
	warsin:u32,//warna sinar
	warbay:u32,//warna bayangan
	arahsinar:vec3f,
	getar:vec4f,
}
struct fragout{
	@location(0) warna:vec4f,
	//@location(1) border:f32,//vec4f,
}

@group(0) @binding(2) var<storage> mat2d: array<mat3x3f>;
@group(0) @binding(3) var<storage> mat3d: array<mat4x4f>;
@group(0) @binding(4) var<storage> invmat3ddata: array<mat4x4f>;
@group(0) @binding(5) var<uniform> matlen: stmatlen;//matrix length info per instance

@group(1) @binding(0) var<uniform> unicam: stcam;
@group(1) @binding(1) var<uniform> valuelain: stvaluelain;
@group(1) @binding(2) var<storage> mco: array<u32>;
@group(1) @binding(3) var<storage> mc: array<vec4u>;
@group(1) @binding(4) var<storage> matem: array<mat3x3f>;
@group(1) @binding(5) var<storage> matec: array<u32>;
@group(1) @binding(6) var<storage,read_write> layar: array<f32>;
@group(1) @binding(7) var border: texture_2d<f32>;
@group(1) @binding(8) var canv: texture_2d<f32>;

@vertex fn vs(
	data:masuk,
) -> hasil {
	//
	var iins = data.ins*matlen.invmat3dlen;
	let i0 = data.joi[0];
	let i1 = data.joi[1];
	let i2 = data.joi[2];
	let i3 = data.joi[3];
	
	let m3d = (

(mat3d[iins+i0] *invmat3ddata[i0]) *data.wei[0]
+(mat3d[iins+i1] *invmat3ddata[i1]) *data.wei[1]
+(mat3d[iins+i2] *invmat3ddata[i2]) *data.wei[2]
+(mat3d[iins+i3] *invmat3ddata[i3]) *data.wei[3]

		)
	;
	let ge = valuelain.getar;
	let pos = unicam.cam*m3d*vec4f(data.pos,1.,);
	
	let m = mat2d[
		u32(round(1.-data.pilih.y))
		+data.ins *matlen.mat2dlen
	];
	
	//normal
	let nor = arahnormal(data.nor,m3d,data.pos,);
	var posgetar = pos.xy/pos.w; //posisi masuk layar
	posgetar += select(
		vec2f(.0),
		sin(pos.xy*ge.xy*9999999.) *.002, // /(33.*pos.w*pos.w+222.),
		.0 < pos.w && pos.w < 11. &&
		-1.1 < posgetar.x && posgetar.x < 1.1 &&
		-1.1 < posgetar.y && posgetar.y < 1.1
	);
	posgetar *= pos.w;
	//coba acak
	return hasil(
		//pos,
		vec4f(posgetar,pos.zw,), //coba getar
		data.tex,
		data.pilih.x,
		m[0],
		m[1],
		m[2],
		nor,
		pos.w,
	);
}

const iterlen = 111u;//angkasukasuka
@fragment fn fs(
	parh: hasil //parameter hasil
) -> fragout {	
	let posxy = parh.posout.xy;
	let p0 = vec2i(posxy);
	let p1 = p0+vec2i(1i,1i,);
	let p2 = p0+vec2i(-1i,0i,);
	let p3 = p0+vec2i(0i,-1i,);
	let pix0 = textureLoad(border,p0,0u,).r;
	let pix1 = textureLoad(border,p1,0u,).r;
	let pix2 = textureLoad(border,p2,0u,).r;
	let pix3 = textureLoad(border,p3,0u,).r;
	let jarak =
		abs(pix0-pix1)
		+abs(pix0-pix2)
		+abs(pix0-pix3)
	;
	let ap0 = round(textureLoad(canv,p0,0u,).a);
	let a =
		ap0
		*round(textureLoad(canv,p1,0u,).a)
		*round(textureLoad(canv,p2,0u,).a)
		*round(textureLoad(canv,p3,0u,).a)
	;
	let warna = select(
		vec4f(vec3f(1.-a),a,),
		fragku0(parh),
		jarak < .1,
	);
	return fragout(
		warna,
		//atan(parh.w),
	);
}

fn fragku0(
	parh: hasil //parameter hasil
) -> vec4f {
	let layarku = layar[0];

	let pelen = valuelain.mclen;//panjang perintah
	let p = parh.tex;
	var ipe = mco[u32(round(parh.pilihx))];
	var colorini = vec4f(.8);
	
	for(var a = 0u;a < iterlen;a++){
		if(pelen <= ipe){
			colorini = unpack4x8unorm(
				matec[ipe-pelen]
			).abgr;
			break;
		}
		let iawal = ipe;
		//coba
			var pm =
				matem[mc[ipe][1]]
				*mat3x3f(
					parh.matvert0,
					parh.matvert1,
					parh.matvert2,
				)
				*vec3f(p,1.,);
			pm /= pm.z;
		//
		//di kiri relatif
		ipe += select(
			mc[ipe][2],
			mc[ipe][3],
			bentuk(pm.xy,mc[ipe][0],),
		);
		if(iawal == ipe){
			break;
		}
	}
	
	//blipping transparenccccccc
	let w = valuelain.w;
	let h = valuelain.h;
	let ilayar =
		u32(parh.posout.x)
		+u32(parh.posout.y)*w
	;
	//angka sukasuka
	var blip =
		sin(layar[ilayar]*2222.3)
		+layar[ilayar+1u]
		+sin(
			parh.posout.x
			+parh.posout.y
			*1111.03
		)
		+2.41
	;
	blip = blip%1.;
	layar[ilayar] = blip;
	let a = select( //0.0 sampe 0.4980392156862745 (127./255.)
		colorini.a*1.1-.575, // -.5
		colorini.a*1.1, // *.5
		colorini.a < .5,
	)*2.; //lalu dikali 2.
/*=======
	if(colorini.a < blip){
		discard;
	}
--------*/
	if(a < blip){
		discard;
	}







	//alpha > .5 -->> campur sinar matahari
	//alpha < .5 -->> tidak campur sinar matahari
	let ws = unpack4x8unorm(valuelain.warsin).abgr; //warna sinar
	let wb = unpack4x8unorm(valuelain.warbay).abgr; //warna bayangan
	let inte = max(.0,dot(parh.nor,valuelain.arahsinar,),); //interpolation
	//let w2 = ws*inte+wb*(1-inte);//warna gabungan
	let w2 = select(wb,ws,inte > .0);
	
	let out = select(
	vec4f(
		colorini.xyz*(1-w2.a)
		+w2.xyz*w2.a,
		colorini.a,
	),
	colorini,
	colorini.a < .5,
	);
	return out;
}

fn bentuk(
	p:vec2f,
	pilih:u32,
)->bool{
	let x = p.x;
	let y = p.y;
switch(pilih){
	case 0u:{
		return .0 < y;
	}
	case 1u:{
		return abs(x) < y;
	}
	case 2u:{
		return sin(x) < y;
	}
	case 3u:{
		return 1./cos(x) < y;
	}
	case 4u:{
		return tan(x) < y;
	}
	case 5u:{
		return distance(p,vec2f(.0),) < 1.;
	}
	case 6u:{
		let pi = 3.14159;
		let xini = cos(x/pi);
		let yini = cos(y/pi);
		return .0 < xini && .0 < yini; //jendela gedung gaza https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fft-ig-images-prod.s3-website-eu-west-1.amazonaws.com%2Fv1%2F8301842205-7r4hu.jpg?source=ig
	}
	case 7u:{
		return x*x+y*y < tan(200.*y/x);
	}
	default:{//sukasuka, biasanya ga akan dipiilih
		//return y*sin(x*x) < x*sin(y*y);
		//return sin(x)%cos(x) < sin(y);//asli
//coba
		return sin(sin(x*y)) < pow(5.,sin(y*sin(x)),)*sin(9.*x);
		
	}
}}
fn arahnormal(
	norawal:vec3f,
	m:mat4x4f,
	vp:vec3f,//vertpos
)->vec3f{
	/*
		LANGKAH: =-=-=-=-=-=-=-=-=-=-=-
		cek apakah normal sejajar vertikal
		bikin 4 sumbu: +x -x +y -y
		geser sumbu sejauh vertpos
		gabung 4 sumbu jadi 1 matrix
		kali matrix
		cek w
			boolean tukar
			bikin 2 sumbu: x & y
		matrix kali vertpos
		vertpos, 2 sumbu, jadi vec3f
		geser 2 sumbu sejauh vertpos
		cross 2 sumbu pake boolean tukar
		normalize
	*/
	var sz = norawal;
	var sx0_3 = vec3f(1.,.0,.0,);
	var sx1_3 = vec3f(-1.,.0,.0,);
	if(abs(sz.y) != 1.){
		sx0_3 = (vec3f(sz.z,.0,-sz.x,));
		sx1_3 = (vec3f(-sz.z,.0,sz.x,));
	}
	var sy0_3 = cross(sz,sx0_3,);//ini dicoba ga normalize
	var sy1_3 = cross(sz,sx1_3,);

	var tukar = false;
	var ms = m*mat4x4f(
		vec4f(vp+sx0_3,1.,),
		vec4f(vp+sx1_3,1.,),
		vec4f(vp+sy0_3,1.,),
		vec4f(vp+sy1_3,1.,),
	);
	var sx:vec4f;
	var sy:vec4f;
	if(ms[0].w <= 0.){ sx = ms[1]; tukar = !tukar; }else{ sx = ms[0]; }
	if(ms[2].w <= 0.){ sy = ms[3]; tukar = !tukar; }else{ sy = ms[2]; }
//b -->> baru
	let vpb0 = m*vec4f(vp,1.,);
	let vpb1 = vpb0.xyz/vpb0.w;

	var sxb = sx.xyz/sx.w-vpb1;
	var syb = sy.xyz/sy.w-vpb1;

	return normalize(select(
		cross(sxb,syb,),
		cross(syb,sxb,),
		tukar,
	));
	//performa sekitar 15 operasi
}
