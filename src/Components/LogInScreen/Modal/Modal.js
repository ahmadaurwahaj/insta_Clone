import React from "react";
import style from "./Modal.module.css";
import Dialog from "@material-ui/core/Dialog";
import { MdClose as Close } from "react-icons/md";
import { Link } from "react-router-dom";
function Modal({
  heading,
  modalData,
  userNameKey,
  profilePicKey,
  modalOpen,
  handleClose,
}) {
  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={modalOpen}
      >
        <div className={style.modalWrapper}>
          <div className={style.modalHeader}>
            <h3>{heading}</h3>
            <button
              type="submit"
              onClick={handleClose}
              className={style.modalCloseBtn}
            >
              <Close className={style.modalClose} />
            </button>
          </div>
          <div className={style.modalDataDiv}>
            {modalData.map(
              (data, index) => (
                <div
                  key={data[userNameKey]}
                  className={style.singleModalDataDiv}
                >
                  <Link
                    to={`/accounts/${data[userNameKey]}`}
                    className={style.modalLink}
                  >
                    <img
                      src={data[profilePicKey]}
                      alt=""
                      className={style.modalUserImg}
                    />
                    <h3 className={style.authorUserName}>
                      {data[userNameKey]}
                    </h3>
                  </Link>
                </div>
              ),
              []
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Modal;
