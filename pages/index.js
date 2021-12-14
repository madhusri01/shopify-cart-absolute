import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal, Button, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@material-ui/core";
//import configData from "../session.json";

toast.configure();
//const session=require('../session.json') ;

//  const sessionData=configData;
//  console.log("sess",sessionData);

const Index = () => {
  const [players, setPlayers] = useState([]);
  const [shopMail, setshopMail] = useState("");
  const [shopName, setshopName] = useState("");
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState([]);

  const [noCheckouts, setNOCheckouts] = useState(false);
  const [loader, setLoader] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getPlayerData = async () => {
    setLoader(true);
    try {
      const data = await window.api.get(`/check12?shop=${window.shop}`);
      console.log("customers", data);
      setPlayers(data.data);
      setLoader(false);
      setNOCheckouts(true);
      setServerError(false);
    } catch (e) {
      setLoader(false);
      setNOCheckouts(false);
      setServerError(true);
      console.log("err", e);
    }
  };

  const getShopData = async () => {
    try {
      const data = await window.api.get(`/shop12?shop=${window.shop}`);
      console.log("SHOP", data);
      setshopMail(data.data.data.shop.email);
      setshopName(data.data.data.shop.name);
    } catch (e) {
      console.log(e);
    }
  };
  console.log("Mail", shopMail);
  console.log("Name", shopName);

  useEffect(() => {
    getPlayerData();
    getShopData();
  }, []);

  useEffect(() => {
    let testUser = players?.data?.checkouts;
    setUser(testUser);
  });
  console.log("test", user);

  const columns = [
    {
      dataField: "id",
      text: "ID",
      editable: false,
      //  events: {
      //   onClick: (e, column, columnIndex, row, rowIndex) => {
      //     console.log(e);
      //     console.log(column);
      //     console.log(columnIndex);
      //     console.log(row);
      //     console.log(rowIndex);
      //     alert('Click on Product ID field');
      //   },
      //}
    },
    { dataField: "email", text: "Email", editable: false },
    { dataField: "customer.first_name", text: "Name", editable: false },
    { dataField: "created_at", text: "Date", sort: true, editable: false },
    {
      dataField: "total_price",
      text: "Total Price",
      sort: true,
      editable: false,
    },
    {
      dataField: "completed_at",
      text: "Recovery Status",
      sort: true,
      editable: false,
      formatter: (cellContent, row) => {
        if (row.completed_at === null) {
          return (
            <h5>
              <span className="label label-success">Not Recovered</span>
            </h5>
          );
        }
        return (
          <h5>
            <span className="label label-danger"> Recovered</span>
          </h5>
        );
      },
    },
    // {dataField:"Mail", text:"Mail Status"}
  ];

  const rowEvents = {
    onClick: (e, row) => {
      console.log(row);
      setModalInfo(row);
      toggleTrueFalse();
    },
  };

  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };

  const ModalContent = () => {
    const sendEmail = (e) => {
      e.preventDefault();
      console.log(e);
      emailjs
        .sendForm(
          "service_4vo2yda",
          "template_6cpz1xt",
          e.target,
          "user_MWAEhs44Epcju6kRHBlxQ"
        )
        .then(
          function (response) {
            toast.success("Message Sent", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
            console.log("SUCCESS!", response.status, response.text);
          },
          function (error) {
            toast.error("message not sent", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
            console.log("FAILED...", error);
          }
        );
    };

    return (
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Mail to Recover Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form onSubmit={sendEmail}>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="formGroupExampleInput">From</label>
                    <input
                      type="email"
                      className="form-control"
                      name="from_email"
                      value="shopifystoremail16@gmail.com"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label for="formGroupExampleInput">To</label>
                    <input
                      type="email"
                      className="form-control"
                      name="to_email"
                      value={modalInfo.email}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputAddress">BCC(optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="shop_email"
                    value={`${shopMail}`}
                  />
                </div>
                {/* <div className="row"> */}
                <div className="col">
                  <div className="form-group">
                    <label for="inputAddress2">Store Name </label>
                    <input
                      type="text"
                      name="store_name"
                      className="form-control"
                      value={`${shopName}`}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label for="inputAddress3">Checkout Link</label>
                    <input
                      type="text"
                      name="checkout_link"
                      className="form-control"
                      value={`${modalInfo.abandoned_checkout_url}`}
                    />
                  </div>
                </div>
                {/* </div> */}
                <div className="form-group">
                  <label for="inputAddress2">Message(default)</label>

                  <div
                    contentEditable="true"
                    className="form-control-1"
                    name="html"
                  >
                    <p>Hi,</p>
                    <strong> All is not lost.</strong>
                    <br />
                    Your basket wasn't empty when you left, so we've saved the
                    contents.
                    <br />
                    Just click the link below if you want to complete your
                    order.
                    <br />
                    <p>
                      <a href="">Checkout Link</a>
                    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputAddress4">Custom Message(optional)</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="8"
                    cols="15"
                  />
                </div>
                <div className="col-8 pt-3 mx-auto">
                  <input
                    type="submit"
                    className="btn btn-info"
                    value="Send Message"
                  />
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="App">
      {loader && <h2 className="abandon">Abandoned checkouts Loading..</h2>}
      {!loader && serverError && (
        <h2 className="abandon">Server is not responding...</h2>
      )}
      {loader ? (
        <>
          <div className="loading-abandon">
            <br />
            <div>
              <CircularProgress
                className="loader-circle"
                thickness={6}
                color="primary"
                size={35}
              />
            </div>
          </div>
        </>
      ) : null}
      {user && user.length > 0 ? (
        <>
          <div>
            <h1 className="heading">Abandoned Checkouts</h1>
            <BootstrapTable
              headerWrapperClasses="foo"
              keyField="id"
              data={user}
              columns={columns}
              pagination={paginationFactory()}
              rowEvents={rowEvents}
              wrapperClasses="table-responsive"
              // noDataIndication="Table is Empty"
              // condensed
            />
          </div>

          {show ? <ModalContent /> : null}
        </>
      ) : (
        <>
          {noCheckouts && (
            <h2 className="no-abandon">No Abandoned checkouts</h2>
          )}
        </>
      )}
    </div>
  );
};

export default Index;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// // import { EmptyState, Layout, Page } from "@shopify/polaris";
// // import Link from "next/link";
// // import { AppStatus } from "../components/wrapper";

// //const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

// const Index = () => {
//   // static contextType = AppStatus;
//   // render() {
//   //   return (
//   //     <Page>
//   //       <Layout>
//   //         <EmptyState
//   //           heading="Api Demo 1"
//   //           action={{
//   //             content: "Fetch API",
//   //             onAction: this.callApi,
//   //           }}
//   //           image={img}
//   //         >
//   //           <p>
//   //             Click on the button below and open the console to view the data
//   //             returned from server using authenticated api call.{" "}
//   //           </p>
//   //           <Link href={`/api2?shop=${window.shop}`}>
//   //             <a>Another API Demo page</a>
//   //           </Link>
//   //         </EmptyState>
//   //       </Layout>
//   //     </Page>
//   //   );
//   // }
//   // callApi = () => {
//   //   console.log("Sending Api Request");
//   //   this.context.showPageLoading();
//   //   window.api.get("/1").then((response) => {
//   //     console.log(response.data);
//   //     this.context.hidePageLoading();
//   //   });
//   // };
//   const [players, setPlayers] = useState([]);
//   const call = () => {
//     console.log("Sending Api Request");

//     window.api.get(`/12?shop=${window.shop}`).then((response) => {
//       console.log(response.data);
//     });
//   };
//   return (
//     <>
//       <h1>Welcome</h1>
//       <button onClick={call}>Click</button>
//     </>
//   );
// };
// export default Index;
