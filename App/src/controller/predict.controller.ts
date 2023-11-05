import express, { Request, Response } from "express"
import { PredictLungCancerDto, PredictLungCancerResponse } from "../service/interface/Iai.service";
import { predictLungCancer, test } from "../service/ai.service";
import { RenderProps } from "../service/interface/Iutility.service";


export async function predictLungCancerController(req : Request, res : Response){
     try{
          const predictLungCancerDto : PredictLungCancerDto = req.body
          // var response : RenderProps<PredictLungCancerResponse> = await predictLungCancer(predictLungCancerDto)
          var response : RenderProps<PredictLungCancerResponse> = await test()
          res.render("result.page.ejs", response)
     }catch(e : any){
          
     }
}