var Mi=(i,t,e)=>()=>{if(e)throw e[0];try{return i&&(t=i(i=0)),t}catch(n){throw e=[n],n}};function Nn(i){if(i<=0)return i*10;let t=Math.min(i,1),e=t*t;return 6*e*e*(5-4*t)}function Wy(i){return i<=0?[0,0]:i<=3?[3.5,5.5]:i<=7?[3,5]:i<=16?[2,3.5]:i<=18||i===21||i===22||i===25||i===26?[1.5,3]:i<=28?[.8,2]:i===29?[.4,1.5]:[0,.5]}function dd(i,t){if(i===0||t<=0)return Ds(t);let e=Vy[i]||[.3,.5,.2],n=Nn(t),[s,r]=Wy(i),o=e[0],a=e[1],c=e[2];if(n<.2){let l=.93+.07*(n/.2);o*=l,a*=l,c*=l}if(s>0&&n>.2&&n<s){let h=1-(n-.2)/(s-.2)*.15;o*=h,a*=h,c*=h}if(s>0&&n>s){let l=r>s?r-s:2,h=Math.min(1,(n-s)/l),u=h*h;o=o+(ol[0]-o)*u,a=a+(ol[1]-a)*u,c=c+(ol[2]-c)*u}if(r>0&&n>r){let l=Math.min(1,(n-r)/2.5),h=l*l;o=o+(.92-o)*h,a=a+(.93-a)*h,c=c+(.96-c)*h}return[o,a,c]}function Ds(i){if(i<-.5)return[.04,.06,.3];if(i<-.1){let t=(i+.5)/.4;return[.04+t*.07,.06+t*.14,.3+t*.18]}if(i<0){let t=(i+.1)/.1;return[.11+t*.19,.2+t*.22,.48+t*.12]}if(i<.002){let t=i/.002;return[.72+t*.08,.68-t*.02,.46-t*.1]}if(i<.25){let t=(i-.002)/.248;return[.2-t*.06,.54-t*.12,.12+t*.08]}if(i<.5){let t=(i-.25)/.25;return[.14+t*.3,.42-t*.14,.2-t*.06]}if(i<.75){let t=(i-.5)/.25;return[.44+t*.16,.28+t*.12,.14+t*.18]}{let t=Math.min(1,(i-.75)/.2);return[.6+t*.35,.4+t*.5,.32+t*.6]}}var Vy,ol,yr=Mi(()=>{Vy=[null,[.05,.3,.05],[.08,.33,.07],[.42,.5,.18],[.82,.72,.5],[.6,.55,.48],[.72,.62,.3],[.55,.52,.32],[.18,.42,.12],[.12,.38,.1],[.1,.28,.1],[.45,.48,.22],[.4,.45,.2],[.35,.4,.2],[.2,.44,.14],[.15,.4,.12],[.12,.32,.1],[.12,.36,.08],[.1,.32,.08],[.06,.22,.08],[.05,.18,.07],[.38,.38,.18],[.35,.35,.17],[.08,.22,.08],[.06,.18,.07],[.14,.36,.1],[.12,.32,.09],[.07,.22,.08],[.05,.18,.07],[.35,.32,.22],[.78,.8,.84]],ol=[.42,.38,.32]});function ea(i){let t=Math.abs(Math.floor(i*9301+49297))%2147483646+1;return()=>(t=t*16807%2147483647,(t-1)/2147483646)}var dl=Mi(()=>{});var fl,kM,Sd=Mi(()=>{fl=[{code:"Ocean",name:"Ocean",color:[.29,.44,.65]},{code:"Af",name:"Tropical rainforest",color:[0,0,1]},{code:"Am",name:"Tropical monsoon",color:[0,.47,1]},{code:"Aw",name:"Tropical savanna",color:[.27,.67,.98]},{code:"BWh",name:"Hot desert",color:[1,0,0]},{code:"BWk",name:"Cold desert",color:[1,.59,.59]},{code:"BSh",name:"Hot steppe",color:[.96,.65,0]},{code:"BSk",name:"Cold steppe",color:[1,.86,.39]},{code:"Cfa",name:"Humid subtropical",color:[.78,1,.31]},{code:"Cfb",name:"Oceanic",color:[.39,1,.31]},{code:"Cfc",name:"Subpolar oceanic",color:[.2,.78,0]},{code:"Csa",name:"Hot-summer Mediterranean",color:[1,1,0]},{code:"Csb",name:"Warm-summer Mediterranean",color:[.78,.78,0]},{code:"Csc",name:"Cold-summer Mediterranean",color:[.59,.59,0]},{code:"Cwa",name:"Humid subtropical (monsoon)",color:[.59,1,.59]},{code:"Cwb",name:"Subtropical highland",color:[.39,.78,.39]},{code:"Cwc",name:"Cold subtropical highland",color:[.2,.59,.2]},{code:"Dfa",name:"Hot-summer continental",color:[0,1,1]},{code:"Dfb",name:"Warm-summer continental",color:[.22,.78,1]},{code:"Dfc",name:"Subarctic",color:[0,.49,.49]},{code:"Dfd",name:"Extremely cold subarctic",color:[0,.27,.37]},{code:"Dsa",name:"Hot-summer continental (dry summer)",color:[.9,.5,1]},{code:"Dsb",name:"Warm-summer continental (dry summer)",color:[.7,.35,.85]},{code:"Dsc",name:"Subarctic (dry summer)",color:[.5,.2,.65]},{code:"Dsd",name:"Extremely cold subarctic (dry summer)",color:[.35,.1,.45]},{code:"Dwa",name:"Hot-summer continental (monsoon)",color:[.67,.69,1]},{code:"Dwb",name:"Warm-summer continental (monsoon)",color:[.43,.47,.78]},{code:"Dwc",name:"Subarctic (monsoon)",color:[.29,.31,.78]},{code:"Dwd",name:"Extremely cold subarctic (monsoon)",color:[.2,0,.53]},{code:"ET",name:"Tundra",color:[.7,.7,.7]},{code:"EF",name:"Ice cap",color:[.41,.41,.41]}],kM=Object.fromEntries(fl.map((i,t)=>[i.code,t]))});var zM,wd=Mi(()=>{zM=Math.PI/180});var D1,Pr,ef=Mi(()=>{dl();D1=new Float64Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),Pr=class{constructor(t=0){let e=ea(t),n=new Uint8Array(256);for(let s=0;s<256;s++)n[s]=s;for(let s=255;s>0;s--){let r=Math.floor(e()*(s+1)),o=n[s];n[s]=n[r],n[r]=o}this.perm=new Uint8Array(512),this.pm3=new Uint8Array(512);for(let s=0;s<512;s++)this.perm[s]=n[s&255],this.pm3[s]=3*(this.perm[s]%12)}noise3D(t,e,n){let s=this.perm,r=this.pm3,o=D1,a=1/3,c=1/6,l=(t+e+n)*a,h=Math.floor(t+l),u=Math.floor(e+l),d=Math.floor(n+l),p=(h+u+d)*c,g=t-h+p,_=e-u+p,m=n-d+p,f,v,x,S,P,E;g>=_?_>=m?(f=1,v=0,x=0,S=1,P=1,E=0):g>=m?(f=1,v=0,x=0,S=1,P=0,E=1):(f=0,v=0,x=1,S=1,P=0,E=1):_<m?(f=0,v=0,x=1,S=0,P=1,E=1):g<m?(f=0,v=1,x=0,S=0,P=1,E=1):(f=0,v=1,x=0,S=1,P=1,E=0);let L=g-f+c,V=_-v+c,M=m-x+c,b=g-S+2*c,D=_-P+2*c,O=m-E+2*c,k=g-1+3*c,A=_-1+3*c,C=m-1+3*c,R=h&255,N=u&255,F=d&255,z=0,B=0,X=0,K=0,H=.6-g*g-_*_-m*m;if(H>0){H*=H;let et=r[R+s[N+s[F]]];z=H*H*(o[et]*g+o[et+1]*_+o[et+2]*m)}let W=.6-L*L-V*V-M*M;if(W>0){W*=W;let et=r[R+f+s[N+v+s[F+x]]];B=W*W*(o[et]*L+o[et+1]*V+o[et+2]*M)}let Z=.6-b*b-D*D-O*O;if(Z>0){Z*=Z;let et=r[R+S+s[N+P+s[F+E]]];X=Z*Z*(o[et]*b+o[et+1]*D+o[et+2]*O)}let nt=.6-k*k-A*A-C*C;if(nt>0){nt*=nt;let et=r[R+1+s[N+1+s[F+1]]];K=nt*nt*(o[et]*k+o[et+1]*A+o[et+2]*C)}return 32*(z+B+X+K)}fbm(t,e,n,s=5,r=2/3){let o=0,a=0,c=1;for(let l=0;l<s;l++){let h=1<<l;o+=c*this.noise3D(t*h,e*h,n*h),a+=c,c*=r}return o/a}}});function Ff(i){rv=i}var rv,_a,Bf=Mi(()=>{rv=null;_a=class{constructor(t,e,n){this.triangles=t,this.halfedges=e,this.numRegions=n,this.numSides=t.length,this.numTriangles=t.length/3|0,this._r_s=new Int32Array(n).fill(-1);for(let o=0;o<this.numSides;o++){let a=t[o];this._r_s[a]===-1&&(this._r_s[a]=o)}let s=new Int32Array(n);for(let o=0;o<n;o++){let a=this._r_s[o];if(a===-1)continue;let c=a;do s[o]++,c=this._next(this.halfedges[c]);while(c!==a)}this._adjOffset=new Int32Array(n+1);for(let o=0;o<n;o++)this._adjOffset[o+1]=this._adjOffset[o]+s[o];let r=this._adjOffset[n];this._adjList=new Int32Array(r),this._adjTriList=new Int32Array(r);for(let o=0;o<n;o++){let a=this._r_s[o];if(a===-1)continue;let c=a,l=this._adjOffset[o];do this._adjList[l]=this.s_end_r(c),this._adjTriList[l]=this.s_inner_t(c),l++,c=this._next(this.halfedges[c]);while(c!==a)}this.adjOffset=this._adjOffset,this.adjList=this._adjList}_next(t){return t%3===2?t-2:t+1}s_begin_r(t){return this.triangles[t]}s_end_r(t){return this.triangles[this._next(t)]}s_inner_t(t){return t/3|0}s_outer_t(t){return this.halfedges[t]/3|0}r_circulate_r(t,e){let n=this._adjOffset[e],r=this._adjOffset[e+1]-n;t.length=r;for(let o=0;o<r;o++)t[o]=this._adjList[n+o];return t}r_circulate_t(t,e){let n=this._adjOffset[e],r=this._adjOffset[e+1]-n;t.length=r;for(let o=0;o<r;o++)t[o]=this._adjTriList[n+o];return t}}});async function np(i){let t=await(await fetch(i)).blob(),e=await createImageBitmap(t,{colorSpaceConversion:"none",premultiplyAlpha:"none"}),n=new OffscreenCanvas(e.width,e.height),s=n.getContext("2d",{willReadFrequently:!0});return s.drawImage(e,0,0),s.getImageData(0,0,e.width,e.height)}function ip(){return Xl||(Xl=(async()=>{try{let[i,t,e]=await Promise.all([np(Wl("../tex/clim.png")),np(Wl("../tex/clim_static.png")),fetch(Wl("../data/climate.json")).then(n=>n.json())]);Qn={clim:i.data,cw:i.width,stat:t.data,sw:t.width,sh:t.height},ba=e}catch(i){Qn=null,console.warn("Cosmossi world data not loaded - plain simulation at 25.2 deg.",i)}})()),Xl}function Hv(i,t){if(!Qn)return 0;let e=Math.min(Qn.sw-1,Math.max(0,Math.floor((t+180)/360*Qn.sw))),n=Math.min(Qn.sh-1,Math.max(0,Math.floor((90-i)/180*Qn.sh)));return Qn.stat[(n*Qn.sw+e)*4+1]}function sp(i,t){let e=Hv(i,t);if(!e||!ba)return"";let s=`<br><span class="hi-label">Biome</span> ${ba.painted[e-1].name}`;if(e===kv){let r=ba.alduran;s+=`<br><span class="hi-label">Alduran</span> summer days ${r.summer_day_high_c}\xB0C (spikes ${r.summer_day_spike_c}\xB0C), nights ${r.summer_night_low_c}\xB0C<br><span class="hi-label"></span> winter days ${r.winter_day_high_c}\xB0C, nights ${r.winter_night_low_c}\xB0C`}return s}var Wl,Fv,Bv,kv,Qn,ba,Xl,rp=Mi(()=>{Wl=i=>new URL(i,import.meta.url),Fv=new Float32Array(256),Bv=new Float32Array(256);for(let i=0;i<256;i++)Fv[i]=-80+i/255*140,Bv[i]=6400*(i/255)*(i/255);kv=5,Qn=null,ba=null,Xl=null});var bn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Dn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Sp=0,ih=1,wp=2;var Uu=1,Ep=2,Vn=3,Rn=0,Ze=1,ln=2;var li=0,ys=1,sh=2,rh=3,oh=4,Ap=5,Ti=100,Tp=101,Rp=102,ah=103,ch=104,Cp=200,Pp=201,Lp=202,Ip=203,fc=204,pc=205,Dp=206,Np=207,Op=208,Up=209,Fp=210,Bp=211,kp=212,Hp=213,zp=214,Gp=0,Vp=1,Wp=2,xo=3,Xp=4,qp=5,Yp=6,$p=7,qo=0,jp=1,Kp=2,hi=0,Zp=1,Jp=2,Qp=3,tm=4,em=5,nm=6;var Fu=300,bs=301,Ss=302,mc=303,gc=304,Yo=306,_c=1e3,gn=1001,xc=1002,He=1003,lh=1004;var Oa=1005;var ze=1006,im=1007;var or=1008;var ui=1009,sm=1010,rm=1011,Zc=1012,Bu=1013,ci=1014,An=1015,ar=1016,ku=1017,Hu=1018,Ci=1020,om=1021,_n=1023,am=1024,cm=1025,Pi=1026,ws=1027,lm=1028,zu=1029,hm=1030,Gu=1031,Vu=1033,Ua=33776,Fa=33777,Ba=33778,ka=33779,hh=35840,uh=35841,dh=35842,fh=35843,Wu=36196,ph=37492,mh=37496,gh=37808,_h=37809,xh=37810,yh=37811,vh=37812,Mh=37813,bh=37814,Sh=37815,wh=37816,Eh=37817,Ah=37818,Th=37819,Rh=37820,Ch=37821,Ha=36492,Ph=36494,Lh=36495,um=36283,Ih=36284,Dh=36285,Nh=36286;var yo=2300,vo=2301,za=2302,Oh=2400,Uh=2401,Fh=2402;var Xu=3e3,Li=3001,dm=3200,fm=3201,Jc=0,pm=1,hn="",Me="srgb",xn="srgb-linear",Qc="display-p3",$o="display-p3-linear",Mo="linear",ae="srgb",bo="rec709",So="p3";var Qi=7680;var Bh=519,mm=512,gm=513,_m=514,qu=515,xm=516,ym=517,vm=518,Mm=519,kh=35044;var Hh="300 es",yc=1035,Wn=2e3,wo=2001,Cn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],zh=1234567,nr=Math.PI/180,cr=180/Math.PI;function Ts(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]).toLowerCase()}function De(i,t,e){return Math.max(t,Math.min(e,i))}function tl(i,t){return(i%t+t)%t}function bm(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Sm(i,t,e){return i!==t?(e-i)/(t-i):0}function ir(i,t,e){return(1-e)*i+e*t}function wm(i,t,e,n){return ir(i,t,1-Math.exp(-e*n))}function Em(i,t=1){return t-Math.abs(tl(i,t*2)-t)}function Am(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Tm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Rm(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Cm(i,t){return i+Math.random()*(t-i)}function Pm(i){return i*(.5-Math.random())}function Lm(i){i!==void 0&&(zh=i);let t=zh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Im(i){return i*nr}function Dm(i){return i*cr}function vc(i){return(i&i-1)===0&&i!==0}function Nm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Eo(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Om(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ms(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Be(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var qn={DEG2RAD:nr,RAD2DEG:cr,generateUUID:Ts,clamp:De,euclideanModulo:tl,mapLinear:bm,inverseLerp:Sm,lerp:ir,damp:wm,pingpong:Em,smoothstep:Am,smootherstep:Tm,randInt:Rm,randFloat:Cm,randFloatSpread:Pm,seededRandom:Lm,degToRad:Im,radToDeg:Dm,isPowerOfTwo:vc,ceilPowerOfTwo:Nm,floorPowerOfTwo:Eo,setQuaternionFromProperEuler:Om,normalize:Be,denormalize:ms},Bt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Jt=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],v=s[1],x=s[4],S=s[7],P=s[2],E=s[5],L=s[8];return r[0]=o*_+a*v+c*P,r[3]=o*m+a*x+c*E,r[6]=o*f+a*S+c*L,r[1]=l*_+h*v+u*P,r[4]=l*m+h*x+u*E,r[7]=l*f+h*S+u*L,r[2]=d*_+p*v+g*P,r[5]=d*m+p*x+g*E,r[8]=d*f+p*S+g*L,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,p=l*r-o*c,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ga.makeScale(t,e)),this}rotate(t){return this.premultiply(Ga.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ga.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ga=new Jt;function Yu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ao(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Um(){let i=Ao("canvas");return i.style.display="block",i}var Gh={};function sr(i){i in Gh||(Gh[i]=!0,console.warn(i))}var Vh=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Wh=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Wr={[xn]:{transfer:Mo,primaries:bo,toReference:i=>i,fromReference:i=>i},[Me]:{transfer:ae,primaries:bo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[$o]:{transfer:Mo,primaries:So,toReference:i=>i.applyMatrix3(Wh),fromReference:i=>i.applyMatrix3(Vh)},[Qc]:{transfer:ae,primaries:So,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Wh),fromReference:i=>i.applyMatrix3(Vh).convertLinearToSRGB()}},Fm=new Set([xn,$o]),se={enabled:!0,_workingColorSpace:xn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Fm.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Wr[t].toReference,s=Wr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Wr[i].primaries},getTransfer:function(i){return i===hn?Mo:Wr[i].transfer}};function vs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Va(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ts,To=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ts===void 0&&(ts=Ao("canvas")),ts.width=t.width,ts.height=t.height;let n=ts.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ts}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Ao("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=vs(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(vs(e[n]/255)*255):e[n]=vs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Bm=0,Ro=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bm++}),this.uuid=Ts(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Wa(s[o].image)):r.push(Wa(s[o]))}else r=Wa(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Wa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?To.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var km=0,yn=class i extends Cn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=gn,s=gn,r=ze,o=or,a=_n,c=ui,l=i.DEFAULT_ANISOTROPY,h=hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=Ts(),this.name="",this.source=new Ro(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(sr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Li?Me:hn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _c:t.x=t.x-Math.floor(t.x);break;case gn:t.x=t.x<0?0:1;break;case xc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _c:t.y=t.y-Math.floor(t.y);break;case gn:t.y=t.y<0?0:1;break;case xc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return sr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Me?Li:Xu}set encoding(t){sr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Li?Me:hn}};yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=Fu;yn.DEFAULT_ANISOTROPY=1;var ue=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(l+1)/2,S=(p+1)/2,P=(f+1)/2,E=(h+d)/4,L=(u+_)/4,V=(g+m)/4;return x>S&&x>P?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=E/n,r=L/n):S>P?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=E/s,r=V/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=L/r,s=V/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((l+p+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Mc=class extends Cn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(sr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Li?Me:hn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ze,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new yn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Ro(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},sn=class extends Mc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Co=class extends yn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bc=class extends yn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var vn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==p||h!==g){let m=1-a,f=c*d+l*p+h*g+u*_,v=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let P=Math.sqrt(x),E=Math.atan2(P,f*v);m=Math.sin(m*E)/P,a=Math.sin(a*E)/P}let S=a*v;if(c=c*m+d*S,l=l*m+p*S,h=h*m+g*S,u=u*m+_*S,m===1-a){let P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-a*p,t[e+2]=l*g+h*p+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(De(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Y=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Xh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Xh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xa.copy(this).projectOnVector(t),this.sub(Xa)}reflect(t){return this.sub(Xa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Xa=new Y,Xh=new vn,Ii=class{constructor(t=new Y(1/0,1/0,1/0),e=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,fn):fn.fromBufferAttribute(r,o),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xr.copy(n.boundingBox)),Xr.applyMatrix4(t.matrixWorld),this.union(Xr)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Js),qr.subVectors(this.max,Js),es.subVectors(t.a,Js),ns.subVectors(t.b,Js),is.subVectors(t.c,Js),ii.subVectors(ns,es),si.subVectors(is,ns),bi.subVectors(es,is);let e=[0,-ii.z,ii.y,0,-si.z,si.y,0,-bi.z,bi.y,ii.z,0,-ii.x,si.z,0,-si.x,bi.z,0,-bi.x,-ii.y,ii.x,0,-si.y,si.x,0,-bi.y,bi.x,0];return!qa(e,es,ns,is,qr)||(e=[1,0,0,0,1,0,0,0,1],!qa(e,es,ns,is,qr))?!1:(Yr.crossVectors(ii,si),e=[Yr.x,Yr.y,Yr.z],qa(e,es,ns,is,qr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Bn=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],fn=new Y,Xr=new Ii,es=new Y,ns=new Y,is=new Y,ii=new Y,si=new Y,bi=new Y,Js=new Y,qr=new Y,Yr=new Y,Si=new Y;function qa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Si.fromArray(i,r);let a=s.x*Math.abs(Si.x)+s.y*Math.abs(Si.y)+s.z*Math.abs(Si.z),c=t.dot(Si),l=e.dot(Si),h=n.dot(Si);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Hm=new Ii,Qs=new Y,Ya=new Y,Di=class{constructor(t=new Y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Hm.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Qs.subVectors(t,this.center);let e=Qs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Qs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ya.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qs.copy(t.center).add(Ya)),this.expandByPoint(Qs.copy(t.center).sub(Ya))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},kn=new Y,$a=new Y,$r=new Y,ri=new Y,ja=new Y,jr=new Y,Ka=new Y,Pn=class{constructor(t=new Y,e=new Y(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){$a.copy(t).add(e).multiplyScalar(.5),$r.copy(e).sub(t).normalize(),ri.copy(this.origin).sub($a);let r=t.distanceTo(e)*.5,o=-this.direction.dot($r),a=ri.dot(this.direction),c=-ri.dot($r),l=ri.lengthSq(),h=Math.abs(1-o*o),u,d,p,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy($a).addScaledVector($r,d),p}intersectSphere(t,e){kn.subVectors(t.center,this.origin);let n=kn.dot(this.direction),s=kn.dot(kn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,s,r){ja.subVectors(e,t),jr.subVectors(n,t),Ka.crossVectors(ja,jr);let o=this.direction.dot(Ka),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ri.subVectors(this.origin,t);let c=a*this.direction.dot(jr.crossVectors(ri,jr));if(c<0)return null;let l=a*this.direction.dot(ja.cross(ri));if(l<0||c+l>o)return null;let h=-a*ri.dot(Ka);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class i{constructor(t,e,n,s,r,o,a,c,l,h,u,d,p,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,p,g,_,m)}set(t,e,n,s,r,o,a,c,l,h,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ss.setFromMatrixColumn(t,0).length(),r=1/ss.setFromMatrixColumn(t,1).length(),o=1/ss.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d+_*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zm,t,Gm)}lookAt(t,e,n){let s=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),oi.crossVectors(n,en),oi.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),oi.crossVectors(n,en)),oi.normalize(),Kr.crossVectors(en,oi),s[0]=oi.x,s[4]=Kr.x,s[8]=en.x,s[1]=oi.y,s[5]=Kr.y,s[9]=en.y,s[2]=oi.z,s[6]=Kr.z,s[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],v=n[3],x=n[7],S=n[11],P=n[15],E=s[0],L=s[4],V=s[8],M=s[12],b=s[1],D=s[5],O=s[9],k=s[13],A=s[2],C=s[6],R=s[10],N=s[14],F=s[3],z=s[7],B=s[11],X=s[15];return r[0]=o*E+a*b+c*A+l*F,r[4]=o*L+a*D+c*C+l*z,r[8]=o*V+a*O+c*R+l*B,r[12]=o*M+a*k+c*N+l*X,r[1]=h*E+u*b+d*A+p*F,r[5]=h*L+u*D+d*C+p*z,r[9]=h*V+u*O+d*R+p*B,r[13]=h*M+u*k+d*N+p*X,r[2]=g*E+_*b+m*A+f*F,r[6]=g*L+_*D+m*C+f*z,r[10]=g*V+_*O+m*R+f*B,r[14]=g*M+_*k+m*N+f*X,r[3]=v*E+x*b+S*A+P*F,r[7]=v*L+x*D+S*C+P*z,r[11]=v*V+x*O+S*R+P*B,r[15]=v*M+x*k+S*N+P*X,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*p-n*c*p)+_*(+e*c*p-e*l*d+r*o*d-s*o*p+s*l*h-r*c*h)+m*(+e*l*u-e*a*p-r*o*u+n*o*p+r*a*h-n*l*h)+f*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],v=u*m*l-_*d*l+_*c*p-a*m*p-u*c*f+a*d*f,x=g*d*l-h*m*l-g*c*p+o*m*p+h*c*f-o*d*f,S=h*_*l-g*u*l+g*a*p-o*_*p-h*a*f+o*u*f,P=g*u*c-h*_*c-g*a*d+o*_*d+h*a*m-o*u*m,E=e*v+n*x+s*S+r*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/E;return t[0]=v*L,t[1]=(_*d*r-u*m*r-_*s*p+n*m*p+u*s*f-n*d*f)*L,t[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*f+n*c*f)*L,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*p-n*c*p)*L,t[4]=x*L,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*L,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*f-e*c*f)*L,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*p+e*c*p)*L,t[8]=S*L,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*f-e*u*f)*L,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*f+e*a*f)*L,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*p-e*a*p)*L,t[12]=P*L,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*L,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*L,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*L,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,p=r*h,g=r*u,_=o*h,m=o*u,f=a*u,v=c*l,x=c*h,S=c*u,P=n.x,E=n.y,L=n.z;return s[0]=(1-(_+f))*P,s[1]=(p+S)*P,s[2]=(g-x)*P,s[3]=0,s[4]=(p-S)*E,s[5]=(1-(d+f))*E,s[6]=(m+v)*E,s[7]=0,s[8]=(g+x)*L,s[9]=(m-v)*L,s[10]=(1-(d+_))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ss.set(s[0],s[1],s[2]).length(),o=ss.set(s[4],s[5],s[6]).length(),a=ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],pn.copy(this);let l=1/r,h=1/o,u=1/a;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,e.setFromRotationMatrix(pn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Wn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),p,g;if(a===Wn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===wo)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Wn){let c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*l,p=(n+s)*h,g,_;if(a===Wn)g=(o+r)*u,_=-2*u;else if(a===wo)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ss=new Y,pn=new fe,zm=new Y(0,0,0),Gm=new Y(1,1,1),oi=new Y,Kr=new Y,en=new Y,qh=new fe,Yh=new vn,Po=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(De(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-De(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(De(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-De(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(De(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-De(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return qh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(qh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yh.setFromEuler(this),this.setFromQuaternion(Yh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Po.DEFAULT_ORDER="XYZ";var lr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Vm=0,$h=new Y,rs=new vn,Hn=new fe,Zr=new Y,tr=new Y,Wm=new Y,Xm=new vn,jh=new Y(1,0,0),Kh=new Y(0,1,0),Zh=new Y(0,0,1),qm={type:"added"},Ym={type:"removed"},Re=class i extends Cn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vm++}),this.uuid=Ts(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new Y,e=new Po,n=new vn,s=new Y(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Jt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return rs.setFromAxisAngle(t,e),this.quaternion.multiply(rs),this}rotateOnWorldAxis(t,e){return rs.setFromAxisAngle(t,e),this.quaternion.premultiply(rs),this}rotateX(t){return this.rotateOnAxis(jh,t)}rotateY(t){return this.rotateOnAxis(Kh,t)}rotateZ(t){return this.rotateOnAxis(Zh,t)}translateOnAxis(t,e){return $h.copy(t).applyQuaternion(this.quaternion),this.position.add($h.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(jh,t)}translateY(t){return this.translateOnAxis(Kh,t)}translateZ(t){return this.translateOnAxis(Zh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Zr.copy(t):Zr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(tr,Zr,this.up):Hn.lookAt(Zr,tr,this.up),this.quaternion.setFromRotationMatrix(Hn),s&&(Hn.extractRotation(s.matrixWorld),rs.setFromRotationMatrix(Hn),this.quaternion.premultiply(rs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(qm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ym)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,t,Wm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,Xm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Re.DEFAULT_UP=new Y(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var mn=new Y,zn=new Y,Za=new Y,Gn=new Y,os=new Y,as=new Y,Jh=new Y,Ja=new Y,Qa=new Y,tc=new Y,Jr=!1,gs=class i{constructor(t=new Y,e=new Y,n=new Y){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),mn.subVectors(t,e),s.cross(mn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){mn.subVectors(s,e),zn.subVectors(n,e),Za.subVectors(t,e);let o=mn.dot(mn),a=mn.dot(zn),c=mn.dot(Za),l=zn.dot(zn),h=zn.dot(Za),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Jr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Jr=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Gn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Gn.x),c.addScaledVector(o,Gn.y),c.addScaledVector(a,Gn.z),c)}static isFrontFacing(t,e,n,s){return mn.subVectors(n,e),zn.subVectors(t,e),mn.cross(zn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),mn.cross(zn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Jr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Jr=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;os.subVectors(s,n),as.subVectors(r,n),Ja.subVectors(t,n);let c=os.dot(Ja),l=as.dot(Ja);if(c<=0&&l<=0)return e.copy(n);Qa.subVectors(t,s);let h=os.dot(Qa),u=as.dot(Qa);if(h>=0&&u<=h)return e.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(os,o);tc.subVectors(t,r);let p=os.dot(tc),g=as.dot(tc);if(g>=0&&p<=g)return e.copy(r);let _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(as,a);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Jh.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Jh,a);let f=1/(m+_+d);return o=_*f,a=d*f,e.copy(n).addScaledVector(os,o).addScaledVector(as,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},$u={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Qr={h:0,s:0,l:0};function ec(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ut=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=se.workingColorSpace){if(t=tl(t,1),e=De(e,0,1),n=De(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ec(o,r,t+1/3),this.g=ec(o,r,t),this.b=ec(o,r,t-1/3)}return se.toWorkingColorSpace(this,s),this}setStyle(t,e=Me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){let n=$u[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=vs(t.r),this.g=vs(t.g),this.b=vs(t.b),this}copyLinearToSRGB(t){return this.r=Va(t.r),this.g=Va(t.g),this.b=Va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return se.fromWorkingColorSpace(Ie.copy(this),t),Math.round(De(Ie.r*255,0,255))*65536+Math.round(De(Ie.g*255,0,255))*256+Math.round(De(Ie.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(Ie.copy(this),e);let n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Me){se.fromWorkingColorSpace(Ie.copy(this),t);let e=Ie.r,n=Ie.g,s=Ie.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(Qr);let n=ir(ai.h,Qr.h,e),s=ir(ai.s,Qr.s,e),r=ir(ai.l,Qr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ie=new Ut;Ut.NAMES=$u;var $m=0,Ln=class extends Cn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$m++}),this.uuid=Ts(),this.name="",this.type="Material",this.blending=ys,this.side=Rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fc,this.blendDst=pc,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=xo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qi,this.stencilZFail=Qi,this.stencilZPass=Qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==Rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fc&&(n.blendSrc=this.blendSrc),this.blendDst!==pc&&(n.blendDst=this.blendDst),this.blendEquation!==Ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Xn=class extends Ln{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=qo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var ge=new Y,to=new Bt,be=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=kh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)to.fromBufferAttribute(this,e),to.applyMatrix3(t),this.setXY(e,to.x,to.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ms(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Be(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ms(e,this.array)),e}setX(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ms(e,this.array)),e}setY(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ms(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ms(e,this.array)),e}setW(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),s=Be(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),s=Be(s,this.array),r=Be(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==kh&&(t.usage=this.usage),t}};var Lo=class extends be{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Io=class extends be{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var jt=class extends be{constructor(t,e,n){super(new Float32Array(t),e,n)}};var jm=0,cn=new fe,nc=new Re,cs=new Y,nn=new Ii,er=new Ii,Te=new Y,ie=class i extends Cn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jm++}),this.uuid=Ts(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Yu(t)?Io:Lo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return cn.makeRotationFromQuaternion(t),this.applyMatrix4(cn),this}rotateX(t){return cn.makeRotationX(t),this.applyMatrix4(cn),this}rotateY(t){return cn.makeRotationY(t),this.applyMatrix4(cn),this}rotateZ(t){return cn.makeRotationZ(t),this.applyMatrix4(cn),this}translate(t,e,n){return cn.makeTranslation(t,e,n),this.applyMatrix4(cn),this}scale(t,e,n){return cn.makeScale(t,e,n),this.applyMatrix4(cn),this}lookAt(t){return nc.lookAt(t),nc.updateMatrix(),this.applyMatrix4(nc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new jt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ii);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Di);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new Y,1/0);return}if(t){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];er.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(nn.min,er.min),nn.expandByPoint(Te),Te.addVectors(nn.max,er.max),nn.expandByPoint(Te)):(nn.expandByPoint(er.min),nn.expandByPoint(er.max))}nn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Te.fromBufferAttribute(a,l),c&&(cs.fromBufferAttribute(t,l),Te.add(cs)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new be(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let b=0;b<a;b++)l[b]=new Y,h[b]=new Y;let u=new Y,d=new Y,p=new Y,g=new Bt,_=new Bt,m=new Bt,f=new Y,v=new Y;function x(b,D,O){u.fromArray(s,b*3),d.fromArray(s,D*3),p.fromArray(s,O*3),g.fromArray(o,b*2),_.fromArray(o,D*2),m.fromArray(o,O*2),d.sub(u),p.sub(u),_.sub(g),m.sub(g);let k=1/(_.x*m.y-m.x*_.y);isFinite(k)&&(f.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(k),v.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(k),l[b].add(f),l[D].add(f),l[O].add(f),h[b].add(v),h[D].add(v),h[O].add(v))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let b=0,D=S.length;b<D;++b){let O=S[b],k=O.start,A=O.count;for(let C=k,R=k+A;C<R;C+=3)x(n[C+0],n[C+1],n[C+2])}let P=new Y,E=new Y,L=new Y,V=new Y;function M(b){L.fromArray(r,b*3),V.copy(L);let D=l[b];P.copy(D),P.sub(L.multiplyScalar(L.dot(D))).normalize(),E.crossVectors(V,D);let k=E.dot(h[b])<0?-1:1;c[b*4]=P.x,c[b*4+1]=P.y,c[b*4+2]=P.z,c[b*4+3]=k}for(let b=0,D=S.length;b<D;++b){let O=S[b],k=O.start,A=O.count;for(let C=k,R=k+A;C<R;C+=3)M(n[C+0]),M(n[C+1]),M(n[C+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new Y,r=new Y,o=new Y,a=new Y,c=new Y,l=new Y,h=new Y,u=new Y;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new be(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],p=t(d,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qh=new fe,wi=new Pn,eo=new Di,tu=new Y,ls=new Y,hs=new Y,us=new Y,ic=new Y,no=new Y,io=new Bt,so=new Bt,ro=new Bt,eu=new Y,nu=new Y,iu=new Y,oo=new Y,ao=new Y,de=class extends Re{constructor(t=new ie,e=new Xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){no.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(ic.fromBufferAttribute(u,t),o?no.addScaledVector(ic,h):no.addScaledVector(ic.sub(e),h))}e.add(no)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(r),wi.copy(t.ray).recast(t.near),!(eo.containsPoint(wi.origin)===!1&&(wi.intersectSphere(eo,tu)===null||wi.origin.distanceToSquared(tu)>(t.far-t.near)**2))&&(Qh.copy(r).invert(),wi.copy(t.ray).applyMatrix4(Qh),!(n.boundingBox!==null&&wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,wi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let S=v,P=x;S<P;S+=3){let E=a.getX(S),L=a.getX(S+1),V=a.getX(S+2);s=co(this,f,t,n,l,h,u,E,L,V),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let v=a.getX(m),x=a.getX(m+1),S=a.getX(m+2);s=co(this,o,t,n,l,h,u,v,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let S=v,P=x;S<P;S+=3){let E=S,L=S+1,V=S+2;s=co(this,f,t,n,l,h,u,E,L,V),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let v=m,x=m+1,S=m+2;s=co(this,o,t,n,l,h,u,v,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Km(i,t,e,n,s,r,o,a){let c;if(t.side===Ze?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Rn,a),c===null)return null;ao.copy(a),ao.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(ao);return l<e.near||l>e.far?null:{distance:l,point:ao.clone(),object:i}}function co(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,ls),i.getVertexPosition(c,hs),i.getVertexPosition(l,us);let h=Km(i,t,e,n,ls,hs,us,oo);if(h){s&&(io.fromBufferAttribute(s,a),so.fromBufferAttribute(s,c),ro.fromBufferAttribute(s,l),h.uv=gs.getInterpolation(oo,ls,hs,us,io,so,ro,new Bt)),r&&(io.fromBufferAttribute(r,a),so.fromBufferAttribute(r,c),ro.fromBufferAttribute(r,l),h.uv1=gs.getInterpolation(oo,ls,hs,us,io,so,ro,new Bt),h.uv2=h.uv1),o&&(eu.fromBufferAttribute(o,a),nu.fromBufferAttribute(o,c),iu.fromBufferAttribute(o,l),h.normal=gs.getInterpolation(oo,ls,hs,us,eu,nu,iu,new Y),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new Y,materialIndex:0};gs.getNormal(ls,hs,us,u.normal),h.face=u}return h}var hr=class i extends ie{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new jt(l,3)),this.setAttribute("normal",new jt(h,3)),this.setAttribute("uv",new jt(u,2));function g(_,m,f,v,x,S,P,E,L,V,M){let b=S/L,D=P/V,O=S/2,k=P/2,A=E/2,C=L+1,R=V+1,N=0,F=0,z=new Y;for(let B=0;B<R;B++){let X=B*D-k;for(let K=0;K<C;K++){let H=K*b-O;z[_]=H*v,z[m]=X*x,z[f]=A,l.push(z.x,z.y,z.z),z[_]=0,z[m]=0,z[f]=E>0?1:-1,h.push(z.x,z.y,z.z),u.push(K/L),u.push(1-B/V),N+=1}}for(let B=0;B<V;B++)for(let X=0;X<L;X++){let K=d+X+C*B,H=d+X+C*(B+1),W=d+(X+1)+C*(B+1),Z=d+(X+1)+C*B;c.push(K,H,Z),c.push(H,W,Z),F+=6}a.addGroup(p,F,M),p+=F,d+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Es(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ke(i){let t={};for(let e=0;e<i.length;e++){let n=Es(i[e]);for(let s in n)t[s]=n[s]}return t}function Zm(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ju(i){return i.getRenderTarget()===null?i.outputColorSpace:se.workingColorSpace}var Jm={clone:Es,merge:ke},Qm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,t0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ve=class extends Ln{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qm,this.fragmentShader=t0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Es(t.uniforms),this.uniformsGroups=Zm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Do=class extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Wn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ge=class extends Do{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=cr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(nr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return cr*2*Math.atan(Math.tan(nr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(nr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ds=-90,fs=1,Sc=class extends Re{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ge(ds,fs,t,e);s.layers=this.layers,this.add(s);let r=new Ge(ds,fs,t,e);r.layers=this.layers,this.add(r);let o=new Ge(ds,fs,t,e);o.layers=this.layers,this.add(o);let a=new Ge(ds,fs,t,e);a.layers=this.layers,this.add(a);let c=new Ge(ds,fs,t,e);c.layers=this.layers,this.add(c);let l=new Ge(ds,fs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===wo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},No=class extends yn{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},wc=class extends sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(sr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Li?Me:hn),this.texture=new No(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ze}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new hr(5,5,5),r=new Ve({name:"CubemapFromEquirect",uniforms:Es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ze,blending:li});r.uniforms.tEquirect.value=e;let o=new de(s,r),a=e.minFilter;return e.minFilter===or&&(e.minFilter=ze),new Sc(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},sc=new Y,e0=new Y,n0=new Jt,Ke=class{constructor(t=new Y(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=sc.subVectors(n,e).cross(e0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(sc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||n0.getNormalMatrix(t),s=this.coplanarPoint(sc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ei=new Di,lo=new Y,ur=class{constructor(t=new Ke,e=new Ke,n=new Ke,s=new Ke,r=new Ke,o=new Ke){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Wn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],v=s[13],x=s[14],S=s[15];if(n[0].setComponents(c-r,d-l,m-p,S-f).normalize(),n[1].setComponents(c+r,d+l,m+p,S+f).normalize(),n[2].setComponents(c+o,d+h,m+g,S+v).normalize(),n[3].setComponents(c-o,d-h,m-g,S-v).normalize(),n[4].setComponents(c-a,d-u,m-_,S-x).normalize(),e===Wn)n[5].setComponents(c+a,d+u,m+_,S+x).normalize();else if(e===wo)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(t){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476,Ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(lo.x=s.normal.x>0?t.max.x:t.min.x,lo.y=s.normal.y>0?t.max.y:t.min.y,lo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(lo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ku(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function i0(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let u=l.array,d=l.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,h,u){let d=h.array,p=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),p.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){let f=g[_];e?i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}var dr=class i extends ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let v=f*d-o;for(let x=0;x<l;x++){let S=x*u-r;g.push(S,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let v=0;v<a;v++){let x=v+l*f,S=v+l*(f+1),P=v+1+l*(f+1),E=v+1+l*f;p.push(x,S,E),p.push(S,P,E)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(_,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},s0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,r0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,o0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,a0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,c0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,l0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,h0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,u0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,d0=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,f0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,p0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,m0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,g0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,x0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,M0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,w0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,E0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,T0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,R0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,C0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,P0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,L0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,I0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,D0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,N0="gl_FragColor = linearToOutputTexel( gl_FragColor );",O0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,U0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,F0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,B0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,k0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,H0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,z0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,G0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,V0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,W0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,X0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,q0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Y0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,j0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,K0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Z0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,J0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Q0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,eg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ng=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ig=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,og=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ag=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cg=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lg=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,hg=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ug=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_g=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,yg=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,vg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Mg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,bg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Eg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ag=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Tg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Lg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ig=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Dg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ng=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Og=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ug=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Hg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Xg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$g=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,t_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,e_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,n_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,i_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,s_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,o_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,c_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,h_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,u_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,d_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,f_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,p_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,g_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,__=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,x_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,b_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,w_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,E_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,R_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,C_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,P_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,I_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,D_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,N_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,O_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,U_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:s0,alphahash_pars_fragment:r0,alphamap_fragment:o0,alphamap_pars_fragment:a0,alphatest_fragment:c0,alphatest_pars_fragment:l0,aomap_fragment:h0,aomap_pars_fragment:u0,batching_pars_vertex:d0,batching_vertex:f0,begin_vertex:p0,beginnormal_vertex:m0,bsdfs:g0,iridescence_fragment:_0,bumpmap_pars_fragment:x0,clipping_planes_fragment:y0,clipping_planes_pars_fragment:v0,clipping_planes_pars_vertex:M0,clipping_planes_vertex:b0,color_fragment:S0,color_pars_fragment:w0,color_pars_vertex:E0,color_vertex:A0,common:T0,cube_uv_reflection_fragment:R0,defaultnormal_vertex:C0,displacementmap_pars_vertex:P0,displacementmap_vertex:L0,emissivemap_fragment:I0,emissivemap_pars_fragment:D0,colorspace_fragment:N0,colorspace_pars_fragment:O0,envmap_fragment:U0,envmap_common_pars_fragment:F0,envmap_pars_fragment:B0,envmap_pars_vertex:k0,envmap_physical_pars_fragment:Z0,envmap_vertex:H0,fog_vertex:z0,fog_pars_vertex:G0,fog_fragment:V0,fog_pars_fragment:W0,gradientmap_pars_fragment:X0,lightmap_fragment:q0,lightmap_pars_fragment:Y0,lights_lambert_fragment:$0,lights_lambert_pars_fragment:j0,lights_pars_begin:K0,lights_toon_fragment:J0,lights_toon_pars_fragment:Q0,lights_phong_fragment:tg,lights_phong_pars_fragment:eg,lights_physical_fragment:ng,lights_physical_pars_fragment:ig,lights_fragment_begin:sg,lights_fragment_maps:rg,lights_fragment_end:og,logdepthbuf_fragment:ag,logdepthbuf_pars_fragment:cg,logdepthbuf_pars_vertex:lg,logdepthbuf_vertex:hg,map_fragment:ug,map_pars_fragment:dg,map_particle_fragment:fg,map_particle_pars_fragment:pg,metalnessmap_fragment:mg,metalnessmap_pars_fragment:gg,morphcolor_vertex:_g,morphnormal_vertex:xg,morphtarget_pars_vertex:yg,morphtarget_vertex:vg,normal_fragment_begin:Mg,normal_fragment_maps:bg,normal_pars_fragment:Sg,normal_pars_vertex:wg,normal_vertex:Eg,normalmap_pars_fragment:Ag,clearcoat_normal_fragment_begin:Tg,clearcoat_normal_fragment_maps:Rg,clearcoat_pars_fragment:Cg,iridescence_pars_fragment:Pg,opaque_fragment:Lg,packing:Ig,premultiplied_alpha_fragment:Dg,project_vertex:Ng,dithering_fragment:Og,dithering_pars_fragment:Ug,roughnessmap_fragment:Fg,roughnessmap_pars_fragment:Bg,shadowmap_pars_fragment:kg,shadowmap_pars_vertex:Hg,shadowmap_vertex:zg,shadowmask_pars_fragment:Gg,skinbase_vertex:Vg,skinning_pars_vertex:Wg,skinning_vertex:Xg,skinnormal_vertex:qg,specularmap_fragment:Yg,specularmap_pars_fragment:$g,tonemapping_fragment:jg,tonemapping_pars_fragment:Kg,transmission_fragment:Zg,transmission_pars_fragment:Jg,uv_pars_fragment:Qg,uv_pars_vertex:t_,uv_vertex:e_,worldpos_vertex:n_,background_vert:i_,background_frag:s_,backgroundCube_vert:r_,backgroundCube_frag:o_,cube_vert:a_,cube_frag:c_,depth_vert:l_,depth_frag:h_,distanceRGBA_vert:u_,distanceRGBA_frag:d_,equirect_vert:f_,equirect_frag:p_,linedashed_vert:m_,linedashed_frag:g_,meshbasic_vert:__,meshbasic_frag:x_,meshlambert_vert:y_,meshlambert_frag:v_,meshmatcap_vert:M_,meshmatcap_frag:b_,meshnormal_vert:S_,meshnormal_frag:w_,meshphong_vert:E_,meshphong_frag:A_,meshphysical_vert:T_,meshphysical_frag:R_,meshtoon_vert:C_,meshtoon_frag:P_,points_vert:L_,points_frag:I_,shadow_vert:D_,shadow_frag:N_,sprite_vert:O_,sprite_frag:U_},wt={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},En={basic:{uniforms:ke([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:ke([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Ut(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:ke([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:ke([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:ke([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Ut(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:ke([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:ke([wt.points,wt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:ke([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:ke([wt.common,wt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:ke([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:ke([wt.sprite,wt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:ke([wt.common,wt.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:ke([wt.lights,wt.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};En.physical={uniforms:ke([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};var ho={r:0,b:0,g:0};function F_(i,t,e,n,s,r,o){let a=new Ut(0),c=r===!0?0:1,l,h,u=null,d=0,p=null;function g(m,f){let v=!1,x=f.isScene===!0?f.background:null;x&&x.isTexture&&(x=(f.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,c):x&&x.isColor&&(_(x,1),v=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Yo)?(h===void 0&&(h=new de(new hr(1,1,1),new Ve({name:"BackgroundCubeMaterial",uniforms:Es(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Ze,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,E,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=se.getTransfer(x.colorSpace)!==ae,(u!==x||d!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new de(new dr(2,2),new Ve({name:"BackgroundMaterial",uniforms:Es(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=se.getTransfer(x.colorSpace)!==ae,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,f){m.getRGB(ho,ju(i)),n.buffers.color.setClear(ho.r,ho.g,ho.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(m,f=1){a.set(m),c=f,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(a,c)},render:g}}function B_(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null),l=c,h=!1;function u(A,C,R,N,F){let z=!1;if(o){let B=_(N,R,C);l!==B&&(l=B,p(l.object)),z=f(A,N,R,F),z&&v(A,N,R,F)}else{let B=C.wireframe===!0;(l.geometry!==N.id||l.program!==R.id||l.wireframe!==B)&&(l.geometry=N.id,l.program=R.id,l.wireframe=B,z=!0)}F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,V(A,C,R,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(A){return n.isWebGL2?i.bindVertexArray(A):r.bindVertexArrayOES(A)}function g(A){return n.isWebGL2?i.deleteVertexArray(A):r.deleteVertexArrayOES(A)}function _(A,C,R){let N=R.wireframe===!0,F=a[A.id];F===void 0&&(F={},a[A.id]=F);let z=F[C.id];z===void 0&&(z={},F[C.id]=z);let B=z[N];return B===void 0&&(B=m(d()),z[N]=B),B}function m(A){let C=[],R=[],N=[];for(let F=0;F<s;F++)C[F]=0,R[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:R,attributeDivisors:N,object:A,attributes:{},index:null}}function f(A,C,R,N){let F=l.attributes,z=C.attributes,B=0,X=R.getAttributes();for(let K in X)if(X[K].location>=0){let W=F[K],Z=z[K];if(Z===void 0&&(K==="instanceMatrix"&&A.instanceMatrix&&(Z=A.instanceMatrix),K==="instanceColor"&&A.instanceColor&&(Z=A.instanceColor)),W===void 0||W.attribute!==Z||Z&&W.data!==Z.data)return!0;B++}return l.attributesNum!==B||l.index!==N}function v(A,C,R,N){let F={},z=C.attributes,B=0,X=R.getAttributes();for(let K in X)if(X[K].location>=0){let W=z[K];W===void 0&&(K==="instanceMatrix"&&A.instanceMatrix&&(W=A.instanceMatrix),K==="instanceColor"&&A.instanceColor&&(W=A.instanceColor));let Z={};Z.attribute=W,W&&W.data&&(Z.data=W.data),F[K]=Z,B++}l.attributes=F,l.attributesNum=B,l.index=N}function x(){let A=l.newAttributes;for(let C=0,R=A.length;C<R;C++)A[C]=0}function S(A){P(A,0)}function P(A,C){let R=l.newAttributes,N=l.enabledAttributes,F=l.attributeDivisors;R[A]=1,N[A]===0&&(i.enableVertexAttribArray(A),N[A]=1),F[A]!==C&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](A,C),F[A]=C)}function E(){let A=l.newAttributes,C=l.enabledAttributes;for(let R=0,N=C.length;R<N;R++)C[R]!==A[R]&&(i.disableVertexAttribArray(R),C[R]=0)}function L(A,C,R,N,F,z,B){B===!0?i.vertexAttribIPointer(A,C,R,F,z):i.vertexAttribPointer(A,C,R,N,F,z)}function V(A,C,R,N){if(n.isWebGL2===!1&&(A.isInstancedMesh||N.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let F=N.attributes,z=R.getAttributes(),B=C.defaultAttributeValues;for(let X in z){let K=z[X];if(K.location>=0){let H=F[X];if(H===void 0&&(X==="instanceMatrix"&&A.instanceMatrix&&(H=A.instanceMatrix),X==="instanceColor"&&A.instanceColor&&(H=A.instanceColor)),H!==void 0){let W=H.normalized,Z=H.itemSize,nt=e.get(H);if(nt===void 0)continue;let et=nt.buffer,mt=nt.type,St=nt.bytesPerElement,ot=n.isWebGL2===!0&&(mt===i.INT||mt===i.UNSIGNED_INT||H.gpuType===Bu);if(H.isInterleavedBufferAttribute){let vt=H.data,q=vt.stride,Pt=H.offset;if(vt.isInstancedInterleavedBuffer){for(let at=0;at<K.locationSize;at++)P(K.location+at,vt.meshPerAttribute);A.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=vt.meshPerAttribute*vt.count)}else for(let at=0;at<K.locationSize;at++)S(K.location+at);i.bindBuffer(i.ARRAY_BUFFER,et);for(let at=0;at<K.locationSize;at++)L(K.location+at,Z/K.locationSize,mt,W,q*St,(Pt+Z/K.locationSize*at)*St,ot)}else{if(H.isInstancedBufferAttribute){for(let vt=0;vt<K.locationSize;vt++)P(K.location+vt,H.meshPerAttribute);A.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let vt=0;vt<K.locationSize;vt++)S(K.location+vt);i.bindBuffer(i.ARRAY_BUFFER,et);for(let vt=0;vt<K.locationSize;vt++)L(K.location+vt,Z/K.locationSize,mt,W,Z*St,Z/K.locationSize*vt*St,ot)}}else if(B!==void 0){let W=B[X];if(W!==void 0)switch(W.length){case 2:i.vertexAttrib2fv(K.location,W);break;case 3:i.vertexAttrib3fv(K.location,W);break;case 4:i.vertexAttrib4fv(K.location,W);break;default:i.vertexAttrib1fv(K.location,W)}}}}E()}function M(){O();for(let A in a){let C=a[A];for(let R in C){let N=C[R];for(let F in N)g(N[F].object),delete N[F];delete C[R]}delete a[A]}}function b(A){if(a[A.id]===void 0)return;let C=a[A.id];for(let R in C){let N=C[R];for(let F in N)g(N[F].object),delete N[F];delete C[R]}delete a[A.id]}function D(A){for(let C in a){let R=a[C];if(R[A.id]===void 0)continue;let N=R[A.id];for(let F in N)g(N[F].object),delete N[F];delete R[A.id]}}function O(){k(),h=!0,l!==c&&(l=c,p(l.object))}function k(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:O,resetDefaultState:k,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfProgram:D,initAttributes:x,enableAttribute:S,disableUnusedAttributes:E}}function k_(i,t,e,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let p,g;if(s)p=i,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function H_(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let L=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,S=o||t.has("OES_texture_float"),P=x&&S,E=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:f,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:S,floatVertexTextures:P,maxSamples:E}}function z_(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Ke,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let v=r?0:n,x=v*4,S=f.clippingState||null;c.value=S,S=h(g,d,x,p);for(let P=0;P!==x;++P)S[P]=e[P];f.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,S=p;x!==_;++x,S+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(m,S),m[S+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function G_(i){let t=new WeakMap;function e(o,a){return a===mc?o.mapping=bs:a===gc&&(o.mapping=Ss),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===mc||a===gc)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new wc(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var In=class extends Do{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},_s=4,su=[.125,.215,.35,.446,.526,.582],Ri=20,rc=new In,ru=new Ut,oc=null,ac=0,cc=0,Ai=(1+Math.sqrt(5))/2,ps=1/Ai,ou=[new Y(1,1,1),new Y(-1,1,1),new Y(1,1,-1),new Y(-1,1,-1),new Y(0,Ai,ps),new Y(0,Ai,-ps),new Y(ps,0,Ai),new Y(-ps,0,Ai),new Y(Ai,ps,0),new Y(-Ai,ps,0)],Oo=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(oc,ac,cc),t.scissorTest=!1,uo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ze,minFilter:ze,generateMipmaps:!1,type:ar,format:_n,colorSpace:xn,depthBuffer:!1},s=au(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=au(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=V_(r)),this._blurMaterial=W_(r,t,e)}return s}_compileMaterial(t){let e=new de(this._lodPlanes[0],t);this._renderer.compile(e,rc)}_sceneToCubeUV(t,e,n,s){let a=new Ge(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ru),h.toneMapping=hi,h.autoClear=!1;let p=new Xn({name:"PMREM.Background",side:Ze,depthWrite:!1,depthTest:!1}),g=new de(new hr,p),_=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(ru),_=!0);for(let f=0;f<6;f++){let v=f%3;v===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):v===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));let x=this._cubeSize;uo(s,v*x,f>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===bs||t.mapping===Ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new de(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;uo(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,rc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ou[(s-1)%ou.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new de(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ri-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ri;m>Ri&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ri}`);let f=[],v=0;for(let L=0;L<Ri;++L){let V=L/_,M=Math.exp(-V*V/2);f.push(M),L===0?v+=M:L<m&&(v+=2*M)}for(let L=0;L<f.length;L++)f[L]=f[L]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let S=this._sizeLods[s],P=3*S*(s>x-_s?s-x+_s:0),E=4*(this._cubeSize-S);uo(e,P,E,3*S,2*S),c.setRenderTarget(e),c.render(u,rc)}};function V_(i){let t=[],e=[],n=[],s=i,r=i-_s+1+su.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-_s?c=su[o-i+_s-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,v=new Float32Array(_*g*p),x=new Float32Array(m*g*p),S=new Float32Array(f*g*p);for(let E=0;E<p;E++){let L=E%3*2/3-1,V=E>2?0:-1,M=[L,V,0,L+2/3,V,0,L+2/3,V+1,0,L,V,0,L+2/3,V+1,0,L,V+1,0];v.set(M,_*g*E),x.set(d,m*g*E);let b=[E,E,E,E,E,E];S.set(b,f*g*E)}let P=new ie;P.setAttribute("position",new be(v,_)),P.setAttribute("uv",new be(x,m)),P.setAttribute("faceIndex",new be(S,f)),t.push(P),s>_s&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function au(i,t,e){let n=new sn(i,t,e);return n.texture.mapping=Yo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function uo(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function W_(i,t,e){let n=new Float32Array(Ri),s=new Y(0,1,0);return new Ve({name:"SphericalGaussianBlur",defines:{n:Ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:el(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function cu(){return new Ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:el(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function lu(){return new Ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:el(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function el(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function X_(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===mc||c===gc,h=c===bs||c===Ss;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new Oo(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{let u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Oo(i));let d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function q_(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Y_(i,t,e,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let v=p.array;_=p.version;for(let x=0,S=v.length;x<S;x+=3){let P=v[x+0],E=v[x+1],L=v[x+2];d.push(P,E,E,L,L,P)}}else if(g!==void 0){let v=g.array;_=g.version;for(let x=0,S=v.length/3-1;x<S;x+=3){let P=x+0,E=x+1,L=x+2;d.push(P,E,E,L,L,P)}}else return;let m=new(Yu(d)?Io:Lo)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function $_(i,t,e,n){let s=n.isWebGL2,r;function o(p){r=p}let a,c;function l(p){a=p.type,c=p.bytesPerElement}function h(p,g){i.drawElements(r,g,a,p*c),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,f;if(s)m=i,f="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[f](r,g,a,p*c,_),e.update(g,r,_)}function d(p,g,_){if(_===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<_;f++)this.render(p[f]/c,g[f]);else{m.multiDrawElementsWEBGL(r,g,0,a,p,0,_);let f=0;for(let v=0;v<_;v++)f+=g[v];e.update(f,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function j_(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function K_(i,t){return i[0]-t[0]}function Z_(i,t){return Math.abs(t[1])-Math.abs(i[1])}function J_(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new ue,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){let d=l.morphTargetInfluences;if(t.isWebGL2===!0){let p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=p!==void 0?p.length:0,_=r.get(h);if(_===void 0||_.count!==g){let A=function(){O.dispose(),r.delete(h),h.removeEventListener("dispose",A)};_!==void 0&&_.texture.dispose();let v=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],E=h.morphAttributes.normal||[],L=h.morphAttributes.color||[],V=0;v===!0&&(V=1),x===!0&&(V=2),S===!0&&(V=3);let M=h.attributes.position.count*V,b=1;M>t.maxTextureSize&&(b=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let D=new Float32Array(M*b*4*g),O=new Co(D,M,b,g);O.type=An,O.needsUpdate=!0;let k=V*4;for(let C=0;C<g;C++){let R=P[C],N=E[C],F=L[C],z=M*b*4*C;for(let B=0;B<R.count;B++){let X=B*k;v===!0&&(o.fromBufferAttribute(R,B),D[z+X+0]=o.x,D[z+X+1]=o.y,D[z+X+2]=o.z,D[z+X+3]=0),x===!0&&(o.fromBufferAttribute(N,B),D[z+X+4]=o.x,D[z+X+5]=o.y,D[z+X+6]=o.z,D[z+X+7]=0),S===!0&&(o.fromBufferAttribute(F,B),D[z+X+8]=o.x,D[z+X+9]=o.y,D[z+X+10]=o.z,D[z+X+11]=F.itemSize===4?o.w:1)}}_={count:g,texture:O,size:new Bt(M,b)},r.set(h,_),h.addEventListener("dispose",A)}let m=0;for(let v=0;v<d.length;v++)m+=d[v];let f=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",f),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{let p=d===void 0?0:d.length,g=n[h.id];if(g===void 0||g.length!==p){g=[];for(let x=0;x<p;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<p;x++){let S=g[x];S[0]=x,S[1]=d[x]}g.sort(Z_);for(let x=0;x<8;x++)x<p&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(K_);let _=h.morphAttributes.position,m=h.morphAttributes.normal,f=0;for(let x=0;x<8;x++){let S=a[x],P=S[0],E=S[1];P!==Number.MAX_SAFE_INTEGER&&E?(_&&h.getAttribute("morphTarget"+x)!==_[P]&&h.setAttribute("morphTarget"+x,_[P]),m&&h.getAttribute("morphNormal"+x)!==m[P]&&h.setAttribute("morphNormal"+x,m[P]),s[x]=E,f+=E):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let v=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function Q_(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Uo=class extends yn{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:Pi,h!==Pi&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Pi&&(n=ci),n===void 0&&h===ws&&(n=Ci),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:He,this.minFilter=c!==void 0?c:He,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Zu=new yn,Ju=new Uo(1,1);Ju.compareFunction=qu;var Qu=new Co,td=new bc,ed=new No,hu=[],uu=[],du=new Float32Array(16),fu=new Float32Array(9),pu=new Float32Array(4);function Rs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=hu[s];if(r===void 0&&(r=new Float32Array(s),hu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function we(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function jo(i,t){let e=uu[t];e===void 0&&(e=new Int32Array(t),uu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function tx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ex(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2fv(this.addr,t),we(e,t)}}function nx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;i.uniform3fv(this.addr,t),we(e,t)}}function ix(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4fv(this.addr,t),we(e,t)}}function sx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;pu.set(n),i.uniformMatrix2fv(this.addr,!1,pu),we(e,n)}}function rx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;fu.set(n),i.uniformMatrix3fv(this.addr,!1,fu),we(e,n)}}function ox(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;du.set(n),i.uniformMatrix4fv(this.addr,!1,du),we(e,n)}}function ax(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function cx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2iv(this.addr,t),we(e,t)}}function lx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3iv(this.addr,t),we(e,t)}}function hx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4iv(this.addr,t),we(e,t)}}function ux(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function dx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2uiv(this.addr,t),we(e,t)}}function fx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3uiv(this.addr,t),we(e,t)}}function px(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4uiv(this.addr,t),we(e,t)}}function mx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Ju:Zu;e.setTexture2D(t||r,s)}function gx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||td,s)}function _x(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ed,s)}function xx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Qu,s)}function yx(i){switch(i){case 5126:return tx;case 35664:return ex;case 35665:return nx;case 35666:return ix;case 35674:return sx;case 35675:return rx;case 35676:return ox;case 5124:case 35670:return ax;case 35667:case 35671:return cx;case 35668:case 35672:return lx;case 35669:case 35673:return hx;case 5125:return ux;case 36294:return dx;case 36295:return fx;case 36296:return px;case 35678:case 36198:case 36298:case 36306:case 35682:return mx;case 35679:case 36299:case 36307:return gx;case 35680:case 36300:case 36308:case 36293:return _x;case 36289:case 36303:case 36311:case 36292:return xx}}function vx(i,t){i.uniform1fv(this.addr,t)}function Mx(i,t){let e=Rs(t,this.size,2);i.uniform2fv(this.addr,e)}function bx(i,t){let e=Rs(t,this.size,3);i.uniform3fv(this.addr,e)}function Sx(i,t){let e=Rs(t,this.size,4);i.uniform4fv(this.addr,e)}function wx(i,t){let e=Rs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ex(i,t){let e=Rs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ax(i,t){let e=Rs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Tx(i,t){i.uniform1iv(this.addr,t)}function Rx(i,t){i.uniform2iv(this.addr,t)}function Cx(i,t){i.uniform3iv(this.addr,t)}function Px(i,t){i.uniform4iv(this.addr,t)}function Lx(i,t){i.uniform1uiv(this.addr,t)}function Ix(i,t){i.uniform2uiv(this.addr,t)}function Dx(i,t){i.uniform3uiv(this.addr,t)}function Nx(i,t){i.uniform4uiv(this.addr,t)}function Ox(i,t,e){let n=this.cache,s=t.length,r=jo(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Zu,r[o])}function Ux(i,t,e){let n=this.cache,s=t.length,r=jo(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||td,r[o])}function Fx(i,t,e){let n=this.cache,s=t.length,r=jo(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ed,r[o])}function Bx(i,t,e){let n=this.cache,s=t.length,r=jo(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Qu,r[o])}function kx(i){switch(i){case 5126:return vx;case 35664:return Mx;case 35665:return bx;case 35666:return Sx;case 35674:return wx;case 35675:return Ex;case 35676:return Ax;case 5124:case 35670:return Tx;case 35667:case 35671:return Rx;case 35668:case 35672:return Cx;case 35669:case 35673:return Px;case 5125:return Lx;case 36294:return Ix;case 36295:return Dx;case 36296:return Nx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return Ux;case 35680:case 36300:case 36308:case 36293:return Fx;case 36289:case 36303:case 36311:case 36292:return Bx}}var Ec=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=yx(e.type)}},Ac=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=kx(e.type)}},Tc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},lc=/(\w+)(\])?(\[|\.)?/g;function mu(i,t){i.seq.push(t),i.map[t.id]=t}function Hx(i,t,e){let n=i.name,s=n.length;for(lc.lastIndex=0;;){let r=lc.exec(n),o=lc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){mu(e,l===void 0?new Ec(a,i,t):new Ac(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Tc(a),mu(e,u)),e=u}}}var Ms=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Hx(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function gu(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var zx=37297,Gx=0;function Vx(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Wx(i){let t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(i),n;switch(t===e?n="":t===So&&e===bo?n="LinearDisplayP3ToLinearSRGB":t===bo&&e===So&&(n="LinearSRGBToLinearDisplayP3"),i){case xn:case $o:return[n,"LinearTransferOETF"];case Me:case Qc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function _u(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Vx(i.getShaderSource(t),o)}else return s}function Xx(i,t){let e=Wx(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function qx(i,t){let e;switch(t){case Zp:e="Linear";break;case Jp:e="Reinhard";break;case Qp:e="OptimizedCineon";break;case tm:e="ACESFilmic";break;case nm:e="AgX";break;case em:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Yx(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xs).join(`
`)}function $x(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xs).join(`
`)}function jx(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kx(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function xs(i){return i!==""}function xu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function yu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Zx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rc(i){return i.replace(Zx,Qx)}var Jx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Qx(i,t){let e=qt[t];if(e===void 0){let n=Jx.get(t);if(n!==void 0)e=qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Rc(e)}var ty=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vu(i){return i.replace(ty,ey)}function ey(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Mu(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function ny(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Uu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ep?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function iy(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case Yo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sy(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ss&&(t="ENVMAP_MODE_REFRACTION"),t}function ry(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case qo:t="ENVMAP_BLENDING_MULTIPLY";break;case jp:t="ENVMAP_BLENDING_MIX";break;case Kp:t="ENVMAP_BLENDING_ADD";break}return t}function oy(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function ay(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=ny(e),l=iy(e),h=sy(e),u=ry(e),d=oy(e),p=e.isWebGL2?"":Yx(e),g=$x(e),_=jx(r),m=s.createProgram(),f,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(xs).join(`
`),f.length>0&&(f+=`
`),v=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(xs).join(`
`),v.length>0&&(v+=`
`)):(f=[Mu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),v=[p,Mu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?qt.tonemapping_pars_fragment:"",e.toneMapping!==hi?qx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Xx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xs).join(`
`)),o=Rc(o),o=xu(o,e),o=yu(o,e),a=Rc(a),a=xu(a,e),a=yu(a,e),o=vu(o),a=vu(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Hh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Hh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let S=x+f+o,P=x+v+a,E=gu(s,s.VERTEX_SHADER,S),L=gu(s,s.FRAGMENT_SHADER,P);s.attachShader(m,E),s.attachShader(m,L),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function V(O){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(m).trim(),A=s.getShaderInfoLog(E).trim(),C=s.getShaderInfoLog(L).trim(),R=!0,N=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(R=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,E,L);else{let F=_u(s,E,"vertex"),z=_u(s,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+F+`
`+z)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(A===""||C==="")&&(N=!1);N&&(O.diagnostics={runnable:R,programLog:k,vertexShader:{log:A,prefix:f},fragmentShader:{log:C,prefix:v}})}s.deleteShader(E),s.deleteShader(L),M=new Ms(s,m),b=Kx(s,m)}let M;this.getUniforms=function(){return M===void 0&&V(this),M};let b;this.getAttributes=function(){return b===void 0&&V(this),b};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(m,zx)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=L,this}var cy=0,Cc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Pc(t),e.set(t,n)),n}},Pc=class{constructor(t){this.id=cy++,this.code=t,this.usedTimes=0}};function ly(i,t,e,n,s,r,o){let a=new lr,c=new Cc,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function m(M,b,D,O,k){let A=O.fog,C=k.geometry,R=M.isMeshStandardMaterial?O.environment:null,N=(M.isMeshStandardMaterial?e:t).get(M.envMap||R),F=N&&N.mapping===Yo?N.image.height:null,z=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let B=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,X=B!==void 0?B.length:0,K=0;C.morphAttributes.position!==void 0&&(K=1),C.morphAttributes.normal!==void 0&&(K=2),C.morphAttributes.color!==void 0&&(K=3);let H,W,Z,nt;if(z){let Ue=En[z];H=Ue.vertexShader,W=Ue.fragmentShader}else H=M.vertexShader,W=M.fragmentShader,c.update(M),Z=c.getVertexShaderID(M),nt=c.getFragmentShaderID(M);let et=i.getRenderTarget(),mt=k.isInstancedMesh===!0,St=k.isBatchedMesh===!0,ot=!!M.map,vt=!!M.matcap,q=!!N,Pt=!!M.aoMap,at=!!M.lightMap,Mt=!!M.bumpMap,pt=!!M.normalMap,Rt=!!M.displacementMap,bt=!!M.emissiveMap,T=!!M.metalnessMap,w=!!M.roughnessMap,$=M.anisotropy>0,ct=M.clearcoat>0,lt=M.iridescence>0,ht=M.sheen>0,At=M.transmission>0,yt=$&&!!M.anisotropyMap,Et=ct&&!!M.clearcoatMap,Ct=ct&&!!M.clearcoatNormalMap,Dt=ct&&!!M.clearcoatRoughnessMap,rt=lt&&!!M.iridescenceMap,Ot=lt&&!!M.iridescenceThicknessMap,U=ht&&!!M.sheenColorMap,st=ht&&!!M.sheenRoughnessMap,ft=!!M.specularMap,ut=!!M.specularColorMap,_t=!!M.specularIntensityMap,Ht=At&&!!M.transmissionMap,Wt=At&&!!M.thicknessMap,Gt=!!M.gradientMap,gt=!!M.alphaMap,G=M.alphaTest>0,J=!!M.alphaHash,xt=!!M.extensions,Nt=!!C.attributes.uv1,Lt=!!C.attributes.uv2,ee=!!C.attributes.uv3,ne=hi;return M.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(ne=i.toneMapping),{isWebGL2:h,shaderID:z,shaderType:M.type,shaderName:M.name,vertexShader:H,fragmentShader:W,defines:M.defines,customVertexShaderID:Z,customFragmentShaderID:nt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:St,instancing:mt,instancingColor:mt&&k.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:xn,map:ot,matcap:vt,envMap:q,envMapMode:q&&N.mapping,envMapCubeUVHeight:F,aoMap:Pt,lightMap:at,bumpMap:Mt,normalMap:pt,displacementMap:d&&Rt,emissiveMap:bt,normalMapObjectSpace:pt&&M.normalMapType===pm,normalMapTangentSpace:pt&&M.normalMapType===Jc,metalnessMap:T,roughnessMap:w,anisotropy:$,anisotropyMap:yt,clearcoat:ct,clearcoatMap:Et,clearcoatNormalMap:Ct,clearcoatRoughnessMap:Dt,iridescence:lt,iridescenceMap:rt,iridescenceThicknessMap:Ot,sheen:ht,sheenColorMap:U,sheenRoughnessMap:st,specularMap:ft,specularColorMap:ut,specularIntensityMap:_t,transmission:At,transmissionMap:Ht,thicknessMap:Wt,gradientMap:Gt,opaque:M.transparent===!1&&M.blending===ys,alphaMap:gt,alphaTest:G,alphaHash:J,combine:M.combine,mapUv:ot&&_(M.map.channel),aoMapUv:Pt&&_(M.aoMap.channel),lightMapUv:at&&_(M.lightMap.channel),bumpMapUv:Mt&&_(M.bumpMap.channel),normalMapUv:pt&&_(M.normalMap.channel),displacementMapUv:Rt&&_(M.displacementMap.channel),emissiveMapUv:bt&&_(M.emissiveMap.channel),metalnessMapUv:T&&_(M.metalnessMap.channel),roughnessMapUv:w&&_(M.roughnessMap.channel),anisotropyMapUv:yt&&_(M.anisotropyMap.channel),clearcoatMapUv:Et&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Dt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:rt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ot&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:U&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:st&&_(M.sheenRoughnessMap.channel),specularMapUv:ft&&_(M.specularMap.channel),specularColorMapUv:ut&&_(M.specularColorMap.channel),specularIntensityMapUv:_t&&_(M.specularIntensityMap.channel),transmissionMapUv:Ht&&_(M.transmissionMap.channel),thicknessMapUv:Wt&&_(M.thicknessMap.channel),alphaMapUv:gt&&_(M.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(pt||$),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,vertexUv1s:Nt,vertexUv2s:Lt,vertexUv3s:ee,pointsUvs:k.isPoints===!0&&!!C.attributes.uv&&(ot||gt),fog:!!A,useFog:M.fog===!0,fogExp2:A&&A.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:k.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:X,morphTextureStride:K,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ne,useLegacyLights:i._useLegacyLights,decodeVideoTexture:ot&&M.map.isVideoTexture===!0&&se.getTransfer(M.map.colorSpace)===ae,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ln,flipSided:M.side===Ze,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:xt&&M.extensions.derivatives===!0,extensionFragDepth:xt&&M.extensions.fragDepth===!0,extensionDrawBuffers:xt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:xt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:xt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function f(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let D in M.defines)b.push(D),b.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(v(b,M),x(b,M),b.push(i.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function v(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function x(M,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function S(M){let b=g[M.type],D;if(b){let O=En[b];D=Jm.clone(O.uniforms)}else D=M.uniforms;return D}function P(M,b){let D;for(let O=0,k=l.length;O<k;O++){let A=l[O];if(A.cacheKey===b){D=A,++D.usedTimes;break}}return D===void 0&&(D=new ay(i,b,M,r),l.push(D)),D}function E(M){if(--M.usedTimes===0){let b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),M.destroy()}}function L(M){c.remove(M)}function V(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:S,acquireProgram:P,releaseProgram:E,releaseShaderCache:L,programs:l,dispose:V}}function hy(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function uy(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function bu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Su(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,p,g,_,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function a(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,_,m){let f=o(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||uy),n.length>1&&n.sort(d||bu),s.length>1&&s.sort(d||bu)}function h(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function dy(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Su,i.set(n,[o])):s>=r.length?(o=new Su,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function fy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new Y,color:new Ut};break;case"SpotLight":e={position:new Y,direction:new Y,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new Y,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new Y,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return i[t.id]=e,e}}}function py(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var my=0;function gy(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _y(i,t){let e=new fy,n=py(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new Y);let r=new Y,o=new fe,a=new fe;function c(h,u){let d=0,p=0,g=0;for(let O=0;O<9;O++)s.probe[O].set(0,0,0);let _=0,m=0,f=0,v=0,x=0,S=0,P=0,E=0,L=0,V=0,M=0;h.sort(gy);let b=u===!0?Math.PI:1;for(let O=0,k=h.length;O<k;O++){let A=h[O],C=A.color,R=A.intensity,N=A.distance,F=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=C.r*R*b,p+=C.g*R*b,g+=C.b*R*b;else if(A.isLightProbe){for(let z=0;z<9;z++)s.probe[z].addScaledVector(A.sh.coefficients[z],R);M++}else if(A.isDirectionalLight){let z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity*b),A.castShadow){let B=A.shadow,X=n.get(A);X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,s.directionalShadow[_]=X,s.directionalShadowMap[_]=F,s.directionalShadowMatrix[_]=A.shadow.matrix,S++}s.directional[_]=z,_++}else if(A.isSpotLight){let z=e.get(A);z.position.setFromMatrixPosition(A.matrixWorld),z.color.copy(C).multiplyScalar(R*b),z.distance=N,z.coneCos=Math.cos(A.angle),z.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),z.decay=A.decay,s.spot[f]=z;let B=A.shadow;if(A.map&&(s.spotLightMap[L]=A.map,L++,B.updateMatrices(A),A.castShadow&&V++),s.spotLightMatrix[f]=B.matrix,A.castShadow){let X=n.get(A);X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,s.spotShadow[f]=X,s.spotShadowMap[f]=F,E++}f++}else if(A.isRectAreaLight){let z=e.get(A);z.color.copy(C).multiplyScalar(R),z.halfWidth.set(A.width*.5,0,0),z.halfHeight.set(0,A.height*.5,0),s.rectArea[v]=z,v++}else if(A.isPointLight){let z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity*b),z.distance=A.distance,z.decay=A.decay,A.castShadow){let B=A.shadow,X=n.get(A);X.shadowBias=B.bias,X.shadowNormalBias=B.normalBias,X.shadowRadius=B.radius,X.shadowMapSize=B.mapSize,X.shadowCameraNear=B.camera.near,X.shadowCameraFar=B.camera.far,s.pointShadow[m]=X,s.pointShadowMap[m]=F,s.pointShadowMatrix[m]=A.shadow.matrix,P++}s.point[m]=z,m++}else if(A.isHemisphereLight){let z=e.get(A);z.skyColor.copy(A.color).multiplyScalar(R*b),z.groundColor.copy(A.groundColor).multiplyScalar(R*b),s.hemi[x]=z,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=wt.LTC_FLOAT_1,s.rectAreaLTC2=wt.LTC_FLOAT_2):(s.rectAreaLTC1=wt.LTC_HALF_1,s.rectAreaLTC2=wt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=wt.LTC_FLOAT_1,s.rectAreaLTC2=wt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=wt.LTC_HALF_1,s.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=p,s.ambient[2]=g;let D=s.hash;(D.directionalLength!==_||D.pointLength!==m||D.spotLength!==f||D.rectAreaLength!==v||D.hemiLength!==x||D.numDirectionalShadows!==S||D.numPointShadows!==P||D.numSpotShadows!==E||D.numSpotMaps!==L||D.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=f,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=E,s.spotShadowMap.length=E,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=E+L-V,s.spotLightMap.length=L,s.numSpotLightShadowsWithMaps=V,s.numLightProbes=M,D.directionalLength=_,D.pointLength=m,D.spotLength=f,D.rectAreaLength=v,D.hemiLength=x,D.numDirectionalShadows=S,D.numPointShadows=P,D.numSpotShadows=E,D.numSpotMaps=L,D.numLightProbes=M,s.version=my++)}function l(h,u){let d=0,p=0,g=0,_=0,m=0,f=u.matrixWorldInverse;for(let v=0,x=h.length;v<x;v++){let S=h[v];if(S.isDirectionalLight){let P=s.directional[d];P.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),d++}else if(S.isSpotLight){let P=s.spot[g];P.position.setFromMatrixPosition(S.matrixWorld),P.position.applyMatrix4(f),P.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),g++}else if(S.isRectAreaLight){let P=s.rectArea[_];P.position.setFromMatrixPosition(S.matrixWorld),P.position.applyMatrix4(f),a.identity(),o.copy(S.matrixWorld),o.premultiply(f),a.extractRotation(o),P.halfWidth.set(S.width*.5,0,0),P.halfHeight.set(0,S.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){let P=s.point[p];P.position.setFromMatrixPosition(S.matrixWorld),P.position.applyMatrix4(f),p++}else if(S.isHemisphereLight){let P=s.hemi[m];P.direction.setFromMatrixPosition(S.matrixWorld),P.direction.transformDirection(f),m++}}}return{setup:c,setupView:l,state:s}}function wu(i,t){let e=new _y(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function xy(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),c;return a===void 0?(c=new wu(i,t),e.set(r,[c])):o>=a.length?(c=new wu(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var Lc=class extends Ln{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ic=class extends Ln{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},yy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function My(i,t,e){let n=new ur,s=new Bt,r=new Bt,o=new ue,a=new Lc({depthPacking:fm}),c=new Ic,l={},h=e.maxTextureSize,u={[Rn]:Ze,[Ze]:Rn,[ln]:ln},d=new Ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:yy,fragmentShader:vy}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ie;g.setAttribute("position",new be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new de(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uu;let f=this.type;this.render=function(E,L,V){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let M=i.getRenderTarget(),b=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),O=i.state;O.setBlending(li),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let k=f!==Vn&&this.type===Vn,A=f===Vn&&this.type!==Vn;for(let C=0,R=E.length;C<R;C++){let N=E[C],F=N.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",N,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let z=F.getFrameExtents();if(s.multiply(z),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/z.x),s.x=r.x*z.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/z.y),s.y=r.y*z.y,F.mapSize.y=r.y)),F.map===null||k===!0||A===!0){let X=this.type!==Vn?{minFilter:He,magFilter:He}:{};F.map!==null&&F.map.dispose(),F.map=new sn(s.x,s.y,X),F.map.texture.name=N.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();let B=F.getViewportCount();for(let X=0;X<B;X++){let K=F.getViewport(X);o.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),O.viewport(o),F.updateMatrices(N,X),n=F.getFrustum(),S(L,V,F.camera,N,this.type)}F.isPointLightShadow!==!0&&this.type===Vn&&v(F,V),F.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,b,D)};function v(E,L){let V=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new sn(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(L,null,V,d,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(L,null,V,p,_,null)}function x(E,L,V,M){let b=null,D=V.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)b=D;else if(b=V.isPointLight===!0?c:a,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){let O=b.uuid,k=L.uuid,A=l[O];A===void 0&&(A={},l[O]=A);let C=A[k];C===void 0&&(C=b.clone(),A[k]=C,L.addEventListener("dispose",P)),b=C}if(b.visible=L.visible,b.wireframe=L.wireframe,M===Vn?b.side=L.shadowSide!==null?L.shadowSide:L.side:b.side=L.shadowSide!==null?L.shadowSide:u[L.side],b.alphaMap=L.alphaMap,b.alphaTest=L.alphaTest,b.map=L.map,b.clipShadows=L.clipShadows,b.clippingPlanes=L.clippingPlanes,b.clipIntersection=L.clipIntersection,b.displacementMap=L.displacementMap,b.displacementScale=L.displacementScale,b.displacementBias=L.displacementBias,b.wireframeLinewidth=L.wireframeLinewidth,b.linewidth=L.linewidth,V.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let O=i.properties.get(b);O.light=V}return b}function S(E,L,V,M,b){if(E.visible===!1)return;if(E.layers.test(L.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===Vn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,E.matrixWorld);let k=t.update(E),A=E.material;if(Array.isArray(A)){let C=k.groups;for(let R=0,N=C.length;R<N;R++){let F=C[R],z=A[F.materialIndex];if(z&&z.visible){let B=x(E,z,M,b);E.onBeforeShadow(i,E,L,V,k,B,F),i.renderBufferDirect(V,null,k,B,E,F),E.onAfterShadow(i,E,L,V,k,B,F)}}}else if(A.visible){let C=x(E,A,M,b);E.onBeforeShadow(i,E,L,V,k,C,null),i.renderBufferDirect(V,null,k,C,E,null),E.onAfterShadow(i,E,L,V,k,C,null)}}let O=E.children;for(let k=0,A=O.length;k<A;k++)S(O[k],L,V,M,b)}function P(E){E.target.removeEventListener("dispose",P);for(let V in l){let M=l[V],b=E.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function by(i,t,e){let n=e.isWebGL2;function s(){let G=!1,J=new ue,xt=null,Nt=new ue(0,0,0,0);return{setMask:function(Lt){xt!==Lt&&!G&&(i.colorMask(Lt,Lt,Lt,Lt),xt=Lt)},setLocked:function(Lt){G=Lt},setClear:function(Lt,ee,ne,Ee,Ue){Ue===!0&&(Lt*=Ee,ee*=Ee,ne*=Ee),J.set(Lt,ee,ne,Ee),Nt.equals(J)===!1&&(i.clearColor(Lt,ee,ne,Ee),Nt.copy(J))},reset:function(){G=!1,xt=null,Nt.set(-1,0,0,0)}}}function r(){let G=!1,J=null,xt=null,Nt=null;return{setTest:function(Lt){Lt?St(i.DEPTH_TEST):ot(i.DEPTH_TEST)},setMask:function(Lt){J!==Lt&&!G&&(i.depthMask(Lt),J=Lt)},setFunc:function(Lt){if(xt!==Lt){switch(Lt){case Gp:i.depthFunc(i.NEVER);break;case Vp:i.depthFunc(i.ALWAYS);break;case Wp:i.depthFunc(i.LESS);break;case xo:i.depthFunc(i.LEQUAL);break;case Xp:i.depthFunc(i.EQUAL);break;case qp:i.depthFunc(i.GEQUAL);break;case Yp:i.depthFunc(i.GREATER);break;case $p:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xt=Lt}},setLocked:function(Lt){G=Lt},setClear:function(Lt){Nt!==Lt&&(i.clearDepth(Lt),Nt=Lt)},reset:function(){G=!1,J=null,xt=null,Nt=null}}}function o(){let G=!1,J=null,xt=null,Nt=null,Lt=null,ee=null,ne=null,Ee=null,Ue=null;return{setTest:function(re){G||(re?St(i.STENCIL_TEST):ot(i.STENCIL_TEST))},setMask:function(re){J!==re&&!G&&(i.stencilMask(re),J=re)},setFunc:function(re,Fe,wn){(xt!==re||Nt!==Fe||Lt!==wn)&&(i.stencilFunc(re,Fe,wn),xt=re,Nt=Fe,Lt=wn)},setOp:function(re,Fe,wn){(ee!==re||ne!==Fe||Ee!==wn)&&(i.stencilOp(re,Fe,wn),ee=re,ne=Fe,Ee=wn)},setLocked:function(re){G=re},setClear:function(re){Ue!==re&&(i.clearStencil(re),Ue=re)},reset:function(){G=!1,J=null,xt=null,Nt=null,Lt=null,ee=null,ne=null,Ee=null,Ue=null}}}let a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap,d={},p={},g=new WeakMap,_=[],m=null,f=!1,v=null,x=null,S=null,P=null,E=null,L=null,V=null,M=new Ut(0,0,0),b=0,D=!1,O=null,k=null,A=null,C=null,R=null,N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,z=0,B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(B)[1]),F=z>=1):B.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),F=z>=2);let X=null,K={},H=i.getParameter(i.SCISSOR_BOX),W=i.getParameter(i.VIEWPORT),Z=new ue().fromArray(H),nt=new ue().fromArray(W);function et(G,J,xt,Nt){let Lt=new Uint8Array(4),ee=i.createTexture();i.bindTexture(G,ee),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ne=0;ne<xt;ne++)n&&(G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY)?i.texImage3D(J,0,i.RGBA,1,1,Nt,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(J+ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return ee}let mt={};mt[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),mt[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(mt[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),mt[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),St(i.DEPTH_TEST),c.setFunc(xo),bt(!1),T(ih),St(i.CULL_FACE),pt(li);function St(G){d[G]!==!0&&(i.enable(G),d[G]=!0)}function ot(G){d[G]!==!1&&(i.disable(G),d[G]=!1)}function vt(G,J){return p[G]!==J?(i.bindFramebuffer(G,J),p[G]=J,n&&(G===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=J),G===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=J)),!0):!1}function q(G,J){let xt=_,Nt=!1;if(G)if(xt=g.get(J),xt===void 0&&(xt=[],g.set(J,xt)),G.isWebGLMultipleRenderTargets){let Lt=G.texture;if(xt.length!==Lt.length||xt[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,ne=Lt.length;ee<ne;ee++)xt[ee]=i.COLOR_ATTACHMENT0+ee;xt.length=Lt.length,Nt=!0}}else xt[0]!==i.COLOR_ATTACHMENT0&&(xt[0]=i.COLOR_ATTACHMENT0,Nt=!0);else xt[0]!==i.BACK&&(xt[0]=i.BACK,Nt=!0);Nt&&(e.isWebGL2?i.drawBuffers(xt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(xt))}function Pt(G){return m!==G?(i.useProgram(G),m=G,!0):!1}let at={[Ti]:i.FUNC_ADD,[Tp]:i.FUNC_SUBTRACT,[Rp]:i.FUNC_REVERSE_SUBTRACT};if(n)at[ah]=i.MIN,at[ch]=i.MAX;else{let G=t.get("EXT_blend_minmax");G!==null&&(at[ah]=G.MIN_EXT,at[ch]=G.MAX_EXT)}let Mt={[Cp]:i.ZERO,[Pp]:i.ONE,[Lp]:i.SRC_COLOR,[fc]:i.SRC_ALPHA,[Fp]:i.SRC_ALPHA_SATURATE,[Op]:i.DST_COLOR,[Dp]:i.DST_ALPHA,[Ip]:i.ONE_MINUS_SRC_COLOR,[pc]:i.ONE_MINUS_SRC_ALPHA,[Up]:i.ONE_MINUS_DST_COLOR,[Np]:i.ONE_MINUS_DST_ALPHA,[Bp]:i.CONSTANT_COLOR,[kp]:i.ONE_MINUS_CONSTANT_COLOR,[Hp]:i.CONSTANT_ALPHA,[zp]:i.ONE_MINUS_CONSTANT_ALPHA};function pt(G,J,xt,Nt,Lt,ee,ne,Ee,Ue,re){if(G===li){f===!0&&(ot(i.BLEND),f=!1);return}if(f===!1&&(St(i.BLEND),f=!0),G!==Ap){if(G!==v||re!==D){if((x!==Ti||E!==Ti)&&(i.blendEquation(i.FUNC_ADD),x=Ti,E=Ti),re)switch(G){case ys:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sh:i.blendFunc(i.ONE,i.ONE);break;case rh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case ys:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sh:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case rh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}S=null,P=null,L=null,V=null,M.set(0,0,0),b=0,v=G,D=re}return}Lt=Lt||J,ee=ee||xt,ne=ne||Nt,(J!==x||Lt!==E)&&(i.blendEquationSeparate(at[J],at[Lt]),x=J,E=Lt),(xt!==S||Nt!==P||ee!==L||ne!==V)&&(i.blendFuncSeparate(Mt[xt],Mt[Nt],Mt[ee],Mt[ne]),S=xt,P=Nt,L=ee,V=ne),(Ee.equals(M)===!1||Ue!==b)&&(i.blendColor(Ee.r,Ee.g,Ee.b,Ue),M.copy(Ee),b=Ue),v=G,D=!1}function Rt(G,J){G.side===ln?ot(i.CULL_FACE):St(i.CULL_FACE);let xt=G.side===Ze;J&&(xt=!xt),bt(xt),G.blending===ys&&G.transparent===!1?pt(li):pt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),c.setFunc(G.depthFunc),c.setTest(G.depthTest),c.setMask(G.depthWrite),a.setMask(G.colorWrite);let Nt=G.stencilWrite;l.setTest(Nt),Nt&&(l.setMask(G.stencilWriteMask),l.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),l.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),$(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?St(i.SAMPLE_ALPHA_TO_COVERAGE):ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function bt(G){O!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),O=G)}function T(G){G!==Sp?(St(i.CULL_FACE),G!==k&&(G===ih?i.cullFace(i.BACK):G===wp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ot(i.CULL_FACE),k=G}function w(G){G!==A&&(F&&i.lineWidth(G),A=G)}function $(G,J,xt){G?(St(i.POLYGON_OFFSET_FILL),(C!==J||R!==xt)&&(i.polygonOffset(J,xt),C=J,R=xt)):ot(i.POLYGON_OFFSET_FILL)}function ct(G){G?St(i.SCISSOR_TEST):ot(i.SCISSOR_TEST)}function lt(G){G===void 0&&(G=i.TEXTURE0+N-1),X!==G&&(i.activeTexture(G),X=G)}function ht(G,J,xt){xt===void 0&&(X===null?xt=i.TEXTURE0+N-1:xt=X);let Nt=K[xt];Nt===void 0&&(Nt={type:void 0,texture:void 0},K[xt]=Nt),(Nt.type!==G||Nt.texture!==J)&&(X!==xt&&(i.activeTexture(xt),X=xt),i.bindTexture(G,J||mt[G]),Nt.type=G,Nt.texture=J)}function At(){let G=K[X];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function yt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ct(){try{i.texSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Dt(){try{i.texSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ot(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function U(){try{i.texStorage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{i.texStorage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ft(){try{i.texImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ut(){try{i.texImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function _t(G){Z.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),Z.copy(G))}function Ht(G){nt.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),nt.copy(G))}function Wt(G,J){let xt=u.get(J);xt===void 0&&(xt=new WeakMap,u.set(J,xt));let Nt=xt.get(G);Nt===void 0&&(Nt=i.getUniformBlockIndex(J,G.name),xt.set(G,Nt))}function Gt(G,J){let Nt=u.get(J).get(G);h.get(J)!==Nt&&(i.uniformBlockBinding(J,Nt,G.__bindingPointIndex),h.set(J,Nt))}function gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},X=null,K={},p={},g=new WeakMap,_=[],m=null,f=!1,v=null,x=null,S=null,P=null,E=null,L=null,V=null,M=new Ut(0,0,0),b=0,D=!1,O=null,k=null,A=null,C=null,R=null,Z.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:St,disable:ot,bindFramebuffer:vt,drawBuffers:q,useProgram:Pt,setBlending:pt,setMaterial:Rt,setFlipSided:bt,setCullFace:T,setLineWidth:w,setPolygonOffset:$,setScissorTest:ct,activeTexture:lt,bindTexture:ht,unbindTexture:At,compressedTexImage2D:yt,compressedTexImage3D:Et,texImage2D:ft,texImage3D:ut,updateUBOMapping:Wt,uniformBlockBinding:Gt,texStorage2D:U,texStorage3D:st,texSubImage2D:Ct,texSubImage3D:Dt,compressedTexSubImage2D:rt,compressedTexSubImage3D:Ot,scissor:_t,viewport:Ht,reset:gt}}function Sy(i,t,e,n,s,r,o){let a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,w){return p?new OffscreenCanvas(T,w):Ao("canvas")}function _(T,w,$,ct){let lt=1;if((T.width>ct||T.height>ct)&&(lt=ct/Math.max(T.width,T.height)),lt<1||w===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){let ht=w?Eo:Math.floor,At=ht(lt*T.width),yt=ht(lt*T.height);u===void 0&&(u=g(At,yt));let Et=$?g(At,yt):u;return Et.width=At,Et.height=yt,Et.getContext("2d").drawImage(T,0,0,At,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+At+"x"+yt+")."),Et}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function m(T){return vc(T.width)&&vc(T.height)}function f(T){return a?!1:T.wrapS!==gn||T.wrapT!==gn||T.minFilter!==He&&T.minFilter!==ze}function v(T,w){return T.generateMipmaps&&w&&T.minFilter!==He&&T.minFilter!==ze}function x(T){i.generateMipmap(T)}function S(T,w,$,ct,lt=!1){if(a===!1)return w;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ht=w;if(w===i.RED&&($===i.FLOAT&&(ht=i.R32F),$===i.HALF_FLOAT&&(ht=i.R16F),$===i.UNSIGNED_BYTE&&(ht=i.R8)),w===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ht=i.R8UI),$===i.UNSIGNED_SHORT&&(ht=i.R16UI),$===i.UNSIGNED_INT&&(ht=i.R32UI),$===i.BYTE&&(ht=i.R8I),$===i.SHORT&&(ht=i.R16I),$===i.INT&&(ht=i.R32I)),w===i.RG&&($===i.FLOAT&&(ht=i.RG32F),$===i.HALF_FLOAT&&(ht=i.RG16F),$===i.UNSIGNED_BYTE&&(ht=i.RG8)),w===i.RGBA){let At=lt?Mo:se.getTransfer(ct);$===i.FLOAT&&(ht=i.RGBA32F),$===i.HALF_FLOAT&&(ht=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ht=At===ae?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)}return(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function P(T,w,$){return v(T,$)===!0||T.isFramebufferTexture&&T.minFilter!==He&&T.minFilter!==ze?Math.log2(Math.max(w.width,w.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?w.mipmaps.length:1}function E(T){return T===He||T===lh||T===Oa?i.NEAREST:i.LINEAR}function L(T){let w=T.target;w.removeEventListener("dispose",L),M(w),w.isVideoTexture&&h.delete(w)}function V(T){let w=T.target;w.removeEventListener("dispose",V),D(w)}function M(T){let w=n.get(T);if(w.__webglInit===void 0)return;let $=T.source,ct=d.get($);if(ct){let lt=ct[w.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&b(T),Object.keys(ct).length===0&&d.delete($)}n.remove(T)}function b(T){let w=n.get(T);i.deleteTexture(w.__webglTexture);let $=T.source,ct=d.get($);delete ct[w.__cacheKey],o.memory.textures--}function D(T){let w=T.texture,$=n.get(T),ct=n.get(w);if(ct.__webglTexture!==void 0&&(i.deleteTexture(ct.__webglTexture),o.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray($.__webglFramebuffer[lt]))for(let ht=0;ht<$.__webglFramebuffer[lt].length;ht++)i.deleteFramebuffer($.__webglFramebuffer[lt][ht]);else i.deleteFramebuffer($.__webglFramebuffer[lt]);$.__webglDepthbuffer&&i.deleteRenderbuffer($.__webglDepthbuffer[lt])}else{if(Array.isArray($.__webglFramebuffer))for(let lt=0;lt<$.__webglFramebuffer.length;lt++)i.deleteFramebuffer($.__webglFramebuffer[lt]);else i.deleteFramebuffer($.__webglFramebuffer);if($.__webglDepthbuffer&&i.deleteRenderbuffer($.__webglDepthbuffer),$.__webglMultisampledFramebuffer&&i.deleteFramebuffer($.__webglMultisampledFramebuffer),$.__webglColorRenderbuffer)for(let lt=0;lt<$.__webglColorRenderbuffer.length;lt++)$.__webglColorRenderbuffer[lt]&&i.deleteRenderbuffer($.__webglColorRenderbuffer[lt]);$.__webglDepthRenderbuffer&&i.deleteRenderbuffer($.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let lt=0,ht=w.length;lt<ht;lt++){let At=n.get(w[lt]);At.__webglTexture&&(i.deleteTexture(At.__webglTexture),o.memory.textures--),n.remove(w[lt])}n.remove(w),n.remove(T)}let O=0;function k(){O=0}function A(){let T=O;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),O+=1,T}function C(T){let w=[];return w.push(T.wrapS),w.push(T.wrapT),w.push(T.wrapR||0),w.push(T.magFilter),w.push(T.minFilter),w.push(T.anisotropy),w.push(T.internalFormat),w.push(T.format),w.push(T.type),w.push(T.generateMipmaps),w.push(T.premultiplyAlpha),w.push(T.flipY),w.push(T.unpackAlignment),w.push(T.colorSpace),w.join()}function R(T,w){let $=n.get(T);if(T.isVideoTexture&&Rt(T),T.isRenderTargetTexture===!1&&T.version>0&&$.__version!==T.version){let ct=T.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z($,T,w);return}}e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+w)}function N(T,w){let $=n.get(T);if(T.version>0&&$.__version!==T.version){Z($,T,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+w)}function F(T,w){let $=n.get(T);if(T.version>0&&$.__version!==T.version){Z($,T,w);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+w)}function z(T,w){let $=n.get(T);if(T.version>0&&$.__version!==T.version){nt($,T,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+w)}let B={[_c]:i.REPEAT,[gn]:i.CLAMP_TO_EDGE,[xc]:i.MIRRORED_REPEAT},X={[He]:i.NEAREST,[lh]:i.NEAREST_MIPMAP_NEAREST,[Oa]:i.NEAREST_MIPMAP_LINEAR,[ze]:i.LINEAR,[im]:i.LINEAR_MIPMAP_NEAREST,[or]:i.LINEAR_MIPMAP_LINEAR},K={[mm]:i.NEVER,[Mm]:i.ALWAYS,[gm]:i.LESS,[qu]:i.LEQUAL,[_m]:i.EQUAL,[vm]:i.GEQUAL,[xm]:i.GREATER,[ym]:i.NOTEQUAL};function H(T,w,$){if($?(i.texParameteri(T,i.TEXTURE_WRAP_S,B[w.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,B[w.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,B[w.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,X[w.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,X[w.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(w.wrapS!==gn||w.wrapT!==gn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,E(w.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,E(w.minFilter)),w.minFilter!==He&&w.minFilter!==ze&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),w.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,K[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let ct=t.get("EXT_texture_filter_anisotropic");if(w.magFilter===He||w.minFilter!==Oa&&w.minFilter!==or||w.type===An&&t.has("OES_texture_float_linear")===!1||a===!1&&w.type===ar&&t.has("OES_texture_half_float_linear")===!1)return;(w.anisotropy>1||n.get(w).__currentAnisotropy)&&(i.texParameterf(T,ct.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy)}}function W(T,w){let $=!1;T.__webglInit===void 0&&(T.__webglInit=!0,w.addEventListener("dispose",L));let ct=w.source,lt=d.get(ct);lt===void 0&&(lt={},d.set(ct,lt));let ht=C(w);if(ht!==T.__cacheKey){lt[ht]===void 0&&(lt[ht]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,$=!0),lt[ht].usedTimes++;let At=lt[T.__cacheKey];At!==void 0&&(lt[T.__cacheKey].usedTimes--,At.usedTimes===0&&b(w)),T.__cacheKey=ht,T.__webglTexture=lt[ht].texture}return $}function Z(T,w,$){let ct=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ct=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ct=i.TEXTURE_3D);let lt=W(T,w),ht=w.source;e.bindTexture(ct,T.__webglTexture,i.TEXTURE0+$);let At=n.get(ht);if(ht.version!==At.__version||lt===!0){e.activeTexture(i.TEXTURE0+$);let yt=se.getPrimaries(se.workingColorSpace),Et=w.colorSpace===hn?null:se.getPrimaries(w.colorSpace),Ct=w.colorSpace===hn||yt===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);let Dt=f(w)&&m(w.image)===!1,rt=_(w.image,Dt,!1,s.maxTextureSize);rt=bt(w,rt);let Ot=m(rt)||a,U=r.convert(w.format,w.colorSpace),st=r.convert(w.type),ft=S(w.internalFormat,U,st,w.colorSpace,w.isVideoTexture);H(ct,w,Ot);let ut,_t=w.mipmaps,Ht=a&&w.isVideoTexture!==!0&&ft!==Wu,Wt=At.__version===void 0||lt===!0,Gt=P(w,rt,Ot);if(w.isDepthTexture)ft=i.DEPTH_COMPONENT,a?w.type===An?ft=i.DEPTH_COMPONENT32F:w.type===ci?ft=i.DEPTH_COMPONENT24:w.type===Ci?ft=i.DEPTH24_STENCIL8:ft=i.DEPTH_COMPONENT16:w.type===An&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===Pi&&ft===i.DEPTH_COMPONENT&&w.type!==Zc&&w.type!==ci&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=ci,st=r.convert(w.type)),w.format===ws&&ft===i.DEPTH_COMPONENT&&(ft=i.DEPTH_STENCIL,w.type!==Ci&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=Ci,st=r.convert(w.type))),Wt&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,ft,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,ft,rt.width,rt.height,0,U,st,null));else if(w.isDataTexture)if(_t.length>0&&Ot){Ht&&Wt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,_t[0].width,_t[0].height);for(let gt=0,G=_t.length;gt<G;gt++)ut=_t[gt],Ht?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,ut.width,ut.height,U,st,ut.data):e.texImage2D(i.TEXTURE_2D,gt,ft,ut.width,ut.height,0,U,st,ut.data);w.generateMipmaps=!1}else Ht?(Wt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,rt.width,rt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,U,st,rt.data)):e.texImage2D(i.TEXTURE_2D,0,ft,rt.width,rt.height,0,U,st,rt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ht&&Wt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,ft,_t[0].width,_t[0].height,rt.depth);for(let gt=0,G=_t.length;gt<G;gt++)ut=_t[gt],w.format!==_n?U!==null?Ht?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,ut.width,ut.height,rt.depth,U,ut.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,gt,ft,ut.width,ut.height,rt.depth,0,ut.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?e.texSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,ut.width,ut.height,rt.depth,U,st,ut.data):e.texImage3D(i.TEXTURE_2D_ARRAY,gt,ft,ut.width,ut.height,rt.depth,0,U,st,ut.data)}else{Ht&&Wt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,_t[0].width,_t[0].height);for(let gt=0,G=_t.length;gt<G;gt++)ut=_t[gt],w.format!==_n?U!==null?Ht?e.compressedTexSubImage2D(i.TEXTURE_2D,gt,0,0,ut.width,ut.height,U,ut.data):e.compressedTexImage2D(i.TEXTURE_2D,gt,ft,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,ut.width,ut.height,U,st,ut.data):e.texImage2D(i.TEXTURE_2D,gt,ft,ut.width,ut.height,0,U,st,ut.data)}else if(w.isDataArrayTexture)Ht?(Wt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,ft,rt.width,rt.height,rt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,U,st,rt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ft,rt.width,rt.height,rt.depth,0,U,st,rt.data);else if(w.isData3DTexture)Ht?(Wt&&e.texStorage3D(i.TEXTURE_3D,Gt,ft,rt.width,rt.height,rt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,U,st,rt.data)):e.texImage3D(i.TEXTURE_3D,0,ft,rt.width,rt.height,rt.depth,0,U,st,rt.data);else if(w.isFramebufferTexture){if(Wt)if(Ht)e.texStorage2D(i.TEXTURE_2D,Gt,ft,rt.width,rt.height);else{let gt=rt.width,G=rt.height;for(let J=0;J<Gt;J++)e.texImage2D(i.TEXTURE_2D,J,ft,gt,G,0,U,st,null),gt>>=1,G>>=1}}else if(_t.length>0&&Ot){Ht&&Wt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,_t[0].width,_t[0].height);for(let gt=0,G=_t.length;gt<G;gt++)ut=_t[gt],Ht?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,U,st,ut):e.texImage2D(i.TEXTURE_2D,gt,ft,U,st,ut);w.generateMipmaps=!1}else Ht?(Wt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,rt.width,rt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,U,st,rt)):e.texImage2D(i.TEXTURE_2D,0,ft,U,st,rt);v(w,Ot)&&x(ct),At.__version=ht.version,w.onUpdate&&w.onUpdate(w)}T.__version=w.version}function nt(T,w,$){if(w.image.length!==6)return;let ct=W(T,w),lt=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+$);let ht=n.get(lt);if(lt.version!==ht.__version||ct===!0){e.activeTexture(i.TEXTURE0+$);let At=se.getPrimaries(se.workingColorSpace),yt=w.colorSpace===hn?null:se.getPrimaries(w.colorSpace),Et=w.colorSpace===hn||At===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let Ct=w.isCompressedTexture||w.image[0].isCompressedTexture,Dt=w.image[0]&&w.image[0].isDataTexture,rt=[];for(let gt=0;gt<6;gt++)!Ct&&!Dt?rt[gt]=_(w.image[gt],!1,!0,s.maxCubemapSize):rt[gt]=Dt?w.image[gt].image:w.image[gt],rt[gt]=bt(w,rt[gt]);let Ot=rt[0],U=m(Ot)||a,st=r.convert(w.format,w.colorSpace),ft=r.convert(w.type),ut=S(w.internalFormat,st,ft,w.colorSpace),_t=a&&w.isVideoTexture!==!0,Ht=ht.__version===void 0||ct===!0,Wt=P(w,Ot,U);H(i.TEXTURE_CUBE_MAP,w,U);let Gt;if(Ct){_t&&Ht&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Wt,ut,Ot.width,Ot.height);for(let gt=0;gt<6;gt++){Gt=rt[gt].mipmaps;for(let G=0;G<Gt.length;G++){let J=Gt[G];w.format!==_n?st!==null?_t?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G,0,0,J.width,J.height,st,J.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G,ut,J.width,J.height,0,J.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):_t?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G,0,0,J.width,J.height,st,ft,J.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G,ut,J.width,J.height,0,st,ft,J.data)}}}else{Gt=w.mipmaps,_t&&Ht&&(Gt.length>0&&Wt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Wt,ut,rt[0].width,rt[0].height));for(let gt=0;gt<6;gt++)if(Dt){_t?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,rt[gt].width,rt[gt].height,st,ft,rt[gt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ut,rt[gt].width,rt[gt].height,0,st,ft,rt[gt].data);for(let G=0;G<Gt.length;G++){let xt=Gt[G].image[gt].image;_t?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G+1,0,0,xt.width,xt.height,st,ft,xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G+1,ut,xt.width,xt.height,0,st,ft,xt.data)}}else{_t?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,st,ft,rt[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ut,st,ft,rt[gt]);for(let G=0;G<Gt.length;G++){let J=Gt[G];_t?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G+1,0,0,st,ft,J.image[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,G+1,ut,st,ft,J.image[gt])}}}v(w,U)&&x(i.TEXTURE_CUBE_MAP),ht.__version=lt.version,w.onUpdate&&w.onUpdate(w)}T.__version=w.version}function et(T,w,$,ct,lt,ht){let At=r.convert($.format,$.colorSpace),yt=r.convert($.type),Et=S($.internalFormat,At,yt,$.colorSpace);if(!n.get(w).__hasExternalTextures){let Dt=Math.max(1,w.width>>ht),rt=Math.max(1,w.height>>ht);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,ht,Et,Dt,rt,w.depth,0,At,yt,null):e.texImage2D(lt,ht,Et,Dt,rt,0,At,yt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),pt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ct,lt,n.get($).__webglTexture,0,Mt(w)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ct,lt,n.get($).__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function mt(T,w,$){if(i.bindRenderbuffer(i.RENDERBUFFER,T),w.depthBuffer&&!w.stencilBuffer){let ct=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if($||pt(w)){let lt=w.depthTexture;lt&&lt.isDepthTexture&&(lt.type===An?ct=i.DEPTH_COMPONENT32F:lt.type===ci&&(ct=i.DEPTH_COMPONENT24));let ht=Mt(w);pt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,ct,w.width,w.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,ct,w.width,w.height)}else i.renderbufferStorage(i.RENDERBUFFER,ct,w.width,w.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(w.depthBuffer&&w.stencilBuffer){let ct=Mt(w);$&&pt(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,i.DEPTH24_STENCIL8,w.width,w.height):pt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,i.DEPTH24_STENCIL8,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{let ct=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let lt=0;lt<ct.length;lt++){let ht=ct[lt],At=r.convert(ht.format,ht.colorSpace),yt=r.convert(ht.type),Et=S(ht.internalFormat,At,yt,ht.colorSpace),Ct=Mt(w);$&&pt(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,Et,w.width,w.height):pt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ct,Et,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Et,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(T,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),R(w.depthTexture,0);let ct=n.get(w.depthTexture).__webglTexture,lt=Mt(w);if(w.depthTexture.format===Pi)pt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0);else if(w.depthTexture.format===ws)pt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function ot(T){let w=n.get(T),$=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!w.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");St(w.__webglFramebuffer,T)}else if($){w.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[ct]),w.__webglDepthbuffer[ct]=i.createRenderbuffer(),mt(w.__webglDepthbuffer[ct],T,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=i.createRenderbuffer(),mt(w.__webglDepthbuffer,T,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function vt(T,w,$){let ct=n.get(T);w!==void 0&&et(ct.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&ot(T)}function q(T){let w=T.texture,$=n.get(T),ct=n.get(w);T.addEventListener("dispose",V),T.isWebGLMultipleRenderTargets!==!0&&(ct.__webglTexture===void 0&&(ct.__webglTexture=i.createTexture()),ct.__version=w.version,o.memory.textures++);let lt=T.isWebGLCubeRenderTarget===!0,ht=T.isWebGLMultipleRenderTargets===!0,At=m(T)||a;if(lt){$.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(a&&w.mipmaps&&w.mipmaps.length>0){$.__webglFramebuffer[yt]=[];for(let Et=0;Et<w.mipmaps.length;Et++)$.__webglFramebuffer[yt][Et]=i.createFramebuffer()}else $.__webglFramebuffer[yt]=i.createFramebuffer()}else{if(a&&w.mipmaps&&w.mipmaps.length>0){$.__webglFramebuffer=[];for(let yt=0;yt<w.mipmaps.length;yt++)$.__webglFramebuffer[yt]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(ht)if(s.drawBuffers){let yt=T.texture;for(let Et=0,Ct=yt.length;Et<Ct;Et++){let Dt=n.get(yt[Et]);Dt.__webglTexture===void 0&&(Dt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&T.samples>0&&pt(T)===!1){let yt=ht?w:[w];$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Et=0;Et<yt.length;Et++){let Ct=yt[Et];$.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[Et]);let Dt=r.convert(Ct.format,Ct.colorSpace),rt=r.convert(Ct.type),Ot=S(Ct.internalFormat,Dt,rt,Ct.colorSpace,T.isXRRenderTarget===!0),U=Mt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,U,Ot,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,$.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),mt($.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(lt){e.bindTexture(i.TEXTURE_CUBE_MAP,ct.__webglTexture),H(i.TEXTURE_CUBE_MAP,w,At);for(let yt=0;yt<6;yt++)if(a&&w.mipmaps&&w.mipmaps.length>0)for(let Et=0;Et<w.mipmaps.length;Et++)et($.__webglFramebuffer[yt][Et],T,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Et);else et($.__webglFramebuffer[yt],T,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);v(w,At)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){let yt=T.texture;for(let Et=0,Ct=yt.length;Et<Ct;Et++){let Dt=yt[Et],rt=n.get(Dt);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),H(i.TEXTURE_2D,Dt,At),et($.__webglFramebuffer,T,Dt,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),v(Dt,At)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let yt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(a?yt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(yt,ct.__webglTexture),H(yt,w,At),a&&w.mipmaps&&w.mipmaps.length>0)for(let Et=0;Et<w.mipmaps.length;Et++)et($.__webglFramebuffer[Et],T,w,i.COLOR_ATTACHMENT0,yt,Et);else et($.__webglFramebuffer,T,w,i.COLOR_ATTACHMENT0,yt,0);v(w,At)&&x(yt),e.unbindTexture()}T.depthBuffer&&ot(T)}function Pt(T){let w=m(T)||a,$=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let ct=0,lt=$.length;ct<lt;ct++){let ht=$[ct];if(v(ht,w)){let At=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,yt=n.get(ht).__webglTexture;e.bindTexture(At,yt),x(At),e.unbindTexture()}}}function at(T){if(a&&T.samples>0&&pt(T)===!1){let w=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],$=T.width,ct=T.height,lt=i.COLOR_BUFFER_BIT,ht=[],At=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(T),Et=T.isWebGLMultipleRenderTargets===!0;if(Et)for(let Ct=0;Ct<w.length;Ct++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Ct=0;Ct<w.length;Ct++){ht.push(i.COLOR_ATTACHMENT0+Ct),T.depthBuffer&&ht.push(At);let Dt=yt.__ignoreDepthValues!==void 0?yt.__ignoreDepthValues:!1;if(Dt===!1&&(T.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),Et&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Ct]),Dt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[At]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[At])),Et){let rt=n.get(w[Ct]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,rt,0)}i.blitFramebuffer(0,0,$,ct,0,0,$,ct,lt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let Ct=0;Ct<w.length;Ct++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Ct]);let Dt=n.get(w[Ct]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.TEXTURE_2D,Dt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}}function Mt(T){return Math.min(s.maxSamples,T.samples)}function pt(T){let w=n.get(T);return a&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Rt(T){let w=o.render.frame;h.get(T)!==w&&(h.set(T,w),T.update())}function bt(T,w){let $=T.colorSpace,ct=T.format,lt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===yc||$!==xn&&$!==hn&&(se.getTransfer($)===ae?a===!1?t.has("EXT_sRGB")===!0&&ct===_n?(T.format=yc,T.minFilter=ze,T.generateMipmaps=!1):w=To.sRGBToLinear(w):(ct!==_n||lt!==ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),w}this.allocateTextureUnit=A,this.resetTextureUnits=k,this.setTexture2D=R,this.setTexture2DArray=N,this.setTexture3D=F,this.setTextureCube=z,this.rebindTextures=vt,this.setupRenderTarget=q,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=ot,this.setupFrameBufferTexture=et,this.useMultisampledRTT=pt}function wy(i,t,e){let n=e.isWebGL2;function s(r,o=hn){let a,c=se.getTransfer(o);if(r===ui)return i.UNSIGNED_BYTE;if(r===ku)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Hu)return i.UNSIGNED_SHORT_5_5_5_1;if(r===sm)return i.BYTE;if(r===rm)return i.SHORT;if(r===Zc)return i.UNSIGNED_SHORT;if(r===Bu)return i.INT;if(r===ci)return i.UNSIGNED_INT;if(r===An)return i.FLOAT;if(r===ar)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===om)return i.ALPHA;if(r===_n)return i.RGBA;if(r===am)return i.LUMINANCE;if(r===cm)return i.LUMINANCE_ALPHA;if(r===Pi)return i.DEPTH_COMPONENT;if(r===ws)return i.DEPTH_STENCIL;if(r===yc)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===lm)return i.RED;if(r===zu)return i.RED_INTEGER;if(r===hm)return i.RG;if(r===Gu)return i.RG_INTEGER;if(r===Vu)return i.RGBA_INTEGER;if(r===Ua||r===Fa||r===Ba||r===ka)if(c===ae)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Ua)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Fa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ka)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Ua)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Fa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ba)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ka)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===hh||r===uh||r===dh||r===fh)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===hh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===uh)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===dh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===fh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Wu)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ph||r===mh)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===ph)return c===ae?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===mh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===gh||r===_h||r===xh||r===yh||r===vh||r===Mh||r===bh||r===Sh||r===wh||r===Eh||r===Ah||r===Th||r===Rh||r===Ch)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===gh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===_h)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===xh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===yh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===vh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Mh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===bh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Sh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===wh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Eh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ah)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Th)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Rh)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ch)return c===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ha||r===Ph||r===Lh)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Ha)return c===ae?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ph)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Lh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===um||r===Ih||r===Dh||r===Nh)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Ha)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Ih)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Dh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Nh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ci?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Dc=class extends Ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Tn=class extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ey={type:"move"},rr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ey)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Tn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Nc=class extends Cn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null,_=e.getContextAttributes(),m=null,f=null,v=[],x=[],S=new Bt,P=null,E=new Ge;E.layers.enable(1),E.viewport=new ue;let L=new Ge;L.layers.enable(2),L.viewport=new ue;let V=[E,L],M=new Dc;M.layers.enable(1),M.layers.enable(2);let b=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let W=v[H];return W===void 0&&(W=new rr,v[H]=W),W.getTargetRaySpace()},this.getControllerGrip=function(H){let W=v[H];return W===void 0&&(W=new rr,v[H]=W),W.getGripSpace()},this.getHand=function(H){let W=v[H];return W===void 0&&(W=new rr,v[H]=W),W.getHandSpace()};function O(H){let W=x.indexOf(H.inputSource);if(W===-1)return;let Z=v[W];Z!==void 0&&(Z.update(H.inputSource,H.frame,l||o),Z.dispatchEvent({type:H.type,data:H.inputSource}))}function k(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",A);for(let H=0;H<v.length;H++){let W=x[H];W!==null&&(x[H]=null,v[H].disconnect(W))}b=null,D=null,t.setRenderTarget(m),p=null,d=null,u=null,s=null,f=null,K.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(H){l=H},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",k),s.addEventListener("inputsourceschange",A),_.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(S),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let W={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,W),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),f=new sn(p.framebufferWidth,p.framebufferHeight,{format:_n,type:ui,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let W=null,Z=null,nt=null;_.depth&&(nt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,W=_.stencil?ws:Pi,Z=_.stencil?Ci:ci);let et={colorFormat:e.RGBA8,depthFormat:nt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(et),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new sn(d.textureWidth,d.textureHeight,{format:_n,type:ui,depthTexture:new Uo(d.textureWidth,d.textureHeight,Z,void 0,void 0,void 0,void 0,void 0,void 0,W),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let mt=t.properties.get(f);mt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),K.setContext(s),K.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function A(H){for(let W=0;W<H.removed.length;W++){let Z=H.removed[W],nt=x.indexOf(Z);nt>=0&&(x[nt]=null,v[nt].disconnect(Z))}for(let W=0;W<H.added.length;W++){let Z=H.added[W],nt=x.indexOf(Z);if(nt===-1){for(let mt=0;mt<v.length;mt++)if(mt>=x.length){x.push(Z),nt=mt;break}else if(x[mt]===null){x[mt]=Z,nt=mt;break}if(nt===-1)break}let et=v[nt];et&&et.connect(Z)}}let C=new Y,R=new Y;function N(H,W,Z){C.setFromMatrixPosition(W.matrixWorld),R.setFromMatrixPosition(Z.matrixWorld);let nt=C.distanceTo(R),et=W.projectionMatrix.elements,mt=Z.projectionMatrix.elements,St=et[14]/(et[10]-1),ot=et[14]/(et[10]+1),vt=(et[9]+1)/et[5],q=(et[9]-1)/et[5],Pt=(et[8]-1)/et[0],at=(mt[8]+1)/mt[0],Mt=St*Pt,pt=St*at,Rt=nt/(-Pt+at),bt=Rt*-Pt;W.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(bt),H.translateZ(Rt),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();let T=St+Rt,w=ot+Rt,$=Mt-bt,ct=pt+(nt-bt),lt=vt*ot/w*T,ht=q*ot/w*T;H.projectionMatrix.makePerspective($,ct,lt,ht,T,w),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function F(H,W){W===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(W.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;M.near=L.near=E.near=H.near,M.far=L.far=E.far=H.far,(b!==M.near||D!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,D=M.far);let W=H.parent,Z=M.cameras;F(M,W);for(let nt=0;nt<Z.length;nt++)F(Z[nt],W);Z.length===2?N(M,E,L):M.projectionMatrix.copy(E.projectionMatrix),z(H,M,W)};function z(H,W,Z){Z===null?H.matrix.copy(W.matrixWorld):(H.matrix.copy(Z.matrixWorld),H.matrix.invert(),H.matrix.multiply(W.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(W.projectionMatrix),H.projectionMatrixInverse.copy(W.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=cr*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(H){c=H,d!==null&&(d.fixedFoveation=H),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=H)};let B=null;function X(H,W){if(h=W.getViewerPose(l||o),g=W,h!==null){let Z=h.views;p!==null&&(t.setRenderTargetFramebuffer(f,p.framebuffer),t.setRenderTarget(f));let nt=!1;Z.length!==M.cameras.length&&(M.cameras.length=0,nt=!0);for(let et=0;et<Z.length;et++){let mt=Z[et],St=null;if(p!==null)St=p.getViewport(mt);else{let vt=u.getViewSubImage(d,mt);St=vt.viewport,et===0&&(t.setRenderTargetTextures(f,vt.colorTexture,d.ignoreDepthValues?void 0:vt.depthStencilTexture),t.setRenderTarget(f))}let ot=V[et];ot===void 0&&(ot=new Ge,ot.layers.enable(et),ot.viewport=new ue,V[et]=ot),ot.matrix.fromArray(mt.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(mt.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(St.x,St.y,St.width,St.height),et===0&&(M.matrix.copy(ot.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),nt===!0&&M.cameras.push(ot)}}for(let Z=0;Z<v.length;Z++){let nt=x[Z],et=v[Z];nt!==null&&et!==void 0&&et.update(nt,W,l||o)}B&&B(H,W),W.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:W}),g=null}let K=new Ku;K.setAnimationLoop(X),this.setAnimationLoop=function(H){B=H},this.dispose=function(){}}};function Ay(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,ju(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,v,x,S){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,S)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,v,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ze&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ze&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let v=t.get(f).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap){m.lightMap.value=f.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=f.lightMapIntensity*x,e(f.lightMap,m.lightMapTransform)}f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,v,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*v,m.scale.value=x*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),t.get(f).envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,v){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ze&&m.clearcoatNormalScale.value.negate())),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let v=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ty(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){let S=x.program;n.uniformBlockBinding(v,S)}function l(v,x){let S=s[v.id];S===void 0&&(g(v),S=h(v),s[v.id]=S,v.addEventListener("dispose",m));let P=x.program;n.updateUBOMapping(v,P);let E=t.render.frame;r[v.id]!==E&&(d(v),r[v.id]=E)}function h(v){let x=u();v.__bindingPointIndex=x;let S=i.createBuffer(),P=v.__size,E=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,P,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,S),S}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let x=s[v.id],S=v.uniforms,P=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let E=0,L=S.length;E<L;E++){let V=Array.isArray(S[E])?S[E]:[S[E]];for(let M=0,b=V.length;M<b;M++){let D=V[M];if(p(D,E,M,P)===!0){let O=D.__offset,k=Array.isArray(D.value)?D.value:[D.value],A=0;for(let C=0;C<k.length;C++){let R=k[C],N=_(R);typeof R=="number"||typeof R=="boolean"?(D.__data[0]=R,i.bufferSubData(i.UNIFORM_BUFFER,O+A,D.__data)):R.isMatrix3?(D.__data[0]=R.elements[0],D.__data[1]=R.elements[1],D.__data[2]=R.elements[2],D.__data[3]=0,D.__data[4]=R.elements[3],D.__data[5]=R.elements[4],D.__data[6]=R.elements[5],D.__data[7]=0,D.__data[8]=R.elements[6],D.__data[9]=R.elements[7],D.__data[10]=R.elements[8],D.__data[11]=0):(R.toArray(D.__data,A),A+=N.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,x,S,P){let E=v.value,L=x+"_"+S;if(P[L]===void 0)return typeof E=="number"||typeof E=="boolean"?P[L]=E:P[L]=E.clone(),!0;{let V=P[L];if(typeof E=="number"||typeof E=="boolean"){if(V!==E)return P[L]=E,!0}else if(V.equals(E)===!1)return V.copy(E),!0}return!1}function g(v){let x=v.uniforms,S=0,P=16;for(let L=0,V=x.length;L<V;L++){let M=Array.isArray(x[L])?x[L]:[x[L]];for(let b=0,D=M.length;b<D;b++){let O=M[b],k=Array.isArray(O.value)?O.value:[O.value];for(let A=0,C=k.length;A<C;A++){let R=k[A],N=_(R),F=S%P;F!==0&&P-F<N.boundary&&(S+=P-F),O.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=N.storage}}}let E=S%P;return E>0&&(S+=P-E),v.__size=S,v.__cache={},this}function _(v){let x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){let x=v.target;x.removeEventListener("dispose",m);let S=o.indexOf(x.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}var fr=class{constructor(t={}){let{canvas:e=Um(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Me,this._useLegacyLights=!1,this.toneMapping=hi,this.toneMappingExposure=1;let x=this,S=!1,P=0,E=0,L=null,V=-1,M=null,b=new ue,D=new ue,O=null,k=new Ut(0),A=0,C=e.width,R=e.height,N=1,F=null,z=null,B=new ue(0,0,C,R),X=new ue(0,0,C,R),K=!1,H=new ur,W=!1,Z=!1,nt=null,et=new fe,mt=new Bt,St=new Y,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function vt(){return L===null?N:1}let q=n;function Pt(I,j){for(let tt=0;tt<I.length;tt++){let it=I[tt],Q=e.getContext(it,j);if(Q!==null)return Q}return null}try{let I={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",gt,!1),e.addEventListener("webglcontextrestored",G,!1),e.addEventListener("webglcontextcreationerror",J,!1),q===null){let j=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&j.shift(),q=Pt(j,I),q===null)throw Pt(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&q instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),q.getShaderPrecisionFormat===void 0&&(q.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let at,Mt,pt,Rt,bt,T,w,$,ct,lt,ht,At,yt,Et,Ct,Dt,rt,Ot,U,st,ft,ut,_t,Ht;function Wt(){at=new q_(q),Mt=new H_(q,at,t),at.init(Mt),ut=new wy(q,at,Mt),pt=new by(q,at,Mt),Rt=new j_(q),bt=new hy,T=new Sy(q,at,pt,bt,Mt,ut,Rt),w=new G_(x),$=new X_(x),ct=new i0(q,Mt),_t=new B_(q,at,ct,Mt),lt=new Y_(q,ct,Rt,_t),ht=new Q_(q,lt,ct,Rt),U=new J_(q,Mt,T),Dt=new z_(bt),At=new ly(x,w,$,at,Mt,_t,Dt),yt=new Ay(x,bt),Et=new dy,Ct=new xy(at,Mt),Ot=new F_(x,w,$,pt,ht,d,c),rt=new My(x,ht,Mt),Ht=new Ty(q,Rt,Mt,pt),st=new k_(q,at,Rt,Mt),ft=new $_(q,at,Rt,Mt),Rt.programs=At.programs,x.capabilities=Mt,x.extensions=at,x.properties=bt,x.renderLists=Et,x.shadowMap=rt,x.state=pt,x.info=Rt}Wt();let Gt=new Nc(x,q);this.xr=Gt,this.getContext=function(){return q},this.getContextAttributes=function(){return q.getContextAttributes()},this.forceContextLoss=function(){let I=at.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){let I=at.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(I){I!==void 0&&(N=I,this.setSize(C,R,!1))},this.getSize=function(I){return I.set(C,R)},this.setSize=function(I,j,tt=!0){if(Gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=I,R=j,e.width=Math.floor(I*N),e.height=Math.floor(j*N),tt===!0&&(e.style.width=I+"px",e.style.height=j+"px"),this.setViewport(0,0,I,j)},this.getDrawingBufferSize=function(I){return I.set(C*N,R*N).floor()},this.setDrawingBufferSize=function(I,j,tt){C=I,R=j,N=tt,e.width=Math.floor(I*tt),e.height=Math.floor(j*tt),this.setViewport(0,0,I,j)},this.getCurrentViewport=function(I){return I.copy(b)},this.getViewport=function(I){return I.copy(B)},this.setViewport=function(I,j,tt,it){I.isVector4?B.set(I.x,I.y,I.z,I.w):B.set(I,j,tt,it),pt.viewport(b.copy(B).multiplyScalar(N).floor())},this.getScissor=function(I){return I.copy(X)},this.setScissor=function(I,j,tt,it){I.isVector4?X.set(I.x,I.y,I.z,I.w):X.set(I,j,tt,it),pt.scissor(D.copy(X).multiplyScalar(N).floor())},this.getScissorTest=function(){return K},this.setScissorTest=function(I){pt.setScissorTest(K=I)},this.setOpaqueSort=function(I){F=I},this.setTransparentSort=function(I){z=I},this.getClearColor=function(I){return I.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor.apply(Ot,arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha.apply(Ot,arguments)},this.clear=function(I=!0,j=!0,tt=!0){let it=0;if(I){let Q=!1;if(L!==null){let Tt=L.texture.format;Q=Tt===Vu||Tt===Gu||Tt===zu}if(Q){let Tt=L.texture.type,It=Tt===ui||Tt===ci||Tt===Zc||Tt===Ci||Tt===ku||Tt===Hu,kt=Ot.getClearColor(),zt=Ot.getClearAlpha(),$t=kt.r,Vt=kt.g,Xt=kt.b;It?(p[0]=$t,p[1]=Vt,p[2]=Xt,p[3]=zt,q.clearBufferuiv(q.COLOR,0,p)):(g[0]=$t,g[1]=Vt,g[2]=Xt,g[3]=zt,q.clearBufferiv(q.COLOR,0,g))}else it|=q.COLOR_BUFFER_BIT}j&&(it|=q.DEPTH_BUFFER_BIT),tt&&(it|=q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q.clear(it)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",gt,!1),e.removeEventListener("webglcontextrestored",G,!1),e.removeEventListener("webglcontextcreationerror",J,!1),Et.dispose(),Ct.dispose(),bt.dispose(),w.dispose(),$.dispose(),ht.dispose(),_t.dispose(),Ht.dispose(),At.dispose(),Gt.dispose(),Gt.removeEventListener("sessionstart",Ue),Gt.removeEventListener("sessionend",re),nt&&(nt.dispose(),nt=null),Fe.stop()};function gt(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function G(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;let I=Rt.autoReset,j=rt.enabled,tt=rt.autoUpdate,it=rt.needsUpdate,Q=rt.type;Wt(),Rt.autoReset=I,rt.enabled=j,rt.autoUpdate=tt,rt.needsUpdate=it,rt.type=Q}function J(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function xt(I){let j=I.target;j.removeEventListener("dispose",xt),Nt(j)}function Nt(I){Lt(I),bt.remove(I)}function Lt(I){let j=bt.get(I).programs;j!==void 0&&(j.forEach(function(tt){At.releaseProgram(tt)}),I.isShaderMaterial&&At.releaseShaderCache(I))}this.renderBufferDirect=function(I,j,tt,it,Q,Tt){j===null&&(j=ot);let It=Q.isMesh&&Q.matrixWorld.determinant()<0,kt=yp(I,j,tt,it,Q);pt.setMaterial(it,It);let zt=tt.index,$t=1;if(it.wireframe===!0){if(zt=lt.getWireframeAttribute(tt),zt===void 0)return;$t=2}let Vt=tt.drawRange,Xt=tt.attributes.position,pe=Vt.start*$t,tn=(Vt.start+Vt.count)*$t;Tt!==null&&(pe=Math.max(pe,Tt.start*$t),tn=Math.min(tn,(Tt.start+Tt.count)*$t)),zt!==null?(pe=Math.max(pe,0),tn=Math.min(tn,zt.count)):Xt!=null&&(pe=Math.max(pe,0),tn=Math.min(tn,Xt.count));let Ae=tn-pe;if(Ae<0||Ae===1/0)return;_t.setup(Q,it,kt,tt,zt);let Fn,le=st;if(zt!==null&&(Fn=ct.get(zt),le=ft,le.setIndex(Fn)),Q.isMesh)it.wireframe===!0?(pt.setLineWidth(it.wireframeLinewidth*vt()),le.setMode(q.LINES)):le.setMode(q.TRIANGLES);else if(Q.isLine){let Zt=it.linewidth;Zt===void 0&&(Zt=1),pt.setLineWidth(Zt*vt()),Q.isLineSegments?le.setMode(q.LINES):Q.isLineLoop?le.setMode(q.LINE_LOOP):le.setMode(q.LINE_STRIP)}else Q.isPoints?le.setMode(q.POINTS):Q.isSprite&&le.setMode(q.TRIANGLES);if(Q.isBatchedMesh)le.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else if(Q.isInstancedMesh)le.renderInstances(pe,Ae,Q.count);else if(tt.isInstancedBufferGeometry){let Zt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,La=Math.min(tt.instanceCount,Zt);le.renderInstances(pe,Ae,La)}else le.render(pe,Ae)};function ee(I,j,tt){I.transparent===!0&&I.side===ln&&I.forceSinglePass===!1?(I.side=Ze,I.needsUpdate=!0,Vr(I,j,tt),I.side=Rn,I.needsUpdate=!0,Vr(I,j,tt),I.side=ln):Vr(I,j,tt)}this.compile=function(I,j,tt=null){tt===null&&(tt=I),m=Ct.get(tt),m.init(),v.push(m),tt.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),I!==tt&&I.traverseVisible(function(Q){Q.isLight&&Q.layers.test(j.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),m.setupLights(x._useLegacyLights);let it=new Set;return I.traverse(function(Q){let Tt=Q.material;if(Tt)if(Array.isArray(Tt))for(let It=0;It<Tt.length;It++){let kt=Tt[It];ee(kt,tt,Q),it.add(kt)}else ee(Tt,tt,Q),it.add(Tt)}),v.pop(),m=null,it},this.compileAsync=function(I,j,tt=null){let it=this.compile(I,j,tt);return new Promise(Q=>{function Tt(){if(it.forEach(function(It){bt.get(It).currentProgram.isReady()&&it.delete(It)}),it.size===0){Q(I);return}setTimeout(Tt,10)}at.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let ne=null;function Ee(I){ne&&ne(I)}function Ue(){Fe.stop()}function re(){Fe.start()}let Fe=new Ku;Fe.setAnimationLoop(Ee),typeof self<"u"&&Fe.setContext(self),this.setAnimationLoop=function(I){ne=I,Gt.setAnimationLoop(I),I===null?Fe.stop():Fe.start()},Gt.addEventListener("sessionstart",Ue),Gt.addEventListener("sessionend",re),this.render=function(I,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Gt.enabled===!0&&Gt.isPresenting===!0&&(Gt.cameraAutoUpdate===!0&&Gt.updateCamera(j),j=Gt.getCamera()),I.isScene===!0&&I.onBeforeRender(x,I,j,L),m=Ct.get(I,v.length),m.init(),v.push(m),et.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),H.setFromProjectionMatrix(et),Z=this.localClippingEnabled,W=Dt.init(this.clippingPlanes,Z),_=Et.get(I,f.length),_.init(),f.push(_),wn(I,j,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(F,z),this.info.render.frame++,W===!0&&Dt.beginShadows();let tt=m.state.shadowsArray;if(rt.render(tt,I,j),W===!0&&Dt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ot.render(_,I),m.setupLights(x._useLegacyLights),j.isArrayCamera){let it=j.cameras;for(let Q=0,Tt=it.length;Q<Tt;Q++){let It=it[Q];Zl(_,I,It,It.viewport)}}else Zl(_,I,j);L!==null&&(T.updateMultisampleRenderTarget(L),T.updateRenderTargetMipmap(L)),I.isScene===!0&&I.onAfterRender(x,I,j),_t.resetDefaultState(),V=-1,M=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function wn(I,j,tt,it){if(I.visible===!1)return;if(I.layers.test(j.layers)){if(I.isGroup)tt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(j);else if(I.isLight)m.pushLight(I),I.castShadow&&m.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||H.intersectsSprite(I)){it&&St.setFromMatrixPosition(I.matrixWorld).applyMatrix4(et);let It=ht.update(I),kt=I.material;kt.visible&&_.push(I,It,kt,tt,St.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||H.intersectsObject(I))){let It=ht.update(I),kt=I.material;if(it&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),St.copy(I.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),St.copy(It.boundingSphere.center)),St.applyMatrix4(I.matrixWorld).applyMatrix4(et)),Array.isArray(kt)){let zt=It.groups;for(let $t=0,Vt=zt.length;$t<Vt;$t++){let Xt=zt[$t],pe=kt[Xt.materialIndex];pe&&pe.visible&&_.push(I,It,pe,tt,St.z,Xt)}}else kt.visible&&_.push(I,It,kt,tt,St.z,null)}}let Tt=I.children;for(let It=0,kt=Tt.length;It<kt;It++)wn(Tt[It],j,tt,it)}function Zl(I,j,tt,it){let Q=I.opaque,Tt=I.transmissive,It=I.transparent;m.setupLightsView(tt),W===!0&&Dt.setGlobalState(x.clippingPlanes,tt),Tt.length>0&&xp(Q,Tt,j,tt),it&&pt.viewport(b.copy(it)),Q.length>0&&Gr(Q,j,tt),Tt.length>0&&Gr(Tt,j,tt),It.length>0&&Gr(It,j,tt),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function xp(I,j,tt,it){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;let Tt=Mt.isWebGL2;nt===null&&(nt=new sn(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")?ar:ui,minFilter:or,samples:Tt?4:0})),x.getDrawingBufferSize(mt),Tt?nt.setSize(mt.x,mt.y):nt.setSize(Eo(mt.x),Eo(mt.y));let It=x.getRenderTarget();x.setRenderTarget(nt),x.getClearColor(k),A=x.getClearAlpha(),A<1&&x.setClearColor(16777215,.5),x.clear();let kt=x.toneMapping;x.toneMapping=hi,Gr(I,tt,it),T.updateMultisampleRenderTarget(nt),T.updateRenderTargetMipmap(nt);let zt=!1;for(let $t=0,Vt=j.length;$t<Vt;$t++){let Xt=j[$t],pe=Xt.object,tn=Xt.geometry,Ae=Xt.material,Fn=Xt.group;if(Ae.side===ln&&pe.layers.test(it.layers)){let le=Ae.side;Ae.side=Ze,Ae.needsUpdate=!0,Jl(pe,tt,it,tn,Ae,Fn),Ae.side=le,Ae.needsUpdate=!0,zt=!0}}zt===!0&&(T.updateMultisampleRenderTarget(nt),T.updateRenderTargetMipmap(nt)),x.setRenderTarget(It),x.setClearColor(k,A),x.toneMapping=kt}function Gr(I,j,tt){let it=j.isScene===!0?j.overrideMaterial:null;for(let Q=0,Tt=I.length;Q<Tt;Q++){let It=I[Q],kt=It.object,zt=It.geometry,$t=it===null?It.material:it,Vt=It.group;kt.layers.test(tt.layers)&&Jl(kt,j,tt,zt,$t,Vt)}}function Jl(I,j,tt,it,Q,Tt){I.onBeforeRender(x,j,tt,it,Q,Tt),I.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),Q.onBeforeRender(x,j,tt,it,I,Tt),Q.transparent===!0&&Q.side===ln&&Q.forceSinglePass===!1?(Q.side=Ze,Q.needsUpdate=!0,x.renderBufferDirect(tt,j,it,Q,I,Tt),Q.side=Rn,Q.needsUpdate=!0,x.renderBufferDirect(tt,j,it,Q,I,Tt),Q.side=ln):x.renderBufferDirect(tt,j,it,Q,I,Tt),I.onAfterRender(x,j,tt,it,Q,Tt)}function Vr(I,j,tt){j.isScene!==!0&&(j=ot);let it=bt.get(I),Q=m.state.lights,Tt=m.state.shadowsArray,It=Q.state.version,kt=At.getParameters(I,Q.state,Tt,j,tt),zt=At.getProgramCacheKey(kt),$t=it.programs;it.environment=I.isMeshStandardMaterial?j.environment:null,it.fog=j.fog,it.envMap=(I.isMeshStandardMaterial?$:w).get(I.envMap||it.environment),$t===void 0&&(I.addEventListener("dispose",xt),$t=new Map,it.programs=$t);let Vt=$t.get(zt);if(Vt!==void 0){if(it.currentProgram===Vt&&it.lightsStateVersion===It)return th(I,kt),Vt}else kt.uniforms=At.getUniforms(I),I.onBuild(tt,kt,x),I.onBeforeCompile(kt,x),Vt=At.acquireProgram(kt,zt),$t.set(zt,Vt),it.uniforms=kt.uniforms;let Xt=it.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(Xt.clippingPlanes=Dt.uniform),th(I,kt),it.needsLights=Mp(I),it.lightsStateVersion=It,it.needsLights&&(Xt.ambientLightColor.value=Q.state.ambient,Xt.lightProbe.value=Q.state.probe,Xt.directionalLights.value=Q.state.directional,Xt.directionalLightShadows.value=Q.state.directionalShadow,Xt.spotLights.value=Q.state.spot,Xt.spotLightShadows.value=Q.state.spotShadow,Xt.rectAreaLights.value=Q.state.rectArea,Xt.ltc_1.value=Q.state.rectAreaLTC1,Xt.ltc_2.value=Q.state.rectAreaLTC2,Xt.pointLights.value=Q.state.point,Xt.pointLightShadows.value=Q.state.pointShadow,Xt.hemisphereLights.value=Q.state.hemi,Xt.directionalShadowMap.value=Q.state.directionalShadowMap,Xt.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Xt.spotShadowMap.value=Q.state.spotShadowMap,Xt.spotLightMatrix.value=Q.state.spotLightMatrix,Xt.spotLightMap.value=Q.state.spotLightMap,Xt.pointShadowMap.value=Q.state.pointShadowMap,Xt.pointShadowMatrix.value=Q.state.pointShadowMatrix),it.currentProgram=Vt,it.uniformsList=null,Vt}function Ql(I){if(I.uniformsList===null){let j=I.currentProgram.getUniforms();I.uniformsList=Ms.seqWithValue(j.seq,I.uniforms)}return I.uniformsList}function th(I,j){let tt=bt.get(I);tt.outputColorSpace=j.outputColorSpace,tt.batching=j.batching,tt.instancing=j.instancing,tt.instancingColor=j.instancingColor,tt.skinning=j.skinning,tt.morphTargets=j.morphTargets,tt.morphNormals=j.morphNormals,tt.morphColors=j.morphColors,tt.morphTargetsCount=j.morphTargetsCount,tt.numClippingPlanes=j.numClippingPlanes,tt.numIntersection=j.numClipIntersection,tt.vertexAlphas=j.vertexAlphas,tt.vertexTangents=j.vertexTangents,tt.toneMapping=j.toneMapping}function yp(I,j,tt,it,Q){j.isScene!==!0&&(j=ot),T.resetTextureUnits();let Tt=j.fog,It=it.isMeshStandardMaterial?j.environment:null,kt=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:xn,zt=(it.isMeshStandardMaterial?$:w).get(it.envMap||It),$t=it.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Vt=!!tt.attributes.tangent&&(!!it.normalMap||it.anisotropy>0),Xt=!!tt.morphAttributes.position,pe=!!tt.morphAttributes.normal,tn=!!tt.morphAttributes.color,Ae=hi;it.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Ae=x.toneMapping);let Fn=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,le=Fn!==void 0?Fn.length:0,Zt=bt.get(it),La=m.state.lights;if(W===!0&&(Z===!0||I!==M)){let an=I===M&&it.id===V;Dt.setState(it,I,an)}let he=!1;it.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==La.state.version||Zt.outputColorSpace!==kt||Q.isBatchedMesh&&Zt.batching===!1||!Q.isBatchedMesh&&Zt.batching===!0||Q.isInstancedMesh&&Zt.instancing===!1||!Q.isInstancedMesh&&Zt.instancing===!0||Q.isSkinnedMesh&&Zt.skinning===!1||!Q.isSkinnedMesh&&Zt.skinning===!0||Q.isInstancedMesh&&Zt.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Zt.instancingColor===!1&&Q.instanceColor!==null||Zt.envMap!==zt||it.fog===!0&&Zt.fog!==Tt||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==Dt.numPlanes||Zt.numIntersection!==Dt.numIntersection)||Zt.vertexAlphas!==$t||Zt.vertexTangents!==Vt||Zt.morphTargets!==Xt||Zt.morphNormals!==pe||Zt.morphColors!==tn||Zt.toneMapping!==Ae||Mt.isWebGL2===!0&&Zt.morphTargetsCount!==le)&&(he=!0):(he=!0,Zt.__version=it.version);let yi=Zt.currentProgram;he===!0&&(yi=Vr(it,j,Q));let eh=!1,Zs=!1,Ia=!1,Pe=yi.getUniforms(),vi=Zt.uniforms;if(pt.useProgram(yi.program)&&(eh=!0,Zs=!0,Ia=!0),it.id!==V&&(V=it.id,Zs=!0),eh||M!==I){Pe.setValue(q,"projectionMatrix",I.projectionMatrix),Pe.setValue(q,"viewMatrix",I.matrixWorldInverse);let an=Pe.map.cameraPosition;an!==void 0&&an.setValue(q,St.setFromMatrixPosition(I.matrixWorld)),Mt.logarithmicDepthBuffer&&Pe.setValue(q,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(it.isMeshPhongMaterial||it.isMeshToonMaterial||it.isMeshLambertMaterial||it.isMeshBasicMaterial||it.isMeshStandardMaterial||it.isShaderMaterial)&&Pe.setValue(q,"isOrthographic",I.isOrthographicCamera===!0),M!==I&&(M=I,Zs=!0,Ia=!0)}if(Q.isSkinnedMesh){Pe.setOptional(q,Q,"bindMatrix"),Pe.setOptional(q,Q,"bindMatrixInverse");let an=Q.skeleton;an&&(Mt.floatVertexTextures?(an.boneTexture===null&&an.computeBoneTexture(),Pe.setValue(q,"boneTexture",an.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Q.isBatchedMesh&&(Pe.setOptional(q,Q,"batchingTexture"),Pe.setValue(q,"batchingTexture",Q._matricesTexture,T));let Da=tt.morphAttributes;if((Da.position!==void 0||Da.normal!==void 0||Da.color!==void 0&&Mt.isWebGL2===!0)&&U.update(Q,tt,yi),(Zs||Zt.receiveShadow!==Q.receiveShadow)&&(Zt.receiveShadow=Q.receiveShadow,Pe.setValue(q,"receiveShadow",Q.receiveShadow)),it.isMeshGouraudMaterial&&it.envMap!==null&&(vi.envMap.value=zt,vi.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Zs&&(Pe.setValue(q,"toneMappingExposure",x.toneMappingExposure),Zt.needsLights&&vp(vi,Ia),Tt&&it.fog===!0&&yt.refreshFogUniforms(vi,Tt),yt.refreshMaterialUniforms(vi,it,N,R,nt),Ms.upload(q,Ql(Zt),vi,T)),it.isShaderMaterial&&it.uniformsNeedUpdate===!0&&(Ms.upload(q,Ql(Zt),vi,T),it.uniformsNeedUpdate=!1),it.isSpriteMaterial&&Pe.setValue(q,"center",Q.center),Pe.setValue(q,"modelViewMatrix",Q.modelViewMatrix),Pe.setValue(q,"normalMatrix",Q.normalMatrix),Pe.setValue(q,"modelMatrix",Q.matrixWorld),it.isShaderMaterial||it.isRawShaderMaterial){let an=it.uniformsGroups;for(let Na=0,bp=an.length;Na<bp;Na++)if(Mt.isWebGL2){let nh=an[Na];Ht.update(nh,yi),Ht.bind(nh,yi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yi}function vp(I,j){I.ambientLightColor.needsUpdate=j,I.lightProbe.needsUpdate=j,I.directionalLights.needsUpdate=j,I.directionalLightShadows.needsUpdate=j,I.pointLights.needsUpdate=j,I.pointLightShadows.needsUpdate=j,I.spotLights.needsUpdate=j,I.spotLightShadows.needsUpdate=j,I.rectAreaLights.needsUpdate=j,I.hemisphereLights.needsUpdate=j}function Mp(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(I,j,tt){bt.get(I.texture).__webglTexture=j,bt.get(I.depthTexture).__webglTexture=tt;let it=bt.get(I);it.__hasExternalTextures=!0,it.__hasExternalTextures&&(it.__autoAllocateDepthBuffer=tt===void 0,it.__autoAllocateDepthBuffer||at.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),it.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(I,j){let tt=bt.get(I);tt.__webglFramebuffer=j,tt.__useDefaultFramebuffer=j===void 0},this.setRenderTarget=function(I,j=0,tt=0){L=I,P=j,E=tt;let it=!0,Q=null,Tt=!1,It=!1;if(I){let zt=bt.get(I);zt.__useDefaultFramebuffer!==void 0?(pt.bindFramebuffer(q.FRAMEBUFFER,null),it=!1):zt.__webglFramebuffer===void 0?T.setupRenderTarget(I):zt.__hasExternalTextures&&T.rebindTextures(I,bt.get(I.texture).__webglTexture,bt.get(I.depthTexture).__webglTexture);let $t=I.texture;($t.isData3DTexture||$t.isDataArrayTexture||$t.isCompressedArrayTexture)&&(It=!0);let Vt=bt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(Vt[j])?Q=Vt[j][tt]:Q=Vt[j],Tt=!0):Mt.isWebGL2&&I.samples>0&&T.useMultisampledRTT(I)===!1?Q=bt.get(I).__webglMultisampledFramebuffer:Array.isArray(Vt)?Q=Vt[tt]:Q=Vt,b.copy(I.viewport),D.copy(I.scissor),O=I.scissorTest}else b.copy(B).multiplyScalar(N).floor(),D.copy(X).multiplyScalar(N).floor(),O=K;if(pt.bindFramebuffer(q.FRAMEBUFFER,Q)&&Mt.drawBuffers&&it&&pt.drawBuffers(I,Q),pt.viewport(b),pt.scissor(D),pt.setScissorTest(O),Tt){let zt=bt.get(I.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_CUBE_MAP_POSITIVE_X+j,zt.__webglTexture,tt)}else if(It){let zt=bt.get(I.texture),$t=j||0;q.framebufferTextureLayer(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,zt.__webglTexture,tt||0,$t)}V=-1},this.readRenderTargetPixels=function(I,j,tt,it,Q,Tt,It){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=bt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&It!==void 0&&(kt=kt[It]),kt){pt.bindFramebuffer(q.FRAMEBUFFER,kt);try{let zt=I.texture,$t=zt.format,Vt=zt.type;if($t!==_n&&ut.convert($t)!==q.getParameter(q.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Xt=Vt===ar&&(at.has("EXT_color_buffer_half_float")||Mt.isWebGL2&&at.has("EXT_color_buffer_float"));if(Vt!==ui&&ut.convert(Vt)!==q.getParameter(q.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===An&&(Mt.isWebGL2||at.has("OES_texture_float")||at.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=I.width-it&&tt>=0&&tt<=I.height-Q&&q.readPixels(j,tt,it,Q,ut.convert($t),ut.convert(Vt),Tt)}finally{let zt=L!==null?bt.get(L).__webglFramebuffer:null;pt.bindFramebuffer(q.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(I,j,tt=0){let it=Math.pow(2,-tt),Q=Math.floor(j.image.width*it),Tt=Math.floor(j.image.height*it);T.setTexture2D(j,0),q.copyTexSubImage2D(q.TEXTURE_2D,tt,0,0,I.x,I.y,Q,Tt),pt.unbindTexture()},this.copyTextureToTexture=function(I,j,tt,it=0){let Q=j.image.width,Tt=j.image.height,It=ut.convert(tt.format),kt=ut.convert(tt.type);T.setTexture2D(tt,0),q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,tt.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,tt.unpackAlignment),j.isDataTexture?q.texSubImage2D(q.TEXTURE_2D,it,I.x,I.y,Q,Tt,It,kt,j.image.data):j.isCompressedTexture?q.compressedTexSubImage2D(q.TEXTURE_2D,it,I.x,I.y,j.mipmaps[0].width,j.mipmaps[0].height,It,j.mipmaps[0].data):q.texSubImage2D(q.TEXTURE_2D,it,I.x,I.y,It,kt,j.image),it===0&&tt.generateMipmaps&&q.generateMipmap(q.TEXTURE_2D),pt.unbindTexture()},this.copyTextureToTexture3D=function(I,j,tt,it,Q=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Tt=I.max.x-I.min.x+1,It=I.max.y-I.min.y+1,kt=I.max.z-I.min.z+1,zt=ut.convert(it.format),$t=ut.convert(it.type),Vt;if(it.isData3DTexture)T.setTexture3D(it,0),Vt=q.TEXTURE_3D;else if(it.isDataArrayTexture||it.isCompressedArrayTexture)T.setTexture2DArray(it,0),Vt=q.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,it.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,it.unpackAlignment);let Xt=q.getParameter(q.UNPACK_ROW_LENGTH),pe=q.getParameter(q.UNPACK_IMAGE_HEIGHT),tn=q.getParameter(q.UNPACK_SKIP_PIXELS),Ae=q.getParameter(q.UNPACK_SKIP_ROWS),Fn=q.getParameter(q.UNPACK_SKIP_IMAGES),le=tt.isCompressedTexture?tt.mipmaps[Q]:tt.image;q.pixelStorei(q.UNPACK_ROW_LENGTH,le.width),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,le.height),q.pixelStorei(q.UNPACK_SKIP_PIXELS,I.min.x),q.pixelStorei(q.UNPACK_SKIP_ROWS,I.min.y),q.pixelStorei(q.UNPACK_SKIP_IMAGES,I.min.z),tt.isDataTexture||tt.isData3DTexture?q.texSubImage3D(Vt,Q,j.x,j.y,j.z,Tt,It,kt,zt,$t,le.data):tt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),q.compressedTexSubImage3D(Vt,Q,j.x,j.y,j.z,Tt,It,kt,zt,le.data)):q.texSubImage3D(Vt,Q,j.x,j.y,j.z,Tt,It,kt,zt,$t,le),q.pixelStorei(q.UNPACK_ROW_LENGTH,Xt),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,pe),q.pixelStorei(q.UNPACK_SKIP_PIXELS,tn),q.pixelStorei(q.UNPACK_SKIP_ROWS,Ae),q.pixelStorei(q.UNPACK_SKIP_IMAGES,Fn),Q===0&&it.generateMipmaps&&q.generateMipmap(Vt),pt.unbindTexture()},this.initTexture=function(I){I.isCubeTexture?T.setTextureCube(I,0):I.isData3DTexture?T.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?T.setTexture2DArray(I,0):T.setTexture2D(I,0),pt.unbindTexture()},this.resetState=function(){P=0,E=0,L=null,pt.reset(),_t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Qc?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===$o?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Me?Li:Xu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Li?Me:xn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Oc=class extends fr{};Oc.prototype.isWebGL1Renderer=!0;var di=class extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var We=class extends Ln{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ut(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Eu=new Y,Au=new Y,Tu=new fe,hc=new Pn,fo=new Di,Fo=class extends Re{constructor(t=new ie,e=new We){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Eu.fromBufferAttribute(e,s-1),Au.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Eu.distanceTo(Au);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fo.copy(n.boundingSphere),fo.applyMatrix4(s),fo.radius+=r,t.ray.intersectsSphere(fo)===!1)return;Tu.copy(s).invert(),hc.copy(t.ray).applyMatrix4(Tu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new Y,h=new Y,u=new Y,d=new Y,p=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){let f=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let x=f,S=v-1;x<S;x+=p){let P=g.getX(x),E=g.getX(x+1);if(l.fromBufferAttribute(m,P),h.fromBufferAttribute(m,E),hc.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);let V=t.ray.origin.distanceTo(d);V<t.near||V>t.far||e.push({distance:V,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{let f=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let x=f,S=v-1;x<S;x+=p){if(l.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),hc.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);let E=t.ray.origin.distanceTo(d);E<t.near||E>t.far||e.push({distance:E,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}},Ru=new Y,Cu=new Y,_e=class extends Fo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Ru.fromBufferAttribute(e,s),Cu.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ru.distanceTo(Cu);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var pr=class extends Ln{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Pu=new fe,Uc=new Pn,po=new Di,mo=new Y,Bo=class extends Re{constructor(t=new ie,e=new pr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),po.copy(n.boundingSphere),po.applyMatrix4(s),po.radius+=r,t.ray.intersectsSphere(po)===!1)return;Pu.copy(s).invert(),Uc.copy(t.ray).applyMatrix4(Pu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,_=p;g<_;g++){let m=l.getX(g);mo.fromBufferAttribute(u,m),Lu(mo,m,c,s,t,e,this)}}else{let d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,_=p;g<_;g++)mo.fromBufferAttribute(u,g),Lu(mo,g,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Lu(i,t,e,n,s,r,o){let a=Uc.distanceSqToPoint(i);if(a<e){let c=new Y;Uc.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var Fc=class i extends ie{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],g=0,_=[],m=n/2,f=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new jt(u,3)),this.setAttribute("normal",new jt(d,3)),this.setAttribute("uv",new jt(p,2));function v(){let S=new Y,P=new Y,E=0,L=(e-t)/n;for(let V=0;V<=r;V++){let M=[],b=V/r,D=b*(e-t)+t;for(let O=0;O<=s;O++){let k=O/s,A=k*c+a,C=Math.sin(A),R=Math.cos(A);P.x=D*C,P.y=-b*n+m,P.z=D*R,u.push(P.x,P.y,P.z),S.set(C,L,R).normalize(),d.push(S.x,S.y,S.z),p.push(k,1-b),M.push(g++)}_.push(M)}for(let V=0;V<s;V++)for(let M=0;M<r;M++){let b=_[M][V],D=_[M+1][V],O=_[M+1][V+1],k=_[M][V+1];h.push(b,D,k),h.push(D,O,k),E+=6}l.addGroup(f,E,0),f+=E}function x(S){let P=g,E=new Bt,L=new Y,V=0,M=S===!0?t:e,b=S===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*b,0),d.push(0,b,0),p.push(.5,.5),g++;let D=g;for(let O=0;O<=s;O++){let A=O/s*c+a,C=Math.cos(A),R=Math.sin(A);L.x=M*R,L.y=m*b,L.z=M*C,u.push(L.x,L.y,L.z),d.push(0,b,0),E.x=C*.5+.5,E.y=R*.5*b+.5,p.push(E.x,E.y),g++}for(let O=0;O<s;O++){let k=P+O,A=D+O;S===!0?h.push(A,A+1,k):h.push(A+1,A,k),V+=3}l.addGroup(f,V,S===!0?1:2),f+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var mr=class i extends ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new Y,d=new Y,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){let v=[],x=f/n,S=0;f===0&&o===0?S=.5/e:f===n&&c===Math.PI&&(S=-.5/e);for(let P=0;P<=e;P++){let E=P/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(E+S,1-x),v.push(l++)}h.push(v)}for(let f=0;f<n;f++)for(let v=0;v<e;v++){let x=h[f][v+1],S=h[f][v],P=h[f+1][v],E=h[f+1][v+1];(f!==0||o>0)&&p.push(x,S,E),(f!==n-1||c<Math.PI)&&p.push(S,P,E)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(_,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ko=class extends Ln{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ut(16777215),this.specular=new Ut(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jc,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=qo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Ho=class extends Ln{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jc,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=qo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function go(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Ry(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var As=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Bc=class extends As{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Oh,endingEnd:Oh}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Uh:r=t,a=2*e-n;break;case Fh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Uh:o=t,c=2*n-e;break;case Fh:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,v=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*_+.5*g,S=p*m-p*_;for(let P=0;P!==a;++P)r[P]=f*o[h+P]+v*o[l+P]+x*o[c+P]+S*o[u+P];return r}},kc=class extends As{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},Hc=class extends As{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Mn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=go(e,this.TimeBufferType),this.values=go(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:go(t.times,Array),values:go(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Hc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new kc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Bc(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case yo:e=this.InterpolantFactoryMethodDiscrete;break;case vo:e=this.InterpolantFactoryMethodLinear;break;case za:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yo;case this.InterpolantFactoryMethodLinear:return vo;case this.InterpolantFactoryMethodSmooth:return za}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Ry(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===za,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)e[d+p]=e[u+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=vo;var Ni=class extends Mn{};Ni.prototype.ValueTypeName="bool";Ni.prototype.ValueBufferType=Array;Ni.prototype.DefaultInterpolation=yo;Ni.prototype.InterpolantFactoryMethodLinear=void 0;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var zc=class extends Mn{};zc.prototype.ValueTypeName="color";var Gc=class extends Mn{};Gc.prototype.ValueTypeName="number";var Vc=class extends As{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)vn.slerpFlat(r,0,o,l-a,o,l,c);return r}},gr=class extends Mn{InterpolantFactoryMethodLinear(t){return new Vc(this.times,this.values,this.getValueSize(),t)}};gr.prototype.ValueTypeName="quaternion";gr.prototype.DefaultInterpolation=vo;gr.prototype.InterpolantFactoryMethodSmooth=void 0;var Oi=class extends Mn{};Oi.prototype.ValueTypeName="string";Oi.prototype.ValueBufferType=Array;Oi.prototype.DefaultInterpolation=yo;Oi.prototype.InterpolantFactoryMethodLinear=void 0;Oi.prototype.InterpolantFactoryMethodSmooth=void 0;var Wc=class extends Mn{};Wc.prototype.ValueTypeName="vector";var Xc=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},Cy=new Xc,qc=class{constructor(t){this.manager=t!==void 0?t:Cy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};qc.DEFAULT_MATERIAL_NAME="__DEFAULT";var zo=class extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}};var uc=new fe,Iu=new Y,Du=new Y,Yc=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ur,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Iu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Iu),Du.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Du),e.updateMatrixWorld(),uc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(uc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var $c=class extends Yc{constructor(){super(new In(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Go=class extends zo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new $c}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Vo=class extends zo{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var nl="\\[\\]\\.:\\/",Py=new RegExp("["+nl+"]","g"),il="[^"+nl+"]",Ly="[^"+nl.replace("\\.","")+"]",Iy=/((?:WC+[\/:])*)/.source.replace("WC",il),Dy=/(WCOD+)?/.source.replace("WCOD",Ly),Ny=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",il),Oy=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",il),Uy=new RegExp("^"+Iy+Dy+Ny+Oy+"$"),Fy=["material","materials","bones","map"],jc=class{constructor(t,e,n){let s=n||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ce=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Py,"")}static parseTrackName(t){let e=Uy.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Fy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ce.Composite=jc;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var sM=new Float32Array(1);var Wo=class{constructor(t,e,n=0,s=1/0){this.ray=new Pn(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new lr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Kc(t,this,n,e),n.sort(Nu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Kc(t[s],this,n,e);return n.sort(Nu),n}};function Nu(i,t){return i.distance-t.distance}function Kc(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)Kc(s[r],t,e,!0)}}var _r=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(De(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Ou=new Y,_o,dc,Xo=class extends Re{constructor(t=new Y(0,0,1),e=new Y(0,0,0),n=1,s=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",_o===void 0&&(_o=new ie,_o.setAttribute("position",new jt([0,0,0,0,1,0],3)),dc=new Fc(0,.5,1,5,1),dc.translate(0,-.5,0)),this.position.copy(e),this.line=new Fo(_o,new We({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new de(dc,new Xn({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,r,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Ou.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Ou,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var nd={type:"change"},sl={type:"start"},id={type:"end"},Zo=new Pn,sd=new Ke,By=Math.cos(70*qn.DEG2RAD),xr=class extends Cn{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bn.ROTATE,MIDDLE:bn.DOLLY,RIGHT:bn.PAN},this.touches={ONE:Dn.ROTATE,TWO:Dn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(U){U.addEventListener("keydown",ht),this._domElementKeyEvents=U},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ht),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(nd),n.update(),r=s.NONE},this.update=(function(){let U=new Y,st=new vn().setFromUnitVectors(t.up,new Y(0,1,0)),ft=st.clone().invert(),ut=new Y,_t=new vn,Ht=new Y,Wt=2*Math.PI;return function(gt=null){let G=n.object.position;U.copy(G).sub(n.target),U.applyQuaternion(st),a.setFromVector3(U),n.autoRotate&&r===s.NONE&&D(M(gt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let J=n.minAzimuthAngle,xt=n.maxAzimuthAngle;isFinite(J)&&isFinite(xt)&&(J<-Math.PI?J+=Wt:J>Math.PI&&(J-=Wt),xt<-Math.PI?xt+=Wt:xt>Math.PI&&(xt-=Wt),J<=xt?a.theta=Math.max(J,Math.min(xt,a.theta)):a.theta=a.theta>(J+xt)/2?Math.max(J,a.theta):Math.min(xt,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&E||n.object.isOrthographicCamera?a.radius=z(a.radius):a.radius=z(a.radius*l),U.setFromSpherical(a),U.applyQuaternion(ft),G.copy(n.target).add(U),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Nt=!1;if(n.zoomToCursor&&E){let Lt=null;if(n.object.isPerspectiveCamera){let ee=U.length();Lt=z(ee*l);let ne=ee-Lt;n.object.position.addScaledVector(S,ne),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let ee=new Y(P.x,P.y,0);ee.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Nt=!0;let ne=new Y(P.x,P.y,0);ne.unproject(n.object),n.object.position.sub(ne).add(ee),n.object.updateMatrixWorld(),Lt=U.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Lt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Lt).add(n.object.position):(Zo.origin.copy(n.object.position),Zo.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Zo.direction))<By?t.lookAt(n.target):(sd.setFromNormalAndCoplanarPoint(n.object.up,n.target),Zo.intersectPlane(sd,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Nt=!0);return l=1,E=!1,Nt||ut.distanceToSquared(n.object.position)>o||8*(1-_t.dot(n.object.quaternion))>o||Ht.distanceToSquared(n.target)>0?(n.dispatchEvent(nd),ut.copy(n.object.position),_t.copy(n.object.quaternion),Ht.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Et),n.domElement.removeEventListener("pointerdown",bt),n.domElement.removeEventListener("pointercancel",w),n.domElement.removeEventListener("wheel",lt),n.domElement.removeEventListener("pointermove",T),n.domElement.removeEventListener("pointerup",w),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ht),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,o=1e-6,a=new _r,c=new _r,l=1,h=new Y,u=new Bt,d=new Bt,p=new Bt,g=new Bt,_=new Bt,m=new Bt,f=new Bt,v=new Bt,x=new Bt,S=new Y,P=new Bt,E=!1,L=[],V={};function M(U){return U!==null?2*Math.PI/60*n.autoRotateSpeed*U:2*Math.PI/60/60*n.autoRotateSpeed}function b(U){let st=Math.abs(U)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*st)}function D(U){c.theta-=U}function O(U){c.phi-=U}let k=(function(){let U=new Y;return function(ft,ut){U.setFromMatrixColumn(ut,0),U.multiplyScalar(-ft),h.add(U)}})(),A=(function(){let U=new Y;return function(ft,ut){n.screenSpacePanning===!0?U.setFromMatrixColumn(ut,1):(U.setFromMatrixColumn(ut,0),U.crossVectors(n.object.up,U)),U.multiplyScalar(ft),h.add(U)}})(),C=(function(){let U=new Y;return function(ft,ut){let _t=n.domElement;if(n.object.isPerspectiveCamera){let Ht=n.object.position;U.copy(Ht).sub(n.target);let Wt=U.length();Wt*=Math.tan(n.object.fov/2*Math.PI/180),k(2*ft*Wt/_t.clientHeight,n.object.matrix),A(2*ut*Wt/_t.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(k(ft*(n.object.right-n.object.left)/n.object.zoom/_t.clientWidth,n.object.matrix),A(ut*(n.object.top-n.object.bottom)/n.object.zoom/_t.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function R(U){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=U:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function N(U){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=U:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function F(U,st){if(!n.zoomToCursor)return;E=!0;let ft=n.domElement.getBoundingClientRect(),ut=U-ft.left,_t=st-ft.top,Ht=ft.width,Wt=ft.height;P.x=ut/Ht*2-1,P.y=-(_t/Wt)*2+1,S.set(P.x,P.y,1).unproject(n.object).sub(n.object.position).normalize()}function z(U){return Math.max(n.minDistance,Math.min(n.maxDistance,U))}function B(U){u.set(U.clientX,U.clientY)}function X(U){F(U.clientX,U.clientX),f.set(U.clientX,U.clientY)}function K(U){g.set(U.clientX,U.clientY)}function H(U){d.set(U.clientX,U.clientY),p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let st=n.domElement;D(2*Math.PI*p.x/st.clientHeight),O(2*Math.PI*p.y/st.clientHeight),u.copy(d),n.update()}function W(U){v.set(U.clientX,U.clientY),x.subVectors(v,f),x.y>0?R(b(x.y)):x.y<0&&N(b(x.y)),f.copy(v),n.update()}function Z(U){_.set(U.clientX,U.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),C(m.x,m.y),g.copy(_),n.update()}function nt(U){F(U.clientX,U.clientY),U.deltaY<0?N(b(U.deltaY)):U.deltaY>0&&R(b(U.deltaY)),n.update()}function et(U){let st=!1;switch(U.code){case n.keys.UP:U.ctrlKey||U.metaKey||U.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):C(0,n.keyPanSpeed),st=!0;break;case n.keys.BOTTOM:U.ctrlKey||U.metaKey||U.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):C(0,-n.keyPanSpeed),st=!0;break;case n.keys.LEFT:U.ctrlKey||U.metaKey||U.shiftKey?D(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):C(n.keyPanSpeed,0),st=!0;break;case n.keys.RIGHT:U.ctrlKey||U.metaKey||U.shiftKey?D(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):C(-n.keyPanSpeed,0),st=!0;break}st&&(U.preventDefault(),n.update())}function mt(U){if(L.length===1)u.set(U.pageX,U.pageY);else{let st=Ot(U),ft=.5*(U.pageX+st.x),ut=.5*(U.pageY+st.y);u.set(ft,ut)}}function St(U){if(L.length===1)g.set(U.pageX,U.pageY);else{let st=Ot(U),ft=.5*(U.pageX+st.x),ut=.5*(U.pageY+st.y);g.set(ft,ut)}}function ot(U){let st=Ot(U),ft=U.pageX-st.x,ut=U.pageY-st.y,_t=Math.sqrt(ft*ft+ut*ut);f.set(0,_t)}function vt(U){n.enableZoom&&ot(U),n.enablePan&&St(U)}function q(U){n.enableZoom&&ot(U),n.enableRotate&&mt(U)}function Pt(U){if(L.length==1)d.set(U.pageX,U.pageY);else{let ft=Ot(U),ut=.5*(U.pageX+ft.x),_t=.5*(U.pageY+ft.y);d.set(ut,_t)}p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let st=n.domElement;D(2*Math.PI*p.x/st.clientHeight),O(2*Math.PI*p.y/st.clientHeight),u.copy(d)}function at(U){if(L.length===1)_.set(U.pageX,U.pageY);else{let st=Ot(U),ft=.5*(U.pageX+st.x),ut=.5*(U.pageY+st.y);_.set(ft,ut)}m.subVectors(_,g).multiplyScalar(n.panSpeed),C(m.x,m.y),g.copy(_)}function Mt(U){let st=Ot(U),ft=U.pageX-st.x,ut=U.pageY-st.y,_t=Math.sqrt(ft*ft+ut*ut);v.set(0,_t),x.set(0,Math.pow(v.y/f.y,n.zoomSpeed)),R(x.y),f.copy(v);let Ht=(U.pageX+st.x)*.5,Wt=(U.pageY+st.y)*.5;F(Ht,Wt)}function pt(U){n.enableZoom&&Mt(U),n.enablePan&&at(U)}function Rt(U){n.enableZoom&&Mt(U),n.enableRotate&&Pt(U)}function bt(U){n.enabled!==!1&&(L.length===0&&(n.domElement.setPointerCapture(U.pointerId),n.domElement.addEventListener("pointermove",T),n.domElement.addEventListener("pointerup",w)),Ct(U),U.pointerType==="touch"?At(U):$(U))}function T(U){n.enabled!==!1&&(U.pointerType==="touch"?yt(U):ct(U))}function w(U){Dt(U),L.length===0&&(n.domElement.releasePointerCapture(U.pointerId),n.domElement.removeEventListener("pointermove",T),n.domElement.removeEventListener("pointerup",w)),n.dispatchEvent(id),r=s.NONE}function $(U){let st;switch(U.button){case 0:st=n.mouseButtons.LEFT;break;case 1:st=n.mouseButtons.MIDDLE;break;case 2:st=n.mouseButtons.RIGHT;break;default:st=-1}switch(st){case bn.DOLLY:if(n.enableZoom===!1)return;X(U),r=s.DOLLY;break;case bn.ROTATE:if(U.ctrlKey||U.metaKey||U.shiftKey){if(n.enablePan===!1)return;K(U),r=s.PAN}else{if(n.enableRotate===!1)return;B(U),r=s.ROTATE}break;case bn.PAN:if(U.ctrlKey||U.metaKey||U.shiftKey){if(n.enableRotate===!1)return;B(U),r=s.ROTATE}else{if(n.enablePan===!1)return;K(U),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(sl)}function ct(U){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;H(U);break;case s.DOLLY:if(n.enableZoom===!1)return;W(U);break;case s.PAN:if(n.enablePan===!1)return;Z(U);break}}function lt(U){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(U.preventDefault(),n.dispatchEvent(sl),nt(U),n.dispatchEvent(id))}function ht(U){n.enabled===!1||n.enablePan===!1||et(U)}function At(U){switch(rt(U),L.length){case 1:switch(n.touches.ONE){case Dn.ROTATE:if(n.enableRotate===!1)return;mt(U),r=s.TOUCH_ROTATE;break;case Dn.PAN:if(n.enablePan===!1)return;St(U),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Dn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;vt(U),r=s.TOUCH_DOLLY_PAN;break;case Dn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;q(U),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(sl)}function yt(U){switch(rt(U),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Pt(U),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;at(U),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;pt(U),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Rt(U),n.update();break;default:r=s.NONE}}function Et(U){n.enabled!==!1&&U.preventDefault()}function Ct(U){L.push(U.pointerId)}function Dt(U){delete V[U.pointerId];for(let st=0;st<L.length;st++)if(L[st]==U.pointerId){L.splice(st,1);return}}function rt(U){let st=V[U.pointerId];st===void 0&&(st=new Bt,V[U.pointerId]=st),st.set(U.pageX,U.pageY)}function Ot(U){let st=U.pointerId===L[0]?L[1]:L[0];return V[st]}n.domElement.addEventListener("contextmenu",Et),n.domElement.addEventListener("pointerdown",bt),n.domElement.addEventListener("pointercancel",w),n.domElement.addEventListener("wheel",lt,{passive:!1}),this.update()}};var Ne=document.getElementById("canvas"),te=new fr({canvas:Ne,antialias:!0});te.setSize(innerWidth,innerHeight);te.setPixelRatio(Math.min(devicePixelRatio,2));var Yt=new di;Yt.background=new Ut(197384);var rn=new Ge(50,innerWidth/innerHeight,.1,200);rn.position.set(0,.4,2.8);function Ls(i,t){let e=i/t,n=Math.tan(25*Math.PI/180);rn.aspect=e,rn.fov=2*Math.atan(n/Math.min(1,e))*180/Math.PI,rn.updateProjectionMatrix()}Ls(innerWidth,innerHeight);var xe=new xr(rn,Ne);xe.enableDamping=!0;xe.dampingFactor=.06;xe.enablePan=!1;xe.minDistance=1.4;xe.maxDistance=8;xe.enableZoom=!1;var Ui=rn.position.distanceTo(xe.target),rd=.92,ky=.12;Ne.addEventListener("wheel",i=>{if(!xe.enabled)return;i.preventDefault();let t=Math.sign(i.deltaY);Ui*=t>0?1/rd:rd,Ui=qn.clamp(Ui,xe.minDistance,xe.maxDistance)},{passive:!1});var Cs=0;Ne.addEventListener("touchstart",i=>{if(!xe.enabled||i.touches.length!==2){Cs=0;return}let t=i.touches[0].clientX-i.touches[1].clientX,e=i.touches[0].clientY-i.touches[1].clientY;Cs=Math.sqrt(t*t+e*e)},{passive:!0});Ne.addEventListener("touchmove",i=>{if(!xe.enabled||i.touches.length!==2||Cs===0)return;let t=i.touches[0].clientX-i.touches[1].clientX,e=i.touches[0].clientY-i.touches[1].clientY,n=Math.sqrt(t*t+e*e),s=Cs/n;Ui*=s,Ui=qn.clamp(Ui,xe.minDistance,xe.maxDistance),Cs=n},{passive:!0});Ne.addEventListener("touchend",()=>{Cs=0},{passive:!0});function ad(){let i=new Y().subVectors(rn.position,xe.target),t=i.length(),e=qn.lerp(t,Ui,ky);Math.abs(e-t)<1e-4||(i.setLength(e),rn.position.copy(xe.target).add(i))}Yt.add(new Vo(11189196,3.5));var cd=new Go(16775406,1.5);cd.position.set(5,3,4);Yt.add(cd);var pi;{let i=new ie,t=[];for(let e=0;e<3e3;e++){let n=Math.random()*Math.PI*2,s=Math.acos(2*Math.random()-1),r=40+Math.random()*30;t.push(r*Math.sin(s)*Math.cos(n),r*Math.sin(s)*Math.sin(n),r*Math.cos(s))}i.setAttribute("position",new jt(t,3)),pi=new Bo(i,new pr({color:16777215,size:.08})),Yt.add(pi)}var Hy=new Ve({uniforms:{c:{value:new Ut(.35,.6,1)}},vertexShader:"varying vec3 vN,vP;void main(){vN=normalize(normalMatrix*normal);vP=(modelViewMatrix*vec4(position,1)).xyz;gl_Position=projectionMatrix*vec4(vP,1);}",fragmentShader:"uniform vec3 c;varying vec3 vN,vP;void main(){float r=1.0-max(0.0,dot(normalize(-vP),vN));gl_FragColor=vec4(c,pow(r,3.5)*0.55);}",transparent:!0,side:Rn,depthWrite:!1}),Fi=new de(new mr(1.12,64,64),Hy);Yt.add(Fi);var zy=new ko({color:801390,transparent:!0,opacity:.55,shininess:50,specular:new Ut(4491451).multiplyScalar(.5),depthWrite:!1}),Yn=new de(new mr(1,80,80),zy);Yt.add(Yn);var Kt=new In(-1,1,1,-1,.1,100);Kt.position.set(0,0,5);Kt.lookAt(0,0,0);var rl=2;function Is(){let i=innerWidth/innerHeight,t,e;i>rl?(e=1.15,t=e*i):(t=1.15*rl,e=t/i),Kt.left=-t,Kt.right=t,Kt.top=e,Kt.bottom=-e,Kt.updateProjectionMatrix()}Is();var oe=new xr(Kt,Ne);oe.enableRotate=!1;oe.enableDamping=!0;oe.dampingFactor=.09;oe.panSpeed=1.4;oe.screenSpacePanning=!0;oe.mouseButtons={LEFT:bn.PAN,MIDDLE:bn.PAN,RIGHT:bn.PAN};oe.touches={ONE:Dn.PAN,TWO:Dn.DOLLY_PAN};oe.minZoom=.5;oe.maxZoom=20;oe.enableZoom=!1;oe.enabled=!1;var fi=Kt.zoom,od=.92,Gy=.12;Ne.addEventListener("wheel",i=>{if(!oe.enabled)return;i.preventDefault();let t=Math.sign(i.deltaY);fi*=t<0?1/od:od,fi=qn.clamp(fi,oe.minZoom,oe.maxZoom)},{passive:!1});var Ps=0;Ne.addEventListener("touchstart",i=>{if(!oe.enabled||i.touches.length!==2){Ps=0;return}let t=i.touches[0].clientX-i.touches[1].clientX,e=i.touches[0].clientY-i.touches[1].clientY;Ps=Math.sqrt(t*t+e*e)},{passive:!0});Ne.addEventListener("touchmove",i=>{if(!oe.enabled||i.touches.length!==2||Ps===0)return;let t=i.touches[0].clientX-i.touches[1].clientX,e=i.touches[0].clientY-i.touches[1].clientY,n=Math.sqrt(t*t+e*e),s=n/Ps;fi*=s,fi=qn.clamp(fi,oe.minZoom,oe.maxZoom),Ps=n},{passive:!0});Ne.addEventListener("touchend",()=>{Ps=0},{passive:!0});function ld(i){rl=i,Is()}function hd(){Kt.position.set(0,0,5),oe.target.set(0,0,0),Kt.zoom=fi=1,Kt.updateProjectionMatrix(),oe.update()}function ud(){let i=Kt.zoom,t=qn.lerp(i,fi,Gy);Math.abs(t-i)<1e-4||(Kt.zoom=t,Kt.updateProjectionMatrix())}var y={planetMesh:null,wireMesh:null,arrowGroup:null,windArrowGroup:null,curData:null,plateColors:{},_hoverBackup:null,hoveredPlate:-1,hoveredRegion:-1,hoveredKoppen:-1,_koppenHoverBackup:null,_mapKoppenHoverBackup:null,mapMesh:null,mapFaceToSide:null,_mapHoverBackup:null,mapGridMesh:null,globeGridMesh:null,gridEnabled:!0,gridSpacing:15,mapMode:!1,mapCenterLon:0,mapProjection:"equirect",mapProjOpts:{},dragStart:null,debugLayer:"",showPlates:!1,climateSeason:"year",palette:"classic",isTouchDevice:"ontouchstart"in window||navigator.maxTouchPoints>0,editMode:!1,oceanCurrentArrowGroup:null,climateComputed:!1,pendingToggles:new Set,_pendingBackup:null,_mapPendingBackup:null,importedHeightmap:!1};yr();yr();var vr=Object.freeze({OCEAN:0,CONTINENT:1,CRATON:2,ARC:3}),$n=Object.freeze({NONE:0,ANDEAN:1,LARAMIDE:2,URAL:3,HIMALAYAN:4,ARC:5,RIFT:6,TRANSPRESSION:7,INTRAPLATE:8}),Xy=Object.freeze({NONE:0,TRACK:1,LIP:2}),uM=Object.freeze({NONE:0,UPPER:1,LOWER:2}),qy=Object.freeze({TRENCH:1,SUTURE:2,FAILED_RIFT:4,RIFT_MARGIN:8,LIP:16,APRON:32,MARGIN_ISLE:64,EROSIVE:128}),dM=Object.freeze(["type","flags","formedAt","terrane","slabKm","wingKm","oroType","oroWork","oroStart","oroLast","thickKm","beltU","beltReach","beltAt","beltSide","beltShear","prevType","prevLast","prevU","prevReach","prevSide","prevShear","rootKm","upliftKm","baseKm","rugged","prevRugged","volcWornKm","riverIncKm","volcType","volcAt","volcKm","volcSource","fzU","geoFlags","coverKm","coverMaxKm","coverMaxAt","coverCarb","coverSalt","coverCoal","coverOrganic","exhumKm","unroofKm","floodMyr","floodLast","arcMyr","riftAt","farWork","farDist","farFold","farAt","farDx","farDy","farDz"]);var Yy=[[-9,[8,16,48]],[-6,[18,38,92]],[-4,[26,60,128]],[-2,[40,96,164]],[-.5,[70,140,196]],[0,[118,182,214]]],$y=[[0,[74,122,70]],[.3,[104,144,82]],[.8,[158,164,104]],[1.6,[166,138,92]],[2.6,[138,110,86]],[3.8,[128,118,112]],[5,[206,206,210]],[7,[255,255,255]]];function jy(i,t,e,n){if(t<=i[0][0]){let s=i[0][1];e[n]=s[0],e[n+1]=s[1],e[n+2]=s[2];return}for(let s=1;s<i.length;s++){if(t>i[s][0]&&s<i.length-1)continue;let r=i[s-1][0],o=i[s-1][1],a=i[s][0],c=i[s][1],l=Math.min(1,Math.max(0,(t-r)/(a-r)));e[n]=o[0]+(c[0]-o[0])*l,e[n+1]=o[1]+(c[1]-o[1])*l,e[n+2]=o[2]+(c[2]-o[2])*l;return}}function al(i,t=[0,0,0],e=0){return jy(i<0?Yy:$y,i,t,e),t}var Ky={topographic:{sea:[[-5,[113,171,216]],[-4,[121,178,222]],[-3,[132,185,227]],[-2,[141,193,234]],[-1.5,[150,201,240]],[-1,[161,210,247]],[-.5,[172,219,251]],[-.2,[185,227,255]],[-.05,[198,236,255]],[0,[216,242,254]]],land:[[0,[172,208,165]],[.05,[148,191,139]],[.1,[168,198,143]],[.2,[189,204,150]],[.3,[209,215,171]],[.4,[225,228,181]],[.5,[239,235,192]],[.6,[232,225,182]],[.7,[222,214,163]],[.8,[211,202,157]],[.9,[202,185,130]],[1,[195,167,107]],[1.2,[185,152,90]],[1.4,[170,135,83]],[1.6,[172,154,124]],[1.8,[186,174,154]],[2,[202,195,184]],[2.5,[224,222,216]],[3,[245,244,242]]]},natural:{sea:[[-7,[22,44,78]],[-4.5,[36,68,108]],[-2.5,[52,92,132]],[-.8,[80,124,158]],[-.1,[118,160,184]],[0,[138,176,196]]],land:[[0,[112,145,95]],[.2,[132,160,104]],[.6,[168,172,122]],[1.2,[190,178,140]],[2,[178,160,132]],[3,[162,152,142]],[4.2,[204,202,200]],[5.5,[242,242,244]]]},swiss:{sea:[[-7,[30,58,92]],[-4,[48,86,122]],[-2,[72,114,146]],[-.5,[110,150,172]],[0,[150,184,196]]],land:[[0,[112,146,124]],[.3,[142,168,128]],[.8,[184,190,140]],[1.5,[214,206,156]],[2.5,[232,222,180]],[3.5,[243,237,212]],[5,[252,250,244]]]},satellite:{sea:[[-7,[5,12,34]],[-4,[8,22,56]],[-2,[12,36,82]],[-.5,[22,62,112]],[-.1,[40,98,138]],[0,[58,122,150]]],land:[[0,[58,86,46]],[.3,[74,96,54]],[.8,[108,104,72]],[1.6,[132,114,88]],[2.8,[122,110,98]],[4,[172,170,168]],[5.2,[236,236,240]]]},school:{sea:[[-7,[18,50,120]],[-4,[30,80,160]],[-2,[60,120,190]],[-.2,[130,180,225]],[0,[170,210,240]]],land:[[0,[86,146,68]],[.2,[140,190,100]],[.5,[230,222,140]],[1,[226,176,92]],[2,[186,114,62]],[3,[140,72,52]],[4,[150,112,142]],[5.5,[242,240,250]]]},etopo:{sea:[[-11,[10,0,121]],[-8,[0,14,203]],[-6,[0,47,229]],[-4,[0,81,255]],[-2,[0,115,255]],[-1,[0,132,255]],[-.5,[0,141,255]],[-.2,[26,159,255]],[0,[141,212,255]]],land:[[0,[51,102,0]],[.05,[51,204,102]],[.2,[187,228,146]],[.5,[255,220,185]],[1,[243,202,137]],[1.5,[230,184,88]],[2,[217,166,39]],[2.5,[168,154,31]],[3,[164,144,25]],[4,[159,123,13]],[5,[153,102,0]],[5.5,[162,89,89]],[6,[178,118,118]],[7,[194,176,176]],[8,[229,229,229]]]},dem:{sea:[[-7,[20,40,90]],[-3,[40,80,140]],[-.5,[80,130,180]],[0,[120,170,210]]],land:[[0,[0,97,71]],[.05,[16,122,47]],[.5,[232,215,125]],[1.2,[161,67,0]],[1.8,[158,0,0]],[2.8,[110,110,110]],[4,[255,255,255]]]},scientific:{sea:[[-6,[51,51,153]],[-3,[26,102,204]],[0,[0,153,255]]],land:[[0,[0,204,102]],[1.5,[255,255,153]],[3.5,[128,92,84]],[6,[255,255,255]]]},grey:{sea:[[-7,[90,100,115]],[-2,[130,140,155]],[0,[170,178,190]]],land:[[0,[215,215,210]],[2,[200,200,196]],[5,[235,235,235]]]},arid:{sea:[[-7,[8,40,52]],[-3,[14,70,82]],[-.5,[40,120,122]],[0,[80,160,150]]],land:[[0,[204,170,118]],[.4,[196,150,98]],[1,[182,118,70]],[2,[156,86,52]],[3.5,[118,64,44]],[5,[160,120,100]],[6.5,[236,222,206]]]},frozen:{sea:[[-7,[10,22,40]],[-3,[20,44,70]],[-.5,[50,86,110]],[0,[110,150,170]]],land:[[0,[152,150,128]],[.15,[196,202,204]],[.6,[222,228,234]],[2,[240,244,248]],[4,[253,254,255]]]},lush:{sea:[[-7,[6,30,80]],[-3,[10,60,120]],[-.8,[20,120,160]],[-.1,[50,190,190]],[0,[90,215,200]]],land:[[0,[26,110,50]],[.3,[44,140,58]],[.9,[70,128,52]],[1.8,[96,110,70]],[2.8,[122,118,106]],[4,[190,190,188]],[5,[250,250,252]]]},alien:{sea:[[-7,[4,40,40]],[-3,[6,80,74]],[-.5,[20,140,120]],[0,[60,190,160]]],land:[[0,[96,48,120]],[.3,[126,62,140]],[.9,[168,88,150]],[1.8,[206,128,120]],[3,[222,170,130]],[4.5,[240,220,230]],[6,[250,244,255]]]},volcanic:{sea:[[-7,[10,16,20]],[-3,[18,32,38]],[-.5,[34,58,62]],[0,[60,86,84]]],land:[[0,[46,44,42]],[.5,[62,58,54]],[1.5,[84,74,66]],[2.5,[112,80,62]],[3.5,[150,70,40]],[5,[190,90,50]],[6.5,[230,200,180]]]},antique:{sea:[[-6,[112,142,140]],[-3,[136,164,158]],[-1,[160,184,172]],[-.1,[184,202,184]],[0,[198,212,190]]],land:[[0,[226,208,166]],[.4,[214,192,146]],[1,[198,172,124]],[2,[178,148,104]],[3.2,[152,122,86]],[4.5,[128,102,74]],[6,[110,88,66]]]}},Qo=-12e3,ta=10,Mr=2201,hl=-Qo/ta,cl=new Map,fd=.75,Zy=[[-5.5,1],[-5,1],[-4.5,1],[-4,1],[-3.5,1],[-3,1],[-2,1],[-1,.5],[-.5,.5],[-.2,.5]],Jy=[[.05,1],[.15,1],[.3,1],[.5,1],[.8,1],[1.2,1],[1.8,1],[2.5,1],[3.5,.5],[5,.5]],Jo=i=>(i/=255,i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4)),Qy=i=>255*(i<=.0031308?12.92*i:1.055*Math.pow(Math.max(0,i),1/2.4)-.055),gd=i=>.2126*i[0]+.7152*i[1]+.0722*i[2],t1=i=>{let t=gd(i);return Math.hypot(i[0]-t,i[1]-t,i[2]-t)};function pd(i,t){let e=0,n=0,s=0;for(let[r,o]of t){let a=i(r).map(Jo);e+=o*gd(a),n+=o*t1(a),s+=o}return{L:e/s,C:n/s}}function md(i,t){let e=pd(o=>al(o,[0,0,0]),t),n=pd(o=>{let a=[0,0,0];return _d(i,o,a,0),a},t),s=Math.min(1,Math.pow(e.L/n.L,fd)),r=Math.min(1,Math.pow(e.C/(s*n.C),fd));return{exposure:s,saturation:r}}function e1([i,t,e]){let n=Math.cbrt(.4122214708*i+.5363325363*t+.0514459929*e),s=Math.cbrt(.2119034982*i+.6806995451*t+.1073969566*e),r=Math.cbrt(.0883024619*i+.2817188376*t+.6299787005*e);return[.2104542553*n+.793617785*s-.0040720468*r,1.9779984951*n-2.428592205*s+.4505937099*r,.0259040371*n+.7827717662*s-.808675766*r]}function n1([i,t,e]){let n=(i+.3963377774*t+.2158037573*e)**3,s=(i-.1055613458*t-.0638541728*e)**3,r=(i-.0894841775*t-1.291485548*e)**3;return[4.0767416621*n-3.3077115913*s+.2309699292*r,-1.2684380046*n+2.6097574011*s-.3413193965*r,-.0041960863*n-.7034186147*s+1.707614701*r]}function i1(i,t,{exposure:e,saturation:n}){let[s,r,o]=e1([Jo(i[t]),Jo(i[t+1]),Jo(i[t+2])].map(c=>c*e)),a=n1([s,n*r,n*o]);for(let c=0;c<3;c++)i[t+c]=Math.min(255,Math.max(0,Qy(a[c])))}function _d(i,t,e,n){if(t<=i[0][0]){e[n]=i[0][1][0],e[n+1]=i[0][1][1],e[n+2]=i[0][1][2];return}for(let s=1;s<i.length;s++){if(t>i[s][0]&&s<i.length-1)continue;let[r,o]=i[s-1],[a,c]=i[s],l=Math.min(1,Math.max(0,(t-r)/(a-r)));for(let h=0;h<3;h++)e[n+h]=o[h]+(c[h]-o[h])*l;return}}function s1(i){if(!cl.has(i)){let t=Ky[i],e=new Float32Array(3*Mr),n=md(t.sea,Zy),s=md(t.land,Jy);for(let r=0;r<Mr;r++){let o=(Qo+r*ta)/1e3;_d(r<hl?t.sea:t.land,o,e,3*r),i1(e,3*r,r<hl?n:s)}cl.set(i,e)}return cl.get(i)}var ll=new Map;function xd(i){if(!ll.has(i)){let t;if(i==="relief"||i==="heightmap"){t=new Float32Array(3*Mr);let e=[0,0,0];for(let n=0;n<Mr;n++){let s=(Qo+n*ta)/1e3;if(i==="relief")al(s,e);else{let r=s<=0?0:Math.round(255*Math.min(1,s/6));e[0]=e[1]=e[2]=r}t[3*n]=e[0],t[3*n+1]=e[1],t[3*n+2]=e[2]}}else t=s1(i);ll.set(i,{rgb:t,minM:Qo,stepM:ta,n:Mr,zero:hl,shaded:i!=="heightmap"})}return ll.get(i)}var _M={[vr.OCEAN]:"Oceanic crust",[vr.CONTINENT]:"Continental crust",[vr.CRATON]:"Craton",[vr.ARC]:"Island-arc crust"},xM={[$n.ANDEAN]:"Andean range",[$n.LARAMIDE]:"Flat-slab range",[$n.URAL]:"Collision belt",[$n.HIMALAYAN]:"Great collision belt",[$n.ARC]:"Volcanic arc",[$n.RIFT]:"Rift shoulder",[$n.TRANSPRESSION]:"Transform ridge",[$n.INTRAPLATE]:"Intraplate range"};var yd="orogen.terrain.palette",r1=i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4,ul=new Map;function o1(i){if(!ul.has(i)){let t=xd(i),e=new Float32Array(t.rgb.length);for(let n=0;n<e.length;n++)e[n]=r1(t.rgb[n]/255);ul.set(i,{...t,rgb:e})}return ul.get(i)}function Bi(){if(y.palette==="classic")return Ds;let i=o1(y.palette),{rgb:t,minM:e,stepM:n,n:s,zero:r}=i;return o=>{let a=Nn(o)*1e3,c=Math.round((a-e)/n),l=3*(a<0?Math.max(0,Math.min(r-1,c)):Math.min(s-1,Math.max(r,c)));return[t[l],t[l+1],t[l+2]]}}function vd(i){let t=y.palette==="classic"?Ds(i):Bi()(i).map(e=>e<=.0031308?12.92*e:1.055*e**.4166666666666667-.055);return`rgb(${Math.round(t[0]*255)},${Math.round(t[1]*255)},${Math.round(t[2]*255)})`}function Md(i){let t=document.getElementById("palette");if(!t)return;let e=null;try{e=localStorage.getItem(yd)}catch{}e&&[...t.options].some(n=>n.value===e)&&(y.palette=e),t.value=y.palette,t.addEventListener("change",()=>{y.palette=t.value;try{localStorage.setItem(yd,y.palette)}catch{}i()})}dl();var a1=Object.freeze({WIND_ITCZ_LAND_BOOST_MAX:.5817,WIND_ITCZ_ANCHOR_FACTOR:.3285,WIND_ITCZ_CLAMP_DEG:20.2698,WIND_ITCZ_LOW_DEPTH_HPA:8.3369,WIND_ITCZ_LOW_WIDTH_DEG:8.8036,WIND_SUBTROP_HIGH_LAT_DEG:31.268,WIND_SUBTROP_SEASONAL_SHIFT_DEG:8.0069,WIND_SUBTROP_HIGH_STRENGTH_HPA:11.891,WIND_SUBTROP_HIGH_WIDTH_DEG:13.652,WIND_SUBTROP_LAND_WEAKENING:.3431,WIND_SUBPOLAR_LOW_DEPTH_HPA:12.1468,WIND_SUBPOLAR_LOW_LAT_DEG:54.5814,WIND_SUBPOLAR_LOW_WIDTH_DEG:5.217,WIND_POLAR_HIGH_STRENGTH_HPA:3.6409,WIND_SUMMER_THERMAL_LOW_HPA:15.4478,WIND_WINTER_THERMAL_HIGH_HPA:17.6062,WIND_CONT_RANGE_KM:2476.1541,WIND_GEOSTROPHIC_MAX_ANGLE_DEG:68.4344,WIND_FRICTION_BACK_ANGLE_DEG:19.8948,TEMP_PEAK_C:27.7866,TEMP_POLEWARD_RANGE_C:48.0373,TEMP_POLEWARD_EXP:1.593,TEMP_TROPICAL_PLATEAU_DEG:12.3597,TEMP_MOIST_LAPSE_C_PER_KM:3.5,TEMP_DRY_LAPSE_EXTRA_C_PER_KM:3.4114,TEMP_OCEAN_WARMTH_DIFFUSE_KM:443.6723,TEMP_SST_CURRENT_SHIFT_C:8.8086,TEMP_COASTAL_WARMTH_SHIFT_C:17.9628,TEMP_SWING_SCALE:1.0723,TEMP_EXTRA_SWING_FACTOR:.8005,TEMP_SWING_WINTER_SHARE:.7055,TEMP_CONT_WINTER_COOL_C:12.6435,TEMP_WINTER_COOL_WEST_RELIEF:.6,TEMP_OCEANIC_WARMING_MAX_C:2,TEMP_CLOUD_MOD_STRENGTH:.05,TEMP_CLEARSKY_AMP_STRENGTH:.2745,PRECIP_OCEAN_MOISTURE_BASE:.4508,PRECIP_ADVECT_FLAT_SURVIVAL:.8901,PRECIP_ADVECT_REACH_KM:3961.314,PRECIP_ELEV_DEPLETION_PER_KM:.9906,PRECIP_ITCZ_WIDTH_DEG:17.6788,PRECIP_ITCZ_CORE_BOOST:1,PRECIP_ITCZ_ADDITIVE:.4727,PRECIP_CONV_MULT_BOOST:.9443,PRECIP_CONV_ADD_FRAC:.3532,PRECIP_COLD_CURRENT_SUPPRESS:.3606,PRECIP_WARM_CURRENT_BOOST:.0267,PRECIP_ORO_UPLIFT_ADD:1.013,PRECIP_ORO_SHADOW_MAX_SUPPRESS:.9186,PRECIP_RS_SHADOW_PROP_KM:3363.1799,PRECIP_RS_APPLY_STRENGTH_SCALE:2.4002,PRECIP_RS_APPLY_MAX_SUPPRESS:.9782,PRECIP_RS_APPLY_WINDWARD_ADD:1.7675,PRECIP_SUBTROP_CENTER_SUMMER_DEG:37.738,PRECIP_SUBTROP_CENTER_WINTER_DEG:24.5392,PRECIP_SUBTROP_WIDTH_SUMMER_DEG:8,PRECIP_SUBTROP_WIDTH_WINTER_DEG:15.8227,PRECIP_SUBTROP_PEAK_SUMMER:.4777,PRECIP_SUBTROP_PEAK_WINTER:.5,PRECIP_MONSOON_RELIEF_MAX:.8247,PRECIP_MONSOON_ADD:.0325,PRECIP_SUBTROP_EAST_RELIEF:.5,PRECIP_MONSOON_REACH_DEG:25.19,PRECIP_POLAR_BASE_ADD:.25,PRECIP_POLAR_COASTAL_ADD:.203,PRECIP_CONT_DRYNESS:.8,PRECIP_COAST_CUTOFF_START_KM:2060.0355,PRECIP_COAST_CUTOFF_END_KM:3161.3364,PRECIP_MODEL_BLEND:.3433,PRECIP_CONT_CAP_FADE_START:.6231,PRECIP_CONT_CAP_MAX_REDUCTION:.884,PRECIP_SEASON_CONTRAST:1.7754,HEUR_ZONAL_TRADE_VALUE:.363,HEUR_ZONAL_DESERT_MIN:.0715,HEUR_ZONAL_DESERT_END_DEG:22,HEUR_ZONAL_DRY_POLEWARD_DEG:28,HEUR_ZONAL_WESTERLY_PEAK:.516,HEUR_ZONAL_WESTERLY_PEAK_DEG:47.515,HEUR_ZONAL_POLAR_MIN:.1381,KOPPEN_PRECIP_SCALE_MM:838.5683,KOPPEN_ARIDITY_SCALE:1.0079,KOPPEN_EAST_COAST_WET:2,KOPPEN_SHOULDER_FRAC:2.4,KOPPEN_DRIEST_FRAC_BASE:.8,KOPPEN_DRIEST_FRAC_DROP:.15,KOPPEN_S_SUMMER_MAX_MM:74.9679,KOPPEN_S_RATIO:1.8019,KOPPEN_W_RATIO:3.5062,KOPPEN_AF_DRY_MIN_MM:74.7163,HEUR_ITCZ_SHIFT_DAMPEN:.2688,HEUR_SEASON_SUMMER_MOD:1.1377,HEUR_SEASON_WINTER_MOD:.8506,HEUR_MED_SUPPRESS_BASE:.0699,HEUR_MED_WESTCOAST_BONUS:.1403,HEUR_CONT_DRYNESS:.7586,HEUR_ORO_UPLIFT_MAX:.8841,HEUR_ORO_SHADOW_MAX:.8685}),bd={...a1};yr();var IM=Math.PI/180,DM=180/Math.PI;var un=[{code:"Ocean",name:"Ocean",color:[.29,.44,.65]},{code:"Af",name:"Tropical rainforest",color:[0,0,1]},{code:"Am",name:"Tropical monsoon",color:[0,.47,1]},{code:"Aw",name:"Tropical savanna",color:[.27,.67,.98]},{code:"BWh",name:"Hot desert",color:[1,0,0]},{code:"BWk",name:"Cold desert",color:[1,.59,.59]},{code:"BSh",name:"Hot steppe",color:[.96,.65,0]},{code:"BSk",name:"Cold steppe",color:[1,.86,.39]},{code:"Cfa",name:"Humid subtropical",color:[.78,1,.31]},{code:"Cfb",name:"Oceanic",color:[.39,1,.31]},{code:"Cfc",name:"Subpolar oceanic",color:[.2,.78,0]},{code:"Csa",name:"Hot-summer Mediterranean",color:[1,1,0]},{code:"Csb",name:"Warm-summer Mediterranean",color:[.78,.78,0]},{code:"Csc",name:"Cold-summer Mediterranean",color:[.59,.59,0]},{code:"Cwa",name:"Humid subtropical (monsoon)",color:[.59,1,.59]},{code:"Cwb",name:"Subtropical highland",color:[.39,.78,.39]},{code:"Cwc",name:"Cold subtropical highland",color:[.2,.59,.2]},{code:"Dfa",name:"Hot-summer continental",color:[0,1,1]},{code:"Dfb",name:"Warm-summer continental",color:[.22,.78,1]},{code:"Dfc",name:"Subarctic",color:[0,.49,.49]},{code:"Dfd",name:"Extremely cold subarctic",color:[0,.27,.37]},{code:"Dsa",name:"Hot-summer continental (dry summer)",color:[.9,.5,1]},{code:"Dsb",name:"Warm-summer continental (dry summer)",color:[.7,.35,.85]},{code:"Dsc",name:"Subarctic (dry summer)",color:[.5,.2,.65]},{code:"Dsd",name:"Extremely cold subarctic (dry summer)",color:[.35,.1,.45]},{code:"Dwa",name:"Hot-summer continental (monsoon)",color:[.67,.69,1]},{code:"Dwb",name:"Warm-summer continental (monsoon)",color:[.43,.47,.78]},{code:"Dwc",name:"Subarctic (monsoon)",color:[.29,.31,.78]},{code:"Dwd",name:"Extremely cold subarctic (monsoon)",color:[.2,0,.53]},{code:"ET",name:"Tundra",color:[.7,.7,.7]},{code:"EF",name:"Ice cap",color:[.41,.41,.41]}],c1={};un.forEach((i,t)=>{c1[i.code]=t});Sd();wd();var Ed=1,Fs=[{name:"rainforest",codes:["Af","Am"],summer:{low:[[36,98,40],[62,108,52]],tree:[2.6,3.6],snow:[4.6,5.4],rip:0},winter:{low:[[40,98,42],[66,106,54]],tree:[2.6,3.6],snow:[4.6,5.4],rip:0}},{name:"savanna",codes:["Aw","As"],summer:{low:[[112,146,62],[130,136,74]],tree:[2.2,3.2],snow:[4.4,5.2],rip:.3},winter:{low:[[170,162,88],[158,142,86]],tree:[2.2,3.2],snow:[4.4,5.2],rip:.8}},{name:"desert",codes:["BWh","BWk"],summer:{low:[[230,204,150],[202,156,104]],tree:[1,2.2],snow:[4.6,5.6],rip:1},winter:{low:[[226,200,148],[198,152,102]],tree:[1,2.2],snow:[3.6,4.6],rip:1}},{name:"steppe",codes:["BSh","BSk"],summer:{low:[[168,172,102],[162,148,98]],tree:[1.6,2.6],snow:[4,5],rip:.8},winter:{low:[[198,180,130],[176,154,110]],tree:[1.6,2.6],snow:[3,4],rip:.6}},{name:"mediterranean",codes:["Csa","Csb","Csc"],summer:{low:[[178,162,98],[150,138,92]],tree:[1.6,2.6],snow:[3.4,4.2],rip:.8},winter:{low:[[116,146,76],[116,124,84]],tree:[1.6,2.6],snow:[2.4,3.2],rip:.3}},{name:"temperate",codes:["Cfa","Cfb","Cfc","Cwa","Cwb","Cwc"],summer:{low:[[84,140,60],[94,122,68]],tree:[1.6,2.6],snow:[3,3.8],rip:.25},winter:{low:[[118,126,84],[116,114,88]],tree:[1.6,2.6],snow:[2,2.8],rip:.3}},{name:"continental",codes:["Dfa","Dfb","Dwa","Dwb","Dsa","Dsb"],summer:{low:[[86,130,62],[98,112,78]],tree:[1.4,2.2],snow:[2.6,3.2],rip:.3},winter:{low:[[128,122,100],[130,124,108]],tree:[1.2,2],snow:[1.4,2],rip:0}},{name:"taiga",codes:["Dfc","Dfd","Dwc","Dwd","Dsc","Dsd"],summer:{low:[[56,96,62],[80,100,80]],tree:[1,1.8],snow:[2,2.6],rip:.15},winter:{low:[[74,92,80],[96,104,96]],tree:[.8,1.4],snow:[1,1.6],rip:0}},{name:"tundra",codes:["ET"],summer:{low:[[108,130,90],[132,138,116]],tree:[.5,1.2],snow:[1.2,1.8],rip:.2},winter:{low:[[160,166,150],[186,190,180]],tree:[.4,1],snow:[.4,1],rip:0}},{name:"ice",codes:["EF"],summer:{low:[[226,232,240],[238,242,248]],tree:[9,9.5],snow:[9,9.5],rip:0},winter:{low:[[232,236,244],[242,245,250]],tree:[9,9.5],snow:[9,9.5],rip:0}}],l1=[84,74,72],h1=[134,130,128],Ad=.25,Cd=[244,244,248];var u1=60,d1=25,f1=70,p1=400;var pl=[13,8],ml=[1,-6],Sr=Fs.length,Td=fl.map(i=>Fs.findIndex(t=>t.codes.includes(i.code))),ia=i=>Fs.findIndex(t=>t.name===i),m1=ia("tundra"),br=ia("ice"),g1=new Set([ia("desert"),ia("steppe")]),qM=Float32Array.from({length:256},(i,t)=>{let e=t/255;return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}),sa=4096,_1=Float32Array.from({length:sa+1},(i,t)=>{let e=t/sa;return 255*(e<=.0031308?12.92*e:1.055*e**(1/2.4)-.055)});var x1=i=>_1[Math.max(0,Math.min(sa,Math.round(i*sa)))],Ns=i=>i.map(t=>{let e=t/255;return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}),jn=(i,t,e)=>{if(i===t)return e<i?0:1;let n=Math.max(0,Math.min(1,(e-i)/(t-i)));return n*n*(3-2*n)},_l=.025,y1=7,Os=Math.round(y1/_l)+1,ki=new Float32Array(Sr*2*Os*3),v1=new Float32Array(Sr*2);{let i=Ns(l1),t=Ns(h1),e=Ns(Cd);Fs.forEach((n,s)=>[n.summer,n.winter].forEach((r,o)=>{v1[s*2+o]=r.rip;let a=Ns(r.low[0]),c=Ns(r.low[1]);for(let l=0;l<Os;l++){let h=l*_l,u=((s*2+o)*Os+l)*3,d=jn(0,Ed,h),p=1-.12*jn(Ed,r.tree[0],h),g=jn(r.tree[0],r.tree[1],h),_=jn(r.tree[0],r.snow[0],h),m=jn(r.snow[0],r.snow[1],h);for(let f=0;f<3;f++){let v=(a[f]+(c[f]-a[f])*d)*p,x=(i[f]+(t[f]-i[f])*_)*(1-Ad)+v*Ad,S=v+(x-v)*g;ki[u+f]=S+(e[f]-S)*m}}}))}function M1(i,t){if(t==="year")return .5;let e=Math.min(1,Math.abs(i)/d1),n=Math.sign(i)*e*e*(3-2*e);return .5+.5*(t==="jul"?n:-n)}function na(i,t){let e=i*374761393+t*668265263|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function b1(i,t,e){let n=Math.floor(i),s=Math.floor(t),r=i-n,o=t-s,a=r*r*(3-2*r),c=o*o*(3-2*o),l=(n%e+e)%e,h=(l+1)%e,u=na(l,s),d=na(h,s),p=na(l,s+1),g=na(h,s+1);return u+(d-u)*a+(p-u)*c+(u-d-p+g)*a*c}function Rd(i,t,e,n=4){let s=0,r=.5,o=0;for(let a=0;a<n;a++,r*=.5){let c=2**a;s+=r*b1(i*c,t*c,e*c),o+=r}return s/o}function S1(i,t,e,n,s=2){let r=new Float32Array(Math.max(t,e));for(let o=0;o<s;o++){for(let a=0;a<e;a++){let c=a*t,l=0;for(let h=-n;h<=n;h++)l+=i[c+(h%t+t)%t];for(let h=0;h<t;h++)r[h]=l/(2*n+1),l+=i[c+(h+n+1)%t]-i[c+((h-n)%t+t)%t];for(let h=0;h<t;h++)i[c+h]=r[h]}for(let a=0;a<t;a++){let c=0,l=0;for(let h=0;h<=n&&h<e;h++)c+=i[h*t+a],l++;for(let h=0;h<e;h++){r[h]=c/l;let u=h+n+1,d=h-n;u<e&&(c+=i[u*t+a],l++),d>=0&&(c-=i[d*t+a],l--)}for(let h=0;h<e;h++)i[h*t+a]=r[h]}}}var w1=1024,Us=null;function Pd(i){let{n:t,xyz:e,lat:n,lon:s,elevKm:r,koppen:o,tAnnual:a,tRange:c,season:l,snowAt:h,iceSheetAt:u}=i;Us??=new i.FastNoise(4243);let d=w1,p=d/2,g=d*p,_=new Float32Array(Sr*g),m=new Int32Array(t);for(let M=0;M<t;M++){let b=o[M];if(m[M]=-1,!b)continue;let D=Td[b];if(D<0||D===br)continue;let O=Math.min(d-1,Math.floor((s[M]+180)/360*d)),k=Math.min(p-1,Math.floor((90-n[M])/180*p)),A=k*d+O;m[M]=A;let C=0;if(g1.has(D)){let R=a[M],N=c[M],F=R+(N===N?N/2:8);R===R&&(C=jn(0,1,Math.max((pl[0]-F)/(pl[0]-pl[1]),(ml[0]-R)/(ml[0]-ml[1]))))}_[D*g+A]+=1-C,C>0&&(_[m1*g+A]+=C)}let f=2*Math.PI*6371/d,v=Math.max(1,Math.round(u1/f/2));for(let M=0;M<Sr;M++)M!==br&&S1(_.subarray(M*g,(M+1)*g),d,p,v);let x=new Float32Array(3*t),S=[0,0,0],P=Math.max(4,Math.round(2*Math.PI*6371/p1)),E=f1/f,L=6371/300,V=6371/60;for(let M=0;M<t;M++){let b=o[M];if(!b)continue;let D=Td[b],O=r(M),k=Math.min(Os-1,Math.round((O>0?O:0)/_l)),A=M1(n[M],l),C=1-A;S[0]=S[1]=S[2]=0;let R=0,N=(W,Z)=>{let nt=(W*2*Os+k)*3,et=nt+Os*3;S[0]+=Z*(A*ki[nt]+C*ki[et]),S[1]+=Z*(A*ki[nt+1]+C*ki[et+1]),S[2]+=Z*(A*ki[nt+2]+C*ki[et+2])};if(D===br)N(br,1),R=1;else{let W=(s[M]+180)/360*P,Z=(90-n[M])/180*P/2,nt=(s[M]+180)/360*d-.5+E*2*(Rd(W,Z,P)-.5),et=Math.max(0,Math.min(p-1.001,(90-n[M])/180*p-.5+E*2*(Rd(W+17.3,Z+9.1,P)-.5))),mt=Math.floor(nt),St=Math.floor(et),ot=nt-mt,vt=et-St,q=St*d+(mt%d+d)%d,Pt=St*d+((mt+1)%d+d)%d,at=q+d,Mt=Pt+d;for(let pt=0;pt<Sr;pt++){if(pt===br)continue;let Rt=pt*g,bt=(1-ot)*(1-vt)*_[Rt+q]+ot*(1-vt)*_[Rt+Pt]+(1-ot)*vt*_[Rt+at]+ot*vt*_[Rt+Mt];bt>1e-6&&(N(pt,bt),R+=bt)}R<1e-6&&(N(Math.max(0,D),1),R=1)}let F=e[3*M],z=e[3*M+1],B=e[3*M+2],X=1+.06*Us.fbm(L*F,L*z,L*B,3,.5)+.04*Us.noise3D(V*F+3.3,V*z-1.7,V*B+5.9),K=Math.max(jn(.3,.85,h(M)),jn(.2,.6,u(M))),H=[gl[0],gl[1],gl[2]];for(let W=0;W<3;W++){let Z=S[W]/R*X;Z+=(H[W]-Z)*K,x[3*M+W]=x1(Math.min(1,Math.max(0,Z)))/255}}return x}var gl=Ns(Cd);function Ld(i,t,e,n,s){if(!(i>.04))return 0;if(i>.96)return 1;Us??=new s(4243);let r=6371/160,o=6371/30,a=.7*Us.fbm(r*t,r*e,r*n,3,.5)+.3*Us.noise3D(o*t+5.1,o*e-2.7,o*n+8.3);return jn(.47,.53,i+.42*a)}var Kn={temperature:{unit:"\xB0C",stops:[[-40,[42,11,94]],[-25,[49,54,149]],[-10,[69,117,180]],[0,[224,243,248]],[10,[254,224,144]],[20,[253,174,97]],[30,[215,48,39]],[40,[103,0,31]]]},rain:{unit:"mm/month",log:!0,stops:[[0,[246,236,212]],[10,[228,214,150]],[30,[180,210,110]],[60,[92,176,96]],[120,[33,128,120]],[250,[30,90,170]],[500,[20,30,110]]]},pressure:{unit:"hPa",stops:[[990,[33,102,172]],[1002,[146,197,222]],[1012,[247,247,247]],[1022,[244,165,130]],[1034,[178,24,43]]]},oceanAnom:{unit:"\xB0C vs latitude average",stops:[[-6,[33,102,172]],[-2,[146,197,222]],[0,[247,247,247]],[2,[244,165,130]],[6,[178,24,43]]]},oceanWarmthV1:{unit:"V1 warmth (\u22121 cold \u2026 +1 warm)",stops:[[-1,[33,102,172]],[-.35,[146,197,222]],[0,[247,247,247]],[.35,[244,165,130]],[1,[178,24,43]]]},swing:{unit:"\xB0C, warmest minus coldest month",stops:[[0,[240,244,250]],[5,[198,219,239]],[10,[120,190,200]],[20,[240,200,90]],[30,[230,120,50]],[45,[150,30,40]],[60,[70,0,30]]]},swingDiff:{unit:"\xB0C (model \u2212 observed swing)",stops:[[-20,[5,48,97]],[-8,[67,147,195]],[-2,[209,229,240]],[0,[247,247,247]],[2,[253,219,199]],[8,[214,96,77]],[20,[103,0,31]]]},seaIce:{unit:"ice fraction",stops:[[0,[16,40,80]],[.15,[40,80,130]],[.5,[150,180,210]],[1,[250,252,255]]]},tempDiff:{unit:"\xB0C (V1 \u2212 observed)",stops:[[-12,[5,48,97]],[-6,[67,147,195]],[-2,[209,229,240]],[0,[247,247,247]],[2,[253,219,199]],[6,[214,96,77]],[12,[103,0,31]]]},rainRatio:{unit:"V1 \xF7 observed",log2:!0,stops:[[-3,[140,81,10]],[-1.5,[216,179,101]],[-.5,[246,232,195]],[0,[245,245,245]],[.5,[199,234,229]],[1.5,[90,180,172]],[3,[1,102,94]]]},pressureDiff:{unit:"hPa (V1 \u2212 observed)",stops:[[-15,[33,102,172]],[-5,[146,197,222]],[0,[247,247,247]],[5,[244,165,130]],[15,[178,24,43]]]}};function Id(i,t){let e=i.stops,n=i.log?r=>Math.log1p(Math.max(0,r)):r=>r,s=n(t);if(s<=n(e[0][0]))return e[0][1];for(let r=1;r<e.length;r++){let o=n(e[r][0]);if(s<=o){let a=n(e[r-1][0]),c=(s-a)/(o-a),l=e[r-1][1],h=e[r][1];return[l[0]+c*(h[0]-l[0]),l[1]+c*(h[1]-l[1]),l[2]+c*(h[2]-l[2])]}}return e[e.length-1][1]}var E1=[{id:"pressure",label:"Pressure",seasonal:!0,arrows:"wind",itcz:!0},{id:"wind",label:"Wind",seasonal:!0,arrows:"wind"},{id:"currents",label:"Ocean Currents",seasonal:!0,arrows:"currents"},{id:"upwelling",label:"Upwelling",seasonal:!0},{id:"ice",label:"Ice",seasonal:!0},{id:"temperature",label:"Temperature",seasonal:!0},{id:"precip",label:"Precipitation",seasonal:!0},{id:"tempRange",label:"Temperature Range",seasonal:!1},{id:"rainShadow",label:"Rain Shadow",seasonal:!0},{id:"aridity",label:"Aridity",seasonal:!1},{id:"growing",label:"Growing Season",seasonal:!1},{id:"rainSeason",label:"Rain Seasonality",seasonal:!1}],Ar=Object.fromEntries(E1.map(i=>[i.id,i])),Er={year:"Year",jan:"January",jul:"July"},zi=i=>Ar[i],Nd=i=>!!Ar[i]||i==="koppen"||i==="biome";function ks(i,t,e,n){let s=i.w,r=i.h,o=i.step,a=(n+180)/o-.5,c=Math.max(0,Math.min(r-1,(90-e)/o-.5)),l=Math.floor(a),h=Math.floor(c),u=a-l,d=c-h,p=(l%s+s)%s,g=(p+1)%s,_=Math.min(r-1,h+1);return(1-d)*((1-u)*t[h*s+p]+u*t[h*s+g])+d*((1-u)*t[_*s+p]+u*t[_*s+g])}function Tr(i){if(i._latlon&&i._latlon.n===i.r_xyz.length)return i._latlon;let t=i.r_xyz.length/3,e=new Float32Array(t),n=new Float32Array(t),s=180/Math.PI;for(let r=0;r<t;r++){let o=i.r_xyz[3*r],a=i.r_xyz[3*r+1],c=i.r_xyz[3*r+2];e[r]=Math.asin(Math.max(-1,Math.min(1,a)))*s,n[r]=Math.atan2(o,c)*s}return i._latlon={n:i.r_xyz.length,lat:e,lon:n}}function ca(i,t,e){let{lat:n,lon:s}=Tr(i);return ks(i.climate.grid,t,n[e],s[e])}var wr=[.06,.08,.22],Hi=[.42,.4,.36],oa=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e];function Rr(i){return t=>{if(t!==t)return Hi;if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0])return oa(i[e-1][1],i[e][1],(t-i[e-1][0])/(i[e][0]-i[e-1][0]));return i[i.length-1][1]}}var Od=i=>t=>{if(t!==t)return Hi;for(let[e,n]of i)if(t<e)return n;return i[i.length-1][1]},la=i=>t=>t===t?Id(i,t).map(e=>e/255):Hi,A1=la(Kn.temperature),T1=la(Kn.rain),Ud=la(Kn.pressure),Fd=[[0,[.95,.95,.95]],[3,[.6,.85,.9]],[7,[.2,.6,.75]],[11,[.35,.25,.7]],[16,[.45,.05,.4]]],Bd=Rr(Fd),R1=la(Kn.oceanAnom),kd=[[0,[.06,.1,.3]],[.1,[.1,.3,.55]],[.3,[.15,.65,.7]],[.8,[.55,.95,.7]],[2,[.95,1,.8]]],Hd=Rr(kd),zd=[[0,[.15,.3,.7]],[10,[.2,.65,.6]],[20,[.75,.8,.25]],[35,[.95,.5,.1]],[55,[.65,.05,.1]]],Gd=Rr(zd),xl=[[.05,[.55,.1,.05],"Hyper-arid"],[.2,[.9,.45,.15],"Arid"],[.5,[.95,.8,.3],"Semi-arid"],[.65,[.7,.8,.35],"Dry sub-humid"],[1,[.3,.65,.3],"Humid"],[1/0,[.1,.4,.45],"Very humid"]],Vd=Od(xl),Wd=[[0,[.8,.82,.86]],[2,[.65,.58,.45]],[5,[.75,.75,.3]],[8,[.35,.65,.25]],[12,[.05,.35,.15]]],Xd=Rr(Wd),qd=[[.2,[.15,.35,.7],"Very equable"],[.4,[.3,.6,.75],"Equable, a wetter season"],[.6,[.55,.75,.55],"Rather seasonal"],[.8,[.9,.8,.35],"Seasonal"],[1,[.95,.55,.2],"Markedly seasonal"],[1.2,[.85,.25,.15],"Most rain in \u2264 3 months"],[1/0,[.5,.05,.15],"Extreme"]],Yd=Od(qd),$d=[[-1.5,[.9,.2,.13]],[-.4,[.75,.5,.45]],[0,[.55,.55,.58]],[.4,[.45,.55,.8]],[1.5,[.15,.4,.95]]],C1=Rr($d),aa=[[.1,.2,.45],[.92,.95,1]],P1=[.97,.98,1],L1=[.84,.87,.92],jd=i=>oa(aa[0],aa[1],Math.max(0,Math.min(1,i))),I1={pressure:Ud,wind:Bd,upwelling:Hd,seaIce:jd,tRange:Gd,rainShadow:i=>C1(Math.log2(Math.max(.001,i))),aridity:Vd,growing:Xd,rainSeason:Yd};function Hs(i,t,e){let n=Ar[i],s=e?.climate;if(!n||!s)return null;let r=n.seasonal&&t in Er?t:"year",o=s.grid,a=s.cells,c=e.r_elevation,l=u=>!(c[u]>0),h=(u,d)=>ca(e,u,d);switch(i){case"temperature":return u=>A1(l(u)?h((o.Tsea??o.T)[r],u):a.t[r][u]);case"precip":return u=>T1(l(u)?h(o.P[r],u):a.p[r][u]);case"pressure":return u=>Ud(h(o.slp[r],u));case"wind":return u=>Bd(Math.hypot(h(o.u[r],u),h(o.v[r],u)));case"currents":return u=>l(u)?R1(h(o.sstAnom[r],u)):Hi;case"upwelling":return u=>l(u)?Hd(h(o.upwelling[r],u)):Hi;case"ice":return u=>l(u)?jd(h(o.seaIce[r],u)):oa(o.snow?oa(Hi,L1,Math.max(0,Math.min(1,h(o.snow[r],u)))):Hi,P1,Math.max(0,Math.min(1,h(o.iceSheet,u))));case"tempRange":return u=>l(u)?wr:Gd(a.tRange[u]);case"rainShadow":{let u=r==="year"?o.orographic:o.orographicSeasons[r];return d=>l(d)?wr:I1.rainShadow(h(u,d))}case"aridity":return u=>l(u)?wr:Vd(a.aridity[u]);case"growing":return u=>l(u)?wr:Xd(a.growing[u]);case"rainSeason":return u=>l(u)?wr:Yd(a.rainSeason[u])}return null}var Kd=i=>`rgb(${Math.round(i[0]*255)},${Math.round(i[1]*255)},${Math.round(i[2]*255)})`,Bs=(i,t,e,n)=>{let s=e-t;return`<div class="legend-gradient" style="background:linear-gradient(to right,${i.map(([r,o])=>`${Kd(o)} ${(100*(r-t)/s).toFixed(1)}%`).join(",")})"></div><div class="legend-labels">${n.map(r=>`<span>${r}</span>`).join("")}</div>`},ra=(i,t)=>{let e=i.stops,n=i.log?a=>Math.log1p(Math.max(0,a)):a=>a,s=n(e[0][0]),r=n(e[e.length-1][0])-s,o=a=>(100*(n(a)-s)/r).toFixed(1);return`<div class="legend-gradient" style="background:linear-gradient(to right,${e.map(([a,c])=>`rgb(${c.join(",")}) ${o(a)}%`).join(",")})"></div><div class="legend-labels" style="position:relative;display:block;height:1.5em">${t.map(([a,c],l)=>`<span style="position:absolute;left:${o(a)}%;transform:translateX(${l===0?0:l===t.length-1?-100:-50}%);white-space:nowrap">${c}</span>`).join("")}</div>`},Dd=i=>`<div class="legend-classes">${i.map(([,t,e])=>`<span><i style="background:${Kd(t)}"></i>${e}</span>`).join("")}</div>`,on=i=>`<div class="legend-note">${i}</div>`;function Zd(i,t){let e=Ar[i];if(!e)return"";let n=e.seasonal?` \xB7 ${Er[t]??"Year"}`:"";switch(i){case"temperature":return ra(Kn.temperature,[[-40,"\u221240"],[-20,"\u221220"],[0,"0"],[20,"20"],[40,"40 \xB0C"]])+on(`Air temperature, \xB0C${n} \u2014 over the sea, its surface`);case"precip":return ra(Kn.rain,t==="year"?[[0,"0"],[10,"120"],[60,"720"],[500,"6,000 mm/yr"]]:[[0,"0"],[10,"10"],[60,"60"],[500,"500 mm/month"]])+on(`Precipitation${n}`);case"pressure":return ra(Kn.pressure,[[990,"990"],[1012,"1012"],[1034,"1034 hPa"]])+on(`Sea-level pressure${n} \xB7 arrows: the wind \xB7 green line: the ITCZ`);case"wind":return Bs(Fd,0,16,["0","8","16 m/s"])+on(`Surface wind speed${n} \xB7 arrows: its direction`);case"currents":return ra(Kn.oceanAnom,[[-6,"\u22126"],[0,"0"],[6,"+6 \xB0C"]])+on(`The sea against its latitude\u2019s average${n} (warm and cold currents) \xB7 arrows: surface currents \u2014 seasonal in the tropics`);case"upwelling":return Bs(kd,0,2,["0","1","2 m/day"])+on(`Cold, nutrient-rich water rising where the wind pushes the surface away${n}`);case"ice":return Bs([[0,aa[0]],[1,aa[1]]],0,1,["Open sea","Sea ice"])+on(`Sea ice${n}; on land, snow${n} and the ice sheets`);case"tempRange":return Bs(zd,0,55,["0","20","40 \xB0C"])+on("Warmest month minus coldest \u2014 continentality: small by the sea, large deep inland");case"rainShadow":return Bs($d,-1.5,1.5,["Rain shadow","No effect","Windward"])+on(`How mountains move the rain${n}: wetter windward slopes, drier lands in their lee`);case"aridity":return Dd(xl)+on("UNEP aridity index: precipitation \xF7 potential evaporation");case"growing":return Bs(Wd,0,12,["0","6","12 months"])+on("Months warmer than 10 \xB0C \u2014 where forests and crops can grow");case"rainSeason":return Dd(qd)+on("Rain seasonality (Walsh & Lawler): how unevenly the rain falls through the year")}return""}var On=(i,t=0)=>i===i?(Math.round(i*10**t)/10**t).toLocaleString(void 0,{minimumFractionDigits:t,maximumFractionDigits:t}):"\u2014";function Jd(i,t){let e=i?.climate;if(!e)return[];let n=e.grid,s=e.cells,r=!(i.r_elevation[t]>0),o=[],a=c=>ca(i,c,t);if(r){let c=n.Tsea??n.T;o.push(`<span class="hi-label">SST</span> ${On(a(c.jan))}\xB0C Jan \xB7 ${On(a(c.jul))}\xB0C Jul`),Math.max(a(n.seaIce.jan),a(n.seaIce.jul))>.05&&o.push(`<span class="hi-label">Sea ice</span> ${On(100*a(n.seaIce.jan))}% Jan \xB7 ${On(100*a(n.seaIce.jul))}% Jul`)}else{o.push(`<span class="hi-label">Temp</span> ${On(s.t.jan[t])}\xB0C Jan \xB7 ${On(s.t.jul[t])}\xB0C Jul`),o.push(`<span class="hi-label">Precip</span> ${On(s.p.year[t]*12)} mm/yr \xB7 ${On(s.p.jan[t])} Jan \xB7 ${On(s.p.jul[t])} Jul`);let c=xl.find(([l])=>s.aridity[t]<l);c&&o.push(`<span class="hi-label">Aridity</span> ${c[2]} (${On(s.aridity[t],2)})`)}return o}function yl(i,t,e,n,s){let r=e in Er?e:"year",o=t==="wind"?i.u[r]:i.currentU[r],a=t==="wind"?i.v[r]:i.currentV[r];return[ks(i,o,n,s),ks(i,a,n,s)]}function Cr(i,t,e,n){let s=Ar[i]?.arrows;e(s==="wind"?t:null),n(s==="currents"?t:null)}function Qd(i){let t=Object.fromEntries(Fs.map(r=>[r.name,r])),e=[["desert","Desert"],["steppe","Steppe"],["savanna","Savanna"],["temperate","Forest"],["taiga","Taiga"],["tundra","Tundra"],["ice","Ice"]].map(([r,o])=>({c:t[r].summer.low[0],label:o})),n=e.map((r,o)=>`rgb(${r.c.join(",")}) ${Math.round(o/(e.length-1)*100)}%`).join(", "),s=i in Er&&i!=="year"?` in ${Er[i]}`:"";return`<div class="legend-gradient" style="background:linear-gradient(to right,${n})"></div><div class="legend-labels"><span>${e[0].label}</span><span>${e[3].label}</span><span>${e[6].label}</span></div>`+on(`Each climate's colours${s}, climbing with the land to rock and snow`)}function tf(i,t){let e=document.getElementById("climateSeason");e&&(e.value=i.climateSeason,e.addEventListener("change",()=>{i.climateSeason=e.value,t(e.value)}))}ef();te.localClippingEnabled=!0;var Sl=[new Ke(new Y(1,0,0),2),new Ke(new Y(-1,0,0),2)],vl=null,Ml=null;function wl(i,t,e){let n=y.curData,s=y.climateSeason||"year",r=[t,n?.climate,s,e];return vl&&Ml&&r.every((o,a)=>o===Ml[a])||(vl=sf(i,nf(i,t,e,n,s)),Ml=r),vl}var Gi=i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4;function nf(i,t,e,n,s){let r=i.numRegions,o=n?.climate;if(!o?.cells||!o.grid||!n.r_xyz||n.r_xyz.length!==3*r){let _=new Float32Array(r*3);for(let m=0;m<r;m++){let[f,v,x]=dd(t[m],e[m]);_[m*3]=f,_[m*3+1]=v,_[m*3+2]=x}return _}let a=new Float32Array(r*3),{lat:c,lon:l}=Tr(n),h=o.grid,u=s in{year:1,jan:1,jul:1}?s:"year",d=new Uint8Array(r);for(let _=0;_<r;_++)d[_]=e[_]>0?t[_]:0;let p=(_,m)=>ks(h,_,c[m],l[m]),g=Pd({n:r,xyz:n.r_xyz,lat:c,lon:l,elevKm:_=>Nn(e[_]),koppen:d,tAnnual:o.cells.t.year,tRange:o.cells.tRange,season:u,FastNoise:Pr,snowAt:h.snow?_=>p(h.snow[u],_):()=>0,iceSheetAt:h.iceSheet?_=>p(h.iceSheet,_):()=>0});for(let _=0;_<r;_++){if(d[_]){for(let v=0;v<3;v++)a[_*3+v]=Gi(g[_*3+v]);continue}let m=Ds(e[_]),f=h.seaIce?Ld(p(h.seaIce[u],_),n.r_xyz[3*_],n.r_xyz[3*_+1],n.r_xyz[3*_+2],Pr):0;for(let v=0;v<3;v++)a[_*3+v]=m[v]+(Gi(N1[v])-m[v])*f}return a}var N1=[214/255,223/255,230/255];function sf(i,t){let e=i.numRegions,n=new Float32Array(e*3),s=.35,{adjOffset:r,adjList:o}=i;for(let a=0;a<e;a++){let c=r[a],l=r[a+1],h=l-c;if(h===0){n[a*3]=t[a*3],n[a*3+1]=t[a*3+1],n[a*3+2]=t[a*3+2];continue}let u=0,d=0,p=0;for(let g=c;g<l;g++){let _=o[g];u+=t[_*3],d+=t[_*3+1],p+=t[_*3+2]}u/=h,d/=h,p/=h,n[a*3]=t[a*3]*(1-s)+u*s,n[a*3+1]=t[a*3+1]*(1-s)+d*s,n[a*3+2]=t[a*3+2]*(1-s)+p*s}return n}function zs(i){let t=Nn(i),e=Math.max(0,Math.min(1,(t+5)/11));return[e,e,e]}function Ir(i){if(i<=0)return[0,0,0];let t=Math.max(0,Math.min(1,Nn(i)/6));return[t,t,t]}var lb=(()=>{let i=new Uint32Array(256);for(let t=0;t<256;t++){let e=t;for(let n=0;n<8;n++)e=e&1?3988292384^e>>>1:e>>>1;i[t]=e}return i})();function O1(i,t,e){let n=Math.max(Math.abs(t),Math.abs(e))||1,s=Math.max(-1,Math.min(1,i/n));if(s<0){let r=-s;return[1-r*.7,1-r*.7,1]}else{let r=s;return[1,1-r*.75,1-r*.75]}}function El(i){return(un[i]||un[0]).color}var Lr=i=>[Gi(i[0]),Gi(i[1]),Gi(i[2])],bl=i=>i==="koppen"||i==="heightmap"||i==="landheightmap"||!!zi(i);/*cosmossi-hooks*/function rf(i){let m=rf$0(i);try{globalThis.__cosmossi&&globalThis.__cosmossi.material&&globalThis.__cosmossi.material(m)}catch(e){}return m}function rf$0(i){if(i)return new Xn({vertexColors:!0});let t=new Ho({vertexColors:!0});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal = normalize(position);")},t.userData.exact=!1,t}function Al({climateColor:i,isBiome:t,biomeSmoothed:e,isKoppen:n,koppenArr:s,dbgArr:r,dbgMin:o,dbgMax:a,showPlates:c,showStress:l,r_plate:h,r_stress:u,mountain_r:d,coastline_r:p,ocean_r:g,r_elevation:_,waterLevel:m,terrainColor:f}){return v=>{if(i)return Lr(i(v));if(t&&e)return[e[v*3],e[v*3+1],e[v*3+2]];if(n&&s)return Lr(El(s[v]));if(r)return O1(r[v],o,a);if(c){let x=y.plateColors[h[v]]||new Ut(.3,.3,.3);return[x.r,x.g,x.b]}if(l){let x=u?u[v]:0;return x>.5?[.9,.1+x*.3,.1]:x>.1?[.9,.5+x*.5,.2]:d.has(v)?[.8,.4,.1]:p.has(v)?[.9,.9,.2]:g.has(v)?[.1,.2,.7]:[.15,.15,.18]}return f(_[v]-m)}}function ha(i,t){let e=new Float32Array(3*i);for(let n=0;n<i;n++){let s=t(n);e[3*n]=s[0],e[3*n+1]=s[1],e[3*n+2]=s[2]}return e}function Tl(i,t,e,n){let s=new Float32Array(i.numTriangles),r=new Float32Array(i.numRegions);for(let o=0;o<s.length;o++)s[o]=Gi(t(e[o])[0]);for(let o=0;o<r.length;o++)r[o]=Gi(t(n[o])[0]);return{t:s,r}}function Rl(i,t){y.plateColors={};for(let e of i){let n=ea(e);if(t.has(e)){let s=.55+n()*.1,r=.4+n()*.3,o=.35+n()*.2;y.plateColors[e]=new Ut().setHSL(s,r,o)}else{let s=.25+n()*.15,r=.3+n()*.3,o=.3+n()*.2;y.plateColors[e]=new Ut().setHSL(s,r,o)}}}function ua(){if(y.mapMesh&&(Yt.remove(y.mapMesh),y.mapMesh.geometry.dispose(),y.mapMesh.material.dispose(),y.mapMesh=null),!y.curData||!y.mapMode)return;let{mesh:i,r_xyz:t,t_xyz:e,r_plate:n,r_elevation:s,t_elevation:r,mountain_r:o,coastline_r:a,ocean_r:c,r_stress:l,debugLayers:h}=y.curData,u=y.showPlates,d=!1,p=0,g=y.debugLayer||"",_=null,m=0,f=0,v=g==="heightmap",x=g==="landheightmap",S=Hs(g,y.climateSeason,y.curData),P=g==="koppen",E=g==="biome",L=P||E?h&&h.koppen:null;if(!v&&!x&&!S&&!P&&!E&&g&&h&&h[g]){_=h[g];for(let et=0;et<i.numRegions;et++)_[et]<m&&(m=_[et]),_[et]>f&&(f=_[et])}let{numSides:V}=i,M=Math.PI,b=y.mapCenterLon||0;function D(et){let mt=et-b;return mt>M?mt-=2*M:mt<-M&&(mt+=2*M),mt}let O=E&&L?wl(i,L,s):null,k=Bi(),A=v||x,C=A?Tl(i,x?Ir:zs,r,s):null,R=A?null:ha(i.numRegions,Al({climateColor:S,isBiome:E,biomeSmoothed:O,isKoppen:P,koppenArr:L,dbgArr:_,dbgMin:m,dbgMax:f,showPlates:u,showStress:d,r_plate:n,r_stress:l,mountain_r:o,coastline_r:a,ocean_r:c,r_elevation:s,waterLevel:p,terrainColor:k})),N=new Float32Array(V*2*9),F=new Float32Array(V*2*9),z=new Int32Array(V*2),B=0;for(let et=0;et<V;et++){let mt=i.s_inner_t(et),St=i.s_outer_t(et),ot=i.s_begin_r(et),vt=s[ot]-p,q,Pt,at,Mt,pt,Rt,bt,T,w;if(A){let J=C.t[mt],xt=C.t[St],Nt=C.r[ot];q=Pt=at=J,Mt=pt=Rt=xt,bt=T=w=Nt}else{let J=R[3*ot],xt=R[3*ot+1],Nt=R[3*ot+2];q=Mt=bt=J,Pt=pt=T=xt,at=Rt=w=Nt}let $=e[3*mt],ct=e[3*mt+1],lt=e[3*mt+2],ht=e[3*St],At=e[3*St+1],yt=e[3*St+2],Et=t[3*ot],Ct=t[3*ot+1],Dt=t[3*ot+2],rt=D(Math.atan2($,lt)),Ot=Math.asin(Math.max(-1,Math.min(1,ct))),U=D(Math.atan2(ht,yt)),st=Math.asin(Math.max(-1,Math.min(1,At))),ft=D(Math.atan2(Et,Dt)),ut=Math.asin(Math.max(-1,Math.min(1,Ct))),_t=2/M,Ht=Math.max(rt,U,ft),Wt=Math.min(rt,U,ft),Gt=Ht-Wt>M,gt=J=>Math.max(-2,Math.min(2,J)),G=J=>Math.max(-1,Math.min(1,J));if(Gt){rt<0&&(rt+=2*M),U<0&&(U+=2*M),ft<0&&(ft+=2*M);let J=B*9;N[J]=gt(rt*_t),N[J+1]=G(Ot*_t),N[J+2]=0,N[J+3]=gt(U*_t),N[J+4]=G(st*_t),N[J+5]=0,N[J+6]=gt(ft*_t),N[J+7]=G(ut*_t),N[J+8]=0,F[J]=q,F[J+1]=Pt,F[J+2]=at,F[J+3]=Mt,F[J+4]=pt,F[J+5]=Rt,F[J+6]=bt,F[J+7]=T,F[J+8]=w,z[B]=et,B++,J=B*9,N[J]=gt((rt-2*M)*_t),N[J+1]=G(Ot*_t),N[J+2]=0,N[J+3]=gt((U-2*M)*_t),N[J+4]=G(st*_t),N[J+5]=0,N[J+6]=gt((ft-2*M)*_t),N[J+7]=G(ut*_t),N[J+8]=0,F[J]=q,F[J+1]=Pt,F[J+2]=at,F[J+3]=Mt,F[J+4]=pt,F[J+5]=Rt,F[J+6]=bt,F[J+7]=T,F[J+8]=w,z[B]=et,B++}else{let J=B*9;N[J]=gt(rt*_t),N[J+1]=G(Ot*_t),N[J+2]=0,N[J+3]=gt(U*_t),N[J+4]=G(st*_t),N[J+5]=0,N[J+6]=gt(ft*_t),N[J+7]=G(ut*_t),N[J+8]=0,F[J]=q,F[J+1]=Pt,F[J+2]=at,F[J+3]=Mt,F[J+4]=pt,F[J+5]=Rt,F[J+6]=bt,F[J+7]=T,F[J+8]=w,z[B]=et,B++}}let X=N.subarray(0,B*9),K=F.subarray(0,B*9),H=new ie;H.setAttribute("position",new be(new Float32Array(X),3)),H.setAttribute("color",new be(new Float32Array(K),3));let W=new Xn({vertexColors:!0,side:ln,clippingPlanes:Sl});y.mapMesh=new de(H,W),y.mapMesh.visible=y.mapMode,y.mapMesh._builtCenterLon=y.mapCenterLon||0,y.mapFaceToSide=z.subarray(0,B),y._mapHoverBackup=null,y._mapKoppenHoverBackup=null,y._mapPendingBackup=null;let Z=new de(H,W);Z.position.x=-4;let nt=new de(H,W);nt.position.x=4,Z.visible=nt.visible=!1,y.mapMesh.add(Z,nt),y.mapMesh.userData.wrap=[Z,nt],Yt.add(y.mapMesh),lf(),of()}function of(){y.mapGridMesh&&(Yt.remove(y.mapGridMesh),y.mapGridMesh.geometry.dispose(),y.mapGridMesh.material.dispose(),y.mapGridMesh=null);let i=y.gridSpacing,t=2/Math.PI,e=.001,n=Math.PI,s=(y.mapCenterLon||0)*180/n,r=[];for(let h=-90;h<=90;h+=i){let u=h*Math.PI/180*t;r.push(-2,u,e,2,u,e)}for(let h=-180;h<=180;h+=i){let u=h-s;u>180?u-=360:u<-180&&(u+=360);let d=u*Math.PI/180*t;r.push(d,-1,e,d,1,e)}let o=new ie;o.setAttribute("position",new jt(r,3));let a=new We({color:16777215,transparent:!0,opacity:.12,clippingPlanes:Sl});y.mapGridMesh=new _e(o,a),y.mapGridMesh.visible=y.mapMode&&y.gridEnabled;let c=new _e(o,a);c.position.x=-4;let l=new _e(o,a);l.position.x=4,y.mapGridMesh.add(c,l),Yt.add(y.mapGridMesh)}function af(){y.globeGridMesh&&(Yt.remove(y.globeGridMesh),y.globeGridMesh.geometry.dispose(),y.globeGridMesh.material.dispose(),y.globeGridMesh=null);let i=y.gridSpacing,t=1.002,e=120,n=[];for(let o=-90;o<=90;o+=i){if(o===-90||o===90)continue;let a=o*Math.PI/180,c=Math.cos(a),l=Math.sin(a)*t;for(let h=0;h<e;h++){let u=h/e*Math.PI*2,d=(h+1)/e*Math.PI*2;n.push(Math.sin(u)*c*t,l,Math.cos(u)*c*t,Math.sin(d)*c*t,l,Math.cos(d)*c*t)}}for(let o=-180;o<180;o+=i){let a=o*Math.PI/180,c=Math.sin(a),l=Math.cos(a);for(let h=0;h<e;h++){let u=-Math.PI/2+h/e*Math.PI,d=-Math.PI/2+(h+1)/e*Math.PI;n.push(c*Math.cos(u)*t,Math.sin(u)*t,l*Math.cos(u)*t,c*Math.cos(d)*t,Math.sin(d)*t,l*Math.cos(d)*t)}}let s=new ie;s.setAttribute("position",new jt(n,3));let r=new Ve({uniforms:{color:{value:new Ut(16777215)},opacity:{value:.12}},vertexShader:`
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_Position.z -= 0.002 * gl_Position.w; // depth bias: render on top of nearby surfaces
            }
        `,fragmentShader:`
            uniform vec3 color;
            uniform float opacity;
            void main() {
                gl_FragColor = vec4(color, opacity);
            }
        `,transparent:!0,depthWrite:!1});y.globeGridMesh=new _e(s,r),y.globeGridMesh.visible=!y.mapMode&&y.gridEnabled,Yt.add(y.globeGridMesh)}function cf(){of(),af()}function lf(){if(y.superPlateBorderMesh&&(Yt.remove(y.superPlateBorderMesh),y.superPlateBorderMesh.geometry.dispose(),y.superPlateBorderMesh.material.dispose(),y.superPlateBorderMesh=null),y.mapSuperPlateBorderMesh&&(Yt.remove(y.mapSuperPlateBorderMesh),y.mapSuperPlateBorderMesh.geometry.dispose(),y.mapSuperPlateBorderMesh.material.dispose(),y.mapSuperPlateBorderMesh=null),!y.curData||!y.showPlates)return;let{mesh:t,t_xyz:e,t_elevation:n,debugLayers:s}=y.curData;if(!s||!s.superPlates)return;let r=s.superPlates,{numSides:o}=t,a=Math.PI,c=.04;if(!y.mapMode){let l=[];for(let h=0;h<o;h++){let u=t.halfedges[h];if(h<u){let d=t.s_begin_r(h),p=t.s_begin_r(u);if(r[d]!==r[p]){let g=t.s_inner_t(h),_=t.s_outer_t(h),m=n[g],f=n[_],v=1.002+(m>0?m*c:m*c*.3),x=1.002+(f>0?f*c:f*c*.3);l.push(e[3*g]*v,e[3*g+1]*v,e[3*g+2]*v,e[3*_]*x,e[3*_+1]*x,e[3*_+2]*x)}}}if(l.length>0){let h=new ie;h.setAttribute("position",new jt(l,3)),y.superPlateBorderMesh=new _e(h,new We({color:0,transparent:!0,opacity:.55})),Yt.add(y.superPlateBorderMesh)}}if(y.mapMode){let h=function(p){let g=p-l;return g>a?g-=2*a:g<-a&&(g+=2*a),g},l=y.mapCenterLon||0,u=2/a,d=[];for(let p=0;p<o;p++){let g=t.halfedges[p];if(p<g){let _=t.s_begin_r(p),m=t.s_begin_r(g);if(r[_]!==r[m]){let f=t.s_inner_t(p),v=t.s_outer_t(p),x=Math.asin(Math.max(-1,Math.min(1,e[3*f+1]))),S=h(Math.atan2(e[3*f],e[3*f+2])),P=Math.asin(Math.max(-1,Math.min(1,e[3*v+1]))),E=h(Math.atan2(e[3*v],e[3*v+2]));Math.abs(S-E)<a*.5&&d.push(S*u,x*u,.002,E*u,P*u,.002)}}}if(d.length>0){let p=new ie;p.setAttribute("position",new jt(d,3));let g=new We({color:0,transparent:!0,opacity:.55,clippingPlanes:Sl});y.mapSuperPlateBorderMesh=new _e(p,g);let _=new _e(p,g);_.position.x=-4;let m=new _e(p,g);m.position.x=4,y.mapSuperPlateBorderMesh.add(_,m),Yt.add(y.mapSuperPlateBorderMesh)}}}function Vi(){if(!y.curData)return;let{mesh:i,r_xyz:t,t_xyz:e,r_plate:n,r_elevation:s,t_elevation:r,mountain_r:o,coastline_r:a,ocean_r:c,r_stress:l,debugLayers:h}=y.curData,u=y.showPlates,d=!1,p=0,g=y.debugLayer||"",_=null,m=0,f=0,v=g==="heightmap",x=g==="landheightmap",S=Hs(g,y.climateSeason,y.curData),P=g==="koppen",E=g==="biome",L=P||E?h&&h.koppen:null;if(!v&&!x&&!S&&!P&&!E&&g&&h&&h[g]){_=h[g];for(let B=0;B<i.numRegions;B++)_[B]<m&&(m=_[B]),_[B]>f&&(f=_[B])}y.planetMesh&&(Yt.remove(y.planetMesh),y.planetMesh.geometry.dispose(),y.planetMesh.material.dispose()),y.wireMesh&&(Yt.remove(y.wireMesh),y.wireMesh.geometry.dispose(),y.wireMesh.material.dispose());let{numSides:V}=i,M=.04,b=new Float32Array(V*9),D=new Float32Array(V*9),O=new Uint8Array(V),k=E&&L?wl(i,L,s):null,A=Bi(),C=v||x,R=C?Tl(i,x?Ir:zs,r,s):null,N=C?null:ha(i.numRegions,Al({climateColor:S,isBiome:E,biomeSmoothed:k,isKoppen:P,koppenArr:L,dbgArr:_,dbgMin:m,dbgMax:f,showPlates:u,showStress:d,r_plate:n,r_stress:l,mountain_r:o,coastline_r:a,ocean_r:c,r_elevation:s,waterLevel:p,terrainColor:A}));for(let B=0;B<V;B++){let X=i.s_inner_t(B),K=i.s_outer_t(B),H=i.s_begin_r(B),W=s[H]-p,Z=r[X]-p,nt=r[K]-p,et=1+(W>0?W*M:W*M*.3),mt=1+(Z>0?Z*M:Z*M*.3),St=1+(nt>0?nt*M:nt*M*.3),ot=B*9,vt=e[3*X]*mt,q=e[3*X+1]*mt,Pt=e[3*X+2]*mt,at=e[3*K]*St,Mt=e[3*K+1]*St,pt=e[3*K+2]*St,Rt=t[3*H]*et,bt=t[3*H+1]*et,T=t[3*H+2]*et,w=at-vt,$=Mt-q,ct=pt-Pt,lt=Rt-vt,ht=bt-q,At=T-Pt,yt=$*At-ct*ht,Et=ct*lt-w*At,Ct=w*ht-$*lt,Dt=(vt+at+Rt)/3,rt=(q+Mt+bt)/3,Ot=(Pt+pt+T)/3,U=yt*Dt+Et*rt+Ct*Ot<0;if(U){let st,ft,ut;st=at,ft=Mt,ut=pt,at=Rt,Mt=bt,pt=T,Rt=st,bt=ft,T=ut}if(O[B]=U?1:0,b[ot]=vt,b[ot+1]=q,b[ot+2]=Pt,b[ot+3]=at,b[ot+4]=Mt,b[ot+5]=pt,b[ot+6]=Rt,b[ot+7]=bt,b[ot+8]=T,C){let st=R.t[X],ft=R.t[K],ut=R.r[H],_t=U?ut:ft,Ht=U?ft:ut;D[ot]=D[ot+1]=D[ot+2]=st,D[ot+3]=D[ot+4]=D[ot+5]=_t,D[ot+6]=D[ot+7]=D[ot+8]=Ht}else{let st=N[3*H],ft=N[3*H+1],ut=N[3*H+2];for(let _t=0;_t<3;_t++)D[ot+_t*3]=st,D[ot+_t*3+1]=ft,D[ot+_t*3+2]=ut}}let F=new ie;F.setAttribute("position",new be(b,3)),F.setAttribute("color",new be(D,3)),y._hoverBackup=null,y._koppenHoverBackup=null,y._sideSwapped=O;let z=rf(bl(g));if(z.userData.exact=bl(g),y.planetMesh=new de(F,z),Yt.add(y.planetMesh),Yn.visible=!y.mapMode&&!u&&!d&&!g,document.getElementById("chkWire").checked){let B=[];for(let K=0;K<V;K++)if(K<i.halfedges[K]){let H=i.s_inner_t(K),W=i.s_outer_t(K),Z=r[H],nt=r[W],et=1.001+(Z>0?Z*M:Z*M*.3),mt=1.001+(nt>0?nt*M:nt*M*.3);B.push(e[3*H]*et,e[3*H+1]*et,e[3*H+2]*et,e[3*W]*mt,e[3*W+1]*mt,e[3*W+2]*mt)}let X=new ie;X.setAttribute("position",new jt(B,3)),y.wireMesh=new _e(X,new We({color:0,transparent:!0,opacity:.12})),Yt.add(y.wireMesh)}lf(),B1(),uf(),hf(),y.mapMode&&ua(),af(),y.mapMode?(y.planetMesh.visible=!1,Yn.visible=!1,Fi.visible=!1,pi.visible=!1,y.wireMesh&&(y.wireMesh.visible=!1),y.arrowGroup&&(y.arrowGroup.visible=!1),y.mapGridMesh&&(y.mapGridMesh.visible=y.gridEnabled),y.globeGridMesh&&(y.globeGridMesh.visible=!1),y.oceanCurrentArrowGroup&&y.oceanCurrentArrowGroup.traverse(B=>{B.name==="oceanGlobe"&&(B.visible=!1),B.name==="oceanMap"&&(B.visible=!0)})):(y.planetMesh.visible=!0,Fi.visible=!0,pi.visible=!0,y.wireMesh&&(y.wireMesh.visible=!0),y.arrowGroup&&(y.arrowGroup.visible=!0),y.mapGridMesh&&(y.mapGridMesh.visible=!1),y.globeGridMesh&&(y.globeGridMesh.visible=y.gridEnabled),y.oceanCurrentArrowGroup&&y.oceanCurrentArrowGroup.traverse(B=>{B.name==="oceanGlobe"&&(B.visible=!0),B.name==="oceanMap"&&(B.visible=!1)}))}function Wi(){if(!y.curData||!y.planetMesh)return;let{mesh:i,r_plate:t,r_elevation:e,t_elevation:n,mountain_r:s,coastline_r:r,ocean_r:o,r_stress:a,debugLayers:c}=y.curData,l=y.showPlates,h=!1,u=0,d=y.debugLayer||"",p=null,g=0,_=0,m=d==="heightmap",f=d==="landheightmap",v=Hs(d,y.climateSeason,y.curData),x=d==="koppen",S=d==="biome",P=x||S?c&&c.koppen:null;if(!m&&!f&&!v&&!x&&!S&&d&&c&&c[d]){p=c[d];for(let R=0;R<i.numRegions;R++)p[R]<g&&(g=p[R]),p[R]>_&&(_=p[R])}let E=S&&P?wl(i,P,e):null,L=Bi(),V=m||f,M=V?Tl(i,f?Ir:zs,n,e):null,b=V?null:ha(i.numRegions,Al({climateColor:v,isBiome:S,biomeSmoothed:E,isKoppen:x,koppenArr:P,dbgArr:p,dbgMin:g,dbgMax:_,showPlates:l,showStress:h,r_plate:t,r_stress:a,mountain_r:s,coastline_r:r,ocean_r:o,r_elevation:e,waterLevel:u,terrainColor:L})),D=bl(d);y.planetMesh.material.userData.exact!==D&&(y.planetMesh.material.dispose(),y.planetMesh.material=rf(D),y.planetMesh.material.userData.exact=D);let O=y.planetMesh.geometry.getAttribute("color"),k=O.array,{numSides:A}=i,C=y._sideSwapped;for(let R=0;R<A;R++){let N=R*9;if(V){let F=i.s_inner_t(R),z=i.s_outer_t(R),B=i.s_begin_r(R),X=M.t[F],K=M.t[z],H=M.r[B],W=C&&C[R],Z=W?H:K,nt=W?K:H;k[N]=k[N+1]=k[N+2]=X,k[N+3]=k[N+4]=k[N+5]=Z,k[N+6]=k[N+7]=k[N+8]=nt}else{let F=i.s_begin_r(R),z=b[3*F],B=b[3*F+1],X=b[3*F+2];for(let K=0;K<3;K++)k[N+K*3]=z,k[N+K*3+1]=B,k[N+K*3+2]=X}}if(O.needsUpdate=!0,y._hoverBackup=null,y._koppenHoverBackup=null,y._pendingBackup=null,y.mapMesh&&y.mapFaceToSide){let R=y.mapMesh.geometry.getAttribute("color"),N=R.array,F=y.mapFaceToSide;for(let z=0;z<F.length;z++){let B=F[z],X=z*9;if(V){let K=i.s_inner_t(B),H=i.s_outer_t(B),W=i.s_begin_r(B),Z=M.t[K],nt=M.t[H],et=M.r[W];N[X]=N[X+1]=N[X+2]=Z,N[X+3]=N[X+4]=N[X+5]=nt,N[X+6]=N[X+7]=N[X+8]=et}else{let K=i.s_begin_r(B),H=b[3*K],W=b[3*K+1],Z=b[3*K+2];for(let nt=0;nt<3;nt++)N[X+nt*3]=H,N[X+nt*3+1]=W,N[X+nt*3+2]=Z}}R.needsUpdate=!0,y._mapHoverBackup=null,y._mapKoppenHoverBackup=null,y._mapPendingBackup=null}Yn.visible=!y.mapMode&&!l&&!h&&!d,uf(),F1(),hf(),U1()}function hf(){if(!y.planetMesh||!y.curData)return;let i=y.planetMesh.geometry.getAttribute("color"),t=i.array;if(y._hoverBackup){let{offsets:e,saved:n}=y._hoverBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._hoverBackup=null}if(y.hoveredPlate>=0){let{mesh:e,r_plate:n}=y.curData,s=0;for(let c=0;c<e.numSides;c++)n[e.s_begin_r(c)]===y.hoveredPlate&&s++;let r=new Int32Array(s),o=new Float32Array(s*9),a=0;for(let c=0;c<e.numSides;c++)if(n[e.s_begin_r(c)]===y.hoveredPlate){r[a]=c;let l=c*9;for(let h=0;h<9;h++)o[a*9+h]=t[l+h];for(let h=0;h<3;h++)t[l+h*3]=Math.min(1,t[l+h*3]+.22),t[l+h*3+1]=Math.min(1,t[l+h*3+1]+.22),t[l+h*3+2]=Math.min(1,t[l+h*3+2]+.22);a++}y._hoverBackup={offsets:r,saved:o}}i.needsUpdate=!0}function U1(){if(!y.mapMesh||!y.curData||!y.mapFaceToSide)return;let i=y.mapMesh.geometry.getAttribute("color"),t=i.array;if(y._mapHoverBackup){let{offsets:e,saved:n}=y._mapHoverBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._mapHoverBackup=null}if(y.hoveredPlate>=0){let{mesh:e,r_plate:n}=y.curData,s=y.mapFaceToSide,r=0;for(let l=0;l<s.length;l++)n[e.s_begin_r(s[l])]===y.hoveredPlate&&r++;let o=new Int32Array(r),a=new Float32Array(r*9),c=0;for(let l=0;l<s.length;l++)if(n[e.s_begin_r(s[l])]===y.hoveredPlate){o[c]=l;let h=l*9;for(let u=0;u<9;u++)a[c*9+u]=t[h+u];for(let u=0;u<3;u++)t[h+u*3]=Math.min(1,t[h+u*3]+.22),t[h+u*3+1]=Math.min(1,t[h+u*3+1]+.22),t[h+u*3+2]=Math.min(1,t[h+u*3+2]+.22);c++}y._mapHoverBackup={offsets:o,saved:a}}i.needsUpdate=!0}function Cl(){if(!y.planetMesh||!y.curData)return;let i=y.planetMesh.geometry.getAttribute("color"),t=i.array;if(y._koppenHoverBackup){let{offsets:e,saved:n}=y._koppenHoverBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._koppenHoverBackup=null}if(y.hoveredKoppen>=0){let{mesh:e,debugLayers:n}=y.curData,s=n&&n.koppen;if(!s){i.needsUpdate=!0;return}let r=0;for(let l=0;l<e.numSides;l++)s[e.s_begin_r(l)]===y.hoveredKoppen&&r++;let o=new Int32Array(r),a=new Float32Array(r*9),c=0;for(let l=0;l<e.numSides;l++)if(s[e.s_begin_r(l)]===y.hoveredKoppen){o[c]=l;let h=l*9;for(let u=0;u<9;u++)a[c*9+u]=t[h+u];for(let u=0;u<3;u++)t[h+u*3]=Math.min(1,t[h+u*3]+.22),t[h+u*3+1]=Math.min(1,t[h+u*3+1]+.22),t[h+u*3+2]=Math.min(1,t[h+u*3+2]+.22);c++}y._koppenHoverBackup={offsets:o,saved:a}}i.needsUpdate=!0}function Pl(){if(!y.mapMesh||!y.curData||!y.mapFaceToSide)return;let i=y.mapMesh.geometry.getAttribute("color"),t=i.array;if(y._mapKoppenHoverBackup){let{offsets:e,saved:n}=y._mapKoppenHoverBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._mapKoppenHoverBackup=null}if(y.hoveredKoppen>=0){let{mesh:e,debugLayers:n}=y.curData,s=n&&n.koppen;if(!s){i.needsUpdate=!0;return}let r=y.mapFaceToSide,o=0;for(let h=0;h<r.length;h++)s[e.s_begin_r(r[h])]===y.hoveredKoppen&&o++;let a=new Int32Array(o),c=new Float32Array(o*9),l=0;for(let h=0;h<r.length;h++)if(s[e.s_begin_r(r[h])]===y.hoveredKoppen){a[l]=h;let u=h*9;for(let d=0;d<9;d++)c[l*9+d]=t[u+d];for(let d=0;d<3;d++)t[u+d*3]=Math.min(1,t[u+d*3]+.22),t[u+d*3+1]=Math.min(1,t[u+d*3+1]+.22),t[u+d*3+2]=Math.min(1,t[u+d*3+2]+.22);l++}y._mapKoppenHoverBackup={offsets:a,saved:c}}i.needsUpdate=!0}function uf(){if(!y.planetMesh||!y.curData)return;let i=y.planetMesh.geometry.getAttribute("color"),t=i.array;if(y._pendingBackup){let{offsets:e,saved:n}=y._pendingBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._pendingBackup=null}if(y.pendingToggles.size>0){let{mesh:e,r_plate:n,plateIsOcean:s}=y.curData,r=0;for(let l=0;l<e.numSides;l++)y.pendingToggles.has(n[e.s_begin_r(l)])&&r++;let o=new Int32Array(r),a=new Float32Array(r*9),c=0;for(let l=0;l<e.numSides;l++){let h=n[e.s_begin_r(l)];if(y.pendingToggles.has(h)){o[c]=l;let u=l*9;for(let p=0;p<9;p++)a[c*9+p]=t[u+p];let d=s.has(h);for(let p=0;p<3;p++)d?(t[u+p*3]=t[u+p*3]*.7,t[u+p*3+1]=Math.min(1,t[u+p*3+1]+.25),t[u+p*3+2]=t[u+p*3+2]*.7):(t[u+p*3]=t[u+p*3]*.7,t[u+p*3+1]=t[u+p*3+1]*.7,t[u+p*3+2]=Math.min(1,t[u+p*3+2]+.25));c++}}y._pendingBackup={offsets:o,saved:a}}i.needsUpdate=!0}function F1(){if(!y.mapMesh||!y.curData||!y.mapFaceToSide)return;let i=y.mapMesh.geometry.getAttribute("color"),t=i.array;if(y._mapPendingBackup){let{offsets:e,saved:n}=y._mapPendingBackup;for(let s=0;s<e.length;s++){let r=e[s]*9;for(let o=0;o<9;o++)t[r+o]=n[s*9+o]}y._mapPendingBackup=null}if(y.pendingToggles.size>0){let{mesh:e,r_plate:n,plateIsOcean:s}=y.curData,r=y.mapFaceToSide,o=0;for(let h=0;h<r.length;h++)y.pendingToggles.has(n[e.s_begin_r(r[h])])&&o++;let a=new Int32Array(o),c=new Float32Array(o*9),l=0;for(let h=0;h<r.length;h++){let u=n[e.s_begin_r(r[h])];if(y.pendingToggles.has(u)){a[l]=h;let d=h*9;for(let g=0;g<9;g++)c[l*9+g]=t[d+g];let p=s.has(u);for(let g=0;g<3;g++)p?(t[d+g*3]=t[d+g*3]*.7,t[d+g*3+1]=Math.min(1,t[d+g*3+1]+.25),t[d+g*3+2]=t[d+g*3+2]*.7):(t[d+g*3]=t[d+g*3]*.7,t[d+g*3+1]=t[d+g*3+1]*.7,t[d+g*3+2]=Math.min(1,t[d+g*3+2]+.25));l++}}y._mapPendingBackup={offsets:a,saved:c}}i.needsUpdate=!0}function B1(){y.arrowGroup&&(y.arrowGroup.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&s.material.dispose()}),Yt.remove(y.arrowGroup),y.arrowGroup=null)}function Gs(i){if(y.windArrowGroup&&(y.windArrowGroup.traverse(O=>{O.geometry&&O.geometry.dispose(),O.material&&O.material.dispose()}),Yt.remove(y.windArrowGroup),y.windArrowGroup=null),!i||!y.curData||!y.curData.climate)return;let{mesh:t,r_xyz:e}=y.curData,n=y.curData.climate.grid,{lat:s,lon:r}=Tr(y.curData),o=Math.PI,a=o/180,c=2/o,l=t.numRegions,h=3,u=3,d=Math.floor(180/h),p=Math.floor(360/u),g=new Int32Array(d*p).fill(-1),_=new Float32Array(d*p).fill(1e9);for(let O=0;O<l;O++){let k=e[3*O+1],A=Math.asin(Math.max(-1,Math.min(1,k))),C=Math.atan2(e[3*O],e[3*O+2]),R=Math.max(0,Math.min(d-1,Math.floor((A+o/2)/(h*a)))),N=Math.max(0,Math.min(p-1,Math.floor((C+o)/(u*a)))),F=(-90+R*h+h*.5)*a,z=(-180+N*u+u*.5)*a,B=A-F,X=C-z,K=B*B+X*X,H=R*p+N;K<_[H]&&(_[H]=K,g[H]=O)}let m=[],f=[],v=[],x=[],S=25*a,P=.35,E=Math.cos(S),L=Math.sin(S);for(let O=0;O<g.length;O++){let k=g[O];if(k<0)continue;let[A,C]=yl(n,"wind",i,s[k],r[k]),R=A/10,N=C/10,F=Math.sqrt(R*R+N*N);if(F<.01)continue;let z=e[3*k],B=e[3*k+1],X=e[3*k+2],K=Math.min(1,F),H,W,Z;if(K<.5){let nt=K*2;H=nt,W=nt,Z=1-nt*.5}else{let nt=(K-.5)*2;H=1,W=1-nt,Z=.5-nt*.5}{let nt=X,et=0,mt=-z,St=Math.sqrt(nt*nt+mt*mt);St>1e-10?(nt/=St,mt/=St):(nt=1,mt=0);let ot=B*mt-X*et,vt=X*nt-z*mt,q=z*et-B*nt,Pt=Math.sqrt(ot*ot+vt*vt+q*q)||1;ot/=Pt,vt/=Pt,q/=Pt;let at=R*nt+N*ot,Mt=R*et+N*vt,pt=R*mt+N*q,Rt=Math.sqrt(at*at+Mt*Mt+pt*pt)||1,bt=at/Rt,T=Mt/Rt,w=pt/Rt,$=B*w-X*T,ct=X*bt-z*w,lt=z*T-B*bt,ht=Math.sqrt($*$+ct*ct+lt*lt)||1;$/=ht,ct/=ht,lt/=ht;let At=.008+Math.min(.012,F*.012),yt=1.007,Et=z*yt,Ct=B*yt,Dt=X*yt,rt=Et+bt*At,Ot=Ct+T*At,U=Dt+w*At;m.push(Et,Ct,Dt,rt,Ot,U),f.push(H,W,Z,H,W,Z);let st=At*P,ft=rt+(-bt*E+$*L)*st,ut=Ot+(-T*E+ct*L)*st,_t=U+(-w*E+lt*L)*st,Ht=rt+(-bt*E-$*L)*st,Wt=Ot+(-T*E-ct*L)*st,Gt=U+(-w*E-lt*L)*st;m.push(rt,Ot,U,ft,ut,_t),f.push(H,W,Z,H,W,Z),m.push(rt,Ot,U,Ht,Wt,Gt),f.push(H,W,Z,H,W,Z)}{let nt=Math.atan2(z,X)-(y.mapCenterLon||0);nt>o?nt-=2*o:nt<-o&&(nt+=2*o);let et=Math.asin(Math.max(-1,Math.min(1,B))),mt=nt*c,St=et*c,ot=F||1,vt=.006+Math.min(.012,F*.012),q=R/ot*vt,Pt=N/ot*vt,at=mt+q,Mt=St+Pt;v.push(mt,St,.002,at,Mt,.002),x.push(H,W,Z,H,W,Z);let pt=vt*P,Rt=Math.sqrt(q*q+Pt*Pt)||1,bt=-q/Rt,T=-Pt/Rt,w=at+(bt*E-T*L)*pt,$=Mt+(bt*L+T*E)*pt,ct=at+(bt*E+T*L)*pt,lt=Mt+(-bt*L+T*E)*pt;v.push(at,Mt,.002,w,$,.002),x.push(H,W,Z,H,W,Z),v.push(at,Mt,.002,ct,lt,.002),x.push(H,W,Z,H,W,Z)}}if(y.windArrowGroup=new Tn,m.length>0){let O=new ie;O.setAttribute("position",new jt(m,3)),O.setAttribute("color",new jt(f,3));let k=new We({vertexColors:!0,transparent:!0,opacity:.6,depthWrite:!1}),A=new _e(O,k);A.name="windGlobe",A.visible=!y.mapMode,y.windArrowGroup.add(A)}if(v.length>0){let O=new ie;O.setAttribute("position",new jt(v,3)),O.setAttribute("color",new jt(x,3));let k=new We({vertexColors:!0,transparent:!0,opacity:.6}),A=new _e(O,k);A.name="windMap",A.visible=y.mapMode,y.windArrowGroup.add(A)}let V=i&&!!zi(y.debugLayer)?.itcz,M=n.itcz?.[i],b=M?Float32Array.from(M,(O,k)=>(-180+(k+.5)*n.step)*a):null,D=M?Float32Array.from(M,O=>O*a):null;if(V&&b&&D){let O=b.length,k=1.01,A=[];for(let K=0;K<O;K++){let H=(K+1)%O,W=b[K],Z=D[K],nt=b[H],et=D[H],mt=Math.cos(Z),St=Math.cos(et);A.push(Math.sin(W)*mt*k,Math.sin(Z)*k,Math.cos(W)*mt*k,Math.sin(nt)*St*k,Math.sin(et)*k,Math.cos(nt)*St*k)}let C=new ie;C.setAttribute("position",new jt(A,3));let R=new We({color:65416,linewidth:2,depthWrite:!1}),N=new _e(C,R);N.name="windGlobe",N.visible=!y.mapMode,y.windArrowGroup.add(N);let F=[];for(let K=0;K<O;K++){let H=(K+1)%O,W=b[K]*c,Z=D[K]*c,nt=b[H]*c,et=D[H]*c;Math.abs(nt-W)>1||F.push(W,Z,.003,nt,et,.003)}let z=new ie;z.setAttribute("position",new jt(F,3));let B=new We({color:65416,linewidth:2}),X=new _e(z,B);X.name="windMap",X.visible=y.mapMode,y.windArrowGroup.add(X)}Yt.add(y.windArrowGroup)}function Vs(i){if(y.oceanCurrentArrowGroup&&(y.oceanCurrentArrowGroup.traverse(D=>{D.geometry&&D.geometry.dispose(),D.material&&D.material.dispose()}),Yt.remove(y.oceanCurrentArrowGroup),y.oceanCurrentArrowGroup=null),!i||!y.curData||!y.curData.climate)return;let{mesh:t,r_xyz:e,r_elevation:n}=y.curData,s=y.curData.climate.grid,{lat:r,lon:o}=Tr(y.curData),a=["year","jan","jul"].includes(i)?i:"year",c=0;{let D=s.currentU[a],O=s.currentV[a],k=[];for(let A=0;A<D.length;A++)s.sea[A]&&k.push(Math.hypot(D[A],O[A]));k.sort((A,C)=>A-C),c=k.length?k[Math.floor(.95*(k.length-1))]:0}if(!(c>0))return;let l=Math.PI,h=l/180,u=2/l,d=t.numRegions,p=3,g=3,_=Math.floor(180/p),m=Math.floor(360/g),f=new Int32Array(_*m).fill(-1),v=new Float32Array(_*m).fill(1e9);for(let D=0;D<d;D++){if(n[D]>0)continue;let O=e[3*D+1],k=Math.asin(Math.max(-1,Math.min(1,O))),A=Math.atan2(e[3*D],e[3*D+2]),C=Math.max(0,Math.min(_-1,Math.floor((k+l/2)/(p*h)))),R=Math.max(0,Math.min(m-1,Math.floor((A+l)/(g*h)))),N=(-90+C*p+p*.5)*h,F=(-180+R*g+g*.5)*h,z=k-N,B=A-F,X=z*z+B*B,K=C*m+R;X<v[K]&&(v[K]=X,f[K]=D)}let x=[],S=[],P=[],E=[],L=25*h,V=.35,M=Math.cos(L),b=Math.sin(L);for(let D=0;D<f.length;D++){let O=f[D];if(O<0)continue;let[k,A]=yl(s,"currents",a,r[O],o[O]),C=k/c,R=A/c,N=Math.min(1.5,Math.hypot(C,R)),F=5*ks(s,s.sstAnom[a],r[O],o[O]);if(N<.01)continue;let z=e[3*O],B=e[3*O+1],X=e[3*O+2],K,H,W;F>.1?(K=.9,H=.15,W=.15):F<-.1?(K=.15,H=.3,W=.9):(K=.5,H=.5,W=.5);{let Z=X,nt=0,et=-z,mt=Math.sqrt(Z*Z+et*et);mt>1e-10?(Z/=mt,et/=mt):(Z=1,et=0);let St=B*et-X*nt,ot=X*Z-z*et,vt=z*nt-B*Z,q=Math.sqrt(St*St+ot*ot+vt*vt)||1;St/=q,ot/=q,vt/=q;let Pt=C*Z+R*St,at=C*nt+R*ot,Mt=C*et+R*vt,pt=Math.sqrt(Pt*Pt+at*at+Mt*Mt)||1,Rt=Pt/pt,bt=at/pt,T=Mt/pt,w=B*T-X*bt,$=X*Rt-z*T,ct=z*bt-B*Rt,lt=Math.sqrt(w*w+$*$+ct*ct)||1;w/=lt,$/=lt,ct/=lt;let ht=.006+Math.min(.014,N*.025),At=1.007,yt=z*At,Et=B*At,Ct=X*At,Dt=yt+Rt*ht,rt=Et+bt*ht,Ot=Ct+T*ht;x.push(yt,Et,Ct,Dt,rt,Ot),S.push(K,H,W,K,H,W);let U=ht*V,st=Dt+(-Rt*M+w*b)*U,ft=rt+(-bt*M+$*b)*U,ut=Ot+(-T*M+ct*b)*U,_t=Dt+(-Rt*M-w*b)*U,Ht=rt+(-bt*M-$*b)*U,Wt=Ot+(-T*M-ct*b)*U;x.push(Dt,rt,Ot,st,ft,ut),S.push(K,H,W,K,H,W),x.push(Dt,rt,Ot,_t,Ht,Wt),S.push(K,H,W,K,H,W)}{let Z=Math.atan2(z,X)-(y.mapCenterLon||0);Z>l?Z-=2*l:Z<-l&&(Z+=2*l);let nt=Math.asin(Math.max(-1,Math.min(1,B))),et=Z*u,mt=nt*u,St=Math.sqrt(C*C+R*R)||1,ot=.006+Math.min(.014,N*.025),vt=C/St*ot,q=R/St*ot,Pt=et+vt,at=mt+q;P.push(et,mt,.002,Pt,at,.002),E.push(K,H,W,K,H,W);let Mt=ot*V,pt=Math.sqrt(vt*vt+q*q)||1,Rt=-vt/pt,bt=-q/pt,T=Pt+(Rt*M-bt*b)*Mt,w=at+(Rt*b+bt*M)*Mt,$=Pt+(Rt*M+bt*b)*Mt,ct=at+(-Rt*b+bt*M)*Mt;P.push(Pt,at,.002,T,w,.002),E.push(K,H,W,K,H,W),P.push(Pt,at,.002,$,ct,.002),E.push(K,H,W,K,H,W)}}if(console.log(`[OceanArrows] ${i}: ${x.length/18} arrows (from ${f.length} grid cells)`),y.oceanCurrentArrowGroup=new Tn,x.length>0){let D=new ie;D.setAttribute("position",new jt(x,3)),D.setAttribute("color",new jt(S,3));let O=new We({vertexColors:!0,transparent:!0,opacity:.6,depthWrite:!1}),k=new _e(D,O);k.name="oceanGlobe",k.visible=!y.mapMode,y.oceanCurrentArrowGroup.add(k)}if(P.length>0){let D=new ie;D.setAttribute("position",new jt(P,3)),D.setAttribute("color",new jt(E,3));let O=new We({vertexColors:!0,transparent:!0,opacity:.6}),k=new _e(D,O);k.name="oceanMap",k.visible=y.mapMode,y.oceanCurrentArrowGroup.add(k)}Yt.add(y.oceanCurrentArrowGroup)}function k1(i=y.mapCenterLon||0){let t=Math.PI,e=i;return(n,s)=>{let r=Math.atan2(n,s)-e;return r>t?r-=2*t:r<-t&&(r+=2*t),r}}function df(i=(y.mapCenterLon||0)*180/Math.PI){let t=Math.round(i);return t?`-c${Math.abs(t)}${t>0?"E":"W"}`:""}function ff(i,t=0){let{mesh:e,r_xyz:n,t_xyz:s,r_elevation:r}=y.curData,{numSides:o,numTriangles:a}=e,c=Math.PI,l=2/c,h=i>>1,u=new Float32Array(o*18),d=new Uint32Array(o*2),p=new Uint32Array(o*2),g=new Uint32Array(o*2),_=0,m=k1(t*c/180),f=b=>Math.max(-2,Math.min(2,b)),v=b=>Math.max(-1,Math.min(1,b)),x=(b,D,O,k,A,C,R,N,F)=>{let z=_*9;u[z]=f(b*l),u[z+1]=v(D*l),u[z+2]=0,u[z+3]=f(O*l),u[z+4]=v(k*l),u[z+5]=0,u[z+6]=f(A*l),u[z+7]=v(C*l),u[z+8]=0,d[_]=R,p[_]=N,g[_]=F,_++};for(let b=0;b<o;b++){let D=e.s_inner_t(b),O=e.s_outer_t(b),k=e.s_begin_r(b),A=m(s[3*D],s[3*D+2]),C=Math.asin(Math.max(-1,Math.min(1,s[3*D+1]))),R=m(s[3*O],s[3*O+2]),N=Math.asin(Math.max(-1,Math.min(1,s[3*O+1]))),F=m(n[3*k],n[3*k+2]),z=Math.asin(Math.max(-1,Math.min(1,n[3*k+1])));Math.max(A,R,F)-Math.min(A,R,F)>c?(A<0&&(A+=2*c),R<0&&(R+=2*c),F<0&&(F+=2*c),x(A,C,R,N,F,z,k,D,O),x(A-2*c,C,R-2*c,N,F-2*c,z,k,D,O)):x(A,C,R,N,F,z,k,D,O)}let S=e.triangles,P=b=>[S[3*b],S[3*b+1],S[3*b+2]],E=te.capabilities.maxTextureSize,L=2048,V=Math.min(i,E,L),M=Math.min(h,E,L);return{width:i,height:h,mesh:e,r_elevation:r,numTriangles:a,triRegionsOf:P,posData:new Float32Array(u.buffer,0,_*9),triRegions:d,triInnerT:p,triOuterT:g,triCount:_,offScene:new di,tileW:V,tileH:M,tilesX:Math.ceil(i/V),tilesY:Math.ceil(h/M),pixelBuf:new Uint8Array(V*M*4),floatBuf:new Float32Array(V*M*4)}}async function pf(i,t,e=()=>{}){let{width:n,height:s,offScene:r,tileW:o,tileH:a,tilesX:c,tilesY:l,pixelBuf:h,floatBuf:u,triCount:d,triRegions:p,triInnerT:g,triOuterT:_,numTriangles:m,triRegionsOf:f,mesh:v}=i,x=t.mode==="value",S=new Float32Array(d*9);if(x){let D=v.numRegions,O=new Float32Array(D);for(let A=0;A<D;A++){let C=t.valueOf(A);O[A]=C===C?Math.min(1,Math.max(0,C)):0}let k=null;if(t.smooth){k=new Float32Array(m);for(let A=0;A<m;A++){let[C,R,N]=f(A);k[A]=(O[C]+O[R]+O[N])/3}}for(let A=0;A<d;A++){let C=A*9,R=p[A],N=O[R],F=k?k[g[A]]:N,z=k?k[_[A]]:N;S[C]=S[C+1]=S[C+2]=F,S[C+3]=S[C+4]=S[C+5]=z,S[C+6]=S[C+7]=S[C+8]=N}}else{let D=ha(v.numRegions,t.colorOf);for(let O=0;O<d;O++){let k=O*9,A=3*p[O],C=D[A],R=D[A+1],N=D[A+2];S[k]=S[k+3]=S[k+6]=C,S[k+1]=S[k+4]=S[k+7]=R,S[k+2]=S[k+5]=S[k+8]=N}}r.background=x?new Ut(0):new Ut(1710638);let P=new ie;P.setAttribute("position",new be(i.posData,3)),P.setAttribute("color",new be(S,3));let E=new Xn({vertexColors:!0,side:ln}),L=new de(P,E);r.add(L);let V=x?new Uint16Array(n*s):new Uint8ClampedArray(n*s*4),M=c*l,b=0;for(let D=0;D<l;D++)for(let O=0;O<c;O++){let k=O*o,A=D*a,C=Math.min(o,n-k),R=Math.min(a,s-A),N=new In(-2+4*k/n,-2+4*(k+C)/n,1-2*A/s,1-2*(A+R)/s,.1,10);N.position.set(0,0,5),N.lookAt(0,0,0);let F=new sn(C,R,x?{type:An}:{}),z=te.outputColorSpace;x&&(te.outputColorSpace=xn),te.setRenderTarget(F),te.render(r,N),te.outputColorSpace=z,te.readRenderTargetPixels(F,0,0,C,R,x?u:h),te.setRenderTarget(null),F.dispose();for(let B=0;B<R;B++){let X=(R-1-B)*C,K=(A+B)*n+k;if(x)for(let H=0;H<C;H++)V[K+H]=Math.max(0,Math.min(65535,u[(X+H)*4]*65535+.5|0));else for(let H=0;H<C;H++){let W=(X+H)*4,Z=(K+H)*4;for(let nt=0;nt<3;nt++){let et=h[W+nt]/255;V[Z+nt]=(et<=.0031308?et*12.92:1.055*Math.pow(et,1/2.4)-.055)*255+.5|0}V[Z+3]=255}}b++,e(b/M,"rendering"),await new Promise(B=>setTimeout(B,0))}return r.remove(L),P.dispose(),E.dispose(),{kind:x?"gray16":"rgba",W:n,H:s,data:V}}function mf(i){i.posData=i.pixelBuf=i.floatBuf=null}function gf(i){let{mesh:t,r_elevation:e,debugLayers:n}=y.curData,s=n&&n.koppen;return s?sf(t,nf(t,s,e,y.curData,i)):null}var H1=(()=>{let i=new Uint32Array(256);for(let t=0;t<256;t++){let e=t;for(let n=0;n<8;n++)e=e&1?3988292384^e>>>1:e>>>1;i[t]=e}return i})();function Ll(i,t=0){let e=(t^4294967295)>>>0;for(let n=0;n<i.length;n++)e=H1[(e^i[n])&255]^e>>>8;return(e^4294967295)>>>0}function Zn(i,t){let e=new Uint8Array(12+t.length),n=new DataView(e.buffer);n.setUint32(0,t.length);for(let s=0;s<4;s++)e[4+s]=i.charCodeAt(s);return e.set(t,8),n.setUint32(8+t.length,Ll(e.subarray(4,8+t.length))),e}async function _f(i,t,e,n=16){let s=new Uint8Array(13),r=new DataView(s.buffer);r.setUint32(0,i),r.setUint32(4,t),s[8]=n,s[9]=0;let o=n>>3,a=1+i*o,c=new Uint8Array(t*a);for(let p=0;p<t;p++){let g=p*a,_=p*i;if(c[g]=1,n===16){let m=0,f=0;for(let v=0;v<i;v++){let x=e[_+v],S=x>>8&255,P=x&255;c[g+1+2*v]=S-m&255,c[g+2+2*v]=P-f&255,m=S,f=P}}else{let m=0;for(let f=0;f<i;f++){let v=e[_+f]&255;c[g+1+f]=v-m&255,m=v}}}let l=new CompressionStream("deflate"),h=l.writable.getWriter();h.write(c),h.close();let u=new Uint8Array(await new Response(l.readable).arrayBuffer()),d=[new Uint8Array([137,80,78,71,13,10,26,10]),Zn("IHDR",s),Zn("IDAT",u),Zn("IEND",new Uint8Array(0))];return new Blob(d,{type:"image/png"})}async function xf(i,t,e){let n=new Uint8Array(13),s=new DataView(n.buffer);s.setUint32(0,i),s.setUint32(4,t),n[8]=8,n[9]=2;let r=1+3*i,o=new Uint8Array(t*r);for(let h=0;h<t;h++){let u=h*r,d=4*h*i;o[u]=1;let p=0,g=0,_=0;for(let m=0;m<i;m++){let f=d+4*m,v=e[f],x=e[f+1],S=e[f+2],P=u+1+3*m;o[P]=v-p&255,o[P+1]=x-g&255,o[P+2]=S-_&255,p=v,g=x,_=S}}let a=new CompressionStream("deflate"),c=a.writable.getWriter();c.write(o),c.close();let l=new Uint8Array(await new Response(a.readable).arrayBuffer());return new Blob([new Uint8Array([137,80,78,71,13,10,26,10]),Zn("IHDR",n),Zn("IDAT",l),Zn("IEND",new Uint8Array(0))],{type:"image/png"})}async function yf(i,t,e){let n=new Uint8Array(13),s=new DataView(n.buffer);s.setUint32(0,i),s.setUint32(4,t),n[8]=8,n[9]=6;let r=1+4*i,o=new Uint8Array(t*r);for(let h=0;h<t;h++){let u=h*r,d=4*h*i;o[u]=1;let p=0,g=0,_=0,m=0;for(let f=0;f<i;f++){let v=d+4*f,x=e[v],S=e[v+1],P=e[v+2],E=e[v+3],L=u+1+4*f;o[L]=x-p&255,o[L+1]=S-g&255,o[L+2]=P-_&255,o[L+3]=E-m&255,p=x,g=S,_=P,m=E}}let a=new CompressionStream("deflate"),c=a.writable.getWriter();c.write(o),c.close();let l=new Uint8Array(await new Response(a.readable).arrayBuffer());return new Blob([new Uint8Array([137,80,78,71,13,10,26,10]),Zn("IHDR",n),Zn("IDAT",l),Zn("IEND",new Uint8Array(0))],{type:"image/png"})}function Il(i,t){let e=document.createElement("a");e.href=URL.createObjectURL(i),e.download=t,document.body.appendChild(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(e.href),5e3)}function z1(i=new Date){return{time:i.getHours()<<11|i.getMinutes()<<5|i.getSeconds()>>1,date:i.getFullYear()-1980<<9|i.getMonth()+1<<5|i.getDate()}}async function vf(i,t=()=>{}){let e=new TextEncoder,{time:n,date:s}=z1(),r=[],o=[],a=0;for(let u=0;u<i.length;u++){let{name:d,blob:p}=i[u],g=e.encode(d),_=new Uint8Array(await p.arrayBuffer()),m=Ll(_);t(u);let f=new Uint8Array(30+g.length),v=new DataView(f.buffer);v.setUint32(0,67324752,!0),v.setUint16(4,20,!0),v.setUint16(6,2048,!0),v.setUint16(8,0,!0),v.setUint16(10,n,!0),v.setUint16(12,s,!0),v.setUint32(14,m,!0),v.setUint32(18,_.length,!0),v.setUint32(22,_.length,!0),v.setUint16(26,g.length,!0),v.setUint16(28,0,!0),f.set(g,30);let x=new Uint8Array(46+g.length),S=new DataView(x.buffer);if(S.setUint32(0,33639248,!0),S.setUint16(4,20,!0),S.setUint16(6,20,!0),S.setUint16(8,2048,!0),S.setUint16(10,0,!0),S.setUint16(12,n,!0),S.setUint16(14,s,!0),S.setUint32(16,m,!0),S.setUint32(20,_.length,!0),S.setUint32(24,_.length,!0),S.setUint16(28,g.length,!0),S.setUint32(42,a,!0),x.set(g,46),r.push(f,p),o.push(x),a+=f.length+_.length,a>4294967295)throw new Error("the files are too big for one ZIP (over 4 GB): export them one at a time")}let c=o.reduce((u,d)=>u+d.length,0),l=new Uint8Array(22),h=new DataView(l.buffer);return h.setUint32(0,101010256,!0),h.setUint16(8,i.length,!0),h.setUint16(10,i.length,!0),h.setUint32(12,c,!0),h.setUint32(16,a,!0),new Blob([...r,...o,l],{type:"application/zip"})}var Ws={temperature:{unit:"\xB0C",lo:-60,hi:60},precip:{unit:"mm/month",lo:0,hi:1e3},pressure:{unit:"hPa",lo:950,hi:1050},windSpeed:{unit:"m/s",lo:0,hi:40},windU:{unit:"m/s (east)",lo:-40,hi:40},windV:{unit:"m/s (north)",lo:-40,hi:40},sstAnom:{unit:"\xB0C against the latitude's mean",lo:-10,hi:10},currentU:{unit:"m/s (east)",lo:-3,hi:3},currentV:{unit:"m/s (north)",lo:-3,hi:3},upwelling:{unit:"m/day",lo:0,hi:5},seaIce:{unit:"fraction",lo:0,hi:1},snow:{unit:"fraction",lo:0,hi:1},iceSheet:{unit:"fraction",lo:0,hi:1},tempRange:{unit:"\xB0C (warmest \u2212 coldest month)",lo:0,hi:80},rainShadow:{unit:"ratio (rain with the mountains \xF7 without)",lo:0,hi:4},aridity:{unit:"P / PET",lo:0,hi:5},growing:{unit:"months above 10 \xB0C",lo:0,hi:12},rainSeason:{unit:"Walsh seasonality index",lo:0,hi:1.5},hillshade:{unit:"light (0 dark \u2026 255 lit; light from the north-west)",lo:0,hi:1},landmask:{unit:"land 255, sea 0",lo:0,hi:1},koppenIndex:{unit:"K\xF6ppen class index (0 = sea; the README lists the classes)",lo:0,hi:255},plateId:{unit:"plate number",lo:0,hi:255}},Mf=(i,t)=>i===i?Math.min(1,Math.max(0,(i-t.lo)/(t.hi-t.lo))):0;function bf(i){let t=new Uint8Array(i.length);for(let e=0;e<i.length;e++)t[e]=Math.round(i[e]/257);return t}function Sf(i,t,e,n=20){let s=new Uint8Array(t*e),r=2*Math.PI*6371/t,o=-.5,a=.5,c=Math.SQRT1_2;for(let l=0;l<e;l++){let h=Math.max(.05,Math.cos(((l+.5)/e-.5)*Math.PI)),u=Math.max(0,l-1)*t,d=Math.min(e-1,l+1)*t,p=l*t;for(let g=0;g<t;g++){let _=(i[p+(g+1)%t]-i[p+(g-1+t)%t])/(2*r*h),m=(i[u+g]-i[d+g])/(2*r),f=-n*_,v=-n*m,x=Math.sqrt(f*f+v*v+1);s[p+g]=Math.round(255*Math.max(0,(f*o+v*a+c)/x))}}return s}var Dl={year:"the year",jan:"January",jul:"July"};function wf(i,t,e=null,n=[]){let s=[];s.push(`World Orogen \u2014 export from the ${i.page} page`,"https://orogen.studio/",""),i.planet&&s.push(`Planet: ${i.planet}`),i.link&&s.push(`Link: ${i.link}`),s.push(`Made: ${new Date().toISOString().slice(0,16).replace("T"," ")} UTC`),s.push(`Projection: ${i.projection||"equirectangular"}${i.projectionNote?` (${i.projectionNote})`:""}`),s.push(`Centre longitude: ${i.centerLon?`${Math.abs(i.centerLon)}\xB0${i.centerLon>0?"E":"W"}`:"0\xB0"}`),s.push(`Size: ${i.width} \xD7 ${i.height} px${i.sizeNote?` (${i.sizeNote})`:""}`),i.hillshade!=null&&s.push(`Hillshade on the colour maps: ${i.hillshade?"on":"off"}`);for(let r of i.notes||[])s.push(r);s.push("","Files","-----");for(let r of t){let o=r.kind==="file"?r.about:r.kind==="rgba"?"colour PNG":r.kind==="gray16"?"16-bit greyscale PNG":"8-bit greyscale PNG",a=r.season?`, ${Dl[r.season]||r.season}`:"",c="";if(r.file?.scale){let l=r.file.scale,h=r.kind==="gray8"?255:65535;c=l.lo===0&&l.hi===255&&r.kind==="gray8"?` \u2014 ${l.unit}`:` \u2014 ${l.unit}: 0 = ${l.lo}, ${h} = ${l.hi}, linear`}s.push(`${r.name}`,`    ${r.label}${a} \u2014 ${o}${c}`)}e&&(s.push("","K\xF6ppen classes (the index in the class-index file)","----------------------------------------------"),e.forEach((r,o)=>s.push(`${String(o).padStart(2)}  ${r.code||"sea"}${r.name?`  ${r.name}`:""}`)));for(let{title:r,items:o}of n)s.push("",r,"-".repeat(r.length)),o.forEach((a,c)=>s.push(`${String(c).padStart(2)}  ${a}`));return s.push("","Data files are linear greyscales on the scale given: value = lo + grey / top \xD7 (hi \u2212 lo). The 16-bit files","open in GIMP, Photoshop, QGIS, Blender and most game engines; a viewer that reads only 8 bits shows the top byte.","Equirectangular maps wrap: the left and right edges meet. The planet is a sphere of Earth's size (6371 km radius)."),s.push("","These maps are yours to use however you like, including commercially. Crediting World Orogen is always appreciated."),s.join(`
`)+`
`}function Nl(i,t="png"){return i.filter(Boolean).map(e=>String(e).replace(/[^A-Za-z0-9+-]+/g,"-").replace(/^-|-$/g,"")).join("-")+"."+t}function Ef(i="climate"){let t=(n,s,r)=>({key:n,suffix:s,label:r,scale:Ws[n],bits:16}),e=(n,s,r,o,a)=>({id:n,label:s,colour:!0,seasonal:r,needs:i,data:o,tip:a});return[e("temperature","Temperature",!0,[t("temperature","","Temperature")],"Air temperature at the surface (the sea's surface at sea)"),e("precip","Precipitation",!0,[t("precip","","Precipitation")],"Rain and snow, mm a month (the year: the monthly mean)"),e("pressure","Pressure",!0,[t("pressure","","Sea-level pressure")],"Sea-level pressure, hPa"),e("wind","Wind",!0,[t("windSpeed","speed","Wind speed"),t("windU","u","Wind, eastward"),t("windV","v","Wind, northward")],"Surface wind: its speed, and as data its east and north parts too"),e("currents","Ocean Currents",!0,[t("sstAnom","warmth","Sea surface temperature against its latitude's mean"),t("currentU","u","Current, eastward"),t("currentV","v","Current, northward")],"Warm and cold currents (the sea against its latitude's average), and the current itself as data"),e("upwelling","Upwelling",!0,[t("upwelling","","Upwelling")],"Cold water rising where the wind pushes the surface away, m a day"),e("ice","Ice",!0,[t("seaIce","sea-ice","Sea ice cover"),t("snow","snow","Snow cover on land"),t("iceSheet","ice-sheet","Ice sheet")],"Sea ice, the season's snow on land and the ice sheets \u2014 three data files"),e("tempRange","Temperature Range",!1,[t("tempRange","","Temperature range")],"Warmest month minus coldest, \xB0C"),e("rainShadow","Rain Shadow",!0,[t("rainShadow","","Rain shadow")],"The mountains' share of the rain: the ratio of the rain with them to without \u2014 for the year, January or July, as the winds turn"),e("aridity","Aridity",!1,[t("aridity","","Aridity")],"P / PET: rain against what the sun could evaporate"),e("growing","Growing Season",!1,[t("growing","","Growing season")],"Months above 10 \xB0C"),e("rainSeason","Rain Seasonality",!1,[t("rainSeason","","Rain seasonality")],"How much of the rain falls in a few months (Walsh's index)")]}var Ft=Math.PI,Ce=Ft/2,fa=2*Ft,Je=Math.SQRT2,Sn=Ft/180,Xi=Math.sqrt(3),Fl=i=>((i+Ft)%fa+fa)%fa-Ft,Xe=(i,t,e)=>i<t?t:i>e?e:i,Ol=[1,.9986,.9954,.99,.9822,.973,.96,.9427,.9216,.8962,.8679,.835,.7986,.7597,.7186,.6732,.6213,.5722,.5322],qi=[0,.062,.124,.186,.248,.31,.372,.434,.4958,.5571,.6176,.6769,.7346,.7903,.8435,.8936,.9394,.9761,1];function Af(i){let t=Math.min(17,Math.floor(i/5)),e=i/5-t;return[Ol[t]+(Ol[t+1]-Ol[t])*e,qi[t]+(qi[t+1]-qi[t])*e]}function G1(i){let t=0;for(;t<17&&qi[t+1]<i;)t++;return 5*(t+(i-qi[t])/(qi[t+1]-qi[t]))}var mi=[1.340264,-.081106,893e-6,.003796],da=i=>mi[0]*i+mi[1]*i**3+mi[2]*i**7+mi[3]*i**9,Dr=i=>mi[0]+3*mi[1]*i*i+7*mi[2]*i**6+9*mi[3]*i**8,Ul=Math.asin(Xi/2);function V1(i){let t=Ft*Math.sin(i),e=i;for(let n=0;n<12;n++){let s=2*e+Math.sin(2*e)-t,r=2+2*Math.cos(2*e);if(r<1e-9)break;let o=s/r;if(e-=o,Math.abs(o)<1e-10)break}return e}function Tf(i,t,e,n,s){let r=Math.sin(n),o=Math.cos(n),a=Math.asin(Xe(o*Math.sin(s)+(e?t*r*Math.cos(s)/e:0),-1,1));return[Math.atan2(i*r,e*o*Math.cos(s)-t*r*Math.sin(s)),a]}var Oe={equirect:{label:"Equirectangular",note:"2 : 1, the grid as straight lines",bounds:()=>[-Ft,Ft,-Ce,Ce],fwd:(i,t)=>[i,t],inv:(i,t)=>[i,t]},mercator:{label:"Mercator",note:"conformal; the poles cut at the max latitude",bounds:i=>{let t=Math.log(Math.tan(Ft/4+(i.maxLat??85)*Sn/2));return[-Ft,Ft,-t,t]},fwd:(i,t,e)=>Math.abs(t)>(e.maxLat??85)*Sn?null:[i,Math.log(Math.tan(Ft/4+t/2))],inv:(i,t)=>[i,2*Math.atan(Math.exp(t))-Ce]},robinson:{label:"Robinson",note:"the atlas compromise; straight parallels",bounds:()=>[-.8487*Ft,.8487*Ft,-1.3523,1.3523],fwd:(i,t)=>{let[e,n]=Af(Math.abs(t)/Sn);return[.8487*e*i,1.3523*n*Math.sign(t)]},inv:(i,t)=>{let e=Math.abs(t)/1.3523;if(e>1)return null;let n=G1(e),s=Af(n)[0],r=i/(.8487*s);return Math.abs(r)>Ft?null:[r,n*Sn*Math.sign(t)]}},equalearth:{label:"Equal Earth",note:"equal-area",bounds:()=>[-2*Xi*Ft/(3*Dr(0)),2*Xi*Ft/(3*Dr(0)),-da(Ul),da(Ul)],fwd:(i,t)=>{let e=Math.asin(Xi/2*Math.sin(t));return[2*Xi*i*Math.cos(e)/(3*Dr(e)),da(e)]},inv:(i,t)=>{let e=t;for(let s=0;s<12;s++){let r=(da(e)-t)/Dr(e);if(e-=r,Math.abs(r)<1e-10)break}if(Math.abs(e)>Ul+1e-9)return null;let n=3*i*Dr(e)/(2*Xi*Math.cos(e));return Math.abs(n)>Ft?null:[n,Math.asin(Xe(Math.sin(e)/(Xi/2),-1,1))]}},mollweide:{label:"Mollweide",note:"equal-area, a 2 : 1 ellipse",bounds:()=>[-2*Je,2*Je,-Je,Je],fwd:(i,t)=>{let e=V1(t);return[2*Je/Ft*i*Math.cos(e),Je*Math.sin(e)]},inv:(i,t)=>{let e=t/Je;if(Math.abs(e)>1)return null;let n=Math.asin(e),s=Math.asin(Xe((2*n+Math.sin(2*n))/Ft,-1,1)),r=Math.cos(n);if(r<1e-9)return Math.abs(i)<1e-9?[0,s]:null;let o=Ft*i/(2*Je*r);return Math.abs(o)>Ft+1e-9?null:[o,s]}},hammer:{label:"Hammer",note:"equal-area, curved parallels",bounds:()=>[-2*Je,2*Je,-Je,Je],fwd:(i,t)=>{let e=Math.sqrt(1+Math.cos(t)*Math.cos(i/2));return[2*Je*Math.cos(t)*Math.sin(i/2)/e,Je*Math.sin(t)/e]},inv:(i,t)=>{let e=1-(i/4)**2-(t/2)**2;if(e<.5)return null;let n=Math.sqrt(e);return[2*Math.atan2(n*i,2*(2*e-1)),Math.asin(Xe(n*t,-1,1))]}},winkel:{label:"Winkel Tripel",note:"a balance of area, angle and distance",bounds:i=>{let t=Math.cos((i.par??50.46)*Sn);return[-.5*(Ft*t+Ft),.5*(Ft*t+Ft),-Ce,Ce]},fwd:(i,t,e)=>{let n=Math.cos((e.par??50.46)*Sn),s=Math.acos(Xe(Math.cos(t)*Math.cos(i/2),-1,1)),r=s<1e-9?1:Math.sin(s)/s;return[.5*(i*n+2*Math.cos(t)*Math.sin(i/2)/r),.5*(t+Math.sin(t)/r)]},inv:(i,t,e)=>{let n=Math.cos((e.par??50.46)*Sn),s=2*i/(n+1),r=t;for(let a=0;a<30;a++){let c=Oe.winkel.fwd(s,r,e),l=c[0]-i,h=c[1]-t;if(Math.abs(l)+Math.abs(h)<1e-10)break;let u=1e-6,d=Oe.winkel.fwd(s+u,r,e),p=Oe.winkel.fwd(s,r+u,e),g=(d[0]-c[0])/u,_=(p[0]-c[0])/u,m=(d[1]-c[1])/u,f=(p[1]-c[1])/u,v=g*f-_*m;if(Math.abs(v)<1e-14||(s-=(f*l-_*h)/v,r-=(-m*l+g*h)/v,Math.abs(r)>Ce+.2||Math.abs(s)>Ft+.4))return null}if(Math.abs(s)>Ft+1e-6||Math.abs(r)>Ce+1e-6)return null;let o=Oe.winkel.fwd(s,r,e);return Math.abs(o[0]-i)+Math.abs(o[1]-t)<1e-6?[Xe(s,-Ft,Ft),Xe(r,-Ce,Ce)]:null}},ortho:{label:"Orthographic",note:"the globe from far away; one hemisphere, or two opposite ones side by side",bounds:i=>(i.hemis??2)===2?[-2.12,2.12,-1.06,1.06]:[-1.04,1.04,-1.04,1.04],fwd:(i,t,e)=>{let n=(e.hemis??2)===2,s=(e.lat0??20)*Sn;for(let r=0;r<(n?2:1);r++){let o=Fl(i-r*Ft);if(!(Math.sin(s)*Math.sin(t)+Math.cos(s)*Math.cos(t)*Math.cos(o)<0))return[Math.cos(t)*Math.sin(o)+(n?r?1.06:-1.06:0),Math.cos(s)*Math.sin(t)-Math.sin(s)*Math.cos(t)*Math.cos(o),r]}return null},inv:(i,t,e)=>{let n=(e.hemis??2)===2,s=(e.lat0??20)*Sn,r=0;n&&(r=i>0?1:0,i-=r?1.06:-1.06);let o=Math.hypot(i,t);if(o>1)return null;let[a,c]=Tf(i,t,o,Math.asin(o),s);return[Fl(a+r*Ft),c]}},vdg:{label:"Van der Grinten",note:"the whole world in a circle, the old atlas look",bounds:()=>[-Ft,Ft,-Ft,Ft],fwd:(i,t)=>{if(Math.abs(t)<1e-9)return[i,0];let e=Math.asin(Xe(2*Math.abs(t)/Ft,0,1));if(Math.abs(i)<1e-9||Math.abs(Math.abs(t)-Ce)<1e-9)return[0,Math.sign(t)*Ft*Math.tan(e/2)];let n=Math.abs(Ft/i-i/Ft)/2,s=Math.cos(e)/(Math.sin(e)+Math.cos(e)-1),r=s*(2/Math.sin(e)-1),o=n*n+s,a=r*r,c=n*n,l=Math.sign(i)*Ft*(n*(s-a)+Math.sqrt(Math.max(0,c*(s-a)**2-(a+c)*(s*s-a))))/(a+c),h=Math.sign(t)*Ft*(r*o-n*Math.sqrt(Math.max(0,(c+1)*(a+c)-o*o)))/(a+c);return[l,h]},inv:(i,t)=>{let e=i/Ft,n=t/Ft,s=e*e,r=n*n;if(s+r>1)return null;if(Math.abs(n)<1e-12)return Math.abs(e)>1?null:[i,0];let o=-Math.abs(n)*(1+s+r),a=o-2*r+s,c=-2*o+1+2*r+(s+r)**2,l=r/c+(2*a**3/c**3-9*o*a/(c*c))/27,h=(o-a*a/(3*c))/c,u=2*Math.sqrt(-h/3),d=Math.acos(Xe(3*l/(h*u),-1,1))/3,p=Ft*(-u*Math.cos(d+Ft/3)-a/(3*c))*Math.sign(n),g=Math.abs(e)<1e-12?0:Ft*(s+r-1+Math.sqrt(1+2*(s-r)+(s+r)**2))/(2*e);return Math.abs(g)>Ft+1e-9?null:[g,Xe(p,-Ce,Ce)]}},azeq:{label:"Azimuthal equidistant",note:"true distance and bearing from the centre; polar when centred on a pole",bounds:i=>{let t=(i.extent??"world")==="world"?Ft:Ce;return[-t,t,-t,t]},fwd:(i,t,e)=>{let n=(e.lat0??90)*Sn,s=Xe(Math.sin(n)*Math.sin(t)+Math.cos(n)*Math.cos(t)*Math.cos(i),-1,1),r=Math.acos(s);if((e.extent??"world")!=="world"&&r>Ce)return null;let o=r<1e-9?1:r/Math.sin(r);return[o*Math.cos(t)*Math.sin(i),o*(Math.cos(n)*Math.sin(t)-Math.sin(n)*Math.cos(t)*Math.cos(i))]},inv:(i,t,e)=>{let n=Math.hypot(i,t),s=(e.extent??"world")==="world"?Ft:Ce;return n>s?null:Tf(i,t,n,n,(e.lat0??90)*Sn)}}},Yi=["equirect","mercator","robinson","equalearth","mollweide","hammer","winkel","ortho","azeq","vdg"].map(i=>({id:i,label:Oe[i].label,note:Oe[i].note})),Rf={mercator:[{id:"maxLat",label:"Max latitude",type:"select",values:[[85,"85\xB0"],[80,"80\xB0"],[75,"75\xB0"],[70,"70\xB0"]],def:85}],winkel:[{id:"par",label:"Standard parallel",type:"select",values:[[50.46,"50.5\xB0 (Winkel\u2019s)"],[40,"40\xB0"],[60,"60\xB0"]],def:50.46}],ortho:[{id:"lat0",label:"Centre latitude",type:"range",min:-90,max:90,def:20},{id:"hemis",label:"Hemispheres",type:"select",values:[[2,"two, opposite"],[1,"one"]],def:2}],azeq:[{id:"lat0",label:"Centre latitude",type:"range",min:-90,max:90,def:90},{id:"extent",label:"Extent",type:"select",values:[["world","the whole world"],["hemi","a hemisphere"]],def:"world"}]};function pa(i,t,e={}){let[n,s,r,o]=Oe[i].bounds(e);return{w:t,h:Math.max(1,Math.round(t*(o-r)/(s-n)))}}function Cf(i,t,e={}){if(t==="equirect")return i;let n=Oe[t],[s,r,o,a]=n.bounds(e),{W:c,H:l,kind:h,data:u}=i,{w:d,h:p}=pa(t,c,e),g=h==="rgba"?4:1,_=h==="rgba"?new Uint8ClampedArray(d*p*4):h==="gray16"?new Uint16Array(d*p):new Uint8Array(d*p),m=h==="gray16",f=b=>s+(b+.5)/d*(r-s),v=b=>a-(b+.5)/p*(a-o),x=8,S=Math.ceil(d/x)+1,P=Math.ceil(p/x)+1,E=new Float64Array(S*P),L=new Float64Array(S*P),V=new Uint8Array(S*P);for(let b=0;b<P;b++)for(let D=0;D<S;D++){let O=n.inv(s+Math.min(d,D*x)/d*(r-s),a-Math.min(p,b*x)/p*(a-o),e),k=b*S+D;O&&(E[k]=O[0],L[k]=O[1],V[k]=1)}let M=(b,D,O)=>{let k=(b/fa+.5)*c-.5,A=(.5-D/Ft)*l-.5;if(!m){let H=(Math.round(k)%c+c)%c,W=Xe(Math.round(A),0,l-1),Z=(W*c+H)*g;g===4?(_[O]=u[Z],_[O+1]=u[Z+1],_[O+2]=u[Z+2],_[O+3]=255):_[O]=u[Z];return}let C=Math.floor(k),R=Math.floor(A),N=k-C,F=A-R,z=(C%c+c)%c,B=(z+1)%c,X=Xe(R,0,l-1),K=Xe(R+1,0,l-1);_[O]=Math.round((u[X*c+z]*(1-N)+u[X*c+B]*N)*(1-F)+(u[K*c+z]*(1-N)+u[K*c+B]*N)*F)};for(let b=0;b<p;b++){let D=Math.floor(b/x),O=(b+.5)/x-D,k=v(b);for(let A=0;A<d;A++){let C=Math.floor(A/x),R=D*S+C,N=(b*d+A)*g,F,z;if(V[R]&&V[R+1]&&V[R+S]&&V[R+S+1]&&Math.abs(E[R]-E[R+1])<1&&Math.abs(E[R]-E[R+S])<1&&Math.abs(E[R]-E[R+S+1])<1){let X=(A+.5)/x-C;F=(E[R]*(1-X)+E[R+1]*X)*(1-O)+(E[R+S]*(1-X)+E[R+S+1]*X)*O,z=(L[R]*(1-X)+L[R+1]*X)*(1-O)+(L[R+S]*(1-X)+L[R+S+1]*X)*O}else{let X=n.inv(f(A),k,e);if(!X)continue;F=X[0],z=X[1]}M(Fl(F),Xe(z,-Ce,Ce),N)}}return{kind:h,W:d,H:p,data:_,alpha:h==="rgba"}}function Bl(i,t,e=null,n=()=>{}){let s=Rf[t]||[];i.innerHTML="",i.hidden=!s.length;for(let r of s){let o=document.createElement("label");o.className="xp-proj-opt";let a=e&&e[r.id]!=null?e[r.id]:r.def;r.type==="select"?(o.innerHTML=`<span>${r.label}</span><select data-opt="${r.id}">${r.values.map(([c,l])=>`<option value="${c}"${String(c)===String(a)?" selected":""}>${l}</option>`).join("")}</select>`,o.querySelector("select").addEventListener("change",n)):(o.innerHTML=`<span>${r.label} <b class="v">${a}\xB0</b></span><input type="range" data-opt="${r.id}" min="${r.min}" max="${r.max}" step="${r.step||5}" value="${a}">`,o.querySelector("input").addEventListener("input",c=>{o.querySelector("b").textContent=c.target.value+"\xB0",n()})),i.appendChild(o)}return()=>{let r={};for(let o of i.querySelectorAll("[data-opt]"))r[o.dataset.opt]=o.type==="range"?Number(o.value):isNaN(+o.value)?o.value:+o.value;return r}}var W1={color:{colour:!0},satellite:{colour:!0},koppen:{colour:!0},landheightmap:{data:!0},landmask:{data:!0}},$i=()=>new Promise(i=>setTimeout(i,0));function Pf({host:i,overlay:t,catalogue:e,adapter:n,onOpen:s,getCenterLon:r=()=>0,getProjection:o=null,storageKey:a="wo-export"}){let c=n.page,l=i.querySelector("h3"),h=document.createElement("div");h.className="xp",h.innerHTML=`
        <div class="xp-settings">
            <div class="cg"><label>Width <span class="v" id="exportDims"></span></label><select id="exportWidth"></select></div>
            <div class="cg"><label>Projection <span class="tip" data-tip="The map's shape. Equirectangular is the plain 2 : 1 map (the one that re-imports and that most tools expect); the others are drawn from it pixel by pixel. Each has its own options below it">?</span></label><select id="exportProjection"></select></div>
            <div class="cg xp-proj-opts" id="exportProjOpts" hidden></div>
            <div class="cg"><label>Centre longitude <span class="v" id="exportCentreV">0\xB0</span> <span class="tip" data-tip="The longitude in the middle of the map \u2014 the map view's Center Longitude when the dialog opens. The file name notes it (-c90E)">?</span></label><input type="range" id="exportCentreLon" min="-180" max="180" step="5" value="0"></div>
            <div class="cg"><label>Season <span class="tip" data-tip="For the maps that change with the seasons (marked \u263C): the year's mean, January, July, or all three as separate files">?</span></label><select id="exportSeason"><option value="year">Year</option><option value="jan">January</option><option value="jul">July</option><option value="all">All three</option></select></div>
        </div>
        <div class="xp-head"><span>Map</span><span title="As shown on screen, in its legend's colours">Colour</span><span title="The numbers themselves: a greyscale on a fixed scale (README.txt says which)">Data</span></div>
        <div class="xp-layers" id="exportLayers"></div>
        <div class="xp-options">
            <label class="xp-opt" id="exportShadeRow"><input type="checkbox" id="chkExportShade" checked> Hillshade on the colour maps <span class="tip" data-tip="Shade the Colour Map and the Satellite view by the relief, as on screen. Off, they are flat colour \u2014 to lay your own shading over">?</span></label>
            <label class="xp-opt"><input type="checkbox" id="chkExportReadme" checked> README.txt in the ZIP <span class="tip" data-tip="A text file naming every map, its kind, units and scale, the projection and the centre \u2014 for whoever opens the files later">?</span></label>
        </div>
        <div class="xp-planet" id="exportPlanet" hidden>
            <div class="xp-planet-text"><span>Planet file <span class="tip" data-tip="The whole history and this detailed moment in one file (.orogen), to open again later without building them again \u2014 the same planet in any browser. Its maps are drawn again from it, so later versions of World Orogen can draw them better">?</span></span><small id="exportPlanetNote"></small></div>
            <button class="btn-ghost" id="exportPlanetGo" type="button">Save planet</button>
        </div>
        <div class="xp-progress" id="exportProgress" hidden><div class="xp-bar"><i></i></div><span></span></div>
        <div class="export-actions">
            <button class="btn-ghost xp-small" id="exportNone" type="button">None</button>
            <button class="btn-ghost xp-small" id="exportAllSel" type="button">All</button>
            <span class="xp-spacer"></span>
            <button class="btn-ghost" id="exportCancel" type="button">Cancel</button>
            <button class="btn-primary" id="exportGo" type="button">Export</button>
        </div>`,l.after(h);let u=C=>h.querySelector("#"+C),d={width:u("exportWidth"),dims:u("exportDims"),proj:u("exportProjection"),projOpts:u("exportProjOpts"),centre:u("exportCentreLon"),centreV:u("exportCentreV"),season:u("exportSeason"),layers:u("exportLayers"),shadeRow:u("exportShadeRow"),shade:u("chkExportShade"),readme:u("chkExportReadme"),progress:u("exportProgress"),go:u("exportGo"),cancel:u("exportCancel"),none:u("exportNone"),all:u("exportAllSel"),planet:u("exportPlanet"),planetNote:u("exportPlanetNote"),planetGo:u("exportPlanetGo")};n.options?.hillshade||(d.shadeRow.hidden=!0);for(let C of Yi){let R=document.createElement("option");R.value=C.id,R.textContent=C.label,d.proj.appendChild(R)}let p=[],g=new Map;for(let C of e){let R=document.createElement("div");R.className="xp-group",R.innerHTML=`<div class="xp-group-title">${C.label}</div>`;for(let N of C.rows){let F=document.createElement("div");F.className="xp-row",F.dataset.id=N.id;let z=N.data&&N.data.length>1?`<small>${N.data.map(X=>X.suffix||X.ext).join(" \xB7 ")}</small>`:"";F.innerHTML=`<span class="xp-name">${N.label}${N.seasonal?' <span class="xp-sun" title="Changes with the seasons">\u263C</span>':""}${N.tip?` <span class="tip" data-tip="${N.tip.replace(/"/g,"&quot;")}">?</span>`:""}${z}</span><label class="xp-check">${N.colour?'<input type="checkbox" data-variant="colour">':"<i>\u2013</i>"}</label><label class="xp-check">${N.data?'<input type="checkbox" data-variant="data">':"<i>\u2013</i>"}</label>`,R.appendChild(F);let B={row:N,el:F,colour:F.querySelector('[data-variant="colour"]'),data:F.querySelector('[data-variant="data"]')};p.push(B),g.set(N.id,B)}d.layers.appendChild(R)}let _={get(){try{return JSON.parse(localStorage.getItem(a+"-"+c)||"null")}catch{return null}},set(C){try{localStorage.setItem(a+"-"+c,JSON.stringify(C))}catch{}}};function m(C){for(let R of p){let N=C?.[R.row.id];R.colour&&(R.colour.checked=!!N?.colour),R.data&&(R.data.checked=!!N?.data)}}function f(){let C={};for(let R of p){let N={colour:!!R.colour?.checked,data:!!R.data?.checked};(N.colour||N.data)&&(C[R.row.id]=N)}return C}function v(){_.set({sel:f(),width:d.width.value,season:d.season.value,readme:d.readme.checked,shade:d.shade.checked,projection:d.proj.value,projOpts:S()})}let x=()=>({});function S(){return x()}function P(C=null){x=Bl(d.projOpts,d.proj.value,C,E),E()}function E(){let C=Number(d.width.value)||0,{w:R,h:N}=pa(d.proj.value,C,S());d.dims.textContent=`${R} \xD7 ${N}`}function L(){let C=d.season.value,R=C==="all"?["year","jan","jul"]:[C],N=[];for(let F of p){if(F.el.classList.contains("xp-off"))continue;let z=F.row.seasonal?R:[null];for(let B of z)if(F.colour?.checked&&N.push({row:F.row,variant:"colour",season:B,file:null,label:F.row.label}),F.data?.checked)for(let X of F.row.data)N.push({row:F.row,variant:"data",season:B,file:X,label:X.label||F.row.label})}return N}function V(){let C=L().length;d.go.textContent=C===0?"Export":C===1?"Export 1 file":`Export ${C} files as ZIP`,d.go.disabled=C===0||b,d.planetGo.disabled=b||!D}let M=null,b=!1,D=!1;d.layers.addEventListener("change",()=>{V(),v()}),d.season.addEventListener("change",()=>{V(),v()}),d.width.addEventListener("change",()=>{E(),v()}),d.proj.addEventListener("change",()=>{P(),v()}),d.projOpts.addEventListener("change",v),d.centre.addEventListener("input",()=>{let C=Number(d.centre.value);d.centreV.textContent=C?`${Math.abs(C)}\xB0${C>0?"E":"W"}`:"0\xB0"}),d.readme.addEventListener("change",v),d.shade.addEventListener("change",v),d.none.addEventListener("click",()=>{m({}),V(),v()}),d.all.addEventListener("click",()=>{for(let C of p)C.el.classList.contains("xp-off")||(C.colour&&(C.colour.checked=!0),C.data&&(C.data.checked=!0));V(),v()});let O=(C,R)=>{d.progress.hidden=!1,d.progress.querySelector("i").style.width=`${Math.round(100*Math.min(1,Math.max(0,C)))}%`,d.progress.querySelector("span").textContent=R};function k(){if(M=s?s():{},M===null)return;let C=_.get(),R=n.widths(M),N=C?.width&&R.some(B=>String(B.w)===String(C.width)&&!B.disabled)?String(C.width):String((R.find(B=>B.selected)||R.find(B=>!B.disabled)||R[0]).w);d.width.innerHTML=R.map(B=>`<option value="${B.w}"${B.disabled?" disabled":""}>${B.label||B.w}</option>`).join(""),d.width.value=N;for(let B of p){let X=n.available?n.available(B.row,M):!0;B.el.classList.toggle("xp-off",!X),B.el.title=X?"":B.row.offTip??(B.row.needs==="climate"?"Needs the moment's climate (Add detail first)":"Not available here");for(let K of[B.colour,B.data])K&&(K.disabled=!X)}m(C?.sel||W1),d.season.value=C?.season||"year",d.readme.checked=C?.readme!==!1,d.shade.checked=C?.shade!==!1;let F=o?o():null;F&&F.id&&F.id!=="equirect"?(d.proj.value=F.id,P(F.opts||null)):(d.proj.value=C?.projection&&Yi.some(B=>B.id===C.projection)?C.projection:"equirect",P(C?.projOpts||null));let z=Math.round(r()||0);if(d.centre.value=String(z),d.centreV.textContent=z?`${Math.abs(z)}\xB0${z>0?"E":"W"}`:"0\xB0",d.progress.hidden=!0,d.planet.hidden=!n.planetFile,n.planetFile){let B=n.planetFile.status(M);D=B.ok,d.planetNote.textContent=B.note}n.titleNote&&(l.querySelector(".xp-note")?.remove(),l.insertAdjacentHTML("beforeend",` <span class="xp-note evo-export-moment">${n.titleNote(M)}</span>`)),V(),t.classList.remove("hidden")}function A(){b||(t.classList.add("hidden"),M=null)}return i.querySelector("#exportClose").addEventListener("click",A),d.cancel.addEventListener("click",A),t.addEventListener("click",C=>{C.target===t&&A()}),document.addEventListener("keydown",C=>{C.key==="Escape"&&!t.classList.contains("hidden")&&A()}),d.go.addEventListener("click",async()=>{if(b)return;let C=L();if(!C.length)return;b=!0,d.go.disabled=!0,d.cancel.disabled=!0;let R=Number(d.width.value),N=Number(d.centre.value),F=d.proj.value,z=S(),B={width:R,centerLon:N,season:d.season.value,hillshade:!n.options?.hillshade||d.shade.checked,projection:F,projOpts:z},X=performance.now();try{O(0,"Starting\u2026"),await $i();let K=[...new Set(C.map(ot=>ot.row).filter(ot=>ot.needs))];K.length&&n.ensure&&await n.ensure(K,O,M);let H=await n.begin(R,B,M,O),W=[],Z=[],nt=C.length,et=n.names(M,B);try{for(let ot=0;ot<nt;ot++){let vt=C[ot],q=`${vt.label}${vt.season?` (${Dl[vt.season]})`:""}`,Pt=(bt,T)=>O((ot+.8*bt)/(nt+.3),`${q} \u2014 ${T} (${ot+1} of ${nt})`);Pt(0,"drawing"),await $i();let at=await n.produce(H,vt,Pt);vt.file?.bits===8&&at.kind==="gray16"&&(at={...at,kind:"gray8",data:bf(at.data)});let Mt=at.kind!=="file";Mt&&F!=="equirect"&&(Pt(.6,"projecting"),await $i(),at=Cf(at,F,z)),Mt&&(Pt(.8,"encoding PNG"),await $i());let pt=Mt?at.kind==="rgba"?at.alpha?await yf(at.W,at.H,at.data):await xf(at.W,at.H,at.data):await _f(at.W,at.H,at.data,at.kind==="gray8"?8:16):at.blob,Rt=Nl([...et.start,vt.row.id==="color"?"colormap":vt.row.id,vt.season,vt.file?.suffix,vt.variant==="data"&&vt.row.colour?"data":null,...et.end],vt.file?.ext??"png");W.push({name:Rt,blob:pt}),Z.push({name:Rt,label:vt.label,season:vt.season,file:vt.file,kind:at.kind,about:at.about,W:at.W,H:at.H}),at=null,await $i()}}finally{n.end&&await n.end(H)}let mt,St;if(W.length===1&&!(d.readme.checked&&!1))mt=W[0].blob,St=W[0].name;else{if(O(nt/(nt+.3),"Packing the ZIP\u2026"),await $i(),d.readme.checked){let{w:ot,h:vt}=pa(F,R,z),q=Yi.find(at=>at.id===F),Pt={...n.about(M,B),width:ot,height:vt,projection:q.label,projectionNote:q.note,centerLon:N,hillshade:n.options?.hillshade?B.hillshade:null};W.push({name:"README.txt",blob:new Blob([wf(Pt,Z,n.koppenClasses,n.readmeLists?.(Z)??[])],{type:"text/plain"})})}mt=await vf(W),St=Nl([...et.start,"export",...et.end],"zip")}Il(mt,St),O(1,`Saved ${St} \xB7 ${(mt.size/2**20).toFixed(1)} MB in ${((performance.now()-X)/1e3).toFixed(0)} s`)}catch(K){O(0,`Could not export: ${String(K&&K.message||K).split(`
`)[0]}`),console.error(K)}finally{b=!1,d.cancel.disabled=!1,V()}}),d.planetGo.addEventListener("click",async()=>{if(b||!D||!n.planetFile)return;b=!0,d.cancel.disabled=!0,V();let C=performance.now();try{O(0,"Starting\u2026"),await $i();let{blob:R,name:N}=await n.planetFile.save(M,O);Il(R,N),O(1,`Saved ${N} \xB7 ${(R.size/2**20).toFixed(1)} MB in ${((performance.now()-C)/1e3).toFixed(0)} s`)}catch(R){O(0,`Could not save the planet: ${String(R&&R.message||R).split(`
`)[0]}`),console.error(R)}finally{b=!1,d.cancel.disabled=!1,V()}}),{open:k,close:A}}var ma={unit:"km (sea level at 5/11 of the range)",lo:-5,hi:6},X1={unit:"km above sea level (the sea 0)",lo:0,hi:6},q1=[{id:"maps",label:"Maps",rows:[{id:"color",label:"Colour Map",colour:!0,tip:"The Terrain view in the Colours chosen: the land by height, the sea by depth"},{id:"satellite",label:"Satellite",colour:!0,seasonal:!0,needs:"climate",tip:"The Satellite view: each climate's colours climbing with the land to rock and snow, sea ice in its season"},{id:"koppen",label:"Climate zones (K\xF6ppen)",colour:!0,needs:"climate",data:[{key:"koppenIndex",suffix:"index",label:"K\xF6ppen class index",scale:Ws.koppenIndex,bits:8}],tip:"The K\xF6ppen classes in the legend's colours; as data, each class's index (the README lists them)"}]},{id:"elevation",label:"Elevation",rows:[{id:"heightmap",label:"Heightmap with sea floor",data:[{key:"heightmap",suffix:"",label:"Heightmap with sea floor",scale:ma,bits:16}],tip:"16-bit greyscale: black \u22125 km, white +6 km, the same scale on every planet"},{id:"landheightmap",label:"Land heightmap",data:[{key:"landheightmap",suffix:"",label:"Land heightmap",scale:X1,bits:16}],tip:"16-bit greyscale: the sea black, land 0 to 6 km \u2014 re-imports on the Import Heightmap page"},{id:"landmask",label:"Land mask",data:[{key:"landmask",suffix:"",label:"Land mask",scale:Ws.landmask,bits:8}],tip:"Land white, the sea black"},{id:"hillshade",label:"Hillshade",data:[{key:"hillshade",suffix:"",label:"Hillshade",scale:Ws.hillshade,bits:8}],tip:"The relief lit from the north-west, on its own \u2014 to lay over a flat colour map"}]},{id:"climate",label:"Climate",rows:Ef("climate")},{id:"geology",label:"Geology",rows:[{id:"plates",label:"Plates",colour:!0,data:[{key:"plateId",suffix:"id",label:"Plate number",scale:Ws.plateId,bits:8}],tip:"The plates in their colours (Show Plates); as data, each plate's number"}]}];function Y1(i,t){let e=i.climate,n=e.grid,s=e.cells,r=i.r_elevation,o=c=>!(r[c]>0),a=(c,l)=>ca(i,c,l);return{temperature:c=>o(c)?a((n.Tsea??n.T)[t],c):s.t[t][c],precip:c=>o(c)?a(n.P[t],c):s.p[t][c],pressure:c=>a(n.slp[t],c),windSpeed:c=>Math.hypot(a(n.u[t],c),a(n.v[t],c)),windU:c=>a(n.u[t],c),windV:c=>a(n.v[t],c),sstAnom:c=>o(c)?a(n.sstAnom[t],c):NaN,currentU:c=>o(c)?a(n.currentU[t],c):NaN,currentV:c=>o(c)?a(n.currentV[t],c):NaN,upwelling:c=>o(c)?a(n.upwelling[t],c):NaN,seaIce:c=>o(c)?a(n.seaIce[t],c):0,snow:c=>o(c)||!n.snow?0:a(n.snow[t],c),iceSheet:c=>o(c)||!n.iceSheet?0:a(n.iceSheet,c),tempRange:c=>o(c)?NaN:s.tRange[c],rainShadow:c=>o(c)?NaN:a(t==="year"?n.orographic:n.orographicSeasons[t],c),aridity:c=>o(c)?NaN:s.aridity[c],growing:c=>o(c)?NaN:s.growing[c],rainSeason:c=>o(c)?NaN:s.rainSeason[c]}}function Lf({page:i,ensureClimate:t,code:e}){let n={page:i,options:{hillshade:!1},koppenClasses:un,widths:()=>[1024,2048,4096,8192,16384,32768,65536].map(s=>({w:s,label:s>8192&&y.isTouchDevice?`${s} (too large for mobile)`:String(s),disabled:s>8192&&y.isTouchDevice,selected:s===4096})),available:()=>!0,ensure:async(s,r)=>{s.some(o=>o.needs==="climate")&&!y.climateComputed&&(r(0,"Computing the climate\u2026"),await t((o,a)=>r(0,a||"Computing the climate\u2026")))},begin:async(s,r)=>({render:ff(s,r.centerLon),opts:r,sat:{},values:{}}),end:async s=>{mf(s.render),s.sat=s.values=null},names:(s,r)=>({start:["orogen",i==="import"?"import":null],end:[e(),df(r.centerLon)]}),about:(s,r)=>{let o=e();return{page:i==="import"?"Import Heightmap":"Generate",planet:o?`planet code ${o}`:"an imported heightmap",link:o?`https://orogen.studio/generate#${o}`:null,notes:[]}},produce:async(s,r,o)=>{let a=y.curData,{r_elevation:c,r_plate:l,debugLayers:h}=a,u=h&&h.koppen,d=r.season||"year",p=r.row.id,g=x=>pf(s.render,x,o);if(r.variant==="colour"){if(p==="color"){let S=Bi();return g({mode:"rgb",colorOf:P=>S(c[P])})}if(p==="satellite"){let S=s.sat[d]||(s.sat[d]=gf(d));return g({mode:"rgb",colorOf:P=>[S[3*P],S[3*P+1],S[3*P+2]]})}if(p==="koppen")return g({mode:"rgb",colorOf:S=>Lr(El(u[S]))});if(p==="plates")return g({mode:"rgb",colorOf:S=>{let P=y.plateColors[l[S]];return P?[P.r,P.g,P.b]:[.3,.3,.3]}});let x=Hs(p,d,a);if(!x)throw new Error(`no colours for ${p}`);return g({mode:"rgb",colorOf:S=>Lr(x(S))})}let _=r.file.key;if(_==="heightmap")return g({mode:"value",smooth:!0,valueOf:x=>zs(c[x])[0]});if(_==="landheightmap")return g({mode:"value",smooth:!0,valueOf:x=>Ir(c[x])[0]});if(_==="landmask")return g({mode:"value",smooth:!1,valueOf:x=>c[x]>0?1:0});if(_==="koppenIndex")return g({mode:"value",smooth:!1,valueOf:x=>u[x]/255});if(_==="plateId")return g({mode:"value",smooth:!1,valueOf:x=>(l[x]&255)/255});if(_==="hillshade"){let x=await g({mode:"value",smooth:!0,valueOf:P=>zs(c[P])[0]}),S=new Float32Array(x.data.length);for(let P=0;P<S.length;P++)S[P]=ma.lo+x.data[P]/65535*(ma.hi-ma.lo);return{kind:"gray8",W:x.W,H:x.H,data:Sf(S,x.W,x.H)}}let m=s.values[d]||(s.values[d]=Y1(a,d)),f=m[_],v=r.file.scale;if(!f)throw new Error(`no data for ${_}`);return g({mode:"value",smooth:!0,valueOf:x=>Mf(f(x),v)})}};return (globalThis.__cosmossi&&globalThis.__cosmossi.wrapAdapter&&globalThis.__cosmossi.wrapAdapter(n),Pf)({host:document.getElementById("exportCard"),overlay:document.getElementById("exportOverlay"),catalogue:q1,adapter:n,onOpen:()=>y.curData?{}:null,getCenterLon:()=>Math.round((y.mapCenterLon||0)*180/Math.PI),getProjection:()=>y.mapMode?{id:y.mapProjection,opts:y.mapProjOpts}:null})}var Qt=11102230246251565e-32,ye=134217729,Nr=(3+8*Qt)*Qt;function ji(i,t,e,n,s){let r,o,a,c,l=t[0],h=n[0],u=0,d=0;h>l==h>-l?(r=l,l=t[++u]):(r=h,h=n[++d]);let p=0;if(u<i&&d<e)for(h>l==h>-l?(o=l+r,a=r-(o-l),l=t[++u]):(o=h+r,a=r-(o-h),h=n[++d]),r=o,a!==0&&(s[p++]=a);u<i&&d<e;)h>l==h>-l?(o=r+l,c=o-r,a=r-(o-c)+(l-c),l=t[++u]):(o=r+h,c=o-r,a=r-(o-c)+(h-c),h=n[++d]),r=o,a!==0&&(s[p++]=a);for(;u<i;)o=r+l,c=o-r,a=r-(o-c)+(l-c),l=t[++u],r=o,a!==0&&(s[p++]=a);for(;d<e;)o=r+h,c=o-r,a=r-(o-c)+(h-c),h=n[++d],r=o,a!==0&&(s[p++]=a);return(r!==0||p===0)&&(s[p++]=r),p}function Or(i,t){let e=t[0];for(let n=1;n<i;n++)e+=t[n];return e}function dt(i){return new Float64Array(i)}var $1=(3+16*Qt)*Qt,j1=(2+12*Qt)*Qt,K1=(9+64*Qt)*Qt*Qt,Xs=dt(4),If=dt(8),Df=dt(12),Nf=dt(16),qe=dt(4);function Z1(i,t,e,n,s,r,o){let a,c,l,h,u,d,p,g,_,m,f,v,x,S,P,E,L,V,M=i-s,b=e-s,D=t-r,O=n-r;S=M*O,d=ye*M,p=d-(d-M),g=M-p,d=ye*O,_=d-(d-O),m=O-_,P=g*m-(S-p*_-g*_-p*m),E=D*b,d=ye*D,p=d-(d-D),g=D-p,d=ye*b,_=d-(d-b),m=b-_,L=g*m-(E-p*_-g*_-p*m),f=P-L,u=P-f,Xs[0]=P-(f+u)+(u-L),v=S+f,u=v-S,x=S-(v-u)+(f-u),f=x-E,u=x-f,Xs[1]=x-(f+u)+(u-E),V=v+f,u=V-v,Xs[2]=v-(V-u)+(f-u),Xs[3]=V;let k=Or(4,Xs),A=j1*o;if(k>=A||-k>=A||(u=i-M,a=i-(M+u)+(u-s),u=e-b,l=e-(b+u)+(u-s),u=t-D,c=t-(D+u)+(u-r),u=n-O,h=n-(O+u)+(u-r),a===0&&c===0&&l===0&&h===0)||(A=K1*o+Nr*Math.abs(k),k+=M*h+O*a-(D*l+b*c),k>=A||-k>=A))return k;S=a*O,d=ye*a,p=d-(d-a),g=a-p,d=ye*O,_=d-(d-O),m=O-_,P=g*m-(S-p*_-g*_-p*m),E=c*b,d=ye*c,p=d-(d-c),g=c-p,d=ye*b,_=d-(d-b),m=b-_,L=g*m-(E-p*_-g*_-p*m),f=P-L,u=P-f,qe[0]=P-(f+u)+(u-L),v=S+f,u=v-S,x=S-(v-u)+(f-u),f=x-E,u=x-f,qe[1]=x-(f+u)+(u-E),V=v+f,u=V-v,qe[2]=v-(V-u)+(f-u),qe[3]=V;let C=ji(4,Xs,4,qe,If);S=M*h,d=ye*M,p=d-(d-M),g=M-p,d=ye*h,_=d-(d-h),m=h-_,P=g*m-(S-p*_-g*_-p*m),E=D*l,d=ye*D,p=d-(d-D),g=D-p,d=ye*l,_=d-(d-l),m=l-_,L=g*m-(E-p*_-g*_-p*m),f=P-L,u=P-f,qe[0]=P-(f+u)+(u-L),v=S+f,u=v-S,x=S-(v-u)+(f-u),f=x-E,u=x-f,qe[1]=x-(f+u)+(u-E),V=v+f,u=V-v,qe[2]=v-(V-u)+(f-u),qe[3]=V;let R=ji(C,If,4,qe,Df);S=a*h,d=ye*a,p=d-(d-a),g=a-p,d=ye*h,_=d-(d-h),m=h-_,P=g*m-(S-p*_-g*_-p*m),E=c*l,d=ye*c,p=d-(d-c),g=c-p,d=ye*l,_=d-(d-l),m=l-_,L=g*m-(E-p*_-g*_-p*m),f=P-L,u=P-f,qe[0]=P-(f+u)+(u-L),v=S+f,u=v-S,x=S-(v-u)+(f-u),f=x-E,u=x-f,qe[1]=x-(f+u)+(u-E),V=v+f,u=V-v,qe[2]=v-(V-u)+(f-u),qe[3]=V;let N=ji(R,Df,4,qe,Nf);return Nf[N-1]}function qs(i,t,e,n,s,r){let o=(t-r)*(e-s),a=(i-s)*(n-r),c=o-a,l=Math.abs(o+a);return Math.abs(c)>=$1*l?c:-Z1(i,t,e,n,s,r,l)}var Db=(7+56*Qt)*Qt,Nb=(3+28*Qt)*Qt,Ob=(26+288*Qt)*Qt*Qt,Ub=dt(4),Fb=dt(4),Bb=dt(4),kb=dt(4),Hb=dt(4),zb=dt(4),Gb=dt(4),Vb=dt(4),Wb=dt(4),Xb=dt(8),qb=dt(8),Yb=dt(8),$b=dt(4),jb=dt(8),Kb=dt(8),Zb=dt(16),Jb=dt(12),Qb=dt(192),tS=dt(192);var iS=(10+96*Qt)*Qt,sS=(4+48*Qt)*Qt,rS=(44+576*Qt)*Qt*Qt,oS=dt(4),aS=dt(4),cS=dt(4),lS=dt(4),hS=dt(4),uS=dt(4),dS=dt(4),fS=dt(4),pS=dt(8),mS=dt(8),gS=dt(8),_S=dt(8),xS=dt(8),yS=dt(8),vS=dt(8),MS=dt(8),bS=dt(8),SS=dt(4),wS=dt(4),ES=dt(4),AS=dt(8),TS=dt(16),RS=dt(16),CS=dt(16),PS=dt(32),LS=dt(32),IS=dt(48),DS=dt(64),NS=dt(1152),OS=dt(1152);var kS=(16+224*Qt)*Qt,HS=(5+72*Qt)*Qt,zS=(71+1408*Qt)*Qt*Qt,GS=dt(4),VS=dt(4),WS=dt(4),XS=dt(4),qS=dt(4),YS=dt(4),$S=dt(4),jS=dt(4),KS=dt(4),ZS=dt(4),JS=dt(24),QS=dt(24),tw=dt(24),ew=dt(24),nw=dt(24),iw=dt(24),sw=dt(24),rw=dt(24),ow=dt(24),aw=dt(24),cw=dt(1152),lw=dt(1152),hw=dt(1152),uw=dt(1152),dw=dt(1152),fw=dt(2304),pw=dt(2304),mw=dt(3456),gw=dt(5760),_w=dt(8),xw=dt(8),yw=dt(8),vw=dt(16),Mw=dt(24),bw=dt(48),Sw=dt(48),ww=dt(96),Ew=dt(192),Aw=dt(384),Tw=dt(384),Rw=dt(384),Cw=dt(768);var Pw=dt(96),Lw=dt(96),Iw=dt(96),Dw=dt(1152);var Uf=Math.pow(2,-52),ga=new Uint32Array(512),Fr=class i{static from(t,e=iv,n=sv){let s=t.length,r=new Float64Array(s*2);for(let o=0;o<s;o++){let a=t[o];r[2*o]=e(a),r[2*o+1]=n(a)}return new i(r)}constructor(t){let e=t.length>>1;if(e>0&&typeof t[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=t;let n=Math.max(2*e-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(e)),this._hullPrev=new Uint32Array(e),this._hullNext=new Uint32Array(e),this._hullTri=new Uint32Array(e),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(e),this._dists=new Float64Array(e),this.update()}update(){let{coords:t,_hullPrev:e,_hullNext:n,_hullTri:s,_hullHash:r}=this,o=t.length>>1,a=1/0,c=1/0,l=-1/0,h=-1/0;for(let M=0;M<o;M++){let b=t[2*M],D=t[2*M+1];b<a&&(a=b),D<c&&(c=D),b>l&&(l=b),D>h&&(h=D),this._ids[M]=M}let u=(a+l)/2,d=(c+h)/2,p,g,_;for(let M=0,b=1/0;M<o;M++){let D=kl(u,d,t[2*M],t[2*M+1]);D<b&&(p=M,b=D)}let m=t[2*p],f=t[2*p+1];for(let M=0,b=1/0;M<o;M++){if(M===p)continue;let D=kl(m,f,t[2*M],t[2*M+1]);D<b&&D>0&&(g=M,b=D)}let v=t[2*g],x=t[2*g+1],S=1/0;for(let M=0;M<o;M++){if(M===p||M===g)continue;let b=ev(m,f,v,x,t[2*M],t[2*M+1]);b<S&&(_=M,S=b)}let P=t[2*_],E=t[2*_+1];if(S===1/0){for(let D=0;D<o;D++)this._dists[D]=t[2*D]-t[0]||t[2*D+1]-t[1];Ys(this._ids,this._dists,0,o-1);let M=new Uint32Array(o),b=0;for(let D=0,O=-1/0;D<o;D++){let k=this._ids[D],A=this._dists[k];A>O&&(M[b++]=k,O=A)}this.hull=M.subarray(0,b),this.triangles=new Uint32Array(0),this.halfedges=new Uint32Array(0);return}if(qs(m,f,v,x,P,E)<0){let M=g,b=v,D=x;g=_,v=P,x=E,_=M,P=b,E=D}let L=nv(m,f,v,x,P,E);this._cx=L.x,this._cy=L.y;for(let M=0;M<o;M++)this._dists[M]=kl(t[2*M],t[2*M+1],L.x,L.y);Ys(this._ids,this._dists,0,o-1),this._hullStart=p;let V=3;n[p]=e[_]=g,n[g]=e[p]=_,n[_]=e[g]=p,s[p]=0,s[g]=1,s[_]=2,r.fill(-1),r[this._hashKey(m,f)]=p,r[this._hashKey(v,x)]=g,r[this._hashKey(P,E)]=_,this.trianglesLen=0,this._addTriangle(p,g,_,-1,-1,-1);for(let M=0,b,D;M<this._ids.length;M++){let O=this._ids[M],k=t[2*O],A=t[2*O+1];if(M>0&&Math.abs(k-b)<=Uf&&Math.abs(A-D)<=Uf||(b=k,D=A,O===p||O===g||O===_))continue;let C=0;for(let B=0,X=this._hashKey(k,A);B<this._hashSize&&(C=r[(X+B)%this._hashSize],!(C!==-1&&C!==n[C]));B++);C=e[C];let R=C,N;for(;N=n[R],qs(k,A,t[2*R],t[2*R+1],t[2*N],t[2*N+1])>=0;)if(R=N,R===C){R=-1;break}if(R===-1)continue;let F=this._addTriangle(R,O,n[R],-1,-1,s[R]);s[O]=this._legalize(F+2),s[R]=F,V++;let z=n[R];for(;N=n[z],qs(k,A,t[2*z],t[2*z+1],t[2*N],t[2*N+1])<0;)F=this._addTriangle(z,O,N,s[O],-1,s[z]),s[O]=this._legalize(F+2),n[z]=z,V--,z=N;if(R===C)for(;N=e[R],qs(k,A,t[2*N],t[2*N+1],t[2*R],t[2*R+1])<0;)F=this._addTriangle(N,O,R,-1,s[R],s[N]),this._legalize(F+2),s[N]=F,n[R]=R,V--,R=N;this._hullStart=e[O]=R,n[R]=e[z]=O,n[O]=z,r[this._hashKey(k,A)]=O,r[this._hashKey(t[2*R],t[2*R+1])]=R}this.hull=new Uint32Array(V);for(let M=0,b=this._hullStart;M<V;M++)this.hull[M]=b,b=n[b];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,e){return Math.floor(Q1(t-this._cx,e-this._cy)*this._hashSize)%this._hashSize}_legalize(t){let{_triangles:e,_halfedges:n,coords:s}=this,r=0,o=0;for(;;){let a=n[t],c=t-t%3;if(o=c+(t+2)%3,a===-1){if(r===0)break;t=ga[--r];continue}let l=a-a%3,h=c+(t+1)%3,u=l+(a+2)%3,d=e[o],p=e[t],g=e[h],_=e[u];if(tv(s[2*d],s[2*d+1],s[2*p],s[2*p+1],s[2*g],s[2*g+1],s[2*_],s[2*_+1])){e[t]=_,e[a]=d;let f=n[u];if(f===-1){let x=this._hullStart;do{if(this._hullTri[x]===u){this._hullTri[x]=t;break}x=this._hullPrev[x]}while(x!==this._hullStart)}this._link(t,f),this._link(a,n[o]),this._link(o,u);let v=l+(a+1)%3;r<ga.length&&(ga[r++]=v)}else{if(r===0)break;t=ga[--r]}}return o}_link(t,e){this._halfedges[t]=e,e!==-1&&(this._halfedges[e]=t)}_addTriangle(t,e,n,s,r,o){let a=this.trianglesLen;return this._triangles[a]=t,this._triangles[a+1]=e,this._triangles[a+2]=n,this._link(a,s),this._link(a+1,r),this._link(a+2,o),this.trianglesLen+=3,a}};function Q1(i,t){let e=i/(Math.abs(i)+Math.abs(t));return(t>0?3-e:1+e)/4}function kl(i,t,e,n){let s=i-e,r=t-n;return s*s+r*r}function tv(i,t,e,n,s,r,o,a){let c=i-o,l=t-a,h=e-o,u=n-a,d=s-o,p=r-a,g=c*c+l*l,_=h*h+u*u,m=d*d+p*p;return c*(u*m-_*p)-l*(h*m-_*d)+g*(h*p-u*d)<0}function ev(i,t,e,n,s,r){let o=e-i,a=n-t,c=s-i,l=r-t,h=o*o+a*a,u=c*c+l*l,d=.5/(o*l-a*c),p=(l*h-a*u)*d,g=(o*u-c*h)*d;return p*p+g*g}function nv(i,t,e,n,s,r){let o=e-i,a=n-t,c=s-i,l=r-t,h=o*o+a*a,u=c*c+l*l,d=.5/(o*l-a*c),p=i+(l*h-a*u)*d,g=t+(o*u-c*h)*d;return{x:p,y:g}}function Ys(i,t,e,n){if(n-e<=20)for(let s=e+1;s<=n;s++){let r=i[s],o=t[r],a=s-1;for(;a>=e&&t[i[a]]>o;)i[a+1]=i[a--];i[a+1]=r}else{let s=e+n>>1,r=e+1,o=n;Ur(i,s,r),t[i[e]]>t[i[n]]&&Ur(i,e,n),t[i[r]]>t[i[n]]&&Ur(i,r,n),t[i[e]]>t[i[r]]&&Ur(i,e,r);let a=i[r],c=t[a];for(;;){do r++;while(t[i[r]]<c);do o--;while(t[i[o]]>c);if(o<r)break;Ur(i,r,o)}i[e+1]=i[o],i[o]=a,n-r+1>=o-e?(Ys(i,t,r,n),Ys(i,t,e,o-1)):(Ys(i,t,e,o-1),Ys(i,t,r,n))}}function Ur(i,t,e){let n=i[t];i[t]=i[e],i[e]=n}function iv(i){return i[0]}function sv(i){return i[1]}Bf();function Br(i){let t=i/1e3;return Math.round((5e3+2555e3*Math.pow(t,5))/1e3)*1e3}var ov=[101,21,31,21,21,21,21,21,21,21,21,51,10,117,21,2556];var av=22,cv=21,lv=18,hv=17,uv=16,dv=14,fv=13;var pv=[21,21,51,10,117,21,2559],mv=[21,21,21,51,10,117,21,2559],gv=[21,21,21,21,21,51,10,117,21,2559],_v=[21,21,21,21,21,21,51,10,117,21,2559],xv=[21,31,21,21,21,21,21,21,21,21,51,10,117,21,2556],yv=[21,21,21,21,21,21,21,51,10,117,21,2556];var Zw={[fv]:{radices:pv,fields:[["hydraulicErosion",7],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{terrainWarp:.5,glacialErosion:0,thermalErosion:.1,ridgeSharpening:.35,soilCreep:.05,continentSizeVariety:0,greenhouse:0,precipitationOffset:0,landCoverage:.3}},[dv]:{radices:mv,fields:[["thermalErosion",8],["hydraulicErosion",7],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{terrainWarp:.5,glacialErosion:0,ridgeSharpening:.35,soilCreep:.05,continentSizeVariety:0,greenhouse:0,precipitationOffset:0,landCoverage:.3}},[uv]:{radices:gv,fields:[["soilCreep",10],["ridgeSharpening",9],["thermalErosion",8],["hydraulicErosion",7],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{terrainWarp:.5,glacialErosion:0,continentSizeVariety:0,greenhouse:0,precipitationOffset:0,landCoverage:.3}},[hv]:{radices:_v,fields:[["soilCreep",10],["ridgeSharpening",9],["thermalErosion",8],["hydraulicErosion",7],["glacialErosion",6],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{terrainWarp:.5,continentSizeVariety:0,greenhouse:0,precipitationOffset:0,landCoverage:.3}},[lv]:{radices:yv,fields:[["terrainWarp",11],["soilCreep",10],["ridgeSharpening",9],["thermalErosion",8],["hydraulicErosion",7],["glacialErosion",6],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{continentSizeVariety:0,greenhouse:0,precipitationOffset:0,landCoverage:.3}},[cv]:{radices:xv,fields:[["precipitationOffset",14],["greenhouse",13],["continentSizeVariety",12],["terrainWarp",11],["soilCreep",10],["ridgeSharpening",9],["thermalErosion",8],["hydraulicErosion",7],["glacialErosion",6],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{landCoverage:.3}},[av]:{radices:ov,fields:[["landCoverage",15],["precipitationOffset",14],["greenhouse",13],["continentSizeVariety",12],["terrainWarp",11],["soilCreep",10],["ridgeSharpening",9],["thermalErosion",8],["hydraulicErosion",7],["glacialErosion",6],["smoothing",5],["roughness",4],["numContinents",3],["P",2],["jitter",1],["N",0]],defaults:{}}};Ff(Fr);function Hf(){return{N:Br(+document.getElementById("sN").value),jitter:+(document.getElementById("sJ")?.value??.75),terrainWarp:+(document.getElementById("sTw")?.value??0),smoothing:+(document.getElementById("sS")?.value??0),hydraulicErosion:+(document.getElementById("sHEr")?.value??0),thermalErosion:+(document.getElementById("sTEr")?.value??0),ridgeSharpening:+(document.getElementById("sRs")?.value??0),glacialErosion:+(document.getElementById("sGl")?.value??0)}}var $e=null,vv=!0;try{$e=new Worker(new URL("./planet-worker.js",import.meta.url),{type:"module"})}catch(i){console.warn("[World Orogen] Module workers not supported, falling back to main thread:",i),vv=!1}var Ye=null,ve=null,ya=0;function zf(){let i=document.getElementById("generate");i.disabled=!1,i.textContent="Build New World",i.classList.remove("generating","stale")}function kf(i){console.error("[World Orogen] Generation failed:",i),zf(),Ye&&Ye(0,""),window.dispatchEvent(new CustomEvent("orogen:build-failed",{detail:{message:String(i?.message??i??"")}}))}function Mv(i,t,e){return new _a(i,t,e)}function xa(i,t){i.climate=t.climate??null,i.debugLayers&&(i.debugLayers.koppen=i.climate?i.climate.koppen:null),y.climateComputed=!!i.climate}$e&&($e.onmessage=i=>{let t=i.data;switch(t.type){case"progress":Ye&&Ye(t.pct,t.label);break;case"done":{let e=performance.now(),n=performance.now(),s=Mv(t.triangles,t.halfedges,t.numRegions),r=performance.now()-n,o=performance.now();Rl(new Set(t.plateSeeds),new Set(t.plateIsOcean));let a=performance.now()-o;y.climateComputed=!t.skipClimate;let c=performance.now();y.curData={mesh:s,r_xyz:t.r_xyz,t_xyz:t.t_xyz,r_plate:t.r_plate,plateSeeds:new Set(t.plateSeeds),plateVec:t.plateVec,plateIsOcean:new Set(t.plateIsOcean),originalPlateIsOcean:new Set(t.originalPlateIsOcean),plateDensity:t.plateDensity,plateDensityLand:t.plateDensityLand,plateDensityOcean:t.plateDensityOcean,prePostElev:t.prePostElev,r_elevation:t.r_elevation,t_elevation:t.t_elevation,mountain_r:new Set(t.mountain_r),coastline_r:new Set(t.coastline_r),ocean_r:new Set(t.ocean_r),r_stress:t.r_stress,seed:t.seed,nMag:t.nMag,debugLayers:t.debugLayers,terrainMetrics:t.terrainMetrics||null},xa(y.curData,t),t.terrainMetrics&&(window.__terrainMetrics=t.terrainMetrics);let l=performance.now()-c,h=performance.now();Vi();let u=performance.now()-h,d=performance.now()-e,p=performance.now()-ya;{let v=0,x=0,S=y.curData.plateIsOcean,P=y.curData.r_plate,E=y.curData.r_elevation;for(let V=0;V<s.numRegions;V++)S.has(P[V])||v++,isNaN(E[V])&&x++;let L=(100*v/s.numRegions).toFixed(1);x>0&&console.error(`[World Orogen] WARNING: ${x} NaN elevation values detected!`),v/s.numRegions<.1&&console.warn(`[World Orogen] WARNING: Only ${L}% land (${v} regions). Ocean/land growth may have stalled.`)}let g=v=>typeof v=="number"?v.toFixed(1):v;console.log("%c[World Orogen] Generation complete","color:#6cf;font-weight:bold"),t._params&&(console.log(`  Params: N=${t._params.N.toLocaleString()} P=${t._params.P} jitter=${t._params.jitter} noise=${t._params.nMag} continents=${t._params.numContinents} seed=${t._params.seed}`),console.log(`  Sculpting: warp=${t._params.terrainWarp} smooth=${t._params.smoothing} glacial=${t._params.glacialErosion} hydraulic=${t._params.hydraulicErosion} thermal=${t._params.thermalErosion} ridge=${t._params.ridgeSharpening}`)),console.log(`  Regions: ${s.numRegions.toLocaleString()}  Triangles: ${s.numTriangles.toLocaleString()}  Sides: ${s.numSides.toLocaleString()}`),t._pipelineTiming&&(console.groupCollapsed("  %cWorker pipeline stages","color:#8cf"),console.table(t._pipelineTiming.map(v=>({Stage:v.stage,ms:g(v.ms)}))),console.groupEnd()),t._timing&&(console.groupCollapsed("  %cElevation sub-stages","color:#fc8"),console.table(t._timing.map(v=>({Stage:v.stage,ms:g(v.ms)}))),console.groupEnd()),t._postTiming&&t._postTiming.length>0&&(console.groupCollapsed("  %cPost-processing sub-stages","color:#8f8"),console.table(t._postTiming.map(v=>({Stage:v.stage,ms:g(v.ms)}))),console.groupEnd());let _=t._workerTotal||0,m=p-_-d;console.log(`  %cSummary:%c Worker: ${g(_)} ms | Transfer: ${g(m)} ms | Main thread: ${g(d)} ms (reconstruct=${g(r)}, colors=${g(a)}, state=${g(l)}, buildMesh=${g(u)}) | TOTAL: ${g(p)} ms`,"color:#ff6;font-weight:bold","");let f=p.toFixed(0);document.getElementById("stats").innerHTML=`Regions: ${s.numRegions.toLocaleString()}<br>Triangles: ${s.numTriangles.toLocaleString()}<br>Generated in ${f} ms<br><span style="color:#445;font-size:10px">worker ${_.toFixed(0)} \xB7 render ${u.toFixed(0)}</span>`,Ye&&Ye(100,"Done"),zf(),document.getElementById("generate").dispatchEvent(new CustomEvent("generate-done")),ve&&(ve(),ve=null);break}case"reapplyDone":{let e=performance.now();y.climateComputed=!t.skipClimate;let n=y.curData;n.r_elevation=t.r_elevation,n.t_elevation=t.t_elevation,n.debugLayers.erosionDelta=t.erosionDelta,xa(n,t);let s=performance.now();Vi();let r=performance.now()-s,o=performance.now()-e,a=l=>typeof l=="number"?l.toFixed(1):l,c=t._reapplyTiming||{};console.log("%c[World Orogen] Reapply complete","color:#8f8;font-weight:bold"),t._postTiming&&t._postTiming.length>0&&(console.groupCollapsed("  %cPost-processing sub-stages","color:#8f8"),console.table(t._postTiming.map(l=>({Stage:l.stage,ms:a(l.ms)}))),console.groupEnd()),console.log(`  %cSummary:%c Worker: ${a(c.workerTotal||0)} ms (clone=${a(c.clone||0)}, postProcess=${a(c.postProcessing||0)}, triElev=${a(c.triangleElevations||0)}) | Main: ${a(o)} ms (buildMesh=${a(r)})`,"color:#ff6;font-weight:bold",""),Ye&&Ye(100,"Done"),ve&&(ve(),ve=null);break}case"editDone":{let e=performance.now();y.climateComputed=!t.skipClimate;let n=y.curData;n.prePostElev=t.prePostElev,n.r_elevation=t.r_elevation,n.t_elevation=t.t_elevation,n.mountain_r=new Set(t.mountain_r),n.coastline_r=new Set(t.coastline_r),n.ocean_r=new Set(t.ocean_r),n.r_stress=t.r_stress,n.debugLayers=t.debugLayers,xa(n,t);let s=performance.now();Rl(n.plateSeeds,n.plateIsOcean);let r=performance.now()-s,o=performance.now();Vi();let a=performance.now()-o,c=performance.now()-e,l=u=>typeof u=="number"?u.toFixed(1):u,h=t._editTiming||{};console.log("%c[World Orogen] Edit recompute complete","color:#fc8;font-weight:bold"),t._timing&&(console.groupCollapsed("  %cElevation sub-stages","color:#fc8"),console.table(t._timing.map(u=>({Stage:u.stage,ms:l(u.ms)}))),console.groupEnd()),t._postTiming&&t._postTiming.length>0&&(console.groupCollapsed("  %cPost-processing sub-stages","color:#8f8"),console.table(t._postTiming.map(u=>({Stage:u.stage,ms:l(u.ms)}))),console.groupEnd()),console.log(`  %cSummary:%c Worker: ${l(h.workerTotal||0)} ms (elevation=${l(h.elevation||0)}, postProcess=${l(h.postProcessing||0)}, triElev=${l(h.triangleElevations||0)}, retain=${l(h.retainState||0)}) | Main: ${l(c)} ms (colors=${l(r)}, buildMesh=${l(a)})`,"color:#ff6;font-weight:bold",""),Ye&&Ye(100,"Done"),ve&&(ve(),ve=null);break}case"climateDone":{y.curData&&xa(y.curData,t),Vi();let e=s=>typeof s=="number"?s.toFixed(1):s,n=t._climateTiming||{};console.log("%c[World Orogen] Climate computed on demand","color:#f8a;font-weight:bold"),console.log(`  %cSummary:%c Worker: ${e(n.workerTotal||0)} ms (climate=${e(n.climate||0)})`,"color:#ff6;font-weight:bold",""),Ye&&Ye(100,"Done"),ve&&(ve(),ve=null);break}case"error":kf(t.message),ve&&(ve(),ve=null);break}},$e.onerror=i=>{kf(i.message||"Worker crashed"),ve&&(ve(),ve=null);let{onmessage:t,onerror:e}=$e;$e.terminate();try{$e=new Worker(new URL("./planet-worker.js",import.meta.url),{type:"module"}),$e.onmessage=t,$e.onerror=e}catch(n){console.error("[World Orogen] Could not restart the worker:",n)}});function Gf(i,t=!1){if(!$e||!y.curData)return;Ye=(o,a)=>{},ve=i||null,ya=performance.now();let e=Hf(),n=+(document.getElementById("sTmp")?.value??0),s=+(document.getElementById("sPrc")?.value??0),r=+(document.getElementById("sLc")?.value??.3);$e.postMessage({cmd:"reapply",...e,greenhouse:n,precipitationOffset:s,landCoverage:r,skipClimate:t})}function va(i,t){if(!$e||!y.curData)return;Ye=i||(()=>{}),ve=t||null,ya=performance.now();let e=+(document.getElementById("sTmp")?.value??0),n=+(document.getElementById("sPrc")?.value??0),s=+(document.getElementById("sLc")?.value??.3);$e.postMessage({cmd:"computeClimate",greenhouse:e,precipitationOffset:n,landCoverage:s})}function Vf(i,t,e,n,s=!1){if(!$e)return;Ye=n||(()=>{}),ya=performance.now();let{N:r,jitter:o,terrainWarp:a,smoothing:c,hydraulicErosion:l,thermalErosion:h,ridgeSharpening:u,glacialErosion:d}=Hf();$e.postMessage({cmd:"importHeightmap",N:r,jitter:o,grayscale:i,imageWidth:t,imageHeight:e,terrainWarp:a,smoothing:c,hydraulicErosion:l,thermalErosion:h,ridgeSharpening:u,glacialErosion:d,greenhouse:+(document.getElementById("sTmp")?.value??0),precipitationOffset:+(document.getElementById("sPrc")?.value??0),skipClimate:s},[i.buffer])}var bv=new Set(["koppen","temperature","precip","wind","currents","pressure","upwelling","ice","tempRange","rainShadow","aridity","growing","rainSeason"]);function Wf(i){let t=h=>document.getElementById(h),e=t("mapTabs"),n=t("subBar"),s=t("climateTabs"),r=t("climateMore"),o=t("climateSeason"),a=t("mobileViewSwitch"),c="koppen",l=h=>i(h==="climate"?c:h);return e.addEventListener("click",h=>{let u=h.target.closest(".map-tab");u&&l(u.dataset.layer)}),s.addEventListener("click",h=>{let u=h.target.closest(".map-tab");u&&l(u.dataset.layer)}),r.addEventListener("change",()=>{r.value&&l(r.value)}),a?.addEventListener("change",()=>l(a.value)),{sync(h){let u=bv.has(h),d=!!zi(h)?.seasonal||h==="biome";u&&(c=h);for(let g of e.querySelectorAll(".map-tab"))g.classList.toggle("active",g.dataset.layer===h||g.dataset.layer==="climate"&&u);for(let g of s.querySelectorAll(".map-tab"))g.classList.toggle("active",g.dataset.layer===h);let p=!!r.querySelector(`option[value="${h}"]`);r.value=p?h:"",r.classList.toggle("active",p),n.hidden=!u&&!d,s.hidden=r.hidden=!u,o.hidden=!d,a&&(a.value=[...a.options].some(g=>g.value===h)?h:"inspect")}}}var Xf="orogen.view-strip-open",qf="orogen.projection",Sv="orogen.evolution.projection";function Yf(i){let t=document.getElementById("mapProjection"),e=document.getElementById("mapProjOpts");if(!t||!e)return;for(let c of Yi){let l=document.createElement("option");l.value=c.id,l.textContent=c.label,t.appendChild(l)}let n=null;try{n=JSON.parse(localStorage.getItem(qf)||localStorage.getItem(Sv)||"null")}catch{n=null}let s=n?.id&&Yi.some(c=>c.id===n.id)?n.id:"equirect",r=()=>({}),o=()=>{let c=r();i(s,c);try{localStorage.setItem(qf,JSON.stringify({id:s,opts:c}))}catch{}},a=c=>{r=Bl(e,s,c,o)};t.value=s,a(s===n?.id?n.opts:null),i(s,r()),t.addEventListener("change",()=>{s=t.value,a(null),o()})}function $f(){let i=document.getElementById("viewStrip"),t=document.getElementById("viewMode");if(!i||!t)return;let e=i.querySelectorAll(".vs-seg [data-mode]"),n=()=>{for(let p of e){let g=p.dataset.mode===t.value;p.classList.toggle("active",g),p.setAttribute("aria-pressed",String(g))}for(let p of i.querySelectorAll("[data-view]"))p.hidden=p.dataset.view!==t.value};for(let p of e)p.addEventListener("click",()=>{t.value!==p.dataset.mode&&(t.value=p.dataset.mode,t.dispatchEvent(new Event("change",{bubbles:!0})))});t.addEventListener("change",n),n();let s=document.getElementById("viewFold");if(s){let p=s.title,g=m=>{i.classList.toggle("folded",!m),s.setAttribute("aria-expanded",String(m)),s.title=m?"Hide the view options":p},_=!1;try{_=localStorage.getItem(Xf)==="1"}catch{}g(_),s.addEventListener("click",()=>{_=!_,g(_);try{localStorage.setItem(Xf,_?"1":"0")}catch{}})}let r=matchMedia("(max-width: 768px)"),o=document.getElementById("layerBar"),a=document.getElementById("ui"),c=document.getElementById("helpBtn");if(o&&a&&typeof ResizeObserver<"u"){let p=()=>{if(o.style.removeProperty("--bar-shift"),r.matches)return;let _=o.getBoundingClientRect(),m=a.getBoundingClientRect().right+8-_.left;if(m<=0)return;let f=(c?.checkVisibility?.()?c.getBoundingClientRect().left:innerWidth)-8-_.right;o.style.setProperty("--bar-shift",`${Math.max(0,Math.min(m,f))}px`)},g=new ResizeObserver(p);g.observe(o),g.observe(a),addEventListener("resize",p)}let l=document.getElementById("viewStripSlot"),h=i.parentElement,u=i.nextElementSibling;if(!l)return;let d=()=>{r.matches?(l.appendChild(i),i.classList.add("in-sheet")):(h.insertBefore(i,u&&u.parentElement===h?u:null),i.classList.remove("in-sheet"))};r.addEventListener("change",d),d()}var wv=["equirect","mercator","robinson","equalearth","mollweide","hammer","winkel","ortho","azeq","vdg"],Ev=Object.fromEntries(wv.map((i,t)=>[i,t]));function Hl(i="equirect",t={}){let e=Oe[i].bounds(t),n=Math.PI/180;return{uProj:Ev[i]??0,uBounds:[e[0],e[1],e[2],e[3]],uOpt:[(t.maxLat??85)*n,Math.cos((t.par??50.46)*n),(t.lat0??(i==="azeq"?90:20))*n,((t.hemis??2)===2?2:1)+((t.extent??"world")==="world"?10:0)+0]}}var jf=`
uniform int uProj;
uniform vec4 uBounds;        // xmin, xmax, ymin, ymax
uniform vec4 uOpt;           // Mercator max latitude (rad); cos(Winkel's parallel); azimuthal centre latitude (rad); flags (hemispheres + 10 \xD7 whole-world extent)
const float PI = 3.14159265358979;
const float HALF = 1.57079632679490;
const float R2 = 1.41421356237310;
const float S3 = 1.73205080756888;
const float RAD = 0.01745329251994;
float wrapLon(float l) { return mod(l + PI, 2.0 * PI) - PI; }
// Robinson's table (every 5\xB0 of latitude): the parallel's length and its distance from the equator
const float RX[19] = float[19](1.0, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962, 0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322);
const float RY[19] = float[19](0.0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0);
// Mollweide's \u03B8 for a latitude: 2\u03B8 + sin 2\u03B8 = \u03C0 sin \u03C6
float mollTheta(float phi) {
    float k = PI * sin(phi), t = phi;
    for (int i = 0; i < 8; i++) { float d = 2.0 + 2.0 * cos(2.0 * t); if (d < 1e-6) break; t -= (2.0 * t + sin(2.0 * t) - k) / d; }
    return t;
}
vec2 winkelFwd(vec2 lp, float c1) {
    float a = acos(clamp(cos(lp.y) * cos(lp.x * 0.5), -1.0, 1.0)), sc = a < 1e-6 ? 1.0 : sin(a) / a;
    return vec2(0.5 * (lp.x * c1 + 2.0 * cos(lp.y) * sin(lp.x * 0.5) / sc), 0.5 * (lp.y + sin(lp.y) / sc));
}
vec2 azInverse(vec2 xy, float r, float c, float p0) {
    float sc = sin(c), cc = cos(c);
    float p = asin(clamp(cc * sin(p0) + (r > 0.0 ? xy.y * sc * cos(p0) / r : 0.0), -1.0, 1.0));
    float l = atan(xy.x * sc, r * cc * cos(p0) - xy.y * sc * sin(p0));
    return vec2(l, p);
}
/** The inverse: map-space xy \u2192 (longitude, latitude) in radians; false outside the map. */
bool projInverse(vec2 xy, out vec2 ll) {
    float x = xy.x, y = xy.y;
    if (uProj == 0) { ll = vec2(x, y); return abs(x) <= PI && abs(y) <= HALF; }
    if (uProj == 1) { ll = vec2(x, 2.0 * atan(exp(y)) - HALF); return abs(x) <= PI; }
    if (uProj == 2) {
        float Y = abs(y) / 1.3523; if (Y > 1.0) return false;
        int i = 0; for (int k = 0; k < 17; k++) { if (RY[k + 1] < Y) i = k + 1; else break; }
        float a = 5.0 * (float(i) + (Y - RY[i]) / (RY[i + 1] - RY[i]));
        int j = int(min(17.0, floor(a / 5.0))); float t = a / 5.0 - float(j), X = RX[j] + (RX[j + 1] - RX[j]) * t;
        float l = x / (0.8487 * X); if (abs(l) > PI) return false;
        ll = vec2(l, a * RAD * sign(y)); return true;
    }
    if (uProj == 3) {
        float t = y;
        for (int i = 0; i < 8; i++) { float t2 = t * t; float f = 1.340264 * t - 0.081106 * t * t2 + 0.000893 * t * t2 * t2 * t2 + 0.003796 * t * t2 * t2 * t2 * t2 - y; float d = 1.340264 - 0.243318 * t2 + 0.006251 * t2 * t2 * t2 + 0.034164 * t2 * t2 * t2 * t2; t -= f / d; }
        if (abs(t) > 1.0471976) return false;
        float t2 = t * t, d = 1.340264 - 0.243318 * t2 + 0.006251 * t2 * t2 * t2 + 0.034164 * t2 * t2 * t2 * t2;
        float l = 3.0 * x * d / (2.0 * S3 * cos(t)); if (abs(l) > PI) return false;
        ll = vec2(l, asin(clamp(sin(t) / (S3 * 0.5), -1.0, 1.0))); return true;
    }
    if (uProj == 4) {
        float s = y / R2; if (abs(s) > 1.0) return false;
        float t = asin(s), p = asin(clamp((2.0 * t + sin(2.0 * t)) / PI, -1.0, 1.0)), c = cos(t);
        if (c < 1e-6) return false;
        float l = PI * x / (2.0 * R2 * c); if (abs(l) > PI) return false;
        ll = vec2(l, p); return true;
    }
    if (uProj == 5) {
        float z2 = 1.0 - (x * 0.25) * (x * 0.25) - (y * 0.5) * (y * 0.5); if (z2 < 0.5) return false;
        float z = sqrt(z2); ll = vec2(2.0 * atan(z * x, 2.0 * (2.0 * z2 - 1.0)), asin(clamp(z * y, -1.0, 1.0))); return true;
    }
    if (uProj == 6) {
        float c1 = uOpt.y; vec2 lp = vec2(2.0 * x / (c1 + 1.0), y);
        for (int i = 0; i < 12; i++) {
            vec2 f = winkelFwd(lp, c1) - xy; if (abs(f.x) + abs(f.y) < 1e-7) break;
            float e = 1e-4; vec2 a = (winkelFwd(lp + vec2(e, 0.0), c1) - f - xy) / e, b = (winkelFwd(lp + vec2(0.0, e), c1) - f - xy) / e;
            float det = a.x * b.y - b.x * a.y; if (abs(det) < 1e-12) return false;
            lp -= vec2(b.y * f.x - b.x * f.y, -a.y * f.x + a.x * f.y) / det;
            if (abs(lp.y) > HALF + 0.2 || abs(lp.x) > PI + 0.4) return false;
        }
        if (abs(lp.x) > PI + 1e-4 || abs(lp.y) > HALF + 1e-4) return false;
        vec2 f = winkelFwd(lp, c1) - xy; if (abs(f.x) + abs(f.y) > 1e-3) return false;
        ll = clamp(lp, vec2(-PI, -HALF), vec2(PI, HALF)); return true;
    }
    if (uProj == 7) {
        bool two = mod(uOpt.w, 10.0) >= 2.0; float h = 0.0;
        if (two) { h = x > 0.0 ? 1.0 : 0.0; x -= h > 0.0 ? 1.06 : -1.06; }
        float r = length(vec2(x, y)); if (r > 1.0) return false;
        vec2 lp = azInverse(vec2(x, y), r, asin(min(1.0, r)), uOpt.z); ll = vec2(wrapLon(lp.x + h * PI), lp.y); return true;
    }
    if (uProj == 8) {
        float lim = mod(uOpt.w, 100.0) >= 10.0 ? PI : HALF, r = length(xy); if (r > lim) return false;
        ll = azInverse(xy, r, r, uOpt.z); return true;
    }
    if (uProj == 9) {
        // Van der Grinten (Snyder 29-7 \u2026 29-16): the world in a circle
        float X = x / PI, Y = y / PI, X2 = X * X, Y2 = Y * Y; if (X2 + Y2 > 1.0) return false;
        if (abs(Y) < 1e-6) { if (abs(X) > 1.0) return false; ll = vec2(x, 0.0); return true; }
        float c1 = -abs(Y) * (1.0 + X2 + Y2), c2 = c1 - 2.0 * Y2 + X2, c3 = -2.0 * c1 + 1.0 + 2.0 * Y2 + (X2 + Y2) * (X2 + Y2);
        float d = Y2 / c3 + (2.0 * c2 * c2 * c2 / (c3 * c3 * c3) - 9.0 * c1 * c2 / (c3 * c3)) / 27.0, a1 = (c1 - c2 * c2 / (3.0 * c3)) / c3, m1 = 2.0 * sqrt(-a1 / 3.0);
        float t1 = acos(clamp(3.0 * d / (a1 * m1), -1.0, 1.0)) / 3.0;
        float p = PI * (-m1 * cos(t1 + PI / 3.0) - c2 / (3.0 * c3)) * sign(Y);
        float l = abs(X) < 1e-6 ? 0.0 : PI * (X2 + Y2 - 1.0 + sqrt(1.0 + 2.0 * (X2 - Y2) + (X2 + Y2) * (X2 + Y2))) / (2.0 * X);
        if (abs(l) > PI) return false;
        ll = vec2(l, clamp(p, -HALF, HALF)); return true;
    }
    return false;
}
`;var Qe=Math.PI,Un=2*Qe,dn=Qe/2,gi=2/Qe,$s=24,zl=i=>((i+Qe)%Un+Un)%Un-Qe,Av=()=>y.mapMode&&y.mapProjection!=="equirect"&&!!y.mapMesh,Ma=()=>Oe[y.mapProjection].bounds(y.mapProjOpts),Ki=()=>{let i=Ma();return(i[1]-i[0])/(i[3]-i[2])};function tp(i,t={}){let e=y.mapProjection+":"+Ki();y.mapProjection=Oe[i]?i:"equirect",y.mapProjOpts=t,ld(i==="equirect"?2:Ki()),y.mapProjection+":"+Ki()!==e&&hd()}function ep(i,t){let e=y.mapCenterLon||0;if(y.mapProjection==="equirect"){let o=t/gi;return o<-dn||o>dn?null:[zl(i/gi+e),o]}let n=Ki();if(Math.abs(i)>n||Math.abs(t)>1)return null;let s=Ma(),r=Oe[y.mapProjection].inv(s[0]+(i+n)/(2*n)*(s[1]-s[0]),s[2]+(t+1)/2*(s[3]-s[2]),y.mapProjOpts);return r?[zl(r[0]+e),r[1]]:null}var me=null,Jn=null,Zi=null,_i=null;function Tv(){Jn=new In(-2,2,1,-1,.1,100),Jn.position.set(0,0,5),Jn.lookAt(0,0,0),Zi=new di;let i=Hl();_i=new de(new dr(1,1),new Ve({uniforms:{map:{value:null},uWin:{value:new ue},uGrid:{value:0},uCentre:{value:0},uProj:{value:i.uProj},uBounds:{value:new ue(...i.uBounds)},uOpt:{value:new ue(...i.uOpt)}},vertexShader:`varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform sampler2D map; uniform vec4 uWin; uniform float uGrid; uniform float uCentre; varying vec2 vUv;
${jf}
// how near a line of the grid (every uGrid radians) the value v is, in pixels: 1 on the line, 0 a pixel or more away
float gridLine(float v) {
    float w = fwidth(v);
    if (w > 0.5) return 0.0;                                       // (across the projection's seam: no line)
    float d = abs(fract(v / uGrid + 0.5) - 0.5) * uGrid / max(w, 1e-6);
    return 1.0 - smoothstep(0.5, 1.0, d);
}
void main() {
    vec2 xy = vec2(uBounds.x + vUv.x * (uBounds.y - uBounds.x), uBounds.z + vUv.y * (uBounds.w - uBounds.z));
    vec2 ll;
    if (!projInverse(xy, ll)) discard;
    float lon = ll.x < uWin.x ? ll.x + 2.0 * PI : ll.x;               // (the picture may run past the map's edge, wrapped)
    gl_FragColor = texture2D(map, vec2((lon - uWin.x) / uWin.y, (ll.y - uWin.z) / uWin.w));
    #include <colorspace_fragment>
    // (the grid as the flat map's: white at 12 %, blended on the screen's colours)
    if (uGrid > 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), 0.12 * max(gridLine(ll.x + uCentre), gridLine(ll.y)));
}`,extensions:{derivatives:!0},depthTest:!1,depthWrite:!1})),_i.frustumCulled=!1,_i.renderOrder=-1,Zi.add(_i)}var js=new Map,Rv=.25;function Cv(){let i=[];return Yt.traverseVisible(t=>{if(!t.isLineSegments||t===y.mapGridMesh||t.parent?.isLineSegments)return;let e=t.geometry;e.boundingBox||e.computeBoundingBox(),Math.max(Math.abs(e.boundingBox.min.z),Math.abs(e.boundingBox.max.z))<.01&&i.push(t)}),i}function Kf(i){let t=Ki(),e=Ma(),n=y.mapProjOpts,s=Oe[y.mapProjection].fwd;i.updateWorldMatrix(!0,!1);let r=i.matrixWorld.elements[12],o=i.matrixWorld.elements[13],a=(p,g)=>{let _=(g+o)/gi;if(_<-dn||_>dn)return null;let m=s(zl((p+r)/gi),_,n);return m?[(m[0]-e[0])/(e[1]-e[0])*2*t-t,(m[1]-e[2])/(e[3]-e[2])*2-1]:null},c=i.geometry.attributes.position,l=i.geometry.attributes.color,h=[],u=[];for(let p=0;p+1<c.count;p+=2){let g=a(c.getX(p),c.getY(p)),_=a(c.getX(p+1),c.getY(p+1));!g||!_||Math.hypot(g[0]-_[0],g[1]-_[1])>Rv||(h.push(g[0],g[1],.002,_[0],_[1],.002),l&&u.push(l.getX(p),l.getY(p),l.getZ(p),l.getX(p+1),l.getY(p+1),l.getZ(p+1)))}let d=new ie;return d.setAttribute("position",new jt(h,3)),l&&d.setAttribute("color",new jt(u,3)),d}function Pv(i){let t=y.mapProjection+JSON.stringify(y.mapProjOpts);for(let e of i){let n=e.geometry.uuid+t+e.matrixWorld.elements[12],s=js.get(e);if(s&&s.key!==n&&(s.copy.geometry.dispose(),s.copy.geometry=Kf(e),s.key=n),!s){let r=new _e(Kf(e),e.material);r.frustumCulled=!1,Zi.add(r),js.set(e,s={key:n,copy:r})}s.copy.material=e.material}for(let[e,n]of js)i.includes(e)||(Zi.remove(n.copy),n.copy.geometry.dispose(),js.delete(e))}function Lv(){let i=te.getDrawingBufferSize(new Bt),t=te.capabilities.maxTextureSize,e=Math.min(t,Math.ceil(i.x*1.5)),n=Math.min(t,Math.ceil(i.y*1.5));me&&me.width===e&&me.height===n||(me?.dispose(),me=new sn(e,n,{depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,minFilter:ze,magFilter:ze}),me.texture.colorSpace=Me)}var Zf="",Jf=null;function Iv(){let i=Ki(),t=Ma(),e=y.mapProjOpts,n=Oe[y.mapProjection],s=Kt.zoom,r=Math.max(Kt.position.x+Kt.left/s,-i),o=Math.min(Kt.position.x+Kt.right/s,i),a=Math.max(Kt.position.y+Kt.bottom/s,-1),c=Math.min(Kt.position.y+Kt.top/s,1);if(r>=o||a>=c)return null;let l=[y.mapProjection,JSON.stringify(e),r,o,a,c].join();return l===Zf?Jf:(Zf=l,Jf=Dv(n,e,t,i,r,o,a,c))}function Dv(i,t,e,n,s,r,o,a){let c=v=>e[0]+(v+n)/(2*n)*(e[1]-e[0]),l=v=>e[2]+(v+1)/2*(e[3]-e[2]),h=[],u=1/0,d=-1/0;for(let v=0;v<=$s;v++)for(let x=0;x<=$s;x++){let S=i.inv(c(s+(r-s)*x/$s),l(o+(a-o)*v/$s),t);S&&(h.push(S[0]),S[1]<u&&(u=S[1]),S[1]>d&&(d=S[1]))}if(!h.length)return{lon0:-Qe,lonSpan:Un,lat0:-dn,latSpan:Qe};h.sort((v,x)=>v-x);let p=h[0]+Un-h[h.length-1],g=h[0],_=h[h.length-1];for(let v=1;v<h.length;v++)h[v]-h[v-1]>p&&(p=h[v]-h[v-1],g=h[v],_=h[v-1]+Un);let m=(_-g)/$s*1.5+.005,f=(d-u)/$s*1.5+.005;return g-=m,_+=m,u=Math.max(-dn,u-f),d=Math.min(dn,d+f),(p<dn||_-g>=Un)&&(g=-Qe,_=Qe,d>dn-3*f&&(d=dn),u<-dn+3*f&&(u=-dn)),g<-Qe&&(g+=Un,_+=Un),{lon0:g,lonSpan:_-g,lat0:u,latSpan:d-u}}function Qf(i,t,e,n,s,r){Jn.left=i*gi,Jn.right=t*gi,Jn.bottom=e*gi,Jn.top=(e+n)*gi,Jn.updateProjectionMatrix(),me.viewport.set(s,0,r-s,me.height),me.scissor.set(s,0,r-s,me.height),te.setRenderTarget(me),te.render(Yt,Jn)}var kr=null,Gl=()=>{kr=null};addEventListener("resize",Gl);document.addEventListener("visibilitychange",Gl);te.domElement.addEventListener("webglcontextrestored",Gl);function Nv(){Yt.updateMatrixWorld();let i=[me.width,me.height,y.mapProjection,JSON.stringify(y.mapProjOpts),y.gridEnabled,y.gridSpacing,y.mapCenterLon||0,Yt.background?.isColor?Yt.background.getHex():"",Kt.position.x,Kt.position.y,Kt.zoom,Kt.left,Kt.right,Kt.top,Kt.bottom];return Yt.traverseVisible(t=>{if(!t.isMesh&&!t.isLine&&!t.isPoints)return;let e=t.matrixWorld.elements,n=t.geometry;i.push(t.id,n.id,n.index?.version??"",n.drawRange.start,n.drawRange.count,e[0],e[5],e[12],e[13]);for(let s in n.attributes)i.push(n.attributes[s].version);for(let s of Array.isArray(t.material)?t.material:[t.material])i.push(s.id,s.version,s.opacity,s.visible)}),i.join()}function Ov(){if(me){me.dispose(),me=null;for(let i of js.values())Zi.remove(i.copy),i.copy.geometry.dispose();js.clear(),kr=null}}function Uv(){_i||Tv(),Lv();let i=Nv();if(i===kr)return;kr=i;let t=Iv(),e=_i.material.uniforms,n=Cv();if(Pv(n),t){let r=y.mapGridMesh,o=r?.visible;r&&(r.visible=!1);for(let l of n)l.visible=!1;me.scissorTest=!0;let a=t.lon0+t.lonSpan,c=Math.round(Math.min(1,(Qe-t.lon0)/t.lonSpan)*me.width);c>0&&Qf(t.lon0,Math.min(a,Qe),t.lat0,t.latSpan,0,c),c<me.width&&Qf(-Qe,a-Un,t.lat0,t.latSpan,c,me.width),te.setRenderTarget(null),r&&(r.visible=o);for(let l of n)l.visible=!0;e.uWin.value.set(t.lon0,t.lonSpan,t.lat0,t.latSpan)}_i.visible=!!t,e.map.value=me.texture,e.uGrid.value=y.gridEnabled?y.gridSpacing*Qe/180:0,e.uCentre.value=y.mapCenterLon||0;let s=Hl(y.mapProjection,y.mapProjOpts);e.uProj.value=s.uProj,e.uBounds.value.set(...s.uBounds),e.uOpt.value.set(...s.uOpt),_i.scale.set(2*Ki(),2,1),Zi.background=Yt.background,te.render(Zi,Kt)}function Vl(i=!1){i&&(kr=null),Av()?Uv():(Ov(),te.render(Yt,y.mapMode?Kt:rn))}yr();rp();var zv=["ui","layerBar","mobileViewSwitch","editToggle","refreshFab","rebuildFab"],Gv=/out of memory|allocation failed|invalid array length|array buffer|rangeerror/i;function op(i,t="build this planet"){return Gv.test(i||"")?`This device ran out of memory trying to ${t}. Try a lower Detail.`:`Something went wrong trying to ${t}. Try again, or reload the page if it keeps happening.`}function ap(i,t=""){let e=document.getElementById("buildOverlay");if(!e)return;let n=e.querySelector(".build-error");n||(n=document.createElement("div"),n.className="build-error",n.setAttribute("role","alert"),n.innerHTML='<p class="build-error-text"></p><p class="build-error-detail"></p><button type="button" class="build-error-close">Close</button>',e.querySelector(".build-overlay-inner").appendChild(n),n.querySelector(".build-error-close").addEventListener("click",()=>{e.classList.remove("failed","initial"),e.classList.add("hidden")})),n.querySelector(".build-error-text").textContent=i,n.querySelector(".build-error-detail").textContent=t?`(${t})`:"",e.classList.add("failed"),e.classList.remove("hidden"),n.querySelector(".build-error-close").focus()}function Sa(i){for(let t of zv)document.getElementById(t)?.toggleAttribute("inert",i)}function cp(){document.getElementById("buildOverlay")?.classList.remove("failed")}var Vv=document.getElementById("heightmapFile"),Wv=document.getElementById("importFileName"),wa=document.getElementById("importPreview"),lp=document.getElementById("importDims"),ei=document.getElementById("importBtn"),zr=null,up=0,dp=0;function fp(i,t){up=i.width,dp=i.height;let e=document.createElement("canvas");e.width=i.width,e.height=i.height;let n=e.getContext("2d");n.drawImage(i,0,0);let s=Math.min(i.width,400),r=Math.round(s*i.height/i.width);wa.width=s,wa.height=r,wa.getContext("2d").drawImage(i,0,0,s,r),wa.style.display="block",lp.textContent=`${i.width} \xD7 ${i.height}`,lp.style.display="block";let a=document.getElementById("importExpect");a&&(a.style.display="block");let c=n.getImageData(0,0,i.width,i.height).data,l=i.width*i.height;zr=new Uint8Array(l);for(let h=0;h<l;h++){let u=c[h*4],d=c[h*4+1],p=c[h*4+2];zr[h]=Math.round(.299*u+.587*d+.114*p)}Wv.textContent=t,ei.disabled=!1}ip();(function(){let t=new Image;t.onload=()=>{fp(t,"Cosmossi (default)"),ei.click()},t.src="world/heightmap.png"})();Vv.addEventListener("change",i=>{let t=i.target.files[0];if(!t)return;let e=new FileReader;e.onload=n=>{let s=new Image;s.onload=()=>fp(s,t.name),s.src=n.target.result},e.readAsDataURL(t)});var Xv=y.isTouchDevice?64e4:1/0,qv=y.isTouchDevice?2e5:64e4,Yv=y.isTouchDevice?5e5:128e4;function pp(){return Br(+document.getElementById("sN").value)>Xv}function $v(i){let t=document.getElementById("sN").closest(".cg"),e=document.getElementById("detailWarn");t.classList.remove("detail-orange","detail-red"),e.className="detail-warn",i>Yv?(t.classList.add("detail-red"),e.classList.add("red"),e.textContent="\u26A0 Very high \u2014 generation may be slow and unstable"):i>qv?(t.classList.add("detail-orange"),e.classList.add("orange"),e.textContent="\u26A0 High detail \u2014 generation may be slow and unstable"):e.textContent=""}function jv(i){let t=i.closest(".cg");if(!t)return;t.style.position="relative";let e=document.createElement("div");e.className="slider-tooltip",t.appendChild(e);function n(){let r=(+i.value-+i.min)/(+i.max-+i.min);e.style.left=r*i.offsetWidth+"px"}i.addEventListener("pointerdown",()=>{let r=document.getElementById(i.id.replace("s","v"));r&&(e.textContent=r.textContent),n(),e.classList.add("visible")}),i.addEventListener("input",()=>{let r=document.getElementById(i.id.replace("s","v"));r&&(e.textContent=r.textContent),n()});let s=()=>e.classList.remove("visible");i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}for(let[i,t]of[["sN","vN"],["sTw","vTw"],["sS","vS"],["sGl","vGl"],["sHEr","vHEr"],["sTEr","vTEr"],["sRs","vRs"],["sTmp","vTmp"],["sPrc","vPrc"]]){let e=document.getElementById(i);e&&(jv(e),e.addEventListener("input",n=>{if(i==="sN"){let s=Br(+n.target.value);document.getElementById(t).textContent=s.toLocaleString(),$v(s)}else if(i==="sTmp"){let s=+n.target.value;document.getElementById(t).textContent=(s>0?"+":s===0?"\xB1":"\u2212")+Math.abs(s)+" W/m\xB2"}else if(i==="sPrc"){let s=+n.target.value,r=Math.round(s*50);document.getElementById(t).textContent=(r>0?"+":r===0?"\xB1":"")+r+"%"}else document.getElementById(t).textContent=n.target.value;(i==="sTw"||i==="sS"||i==="sGl"||i==="sHEr"||i==="sTEr"||i==="sRs")&&Kv()}),(i==="sTmp"||i==="sPrc")&&e.addEventListener("change",()=>{y.curData&&(Ca(),va(Ra,()=>{Pa(),Wi(),Ks(y.debugLayer)}))}))}var xi=document.getElementById("reapplyBtn");function Kv(){y.curData&&(xi.disabled=!1,xi.classList.add("ready"))}function mp(){xi.disabled=!0,xi.classList.remove("ready")}function Zv(){let i=y.curData;if(!i||!i.prePostElev)return;let t=pp();Gf(()=>{xi.classList.remove("spinning"),t&&Kl.has(y.debugLayer)&&(y.debugLayer="",ni&&(ni.value=""),Ea(""),Wi(),Ks(""))},t)}xi.addEventListener("click",()=>{xi.disabled||(mp(),xi.classList.add("spinning"),Zv())});ei.addEventListener("click",()=>{if(!zr)return;ei.disabled=!0,ei.textContent="Importing\u2026",mp(),Gs(null),Vs(null),Ca();let i=document.getElementById("ui");window.innerWidth<=768&&i&&i.classList.add("collapsed");let t=new Uint8Array(zr);Vf(t,up,dp,Ra,pp())});var UE=document.getElementById("importBtn"),Aa=document.createElement("button");Aa.id="generate";Aa.style.display="none";document.body.appendChild(Aa);window.addEventListener("orogen:build-failed",i=>{Ta=!1,Sa(!1),ei.disabled=!zr,ei.textContent="Import",ap(op(i.detail.message,"import this heightmap"),i.detail.message)});Aa.addEventListener("generate-done",()=>{Pa(),ei.disabled=!1,ei.textContent="Import",y.importedHeightmap=!0;let i=document.getElementById("info");i&&(i.textContent=y.isTouchDevice?"Drag to rotate \xB7 Pinch to zoom":"Drag to rotate \xB7 Scroll to zoom"),!y.climateComputed&&Kl.has(y.debugLayer)&&(y.debugLayer="",ni&&(ni.value=""),Ea(""),Wi()),Ea(y.debugLayer),Ks(y.debugLayer);let t=y.debugLayer;Cr(t,y.climateSeason,Gs,Vs)});var Kl={has:Nd},ti=document.getElementById("vizLegend"),ni=document.getElementById("debugLayer");function gp(i){if(Kl.has(i)&&!y.climateComputed){Ca(),va(Ra,()=>{Pa(),hp(i)});return}hp(i)}function hp(i){y.debugLayer=i,y.hoveredKoppen=-1,Wi(),Cr(i,y.climateSeason,Gs,Vs),Ea(i),Ks(i)}var Jv=Wf(gp);$f();Yf(tp);function Ea(i){Jv.sync(i),ni&&(ni.value=[...ni.options].some(t=>t.value===i)?i:"")}ni&&ni.addEventListener("change",i=>gp(i.target.value));tf(y,()=>{Wi(),Cr(y.debugLayer,y.climateSeason,Gs,Vs),Ks(y.debugLayer)});var Qv={Af:"Tropical rainforest \u2014 Hot and wet year-round.",Am:"Tropical monsoon \u2014 Brief dry season offset by heavy monsoon rains.",Aw:"Tropical savanna \u2014 Distinct wet and dry seasons.",BWh:"Hot desert \u2014 Extremely dry with scorching summers.",BWk:"Cold desert \u2014 Arid with cold winters.",BSh:"Hot steppe \u2014 Semi-arid grassland with hot summers.",BSk:"Cold steppe \u2014 Semi-arid with cold winters.",Cfa:"Humid subtropical \u2014 Hot humid summers, mild winters.",Cfb:"Oceanic \u2014 Mild year-round, cool summers, frequent rain.",Cfc:"Subpolar oceanic \u2014 Cool year-round with short summers.",Csa:"Hot-summer Mediterranean \u2014 Dry hot summers, mild wet winters.",Csb:"Warm-summer Mediterranean \u2014 Dry warm summers, mild wet winters.",Csc:"Cold-summer Mediterranean \u2014 Cool dry summers, mild wet winters.",Cwa:"Humid subtropical monsoon \u2014 Warm with dry winters.",Cwb:"Subtropical highland \u2014 Mild with dry winters.",Cwc:"Cold subtropical highland \u2014 Cool with dry winters.",Dfa:"Hot-summer continental \u2014 Hot summers, cold snowy winters.",Dfb:"Warm-summer continental \u2014 Warm summers, cold winters.",Dfc:"Subarctic \u2014 Long cold winters, brief cool summers.",Dfd:"Extremely cold subarctic \u2014 Harshest winters on Earth.",Dsa:"Hot-summer continental, dry summer.",Dsb:"Warm-summer continental, dry summer.",Dsc:"Subarctic, dry summer.",Dsd:"Extremely cold subarctic, dry summer.",Dwa:"Hot-summer continental, monsoon.",Dwb:"Warm-summer continental, monsoon.",Dwc:"Subarctic monsoon \u2014 Brief wet summers, long frigid winters.",Dwd:"Extremely cold subarctic, monsoon.",ET:"Tundra \u2014 Permafrost, only warmest month above 0\xB0C.",EF:"Ice cap \u2014 Permanent ice, never above 0\xB0C."};function Ks(i){if(ti)if(i===""||!i){let t=[{e:-.5},{e:-.25},{e:-.05},{e:0},{e:.03},{e:.15},{e:.35},{e:.55},{e:.8}],e=t.map(r=>vd(r.e)),n=t.map((r,o)=>Math.round(o/(t.length-1)*100)),s=e.map((r,o)=>`${r} ${n[o]}%`).join(", ");ti.innerHTML=`<div class="legend-gradient" style="background:linear-gradient(to right,${s})"></div><div class="legend-labels"><span>Deep Ocean</span><span>Sea Level</span><span>Peak</span></div>`}else if(i==="koppen"){let t='<div class="legend-koppen-header"><a href="https://en.wikipedia.org/wiki/K%C3%B6ppen_climate_classification" target="_blank" rel="noopener">K\xF6ppen climate classification</a></div>';t+='<div class="legend-koppen">';for(let s=1;s<un.length;s++){let r=un[s],[o,a,c]=r.color,l=`rgb(${Math.round(o*255)},${Math.round(a*255)},${Math.round(c*255)})`;t+=`<div class="legend-koppen-item" data-code="${r.code}"><span class="legend-koppen-swatch" style="background:${l}"></span>${r.code}</div>`}t+='<div class="legend-koppen-tooltip" id="koppenTip"></div>',t+="</div>",ti.innerHTML=t;let e=document.getElementById("koppenTip"),n=ti.querySelector(".legend-koppen");ti.querySelectorAll(".legend-koppen-item").forEach(s=>{s.addEventListener("mouseenter",()=>{let r=s.dataset.code;e.textContent=Qv[r]||"",e.classList.add("visible");let o=s.getBoundingClientRect(),a=n.getBoundingClientRect(),c=240,l=o.left-a.left+o.width/2-c/2;l=Math.max(0,Math.min(l,a.width-c)),e.style.left=l+"px",e.style.bottom=a.bottom-o.top+6+"px";let h=un.findIndex(u=>u.code===r);h>=0&&(y.hoveredKoppen=h,Cl(),Pl())}),s.addEventListener("mouseleave",()=>{e.classList.remove("visible"),y.hoveredKoppen=-1,Cl(),Pl()})})}else i==="biome"?ti.innerHTML=Qd(y.climateSeason):i==="landheightmap"?ti.innerHTML='<div class="legend-gradient" style="background:linear-gradient(to right,#000 0%,#fff 100%)"></div><div class="legend-labels"><span>Ocean / Sea Level</span><span>Peak</span></div>':zi(i)?ti.innerHTML=Zd(i,y.climateSeason):ti.innerHTML=""}var Hr=document.getElementById("buildOverlay"),Ji=document.getElementById("buildBarFill"),Yl=document.getElementById("buildBarLabel"),Ta=!1;function Ra(i,t){Ta&&(Ji&&(Ji.style.transform="scaleX("+i/100+")"),Yl&&(Yl.textContent=t))}function Ca(){cp(),!(!Ji||!Hr)&&(Ji.style.transition="none",Ji.style.transform="scaleX(0)",Yl.textContent="",Ji.offsetWidth,Ji.style.transition="",Ta=!0,Hr.classList.remove("hidden"),Sa(!0))}function Pa(){setTimeout(()=>{Ta=!1,Sa(!1),Hr&&(Hr.classList.add("hidden"),Hr.classList.remove("initial"))},500)}document.getElementById("chkWire").addEventListener("change",Vi);var tM=document.getElementById("gridSpacingGroup");document.getElementById("chkGrid").addEventListener("change",i=>{y.gridEnabled=i.target.checked,tM.style.display=y.gridEnabled?"":"none",y.mapMode?(y.mapGridMesh&&(y.mapGridMesh.visible=y.gridEnabled),y.globeGridMesh&&(y.globeGridMesh.visible=!1)):(y.globeGridMesh&&(y.globeGridMesh.visible=y.gridEnabled),y.mapGridMesh&&(y.mapGridMesh.visible=!1))});document.getElementById("gridSpacing").addEventListener("change",i=>{y.gridSpacing=parseFloat(i.target.value),cf()});Md(()=>{Wi(),Ks(y.debugLayer)});var $l=document.getElementById("sMapCenterLon"),eM=document.getElementById("vMapCenterLon");$l.addEventListener("input",()=>{let i=+$l.value,t=i>0?"E":i<0?"W":"";if(eM.textContent=Math.abs(i)+"\xB0"+t,y.mapCenterLon=i*Math.PI/180,y.mapMode&&y.mapMesh){let n=((y.mapMesh._builtCenterLon||0)-y.mapCenterLon)*(2/Math.PI);y.mapMesh.position.x=n;for(let s of y.mapMesh.userData.wrap)s.visible=n!==0;y.mapGridMesh&&(y.mapGridMesh.position.x=n)}});$l.addEventListener("change",()=>{if(y.mapMode){ua();let i=y.debugLayer;Cr(i,y.climateSeason,Gs,Vs)}});document.getElementById("viewMode").addEventListener("change",i=>{y.mapMode=i.target.value==="map",y.mapMode?(y.planetMesh&&(y.planetMesh.visible=!1),Yn.visible=!1,Fi.visible=!1,pi.visible=!1,y.wireMesh&&(y.wireMesh.visible=!1),y.arrowGroup&&(y.arrowGroup.visible=!1),y.mapMesh||(Ca(),Ra(0,"Building map mesh\u2026"),setTimeout(()=>{ua(),y.mapMesh&&(y.mapMesh.visible=!0),Pa()},50)),y.mapMesh&&(y.mapMesh.visible=!0),y.mapGridMesh&&(y.mapGridMesh.visible=y.gridEnabled),y.globeGridMesh&&(y.globeGridMesh.visible=!1),y.windArrowGroup&&y.windArrowGroup.traverse(t=>{t.name==="windGlobe"&&(t.visible=!1),t.name==="windMap"&&(t.visible=!0)}),y.oceanCurrentArrowGroup&&y.oceanCurrentArrowGroup.traverse(t=>{t.name==="oceanGlobe"&&(t.visible=!1),t.name==="oceanMap"&&(t.visible=!0)}),Yt.background=new Ut(1710638),xe.enabled=!1,oe.enabled=!0,Kt.position.set(0,0,5),Kt.lookAt(0,0,0),Is(),oe.target.set(0,0,0),oe.update()):(y.planetMesh&&(y.planetMesh.visible=!0),Fi.visible=!0,pi.visible=!0,y.wireMesh&&(y.wireMesh.visible=!0),y.arrowGroup&&(y.arrowGroup.visible=!0),y.mapMesh&&(y.mapMesh.visible=!1),y.mapGridMesh&&(y.mapGridMesh.visible=!1),y.globeGridMesh&&(y.globeGridMesh.visible=y.gridEnabled),y.windArrowGroup&&y.windArrowGroup.traverse(t=>{t.name==="windGlobe"&&(t.visible=!0),t.name==="windMap"&&(t.visible=!1)}),y.oceanCurrentArrowGroup&&y.oceanCurrentArrowGroup.traverse(t=>{t.name==="oceanGlobe"&&(t.visible=!0),t.name==="oceanMap"&&(t.visible=!1)}),Yn.visible=!y.debugLayer,Yt.background=new Ut(197384),oe.enabled=!1,xe.enabled=!0)});var nM=Lf({page:"import",ensureClimate:i=>new Promise(t=>va(i,t)),code:()=>""});document.getElementById("exportBtn").addEventListener("click",nM.open);var ql=document.getElementById("sidebarToggle"),je=document.getElementById("ui"),jl=()=>window.innerWidth<=768;jl()&&je.classList.add("collapsed");ql.addEventListener("click",()=>{let i=je.classList.toggle("collapsed");ql.innerHTML=i?"\xBB":"\xAB",ql.title=i?"Show panel":"Collapse panel"});(function(){let t=document.getElementById("sheetHandle");if(!t)return;let e=0,n=0,s=!1,r=0,o=0,a=0,c=!1,l=0,h=null;function u(){let m=getComputedStyle(je);return new DOMMatrix(m.transform).m42}function d(){return je.offsetHeight-60}function p(){h!==null&&(je.style.transform=`translateY(${h}px)`,h=null),l=0}function g(m){h=m,l||(l=requestAnimationFrame(p))}function _(){s=!1,je.style.transition="",je.classList.remove("dragging"),l&&(cancelAnimationFrame(l),l=0),h=null}t.addEventListener("pointerdown",m=>{jl()&&(m.preventDefault(),t.setPointerCapture(m.pointerId),s=!0,c=!1,e=m.clientY,r=m.clientY,o=performance.now(),a=0,n=je.classList.contains("collapsed")?u():0,je.style.transition="none",je.classList.add("dragging"))}),t.addEventListener("pointermove",m=>{if(!s)return;let f=m.clientY,v=performance.now(),x=v-o;x>0&&(a=(f-r)/x),r=f,o=v;let S=f-e;Math.abs(S)>5&&(c=!0);let P=d();g(Math.max(0,Math.min(P,n+S)))}),t.addEventListener("pointerup",m=>{if(!s)return;t.releasePointerCapture(m.pointerId),_();let f=u(),v=d(),x=v>0?1-f/v:0;a>.3||a>-.3&&x<.3?je.classList.add("collapsed"):je.classList.remove("collapsed"),je.style.transform=""}),t.addEventListener("pointercancel",m=>{if(s){try{t.releasePointerCapture(m.pointerId)}catch{}_(),je.style.transform=""}}),t.addEventListener("click",()=>{if(jl()){if(c){c=!1;return}je.classList.toggle("collapsed")}})})();if(y.isTouchDevice){let i=document.getElementById("info");i&&(i.textContent="Import a heightmap to get started")}window.addEventListener("orientationchange",()=>{setTimeout(()=>{Ls(innerWidth,innerHeight),Is(),te.setSize(innerWidth,innerHeight)},100)});function _p(){requestAnimationFrame(_p),y.mapMode?(ud(),oe.update()):(ad(),xe.update()),!y.mapMode&&y.planetMesh&&document.getElementById("chkRotate").checked&&(y.planetMesh.rotation.y+=8e-4,Yn.rotation.y=y.planetMesh.rotation.y,y.wireMesh&&(y.wireMesh.rotation.y=y.planetMesh.rotation.y),y.arrowGroup&&(y.arrowGroup.rotation.y=y.planetMesh.rotation.y),y.windArrowGroup&&(y.windArrowGroup.rotation.y=y.planetMesh.rotation.y),y.oceanCurrentArrowGroup&&(y.oceanCurrentArrowGroup.rotation.y=y.planetMesh.rotation.y),y.globeGridMesh&&(y.globeGridMesh.rotation.y=y.planetMesh.rotation.y)),Vl()}window.addEventListener("resize",()=>{Ls(innerWidth,innerHeight),Is(),te.setSize(innerWidth,innerHeight)});(function(){let t=document.getElementById("hoverInfo");if(!t)return;let e=new Wo,n=new Bt,s=new fe,r=new Pn,o=50,a=0,c=-1;function l(g,_,m){let{mesh:f,r_xyz:v}=y.curData,x=f.numRegions,S=-2,P=-1;for(let E=0;E<x;E++){let L=g*v[3*E]+_*v[3*E+1]+m*v[3*E+2];L>S&&(S=L,P=E)}return P}function h(g){if(!y.planetMesh)return-1;let _=Ne.getBoundingClientRect();n.x=(g.clientX-_.left)/_.width*2-1,n.y=-((g.clientY-_.top)/_.height)*2+1,e.setFromCamera(n,rn),s.copy(y.planetMesh.matrixWorld).invert(),r.copy(e.ray).applyMatrix4(s);let m=r.origin.x,f=r.origin.y,v=r.origin.z,x=r.direction.x,S=r.direction.y,P=r.direction.z,E=1.08,L=2*(m*x+f*S+v*P),V=m*m+f*f+v*v-E*E,M=L*L-4*V;if(M<0)return-1;let b=(-L-Math.sqrt(M))*.5;if(b<0)return-1;let D=m+b*x,O=f+b*S,k=v+b*P,A=Math.sqrt(D*D+O*O+k*k)||1;return l(D/A,O/A,k/A)}function u(g){if(!y.mapMesh)return-1;let _=Ne.getBoundingClientRect();n.x=(g.clientX-_.left)/_.width*2-1,n.y=-((g.clientY-_.top)/_.height)*2+1,e.setFromCamera(n,Kt);let m=e.ray.origin,f=e.ray.direction;if(Math.abs(f.z)<1e-10)return-1;let v=-m.z/f.z,x=ep(m.x+v*f.x,m.y+v*f.y);if(!x)return-1;let[S,P]=x,E=Math.cos(P);return l(E*Math.sin(S),Math.sin(P),E*Math.cos(S))}function d(g){if(!y.curData)return;let _=performance.now();if(_-a<o)return;a=_;let m=y.mapMode?u(g):h(g);if(m!==c){if(c=m,m<0){t.style.display="none";return}p(m)}}function p(g){let _=y.curData;if(!_||g<0||g>=_.mesh.numRegions){t.style.display="none";return}let m=_.r_xyz[3*g],f=_.r_xyz[3*g+1],v=_.r_xyz[3*g+2],x=Math.asin(Math.max(-1,Math.min(1,f)))*180/Math.PI,S=Math.atan2(m,v)*180/Math.PI,P=_.r_elevation[g],E=Nn(P).toFixed(1),L=P<=0,V=`<span class="hi-label">Elev</span> ${E} km (${L?"ocean":"land"})<br>`;if(V+=`<span class="hi-label">Coord</span> ${Math.abs(x).toFixed(1)}\xB0${x>=0?"N":"S"}, ${Math.abs(S).toFixed(1)}\xB0${S>=0?"E":"W"}`,_.climate&&(V+="<br>"+Jd(_,g).join("<br>")),_.debugLayers?.koppen){let M=_.debugLayers.koppen[g];if(M>0&&M<un.length){let b=un[M];V+=`<br><span class="hi-label">Clim</span> ${b.code} \u2014 ${b.name}`}}L||(V+=sp(x,S)),t.innerHTML=V,t.style.display="block"}Ne.addEventListener("mousemove",d),Ne.addEventListener("mouseleave",()=>{c=-1,t.style.display="none"})})();window.takePreview=function(i=1200,t=630){let e=te.domElement.width,n=te.domElement.height,s=te.getPixelRatio(),r=[];for(let a of["#ui","#layerBar","#legendCard","#info","#hoverInfo","#helpBtn","#editToggle","#refreshFab","#rebuildFab","#mobileViewSwitch","#buildOverlay","#tutorialOverlay","#exportOverlay","#whatsNewOverlay"]){let c=document.querySelector(a);c&&c.style.display!=="none"&&(r.push({el:c,prev:c.style.display}),c.style.display="none")}Ls(i,t),te.setPixelRatio(1),te.setSize(i,t),te.render(Yt,y.mapMode?Kt:rn);let o=document.createElement("a");o.download="preview.png",o.href=te.domElement.toDataURL("image/png"),o.click(),te.setPixelRatio(s),te.setSize(e/s,n/s),Ls(innerWidth,innerHeight);for(let{el:a,prev:c}of r)a.style.display=c;Vl(!0),console.log("preview.png downloaded!")};_p();window.parent!==window&&window.addEventListener("keydown",i=>{i.key==="Escape"&&window.parent.postMessage("cosmossi-globe-close",location.origin)});;globalThis.__cosmossi&&globalThis.__cosmossi.attach&&globalThis.__cosmossi.attach({renderer:te,scene:Yt,camera:rn,ctrl:xe,canvas:Ne,state:y,mapCamera:Kt,Texture:yn,Mesh:de,PlaneGeometry:dr,ShaderMaterial:Ve});
