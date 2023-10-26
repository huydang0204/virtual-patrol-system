import React, { useState } from "react";
import { usePopper } from "react-popper";
import { FaUserAlt } from "react-icons/fa";

import useOutsideClick from "hooks/useOutsideClick";

import { Portal } from "./Portal";
import { EntityOverallData } from "@vps/utils/lib/dto";

const AvatarsOverlay = ({ items } : { items : EntityOverallData[] }) : JSX.Element => {
  const overlapPercentage = 60;
  const maxVisibleAvatars = 3;

  const visibleAvatars = items.slice(0, maxVisibleAvatars);
  const hiddenAvatarCount = Math.max(0, items.length - maxVisibleAvatars);

  const [avatarsPopupRef,
    isAvatarsPopupOpen,
    setIsAvatarsPopupOpen] = useOutsideClick(false);
  const [refElAvatars,
    setRefElAvatars] = useState(null);
  const [avatarPopperEl,
    setAvatarPopperEl] = useState(null);
  const {
    styles : avatarsPopperStyles, attributes : avatarseAttributes
  } = usePopper(
    refElAvatars,
    avatarPopperEl,
    {
      placement : "bottom-start",
      modifiers : [
        {
          name : "offset",
          options : {
            offset : [0,
              3]
          }
        }
      ],
      strategy : "fixed"
    }
  );

  const handleMouseEnter = () => {
    setIsAvatarsPopupOpen(true);
  };

  const handleMouseLeave = () => {
    setIsAvatarsPopupOpen(false);
  };

  return (
    <div id="avatars-overlay">
      {visibleAvatars.map((item, index: number) => {
        const overlapOffset = (maxVisibleAvatars - 1 - index) * (overlapPercentage / 100) * 20;
        const style = {
          right : `${overlapOffset}px`,
          zIndex : index
        };

        return (
          <div title={item.name} className="avatar-inner-wrapper" style={style} key={index}>
            {item.avatar ? <img src={item.avatar} className="img-content" /> : <div className="img-content d-flex justify-content-center align-items-center" ><FaUserAlt size={10} color="white" /></div>}
          </div>
        );
      })}
      {hiddenAvatarCount > 0 && (
        <div ref={setRefElAvatars} className="avatar-inner-wrapper additional-avatar"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="rounded-circle">
            <span>+{hiddenAvatarCount}</span>
          </div>
        </div>
      )}

      {isAvatarsPopupOpen && hiddenAvatarCount > 0 && (
        <Portal>
          <div ref={avatarsPopupRef}>
            <div ref={setAvatarPopperEl} style={avatarsPopperStyles.popper} {...avatarseAttributes.popper} className="z-index-999">
              <div className="avatar-popup-wrapper" style={{ zIndex : 99999 }}>
                {items.slice(maxVisibleAvatars).map((item, index) => (
                  <div className="popup-avatar" key={index}>
                    <div className="avatar-img-cover">
                      {item.avatar ? <img className="img-content" src={item.avatar} alt={`Avatar ${index}`} /> : <div className="img-content d-flex justify-content-center align-items-center" ><FaUserAlt size={10} color="white" /></div>}
                    </div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default AvatarsOverlay;