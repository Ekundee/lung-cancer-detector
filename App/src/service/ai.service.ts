import * as tf from "@tensorflow/tfjs-node"
import { PredictLungCancerDto, PredictLungCancerResponse } from "./interface/Iai.service";
import { RenderProps } from "./interface/Iutility.service";
import { ServiceStatusEnum } from "../enum/utility.enum";


function findMinNMax(a : any){
     let arrMin = a[0]
     let arrMax = a[0]
     let arrMinIndex = 0
     let arrMaxIndex = 0
     for(let i = 0; i < a.length; i++){
          if(a[i] < arrMin){
               arrMin = a[i]
               arrMinIndex = i
          }
          if(a[i] > arrMax){
               arrMax = a[i]
               arrMaxIndex = i
          }
     }
     return { arrMin, arrMax, arrMinIndex, arrMaxIndex }
}


export async function predictLungCancer (predictLungCancerDto : PredictLungCancerDto) {
     const lungImage  = predictLungCancerDto.LungImage
     // const b = Buffer.from(skinPic, "base64");
     var lungPicTensor = tf.node.decodeImage(lungImage!.buffer,3)
     var resizedSkinPicTensor = tf.image.resizeBilinear(lungPicTensor, [64,64], true) // this is a 3d tensor but we need a 4d tensor so we switch normal js array before 4d tensor
     const resizedLungPicTensorToArray = resizedSkinPicTensor.dataSync();
     const resizedLungPicTensorToJSArray = Array.from(resizedLungPicTensorToArray);    
          
     // Load model
     const model = tf.loadLayersModel("file://./src/AI_Model/skinDiseaseModel/model.json")
     const lungCancerLabels : any = [ "Malignant", "Normal"]
     
     const modelConfig : any = (await model).getConfig();
     var inputShape = modelConfig["layers"][0]["config"]["batchInputShape"]
     inputShape[0] = 1
     const lungPic4Dtensor = tf.tensor4d(resizedLungPicTensorToJSArray,  inputShape)
     
     // Predicting
     var predictProbabilityTensor = ((await model).predict(lungPic4Dtensor) as tf.Tensor)
     const predictProbabilityTensorToArray = predictProbabilityTensor.dataSync();
     const predictProbabilityTensorToJSArray : any = Array.from(predictProbabilityTensorToArray);
     const { arrMaxIndex } = findMinNMax(predictProbabilityTensorToJSArray)
     
     var resultsArray : any= []
     for(let k : any = 0; k < predictProbabilityTensorToJSArray.length; k++){
          const skinDisease = lungCancerLabels[k]
          resultsArray[k] = { 
               Disease : skinDisease,
               Probability : predictProbabilityTensorToJSArray[k] * 100
          }
     }
     
     const confirmedDisease = lungCancerLabels[arrMaxIndex]

     // Find the indices of the three highest elements in the original array
     const originalIndices = predictProbabilityTensorToJSArray
     .map((_, index : number) => index)
     .sort((a : any, b : any) => predictProbabilityTensorToJSArray[b] - predictProbabilityTensorToJSArray[a])
     .slice(0, 3);

     console.log(originalIndices)
  
     var response : RenderProps<PredictLungCancerResponse>
     response = {
          Status : ServiceStatusEnum.SUCCESSFUL,
          StatusMessage : "Lung was successfully evaluated",
          Data : {
               OriginalIndices : originalIndices
          }
     }
     return response 
}

export function test () {
     var response : RenderProps<PredictLungCancerResponse>
     response = {
          Status : ServiceStatusEnum.SUCCESSFUL,
          StatusMessage : "Lung was successfully evaluated",
          Data : {
               OriginalIndices : "originalIndices"
          }
     }
     return response 
}