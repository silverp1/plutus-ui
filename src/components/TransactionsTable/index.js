import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table
} from 'reactstrap';
import { formatMoney } from '../../util/money';

class TransactionsTable extends Component {
  render() {
    let transactions = this.props.transactions || []
    return (
      <Table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Date</th>
            <th>Transaction Description</th>
            <th>Transaction Amount</th>
          </tr>
        </thead>
        <tbody>
        {transactions.map((value, index) => {
          return (
            <tr key={index}>
              <td>{value.id}</td>
              <td>{value.date}</td>
              <td>{value.description}</td>
              <td className={value.amount > 0 ? "text-success" : "text-danger"}>
                { formatMoney(value.amount) }
              </td>
            </tr>
          )
        })}
        </tbody>
      </Table>
    )
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(TransactionsTable);