/* types/react-media.d.ts */
import "react";

declare module "react" {
  interface VideoHTMLAttributes<T> extends HTMLAttributes<T> {
    controlsList?: string;
    disablePictureInPicture?: boolean;
    disableRemotePlayback?: boolean;
  }
}
