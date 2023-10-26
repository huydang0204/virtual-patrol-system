import React, {
  useEffect,
  useRef
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import {
  VideoJsPlayer,
  VideoJsPlayerOptions
} from "video.js";
import { retrieveNxToken } from "../model/user-account";

interface VideoPlayerProps {
  id : string;
  videoURL? : string;
  options? : VideoJsPlayerOptions;
  videoRequest : {
    // triggered by Reload button
    setIsSyncing : React.Dispatch<React.SetStateAction<boolean>>;

    // video requesting
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>;
    setIsBuffered : React.Dispatch<React.SetStateAction<boolean>>;
    setIsError : React.Dispatch<React.SetStateAction<boolean>>;
    setIsSuccess : React.Dispatch<React.SetStateAction<boolean>>;
  }
}

const VideoPlayer : React.FC<VideoPlayerProps> = ({
  id,
  videoURL : videoUrl,
  options,
  videoRequest
} : VideoPlayerProps) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoJsPlayer>();

  const {
    setIsSyncing,
    setIsLoading,
    setIsBuffered,
    setIsError,
    setIsSuccess
  } = videoRequest;

  useEffect(() => {
    if (options.sources.length === 0) return;

    if (videoNode.current) {
      if (!playerRef.current) {
        const player = videojs(videoNode.current, options, () => {
          console.log("Video player is ready");
        });

        playerRef.current = player;

        player.on("error", (event) => {
          setIsError(true);
          setIsSyncing(false);
        });

        player.on("loadedmetadata", () => {
          setIsSuccess(true);
          setIsLoading(false);
        });

        player.on("playing", () => {
          setIsBuffered(true);
          setIsSyncing(false);
          setIsError(false);
        });
      } else {
        const currentSrc = playerRef.current.currentSrc();
        // new src
        const newSrc = options.sources[0].src;
        const player = playerRef.current;

        // check if current src is not equal to new src
        if (currentSrc !== newSrc) {
          player.autoplay(options.autoplay);
          player.src(options.sources);
        }
      }
    }
  }, [videoUrl,
    options]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      // Reloading triggers this and will dispose / abort old requests and replace with new src
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      id="video-player"
      data-vjs-player
      style={ { borderRadius : "9px" } }>
      <video
        id={ `${ id }` }
        ref={ videoNode }
        className="video-js vjs-big-play-centered custom-video-js-class vjs-control-bar"
      />
    </div>
  );
};

export default VideoPlayer;
