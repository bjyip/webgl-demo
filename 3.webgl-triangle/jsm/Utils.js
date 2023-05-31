function initShaders(gl,vsSource,fsSource){
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  //将程序对象挂到上下文对象上
  gl.program = program;
  return true;
}
function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type);
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  //编译着色器对象
  gl.compileShader(shader);
  //返回着色器对象
  return shader;
}

const defAttr=()=>({
  gl:null, // webgl上下文对象
  vertices:[], // 顶点数据集合，在被赋值的时候会做两件事：更新count 顶点数量，数据运算尽量不放渲染方法里；向缓冲区内写入顶点数据。
  geoData:[], // 模型数据，对象数组，可解析出vertices 顶点数据
  size:2, // 顶点分量的数目
  attrName:'a_Position', // 代表顶点位置的attribute 变量名
  count:0, // 顶点数量
  types:['POINTS'], // 绘图方式，可以用多种方式绘图
})
class Poly{
  constructor(attr){
    Object.assign(this,defAttr(),attr)
    this.init()
  }
  // 初始化方法，建立缓冲对象，并将其绑定到webgl 上下文对象上，然后向其中写入顶点数据。
  // 将缓冲对象交给attribute变量，并开启attribute 变量的批处理功能。
  init(){
    const {attrName,size,gl}=this
    if(!gl){return}
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    this.updateBuffer()
    const a_Position=gl.getAttribLocation(gl.program,attrName)
    gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)
  }
  // 添加顶点
  addVertice(...params){
    this.vertices.push(...params)
    this.updateBuffer()
  }
  // 删除最后一个顶点
  popVertice(){
    const {vertices,size}=this
    const len=vertices.length
    vertices.splice(len-size,len)
    this.updateCount()
  }
  // 根据索引位置设置顶点
  setVertice(ind,...params){
    const {vertices,size}=this
    const i=ind*size
    params.forEach((param,paramInd)=>{
      vertices[i+paramInd]=param
    })
  }
  // 更新缓冲区数据，同时更新顶点数量
  updateBuffer(){
    const {gl,vertices}=this
    this.updateCount()
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)
  }
  // 更新顶点数量
  updateCount(){
    this.count=this.vertices.length/this.size
  }
  // 基于geoData 解析出vetices 数据
  updateVertices(params){
    const {geoData}=this
    const vertices=[]
    geoData.forEach(data=>{
      params.forEach(key=>{
        vertices.push(data[key])
      })
    })
    this.vertices=vertices
  }
  // 绘图方法
  draw(types=this.types){
    const {gl,count}=this
    for(let type of types){
      gl.drawArrays(gl[type],0,count);
    }
  }
}

export {initShaders, Poly}