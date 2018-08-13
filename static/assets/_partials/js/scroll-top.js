//ScrollTop
/**
    by Nemes Ioan Sorin - not an jQuery big fan 
    therefore this script is for those who love the old clean coding style  
    @id = the id of the element who need to bring  into view
      
    Note : this demo scrolls about 12.700 pixels from Link1 to Link3
*/
(function()
{
      window.setTimeout = window.setTimeout; //
})();

      var smoothScr = {
      iterr : 300, // set timeout miliseconds ..decreased with 1ms for each iteration
        tm : null, //timeout local variable
      stopShow: function()
      {
        clearTimeout(this.tm); // stopp the timeout
        this.iterr = 30; // reset milisec iterator to original value
      },
      getRealTop : function (el) // helper function instead of jQuery
      {
        var elm = el; 
        var realTop = 0;
        do
        {
          realTop += elm.offsetTop;
          elm = elm.offsetParent;
        }
        while(elm);
        return realTop;
      },
      getPageScroll : function()  // helper function instead of jQuery
      {
        var pgYoff = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        return pgYoff;
      },
      anim : function (id) // the main func
      {
        this.stopShow(); // for click on another button or link
        var eOff, pOff, tOff, scrVal, pos, dir, step;

        eOff = document.getElementById(id).offsetTop; // element offsetTop

        tOff =  this.getRealTop(document.getElementById(id).parentNode); // terminus point 

        pOff = this.getPageScroll(); // page offsetTop

        if (pOff === null || isNaN(pOff) || pOff === 'undefined') pOff = 0;

        scrVal = eOff - pOff; // actual scroll value;

        if (scrVal > tOff) 
        {
          pos = (eOff - tOff - pOff); 
          dir = 1;
        }
        if (scrVal < tOff)
        {
          pos = (pOff + tOff) - eOff;
          dir = -1; 
        }
        if(scrVal !== tOff) 
        {
          step = ~~((pos / 4) +1) * dir;

          if(this.iterr > 1) this.iterr -= 1; 
          else this.itter = 0; // decrease the timeout timer value but not below 0
          window.scrollBy(0, step);
          this.tm = window.setTimeout(function()
          {
             smoothScr.anim(id);  
          }, this.iterr); 
        }  
        if(scrVal === tOff) 
        { 
          this.stopShow(); // reset function values
          return;
        }
    }
 }