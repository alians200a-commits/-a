/* Ordered center-line coverage. Rejects taps, shortcuts and backwards strokes.
 * These paths are simplified motor-training guides, not handwriting assessment.
 */
(function(root){
  class TraceTracker {
    constructor(points, tolerance=25){this.points=points;this.tolerance=tolerance;this.index=0;this.active=false;}
    near(p,q){return Math.hypot(p.x-q.x,p.y-q.y)<=this.tolerance;}
    begin(p){this.active=this.near(p,this.points[this.index]);return this.active;}
    move(p){
      if(!this.active)return false;
      // Only the next few samples can be consumed; no jumping across the glyph.
      let advanced=false;
      for(let n=0;n<3&&this.index<this.points.length-1;n++){
        if(!this.near(p,this.points[this.index+1]))break;
        this.index++;advanced=true;
      }
      if(!advanced&&!this.near(p,this.points[this.index]))this.active=false;
      return this.complete;
    }
    end(){this.active=false;}
    get complete(){return this.index>=this.points.length-2;}
    get progress(){return this.index/(this.points.length-1);}
  }
  root.TraceTracker=TraceTracker;
  if(typeof module!=='undefined')module.exports=TraceTracker;
})(typeof window!=='undefined'?window:globalThis);
