import React from "react";
import Table from "react-bootstrap/Table";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import SwarmConnect from "providers/Web3Provider";

interface INodeDetailsProps {}

const formatter = new Intl.NumberFormat("en-us");

const PAYMENT_THRESHOLD = 1000000;

export default (props: INodeDetailsProps) => (
  <SwarmConnect.Consumer>
    {({ state: { updatedAt, peers, node } }) => (
      <div>
        Last update: {updatedAt && updatedAt.toLocaleString()}
        <br />
        <Card>
          <Card.Body>
            <Card.Title>My Node details</Card.Title>
            <Card.Text>
              <table>
                <tr>
                  <td>
                    <strong>Ethereum Address:</strong>
                  </td>
                  <td>{node.address}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Chequebook Address:</strong>
                  </td>
                  <td>{node.address}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Current Honey Balance:</strong>
                  </td>
                  <td>{formatter.format(node.currentHoneyBalance)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Honey Received:</strong>
                  </td>
                  <td>{formatter.format(node.totalHoneyReceived)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Honey Sent:</strong>
                  </td>
                  <td>{formatter.format(node.totalHoneySent)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Est. Total Cheques Received:</strong>
                  </td>
                  <td>{node.totalChequesReceived}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Est. Total Cheques Sent:</strong>
                  </td>
                  <td>{node.totalChequesSent}</td>
                </tr>
              </table>
            </Card.Text>
          </Card.Body>
        </Card>
        <h1>Peers:</h1>
        <Table striped responsive bordered hover size="sm">
          <thead>
            <tr>
              <th className="text-right">Peer #</th>
              <th className="text-right">BZZ node ID</th>
              <th className="text-right">Chequebook address</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((p, i) => (
              <tr>
                <td className="text-right">{i}</td>
                <td className="text-right">{p.swarmAddress}</td>
                <td className="text-right">
                  {p.receivedCheque && p.receivedCheque.contract}
                  {!p.receivedCheque && 0}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h1>Balances (honey):</h1>
        <Table striped responsive bordered hover size="sm">
          <thead>
            <tr>
              <th className="text-right">Peer #</th>
              <th className="text-right">Current Honey Balance</th>
              <th className="text-right">Total Honey Received</th>
              <th className="text-right">Total Honey Paid</th>
              <th className="text-right">Est Cheques Received</th>
              <th className="text-right">Est Cheques Sent</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((p, i) => (
              <tr>
                <td className="text-right">{i}</td>
                <td className="text-right">
                  {formatter.format(p.balance | 0)}
                </td>
                <td className="text-right">
                  {p.receivedCheque
                    ? formatter.format(p.receivedCheque.cumulativePayout)
                    : 0}
                </td>
                <td className="text-right">
                  {p.sentCheque
                    ? formatter.format(p.sentCheque.cumulativePayout)
                    : 0}
                </td>
                <td className="text-right">
                  {p.receivedCheque
                    ? Math.round(
                        p.receivedCheque.cumulativePayout / PAYMENT_THRESHOLD
                      )
                    : 0}
                </td>
                <td className="text-right">
                  {p.sentCheque
                    ? Math.round(
                        p.sentCheque.cumulativePayout / PAYMENT_THRESHOLD
                      )
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h1>Cheques (honey):</h1>
        {peers && (
          <Tab.Container defaultActiveKey={0}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {peers.map((p, i) => (
                    <Nav.Item>
                      <Nav.Link eventKey={i}>
                        <Badge
                          variant="light"
                          style={{ width: 60, textAlign: "end" }}
                        >
                          {p.receivedCheque
                            ? Math.round(
                                p.receivedCheque.cumulativePayout /
                                  PAYMENT_THRESHOLD
                              )
                            : 0}{" "}
                          <FontAwesomeIcon icon={faArrowDown} />
                        </Badge>{" "}
                        <Badge
                          variant="dark"
                          style={{ width: 60, textAlign: "end" }}
                        >
                          {p.sentCheque
                            ? Math.round(
                                p.sentCheque.cumulativePayout /
                                  PAYMENT_THRESHOLD
                              )
                            : 0}{" "}
                          <FontAwesomeIcon icon={faArrowUp} />
                        </Badge>{" "}
                        Peer {i}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  {peers.map((p, i) => (
                    <Tab.Pane eventKey={i}>
                      {p.receivedCheque && (
                        <Card style={{ margin: 10 }}>
                          <Card.Body>
                            <Card.Title>
                              <FontAwesomeIcon icon={faArrowDown} /> Last
                              Received
                            </Card.Title>
                            <Card.Text>
                              <strong>Beneficiary Address:</strong>{" "}
                              {p.receivedCheque.beneficiary}
                              <br />
                              <strong>Chequebook Address:</strong>{" "}
                              {p.receivedCheque.contract}
                              <br />
                              <strong>Cumulative Amount:</strong>{" "}
                              {p.receivedCheque.cumulativePayout}
                              <br />
                              <strong>Honey:</strong> {p.receivedCheque.honey}
                              <br />
                              <strong>Signature:</strong>{" "}
                              {p.receivedCheque.signature}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      )}
                      {p.sentCheque && (
                        <Card style={{ margin: 10 }}>
                          <Card.Body>
                            <Card.Title>
                              <FontAwesomeIcon icon={faArrowUp} /> Last Sent
                            </Card.Title>
                            <Card.Text>
                              <strong>Beneficiary Address:</strong>{" "}
                              {p.sentCheque.beneficiary}
                              <br />
                              <strong>Chequebook Address:</strong>{" "}
                              {p.sentCheque.contract}
                              <br />
                              <strong>Cumulative Amount:</strong>{" "}
                              {p.sentCheque.cumulativePayout}
                              <br />
                              <strong>Honey:</strong> {p.sentCheque.honey}
                              <br />
                              <strong>Signature:</strong>{" "}
                              {p.sentCheque.signature}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      )}
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        )}
      </div>
    )}
  </SwarmConnect.Consumer>
);
