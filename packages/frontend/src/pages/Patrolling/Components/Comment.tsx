import React from "react";
import { FaRegComment } from "react-icons/fa";
import { Button } from "reactstrap";

const Comment = ({
  onCommentClick, classes = "" 
} : {
  onCommentClick : () => void,
  classes ?: string
}) : JSX.Element => {
  return (
    <div className={`patrolling-comments ${classes}`} title="Add comment">
      <Button
        className={`rounded rounded-3 ${classes === "outside" ? "p-1 px-2" : "p-2"}`}
        onClick={onCommentClick}>
        <FaRegComment
          size={classes === "outside" ? 10 : 15}
          style={{
            cursor : "pointer",
            color : "white"
          }}
        />
      </Button>
    </div>);
};

export default Comment;

