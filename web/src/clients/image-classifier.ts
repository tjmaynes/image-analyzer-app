import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { Err, Ok, Result } from 'ts-results'
import {
  ClassificationData,
  IImageClassifierClient,
  ImageMetadata,
} from '../types'

export class MobileNetImageClassifierClient implements IImageClassifierClient {
  classify = async (
    { name, imageData }: ImageMetadata,
    model: mobilenet.MobileNet
  ): Promise<Result<ClassificationData, Error>> =>
    model
      .classify(imageData)
      .then((predictions) =>
        Ok({
          name: name,
          predictions: Array.from(predictions)
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5),
        })
      )
      .catch((e) => Err(e))
}
