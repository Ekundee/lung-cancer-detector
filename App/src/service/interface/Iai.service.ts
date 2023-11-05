export interface PredictLungCancerDto{
     LungImage : Express.Multer.File | undefined
}

export interface PredictLungCancerResponse {
     OriginalIndices : any
}