//  Work
// 1. Render songs
// 2. Scroll top 
// 3. Play/ Pause/ Seek
// 4. CD rotate
// 5. Next/ Prev Song
// 6. Random songs
// 7. Next and Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click


const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const playlist=$('.playlist')
const songName=$('header h2')
const cd=$('.cd')
const cdThumb=$('.cd-thumb')
const audioEl=$('audio')
const btnPlay=$('.btn-play')
const progressEl=$('.progress')
const btnNext=$('.btn-next')
const btnPrev=$('.btn-prev')
const btnRandom=$('.btn-random')
const btnRepeat=$('.btn-repeat')


const app={
  currentIndex:0,
  isPlaying:false,
  isRandom:false,
  isRepeat:false,
   songs: [
    {
      name:'Nến và Hoa',
      singer:'Rhymastic',
      path:'./assets/media/Nến và hoa.mp3',
      image:'./assets/img/nến và hoa.jpg'
    },
    {
      name:'Deep see',
      singer:'BinZ',
      path:'./assets/media/deepsee.mp3',
      image:'./assets/img/deep sea.jpg'
    },
    {
      name:'Cho mình em',
      singer:'BinZ & Đen',
      path:'./assets/media/Cho mình em.mp3',
      image:'./assets/img/cho mình em.jpg'
    },
    {
      name:'Dont break my heart',
      singer:'BinZ',
      path:'./assets/media/Dont break my heart.mp3',
      image:'./assets/img/dont break my heart.jpg'
    },
    {
      name:'Everyday',
      singer:'Space Speaker',
      path:'./assets/media/Everyday.mp3',
      image:'./assets/img/everyday.jpg'
    },
    {
      name:'Người và ta',
      singer:'Rhymastic',
      path:'./assets/media/Người và ta.mp3',
      image:'./assets/img/người và ta.jpg'
    },
    {
      name:'Nụ cười',
      singer:'Rhymastic',
      path:'./assets/media/Nụ cười.mp3',
      image:'./assets/img/nụ cười.jpg'
    },
    {
      name:'Ok',
      singer:'BinZ',
      path:'./assets/media/OK.mp3',
      image:'./assets/img/ok.jpg'
    },
    {
      name:'Sofar',
      singer:'BinZ',
      path:'./assets/media/Sofar.mp3',
      image:'./assets/img/sofar.jpg'
    },
    {
      name:'Treasure',
      singer:'Rhymastic',
      path:'./assets/media/Treasure.mp3',
      image:'./assets/img/treasure.jpg'
    }
  ],
  render(){
    const htmls=this.songs.map((song,index)=>{
      return `
      <div class="song ${index===this.currentIndex?'active':''}" data-index=${index}>
         <div class="thumb" style="background-image: url('${song.image}')"></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
    </div>
    `
    })

    playlist.innerHTML=htmls.join('')  
  },
  handleEvent(){
    const _this=this
    const cdWidth=cd.offsetWidth
    // Thu phóng CD
    document.onscroll= function(e){
      const scrollTop= Math.floor(window.screenY)|| Math.floor(document.documentElement.scrollTop)
      let newCdWidth= cdWidth-scrollTop
      newCdWidth<0?newCdWidth=0:''
      cd.style.width=newCdWidth+'px'
      cd.style.opacity=newCdWidth/cdWidth
    }
    // Cd rorate
   cdThumbRotate= cdThumb.animate([
    {transform:'rotate(360deg)'}],
    {
      duration:10000,
      iterations:Infinity
    }
  )
  cdThumbRotate.pause()
// Playing/pause/seek music
      btnPlay.onclick=function(){
       
        if(!_this.isPlaying){
          audioEl.play()
        }
        else{
          audioEl.pause()
        }
      }
      audioEl.onplay=function(){
        _this.isPlaying=true
        btnPlay.classList.add('playing')
        cdThumbRotate.play()
      }
      audioEl.onpause=function(){
        _this.isPlaying=false
        btnPlay.classList.remove('playing')
        cdThumbRotate.pause()
      }
      
      progressEl.onchange=function(e){
        audioEl.currentTime=e.target.value/100*audioEl.duration  
      }
      audioEl.ontimeupdate=function(){
        if(audioEl.duration){
          progressEl.value=Math.floor(audioEl.currentTime/audioEl.duration*100)
        }
      }
     
      // Next / prev btn
      btnNext.onclick=function(){
        if(_this.isRandom){
          _this.randomSong()
        }else{
          _this.nextSong()
        }
          audioEl.play()
          _this.render()
          _this.scrollToSong()
      }
      btnPrev.onclick=function(){
        if(_this.isRandom){
          _this.randomSong()
        }else{
          _this.prevSong()
        }
        audioEl.play()
        _this.render()
        _this.scrollToSong()
    }
    btnRandom.onclick=function(){
       _this.isRandom=!_this.isRandom
      btnRandom.classList.toggle("active",_this.isRandom)
    }
    btnRepeat.onclick=function(){
      _this.isRepeat=!_this.isRepeat
      btnRepeat.classList.toggle("active",_this.isRepeat)
   }
  
//  Next and repeat when ended
    audioEl.onended=function(){
      if(_this.isRandom){
        _this.randomSong()
        audioEl.play()
      }
      else if(_this.isRepeat){
        _this.loadCurrentSong()
          audioEl.play()
      }
      else{
        _this.nextSong()
        audioEl.play()
      }
    }
    playlist.onclick=function(e){
      let songNode=e.target.closest('.song:not(.active)')
      if(songNode||e.target.closest('.option')){
        if(songNode){
          _this.currentIndex=Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audioEl.play()
        }
        if(e.target.closest('.option')){

        }
      }
    }
  },
    defineProperties(){
      Object.defineProperty(this,'currentSong',{
        get: function(){
          return this.songs[this.currentIndex]
        }
      })
    },
    loadCurrentSong: function(){
      songName.innerHTML=this.currentSong.name
      cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
      audioEl.src=this.currentSong.path
    },
    nextSong(){
      this.currentIndex++
      if(this.currentIndex>this.songs.length-1){
        this.currentIndex=0
      }
      this.loadCurrentSong()
    },
    prevSong(){
      this.currentIndex--
      if(this.currentIndex<0){
        this.currentIndex=this.songs.length-1
      }
      this.loadCurrentSong()
    },
    randomSong(){
      let randomIndex
      do{
         randomIndex=Math.floor(Math.random()*this.songs.length)
      }
      while(randomIndex===this.currentIndex)
      this.currentIndex=randomIndex
      this.loadCurrentSong()
    },
    // scoll to song
    scrollToSong(){
      setTimeout(()=>{
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block:'end'
        })
      },300)
    },
    start(){
    this.defineProperties()
    this.loadCurrentSong()
    this.handleEvent()
    this.render()
  },
  init(){
    this.start()
  }
}
app.init()