/*
 * Adapted from Kitkit School TraceLocator::bestIndexByFinger.
 * Copyright (c) 2016 Enuma, Inc. All rights reserved.
 * Based on todomathandroid_kh and Todomath iOS (Locomotive Labs).
 * Licensed under Apache-2.0; see KITKIT-LICENSE.txt.
 * Source path and revision are recorded in THIRD_PARTY.md.
 * MODIFIED 2026-09-17: C++ -> JavaScript; flat sample array; SVG-scale
 * lookahead budget; turning-angle penalty instead of absolute heading;
 * no skip-to-stroke-end shortcut; explicit null result outside tolerance.
 */
(function(root){
  function bestIndexByFinger(passedIndex, points, finger, tolerance=24, lookahead=48){
    let bestIndex=null, bestDistance=tolerance, energy=lookahead*.8;
    let last=points[passedIndex];
    let previousAngle=null;
    for(let i=passedIndex;i<points.length;i++){
      const item=points[i];
      const distanceToLast=Math.hypot(item.x-last.x,item.y-last.y);
      const distanceToFinger=Math.hypot(item.x-finger.x,item.y-finger.y);
      if(distanceToLast>0){
        const angle=Math.atan2(item.y-last.y,item.x-last.x);
        if(previousAngle!==null){
          const turn=Math.abs(Math.atan2(Math.sin(angle-previousAngle),Math.cos(angle-previousAngle)))*180/Math.PI;
          energy-=Math.min(turn,20)*.5;
        }
        energy-=distanceToLast*.8;
        previousAngle=angle;
      }
      if(energy<0)break;
      if(distanceToFinger<bestDistance){bestDistance=distanceToFinger;bestIndex=i;}
      last=item;
    }
    return bestIndex;
  }
  root.KitkitTraceLocator={bestIndexByFinger};
  if(typeof module!=='undefined')module.exports=root.KitkitTraceLocator;
})(typeof window!=='undefined'?window:globalThis);
