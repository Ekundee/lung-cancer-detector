import { ServiceStatusEnum } from "../../enum/utility.enum";

export interface RenderProps<T> {
     Status : ServiceStatusEnum,
     StatusMessage : string,
     Data : T
}