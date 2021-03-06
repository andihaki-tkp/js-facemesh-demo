import TRIANGULATION from '../const/triangulation';
import { lipMesh, rightEyeMesh, rightEyeShadowMesh, leftEyeMesh, leftEyeShadowMesh } from '../const/segmentation';

/* canvas drawing path method */
const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
  ctx.fill(region);
}

export const paintingFace = (ctx, predictions, {skin, lip, eyeShadow}) => {
  let lipFlag = 0;
  let rightEyeFlag = 0;
  let rightEyeShadowFlag = 0;
  let leftEyeShadowFlag = 0;
  let leftEyeFlag = 0;

  if (predictions.length > 0) {
    predictions.forEach(prediction => {
      const keypoints = prediction.scaledMesh;

      /* loop all triangulation face-map and match to prediction points */
      for (let i = 0; i < TRIANGULATION.length; i++) {
        const points = [
          TRIANGULATION[i][0],
          TRIANGULATION[i][1],
          TRIANGULATION[i][2]
        ].map(index => keypoints[index]);

        //seperate face segmentation and set each segment's color
        let drawColor = skin;
        if (lipMesh[lipFlag] === i){
          drawColor = lip;
          lipFlag += 1;
        }
        else if(rightEyeMesh[rightEyeFlag] === i){
          drawColor = null;
          rightEyeFlag += 1;
        }
        else if(eyeShadow && rightEyeShadowMesh[rightEyeShadowFlag] === i){
          drawColor = eyeShadow;
          rightEyeShadowFlag += 1;
        }
        else if(leftEyeMesh[leftEyeFlag] === i){
          drawColor = null;
          leftEyeFlag += 1;
        }
        else if(eyeShadow && leftEyeShadowMesh[leftEyeShadowFlag] === i){
          drawColor = eyeShadow;
          leftEyeShadowFlag += 1;
        }

        /* do drawPath method if the color is not null */
        if(drawColor){
          ctx.fillStyle = drawColor;
          ctx.strokeStyle = drawColor;
          drawPath(ctx, points, true)
        };
      }
    });
  }
}