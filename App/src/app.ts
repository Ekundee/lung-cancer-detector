require("dotenv").config({})
import express, { Request, Response } from "express"
import path from "path"
import { RenderProps } from "./service/interface/Iutility.service";
import { PredictLungCancerResponse } from "./service/interface/Iai.service";
import { test } from "./service/ai.service";

const app = express()

/*setting view engine*/
app.set("view engine", "ejs")

/*setting views folder*/
app.set("views", path.join(__dirname + "/view"))


app.get("/", (req : Request, res : Response) =>{
     res.render("predict.page.ejs")
})

app.get("/result", (req : Request, res : Response) =>{
     var response : RenderProps<PredictLungCancerResponse> = test()
     res.render("result.page.ejs", response)
})

const PORT : string = process.env.PORT || "8080"

app.listen(PORT, ()=>{
     console.log(`**********Application is running on port - ${PORT}************`)
})