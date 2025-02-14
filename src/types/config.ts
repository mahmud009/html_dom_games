import { Vec } from "src/system/Vec";
import { TDisplayConfig } from "./display-config";

export interface TConfig {
  bulletSize: Vec;
  enemySize: Vec;
  display: TDisplayConfig;
}
