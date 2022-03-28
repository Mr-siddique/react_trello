import React, { useState } from "react";
import { changeCardData, addComment } from "../ApiCalls";
import Comment from "./Comment";
import "./Modal.css";

const Modal = ({ modal, showModal }) => {
  const [nameReadOnly, toggleNameReadOnly] = useState(true);
  const [descReadOnly, toggleDescReadOnly] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const { modalName, modalDesc, modalComments, modalId, modalState } = modal;
  const handleChange = (e) => {
    showModal((prevModal) => ({
      ...prevModal,
      [e.target.name]: e.target.value,
    }));
  };
  const saveModalName = async (e) => {
    if (e.keyCode !== 13) return;
    try {
      showModal({ ...modal, modalName: modalName.replace(/\n/g, "") });
      const { data } = await changeCardData(modalId, { name: modalName });
      toggleNameReadOnly(true);
    } catch (err) {
      console.log(err);
    }
  };
  const saveModalDesc = async (e) => {
    try {
      showModal({ ...modal, modalDesc: modalDesc.replace(/\n/g, "") });
      const { data } = await changeCardData(modalId, { desc: modalDesc });
      toggleDescReadOnly(true);
    } catch (err) {
      console.log(err);
    }
  };
  const addNewComment = async (e) => {
    try {
      const { data } = await addComment(modalId, newComment);
      const newCmnt = {
        id: data.id,
        text: data.data.text,
        avatarUrl: data.memberCreator.avatarUrl,
        fullName: data.memberCreator.fullName,
      };
      showModal({ ...modal, modalComments: [...modalComments, newCmnt] });
      setReadOnly(true);
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };
  const filterComment = (commentId) => {
    showModal({
      ...modal,
      modalComments: modalComments.filter(
        (modalComment) => modalComment.id !== commentId
      ),
    });
  };

  return (
    <div className="modalContainer">
      <div className="modalContent">
        <div className="modalHeading">
          <textarea
            value={modalName}
            name="modalName"
            readOnly={nameReadOnly}
            onChange={handleChange}
            onClick={() => toggleNameReadOnly(false)}
            onKeyUp={saveModalName}
          ></textarea>
          <button
            id="close"
            onClick={() => showModal({ ...modal, modalState: false })}
          >
            x
          </button>
        </div>
        <div className="modalDescription">
          <div className="modalDescriptionContainer">
            <h4 style={{ marginRight: "5px" }}>Description</h4>
            {modalDesc && descReadOnly && (
              <button
                style={{ marginLeft: "5px" }}
                onClick={() => toggleDescReadOnly(false)}
              >
                Edit
              </button>
            )}
          </div>
          <textarea
            value={modalDesc}
            name="modalDesc"
            readOnly={descReadOnly}
            onChange={handleChange}
            style={{ backgroundColor: !descReadOnly && "#fff" }}
            placeholder="Add a more detailed description."
            onClick={() => !modalDesc && toggleDescReadOnly(false)}
          ></textarea>
          {!descReadOnly && (
            <div className="buttons">
              <button className="save" id="save" onClick={saveModalDesc}>
                Save
              </button>
              <button
                className="close"
                onClick={() => toggleDescReadOnly(true)}
              >
                x
              </button>
            </div>
          )}
        </div>
        <div className="activity">
          <h4>Activity</h4>
          <div className="putComment">
            <textarea
              placeholder="Write a comment."
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              onClick={() => setReadOnly(false)}
            ></textarea>
            {!readOnly && (
              <button id="save" onClick={addNewComment}>
                Save
              </button>
            )}
          </div>
          <div className="allComments">
            {modalComments.map((modalComment, index) => (
              <Comment
                modalComment={modalComment}
                key={index}
                modalId={modal.modalId}
                filterComment={filterComment}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
