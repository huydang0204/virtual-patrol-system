import React from "react";
import { AiOutlineUser } from "react-icons/ai";

interface ComponentProps {
    avatar ?: string;
    Icon ?: JSX.Element;
    title ?: string;
    subTitle ?: string;
    description ?: string;
    timeAgo : string;
}

function UserActivityCard(props : ComponentProps) {
  const {
    avatar, Icon, title, subTitle, description, timeAgo 
  } = props;

  return (
    <div className="d-flex justify-content-between gap-3">
      {/* <div className="col-8"> */}
      <div className="d-flex justify-content-start align-items-start gap-2">
        {!!avatar ? 
          <div><img src={avatar} className="avatar-in-table" /></div> : 
          !!Icon ? <div className="activity-icon">{Icon}</div> :
            <div className="border border-gray p-1 rounded-pill no-avatar"><AiOutlineUser color="white" size={15} /></div>
        }
        <div className="">
          { title && <h6 className="text-white fw-bold mb-1">{ title }</h6> }
          { subTitle && <div className="text-secondary mb-1">{ subTitle }</div> }
          { description && <div className="text-gray">{ description }</div>}
        </div>
      </div>
      {/* </div> */}
      {/* <div className="col-4" style={{ textAlign : "right" }}> */}
      <small className="text-secondary" style={{ textAlign : "right" }}>{ timeAgo }</small>
      {/* </div> */}
    </div>
  );
}

export default UserActivityCard;