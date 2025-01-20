import S3ImageHosting from "..";
import { imageHosting as _imageHosting } from "./global";

declare module "base"{
    export const imageHosting: S3ImageHosting;
}