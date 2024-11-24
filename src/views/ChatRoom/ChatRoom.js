import React, { useState } from 'react';
import './ChatRoom.css';
import avatar from '../../assets/avatar.jpg'
const ChatRoom = () => {
  const [activeTab, setActiveTab] = useState('Open');
  const [showBox, setShowBox] = useState(false);
  const [message, setMessage] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChatClick = () => {
    setShowBox(true);
  };

  const handleCloseClick = () => {
    setShowBox(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    console.log("Message sent: ", message);
    setMessage('');
  };

  return (
            <div className="chat-area">
              <div className="chatlist">
                <div className="modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="chat-header">
                      <div className="msg-search">
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInputGroup"
                          placeholder="Search"
                          aria-label="search"
                        />
                      </div>
                    </div>

                    <div className="modal-body-list">
                      <div className="chat-lists">
                        <div className="tab-content" id="myTabContent">
                          <div
                            className={`tab-pane fade show ${activeTab === 'Open' ? 'active' : ''}`}
                            id="Open"
                            role="tabpanel"
                            aria-labelledby="Open-tab"
                          >
                            <div className="chat-list">
                              <a href="#" className="d-flex align-items-center" onClick={handleChatClick}>
                                <div className="flex-shrink-0">
                                  <img
                                    className="img-fluid avatar"
                                    src={avatar}
                                    alt="user img"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h3>Divakar Yadav</h3>
                                  <p>Machine Learning Engineer</p>
                                </div>
                              </a>
                              <a href="#" className="d-flex align-items-center" onClick={handleChatClick}>
                                <div className="flex-shrink-0">
                                  <img
                                    className="img-fluid avatar"
                                    src={avatar}
                                    alt="user img"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h3>Tian Zhao</h3>
                                  <p>Associate Professor</p>
                                </div>
                              </a>
                              <a href="#" className="d-flex align-items-center" onClick={handleChatClick}>
                                <div className="flex-shrink-0">
                                  <img
                                    className="img-fluid avatar"
                                    src={avatar}
                                    alt="user img"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h3>Tian Zhao</h3>
                                  <p>Associate Professor</p>
                                </div>
                              </a>
                              <a href="#" className="d-flex align-items-center" onClick={handleChatClick}>
                                <div className="flex-shrink-0">
                                  <img
                                    className="img-fluid avatar"
                                    src={avatar}
                                    alt="user img"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h3>Tian Zhao</h3>
                                  <p>Associate Professor</p>
                                </div>
                              </a>
                              <a href="#" className="d-flex align-items-center" onClick={handleChatClick}>
                                <div className="flex-shrink-0">
                                  <img
                                    className="img-fluid avatar"
                                    src={avatar}
                                    alt="user img"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h3>Tian Zhao</h3>
                                  <p>Associate Professor</p>
                                </div>
                              </a>
                            </div>
                          </div>
                          <div
                            className={`tab-pane fade ${activeTab === 'Closed' ? 'active' : ''}`}
                            id="Closed"
                            role="tabpanel"
                            aria-labelledby="Closed-tab"
                          >
                            <div className="chat-list">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`chatbox ${showBox ? 'showbox' : ''}`}>
                <div className="modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="msg-head">
                      <div className="row">
                        <div className="col-8">
                          <div className="d-flex align-items-center">
                            <span className="chat-icon" onClick={handleCloseClick}>
                              <img
                                className="img-fluid"
                                src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg"
                                alt="image title"
                              />
                            </span>
                            <div className="flex-shrink-0">
                              <img
                                className="img-fluid avatar"
                                src={avatar}
                                alt="user img"
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h3>Divakar Yadav</h3>
                              {/* <p>front end developer</p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-body">
                      <div className="msg-body">
                        <ul>
                          <li className="sender">
                            <p> Hey, Are you there? </p>
                            <span className="time">10:06 am</span>
                          </li>
                          <li className="sender">
                            <p> Hey, Are you there? </p>
                            <span className="time">10:16 am</span>
                          </li>
                          <li className="repaly">
                            <p>yes!</p>
                            <span className="time">10:20 am</span>
                          </li>
                          <li className="sender">
                            <p> Hey, Are you there? </p>
                            <span className="time">10:26 am</span>
                          </li>
                          <li className="sender">
                            <p> Hey, Are you there? </p>
                            <span className="time">10:32 am</span>
                          </li>
                          <li className="repaly">
                            <p>How are you?</p>
                            <span className="time">10:35 am</span>
                          </li>
                          <li>
                            <div className="divider">
                              <h6>Today</h6>
                            </div>
                          </li>
                          <li className="repaly">
                            <p> yes, tell me</p>
                            <span className="time">10:36 am</span>
                          </li>
                          <li className="repaly">
                            <p>yes... on it</p>
                            <span className="time">just now</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="send-box">
                      <form>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="message…"
                          placeholder="Write message…"
                          value={message}
                          onChange={handleMessageChange}
                        />
                        <button type="button" onClick={handleSendMessage}>
                          <i className="fa fa-paper-plane" aria-hidden="true"></i> Send
                        </button>
                      </form>

                      <div className="send-btns">
                        <div className="attach">
                          <div className="button-wrapper">
                            <span className="label">
                              <img
                                className="img-fluid"
                                src="https://mehedihtml.com/chatbox/assets/img/upload.svg"
                                alt="image title"
                              />{' '}
                              attached file
                            </span>
                            <input
                              type="file"
                              name="upload"
                              id="upload"
                              className="upload-box"
                              placeholder="Upload File"
                              aria-label="Upload File"
                            />
                          </div>

                          <select className="form-control" id="exampleFormControlSelect1">
                            <option>Select template</option>
                            <option>Template 1</option>
                            <option>Template 2</option>
                          </select>

                          <div className="add-apoint">
                            <a href="#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M8 16C3.58862 16 0 12.4114 0 8C0 3.58862 3.58862 0 8 0C12.4114 0 16 3.58862 16 8C16 12.4114 12.4114 16 8 16ZM8 1C4.14001 1 1 4.14001 1 8C1 11.86 4.14001 15 8 15C11.86 15 15 11.86 15 8C15 4.14001 11.86 1 8 1Z"
                                  fill="#7D7D7D"
                                />
                                <path
                                  d="M11.5 8.5H4.5C4.224 8.5 4 8.276 4 8C4 7.724 4.224 7.5 4.5 7.5H11.5C11.776 7.5 12 7.724 12 8C12 8.276 11.776 8.5 11.5 8.5Z"
                                  fill="#7D7D7D"
                                />
                                <path
                                  d="M8 12C7.724 12 7.5 11.776 7.5 11.5V4.5C7.5 4.224 7.724 4 8 4C8.276 4 8.5 4.224 8.5 4.5V11.5C8.5 11.776 8.276 12 8 12Z"
                                  fill="#7D7D7D"
                                />
                              </svg>{' '}
                              Appointment
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  );
};

export default ChatRoom;
