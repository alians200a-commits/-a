/* Ordered tracing using Kitkit's bounded nearest-sample search, adapted for SVG.
 * No completion for a tap, stationary events, or a jump to the end.
 * Simplified motor-training paths: not a handwriting assessment.
 */
(function(root){
  const locator=typeof module!=='undefined'?require('./vendor/kitkit-trace-locator.js'):root.KitkitTraceLocator;
  class TraceTracker {
    constructor(points,tolerance=25){this.points=points;this.tolerance=tolerance;this.index=0;this.active=false;}
    near(p,q){return Math.hypot(p.x-q.x,p.y-q.y)<=this.tolerance;}
    begin(p){this.active=!this.complete&&this.near(p,this.points[this.index]);return this.active;}
    move(p){
      if(!this.active)return false;
      const next=locator.bestIndexByFinger(this.index,this.points,p,this.tolerance,48);
      if(next===null){this.active=false;return false;}
      this.index=next;
      return this.complete;
    }
    end(){this.active=false;}
    get complete(){return this.index>=this.points.length-2;}
    get progress(){return this.complete?1:this.index/(this.points.length-1);}
  }
  root.TraceTracker=TraceTracker;
  if(typeof module!=='undefined')module.exports=TraceTracker;
})(typeof window!=='undefined'?window:globalThis);
