import React, { useEffect, useState } from "react";
import { editComment,deleteComment } from "../ApiCalls";

import "./Comment.css";

// {id: '623ea3e8700e9a0e20cab200', text: 'comment', avatarUrl: 'https://trello-members.s3.amazonaws.com/62320cf8efc02811542d0d43/b76ee3cc0c1a88912e2f8a461b479b64', fullName: '4024_md amir'}

const Comment = ({ modalComment,modalId,filterComment }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [commentText, setCommentText] = useState(modalComment.text);

  const saveComment = async () => {
    try {
        const {data}=await editComment(modalComment.id,commentText);
        setReadOnly(true);
    } catch (err) {
      console.log(err);
    }
  };
const deleteThisComment=async()=>{
   try{
     const {data}=await deleteComment(modalId,modalComment.id);
     filterComment(modalComment.id);
   }catch(err){
       console.log(err);
   }
}
// useEffect(()=>{

// },);
  return (
    <div className="singleComment">
      <img className="avatar" src={modalComment.avatarUrl} />
      <div className="commentData">
        <h5>{modalComment.fullName}</h5>
        <div className="displayComment">
          <textarea
            value={commentText}
            readOnly={readOnly}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          {!readOnly && (
            <div className="buttons">
              <button id="save" onClick={saveComment}>
                Save
              </button>

              <button id="close" onClick={() => setReadOnly(true)}>
                x
              </button>
            </div>
          )}
        </div>
        {readOnly && (
          <div className="anchors">
            <a href="#" onClick={() => setReadOnly(false)}>
              Edit
            </a>
            <a href="#" onClick={deleteThisComment}>Delete</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
