import React, { useEffect, useState } from "react";
import Card from "./Card";
import { fetchCardsOfAList, changeListName, createNewCard } from "../ApiCalls";
import "./List.css";
const List = ({
  listId,
  listName,
  handleDeleteList,
  showModal,
  renderUI,
  setRenderUI,
}) => {
  const [cards, setCards] = useState({});
  const [editListName, setEditListName] = useState(false);
  const [currListName, setCurrListName] = useState(listName);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [currCard, setCurrCard] = useState([]);

  const getCardsOfAList = async () => {
    try {
      const { data } = await fetchCardsOfAList(listId);
      // setCards({ ...cards, [listId]: data });
       setCurrCard(data);
    } catch (err) {
      console.log(err);
    }
  };
  const saveListName = async (e) => {
    try {
      if (e.keyCode !== 13) return;
      setEditListName(!editListName);
      
      setCurrListName(() => {
        let tempListName = "";
        for (let i = 0; i < currListName.length - 1; i++) {
          tempListName += currListName[i];
        }
        return tempListName;
      });
      const { data } = await changeListName(listId, currListName);
    } catch (err) {
      console.log(err);
    }
  };
  const addNewCard = async (e) => {
    try {
      e.preventDefault();
      const { data } = await createNewCard(listId, { name: newCardName });
      setCurrCard([...currCard, data]);
      setShowNewCardForm(!showNewCardForm);
      setNewCardName("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCardsOfAList(listId);
  }, []);
  
  return (
    <div className="list" id={listId}>
      <div className="heading">
        <textarea
          value={currListName}
          onChange={(e) => setCurrListName(e.target.value)}
          onClick={() => setEditListName(!editListName)}
          onKeyUp={saveListName}
          readOnly={!editListName}
        ></textarea>
        <i
          className="fa-solid fa-trash"
          onClick={() => handleDeleteList(listId)}
        ></i>
      </div>
      {currCard.map((card, index) => (
        <Card
          key={index}
          cardId={card.id}
          title={card.name}
          description={card.desc}
          showModal={showModal}
          pos={card.pos}
          currCard={currCard}
          setCurrCard={setCurrCard}
          listId={card.idList}
          setRenderUI={setRenderUI}
          renderUI={renderUI}
        />
      ))}

      {!showNewCardForm ? (
        <button
          className="addCard"
          onClick={() => setShowNewCardForm(!showNewCardForm)}
        >
          <i className="fa-solid fa-plus"></i>Add a card
        </button>
      ) : (
        <form>
          <textarea
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
          ></textarea>
          <div className="buttons">
            <button
              style={{ width: "70px", height: "30px" }}
              id="add"
              onClick={addNewCard}
            >
              Add Card
            </button>
            <button
              style={closeButtonStyle}
              id="close"
              onClick={() => setShowNewCardForm(!showNewCardForm)}
            >
              X
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default List;

const closeButtonStyle = {
  marginLeft: "10px",
  border: "none",
  background: "inherit",
  color: "grey",
  fontSize: "20px",
};
