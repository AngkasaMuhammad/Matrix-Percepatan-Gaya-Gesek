struct masuk{
	@builtin(instance_index) ins:u32,
	@location(0) pos:vec3f,
	@location(1) joi:vec4u,
	@location(2) wei:vec4f,
	@location(3) pilih:vec2f,//sampe sini
}
struct hasil{
	@builtin(position) posout:vec4f,
	@location(0) w:f32,
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

@group(0) @binding(3) var<storage> mat3d: array<mat4x4f>;
@group(0) @binding(4) var<storage> invmat3ddata: array<mat4x4f>;
@group(0) @binding(5) var<uniform> matlen: stmatlen;//matrix length info per instance

@group(1) @binding(0) var<uniform> unicam: stcam;
@group(1) @binding(1) var<uniform> valuelain: stvaluelain;

@vertex fn vs(
	data:masuk,
) -> hasil{
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
	
	var posgetar = pos.xy/pos.w; //posisi masuk layar
	posgetar += select(
		vec2f(.0),
		sin(pos.xy*(ge.zw-vec2f(.5))*9999999.) *.0024, // /(33.*pos.w*pos.w+222.),
		.0 < pos.w && pos.w < 11. &&
		-1.1 < posgetar.x && posgetar.x < 1.1 &&
		-1.1 < posgetar.y && posgetar.y < 1.1
	);
	posgetar *= pos.w;
	return hasil(
		vec4f(posgetar,pos.zw,),
		pos.w,
	);
}

@fragment fn fs(
	h:hasil,
) -> @location(0) f32{
	return atan(h.w);
}
