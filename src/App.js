import React, { useEffect, useState } from "react";
import List from "./components/List";
import { fetchLists, deleteAList, fetchBoard, addList } from "./ApiCalls";
import Modal from "./components/Modal";

const App = () => {
  const [lists, setLists] = useState();
  const [cards, setCards] = useState({});
  const [form, toggleForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [modal, showModal] = useState({
    modalState: false,
    modalId: "",
    modalName: "",
    modalDesc: "",
    modalComments: [],
  });
  const getLists = async () => {
    try {
      const { data } = await fetchLists();
      data.reverse();
      setLists(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const { data } = await deleteAList(listId);
      setLists((prevLists)=>prevLists.filter(list=>list.id!==data.id));
    } catch (err) {
      console.log(err.message);
    }
  };
  const addNewList = async (e) => {
    try {
      e.preventDefault();
      const { data } = await fetchBoard();
      const boardId = data.id;
      const res = await addList(boardId, { name: newListName });
      setLists([...lists, res.data]);
      setNewListName("");
      toggleForm(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getLists();
  }, []);
  return (
    <div className="Board" style={styles}>
      {lists?.map((list, index) => (
        <List
          key={list.id}
          listId={list.id}
          listName={list.name}
          handleDeleteList={handleDeleteList}
          showModal={showModal}
          cards={cards}
          setCards={setCards}
        />
      ))}
      <div className="addNewList">
        {!form ? (
          <button
            className="addList"
            style={addListBtnStyle}
            onClick={() => toggleForm(true)}
          >
            <i className="fa-light fa-plus"></i> Add another list
          </button>
        ) : (
          <form style={{ width: "250px", backgroundColor: "beige" }}>
            <input
              placeholder="Enter list title"
              style={inputElemStyle}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="buttons">
              <button id="add" style={{ width: "80px" }} onClick={addNewList}>
                Add list
              </button>
              <button id="close" onClick={() => toggleForm(false)}>
                x
              </button>
            </div>
          </form>
        )}
      </div>
      {modal.modalState && <Modal modal={modal} showModal={showModal} />}
    </div>
  );
};

export default App;

const styles = {
  padding: "10px",
  fontFamily: "'Ubuntu', sans-serif",
  position: "relative",
};

const addListBtnStyle = {
  width: "250px",
  height: "30px",
  backgroundColor: "rgba(0,0,0,0.1)",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "16px",
  color: "gray",
};
const inputElemStyle = {
  width: "100%",
  height: "30px",
  border: "2px solid blue",
  marginBottom: "5px",
  fontFamily: "inherit",
  paddingLeft: "5px",
};
