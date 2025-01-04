// 解析歌词
/**
 * @description 解析歌词字符串, 返回一个对象数组
 * @param {*} lrc 
 * @returns [{time: 0, words: 'xxxx'}]
 */
function parseLrc(lrc) {
    var lrcArr = lrc.split('\n')
    var result = []
    for (let i = 0; i < lrcArr.length; i++) {
        var str = lrcArr[i]
        var obj = {
            time: '',
            words: ''
        }
        var time = str.split('[')[1].split(']')[0]
        var words = str.split(']')[1]
        // console.log(time, words)
        obj.time = parseTime(time)
        obj.words = words
        result.push(obj)  
    }
    // console.log(result)
    return  result
     
}
/**
 * @description 解析时间字符串, 返回秒数
 * @param {String} str 
 * @returns 
 */
function parseTime (str) {
    var timeArr = str.split(':') 
    return +timeArr[0] * 60 + +timeArr[1]
} 
// 获取需要的dom
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.lrc-list'),
    container: document.querySelector('.container')
}
var lrcDate = parseLrc(lrc)

/**
 * @description 计算出当前播放时间应该高亮的歌词的索引
 * 如果没有任何一句歌词要显示就返回 -1
 * @param {*} arr 
 * @param {*} time 
 * @returns 
 */
function findIndex() {
    var currentTime = doms.audio.currentTime
    var arr = lrcDate
    // console.log(doms.audio.currentTime,doms.audio)
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].time > currentTime) {
            return i - 1
        }
        // 找到最后一句歌词，返回最后一句歌词的索引
        if (i === arr.length - 1) {
            return i
        }
    }
}

// 界面 
/**
 * @description 创建歌词dom
 */
function createLrcDom() {
    var frag = document.createDocumentFragment() // 创建一个文档片段
    for (var i = 0; i < lrcDate.length; i++) {
        var li = document.createElement('li')
        li.textContent = lrcDate[i].words
        frag.appendChild(li)
    }
    doms.ul.appendChild(frag)
}

createLrcDom()
// 歌词容器高度
var containerHeight = doms.container.clientHeight // 获取歌词容器的高度
var itemHeight = doms.ul.children[0].clientHeight // 获取歌词li的高度
var maxOffset = doms.ul.clientHeight - containerHeight // 最大偏移量
/**
 * @description 设置歌词的偏移量
 */
function setOffset() {
    var index = findIndex()
    var li = doms.ul.children[index]
    var liActive = doms.ul.querySelector('.active')
    if(liActive) {
        liActive.classList.remove('active')
    } 
    if(li) {
        li.classList.add('active')
    } 
    // 获取当前播放时间应该高亮的歌词的偏移量
    var offset = (itemHeight * index  + itemHeight / 2) - containerHeight / 2   
    if(offset < 0) {
        offset = 0
    } 
    if(offset > maxOffset) {
        offset = maxOffset
    }  
    doms.ul.style.transform = `translateY(-${offset}px)` 
    
}
// 事件
doms.audio.addEventListener('timeupdate', setOffset) 


// 思路：1. 解析数据 2. 界面逻辑 3. 事件逻辑
