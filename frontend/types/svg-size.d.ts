import * as React from "react";

declare module "react" {
  interface SVGProps<T> {
    size?: number | string;
  }
}

export {};
